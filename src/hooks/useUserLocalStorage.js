import { useState, useEffect } from 'react';

export const useUserLocalStorage = (key, initialValue, userId) => {
  console.log(`useUserLocalStorage - key: ${key}, userId: ${userId}`);

  // Keep track of previous userId and userKey to save data before switching
  const [prevUserId, setPrevUserId] = useState(userId);
  const [storedValue, setStoredValue] = useState(() => {
    // Get initial value for current user
    if (!userId) {
      console.log(`useUserLocalStorage - no userId, returning initial value for key: ${key}`);
      return initialValue;
    }
    const userKey = `${key}_${userId}`;
    console.log(`useUserLocalStorage - loading from key: ${userKey}`);
    try {
      const item = window.localStorage.getItem(userKey);
      console.log(`useUserLocalStorage - raw item from localStorage:`, item);

      // Handle cases where localStorage contains string "undefined" or "null" or is actually null/empty
      if (!item || item === 'undefined' || item === 'null') {
        console.log(`useUserLocalStorage - no valid data, using initial value`);
        return initialValue;
      }

      const value = JSON.parse(item);
      console.log(`useUserLocalStorage - loaded value:`, value);
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${userKey}":`, error);
      console.log(`useUserLocalStorage - using initial value due to error`);
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
      console.log(`useUserLocalStorage setValue - key: ${key}, userId: ${userId}, value:`, value);
      setStoredValue(value);
      if (userId) {
        const userKey = `${key}_${userId}`;
        window.localStorage.setItem(userKey, JSON.stringify(value));
        console.log(`useUserLocalStorage - saved to key: ${userKey}`);

        // Verify the save worked
        const verification = window.localStorage.getItem(userKey);
        console.log(`useUserLocalStorage - verification read:`, verification);
      } else {
        console.log(`useUserLocalStorage - no userId, not saving to localStorage`);
      }
    } catch (error) {
      const userKey = userId ? `${key}_${userId}` : key;
      console.error(`Error setting localStorage key "${userKey}":`, error);
    }
  };

  return [storedValue, setValue];
};