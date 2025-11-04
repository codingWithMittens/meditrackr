import { useState, useEffect } from 'react';

export const useUserLocalStorage = (key, initialValue, userId) => {
  // Keep track of previous userId and userKey to save data before switching
  const [prevUserId, setPrevUserId] = useState(userId);
  const [storedValue, setStoredValue] = useState(() => {
    // Get initial value for current user
    if (!userId) return initialValue;
    const userKey = `${key}_${userId}`;
    try {
      const item = window.localStorage.getItem(userKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${userKey}":`, error);
      return initialValue;
    }
  });

  // Handle user switching
  useEffect(() => {
    if (userId !== prevUserId) {
      // Save current data before switching users
      if (prevUserId && storedValue !== undefined) {
        const prevUserKey = `${key}_${prevUserId}`;
        try {
          window.localStorage.setItem(prevUserKey, JSON.stringify(storedValue));
        } catch (error) {
          console.error(`Error saving data for previous user "${prevUserKey}":`, error);
        }
      }

      // Load data for new user
      if (userId) {
        const newUserKey = `${key}_${userId}`;
        try {
          const item = window.localStorage.getItem(newUserKey);
          const newValue = item ? JSON.parse(item) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error reading localStorage key "${newUserKey}":`, error);
          setStoredValue(initialValue);
        }
      }

      setPrevUserId(userId);
    }
  }, [userId, prevUserId, key, initialValue, storedValue]);

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (userId) {
        const userKey = `${key}_${userId}`;
        window.localStorage.setItem(userKey, JSON.stringify(value));
      }
    } catch (error) {
      const userKey = userId ? `${key}_${userId}` : key;
      console.error(`Error setting localStorage key "${userKey}":`, error);
    }
  };

  return [storedValue, setValue];
};