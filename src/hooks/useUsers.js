import { useLocalStorage } from './useLocalStorage';
import { useState, useEffect } from 'react';

export const useUsers = () => {
  // Initialize with default user if none exist
  const getInitialUsers = () => {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (parsed.length > 0) return parsed;
    }
    // Create default user
    return [{
      id: Date.now().toString(),
      name: 'Default User',
      email: '',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }];
  };

  const getInitialCurrentUserId = () => {
    const storedUserId = localStorage.getItem('current_user_id');
    if (storedUserId) {
      return JSON.parse(storedUserId);
    }
    const initialUsers = getInitialUsers();
    return initialUsers[0]?.id || null;
  };

  const [users, setUsers] = useLocalStorage('app_users', getInitialUsers());
  const [currentUserId, setCurrentUserId] = useLocalStorage('current_user_id', getInitialCurrentUserId());



  const addUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email || '',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser.id;
  };

  const updateUser = (userId, userData) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, ...userData }
        : user
    ));
  };

  const deleteUser = (userId) => {
    // Don't allow deleting the last user
    if (users.length <= 1) {
      throw new Error('Cannot delete the last user');
    }

    // If deleting current user, switch to another user
    if (currentUserId === userId) {
      const remainingUsers = users.filter(u => u.id !== userId);
      setCurrentUserId(remainingUsers[0].id);
    }

    setUsers(prev => prev.filter(user => user.id !== userId));

    // Clean up user-specific data
    cleanupUserData(userId);
  };

  const switchUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      // Update last active time when switching
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, lastActive: new Date().toISOString() }
          : u
      ));
    }
  };

  const getCurrentUser = () => {
    return users.find(user => user.id === currentUserId) || users[0];
  };

  // Clean up user-specific localStorage data
  const cleanupUserData = (userId) => {
    const userKeys = [
      `medications_${userId}`,
      `pharmacies_${userId}`,
      `providers_${userId}`,
      `timePeriods_${userId}`,
      `dailyLogs_${userId}`
    ];

    userKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  };

  // Migration helper for future cloud auth
  const exportUserData = (userId) => {
    const userData = {
      user: users.find(u => u.id === userId),
      medications: JSON.parse(localStorage.getItem(`medications_${userId}`) || '[]'),
      pharmacies: JSON.parse(localStorage.getItem(`pharmacies_${userId}`) || '[]'),
      providers: JSON.parse(localStorage.getItem(`providers_${userId}`) || '[]'),
      timePeriods: JSON.parse(localStorage.getItem(`timePeriods_${userId}`) || '[]'),
      dailyLogs: JSON.parse(localStorage.getItem(`dailyLogs_${userId}`) || '{}'),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    return userData;
  };

  const importUserData = (userData) => {
    // This will be used for cloud auth migration
    const userId = userData.user.id;

    // Store user data
    localStorage.setItem(`medications_${userId}`, JSON.stringify(userData.medications || []));
    localStorage.setItem(`pharmacies_${userId}`, JSON.stringify(userData.pharmacies || []));
    localStorage.setItem(`providers_${userId}`, JSON.stringify(userData.providers || []));
    localStorage.setItem(`timePeriods_${userId}`, JSON.stringify(userData.timePeriods || []));
    localStorage.setItem(`dailyLogs_${userId}`, JSON.stringify(userData.dailyLogs || {}));

    // Add user to users list if not already there
    const existingUser = users.find(u => u.id === userId);
    if (!existingUser) {
      setUsers(prev => [...prev, userData.user]);
    }
  };

  return {
    users,
    currentUserId,
    currentUser: getCurrentUser(),
    addUser,
    updateUser,
    deleteUser,
    switchUser,
    exportUserData,
    importUserData,
    cleanupUserData
  };
};