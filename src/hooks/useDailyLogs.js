import { useUserLocalStorage } from './useUserLocalStorage';

export const useDailyLogs = (userId) => {
  const [dailyLogs, setDailyLogs] = useUserLocalStorage('dailyLogs', {}, userId);

  const updateDailyLog = (date, updates) => {
    setDailyLogs(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        ...updates
      }
    }));
  };

  const getDailyLog = (date) => {
    return dailyLogs[date] || { pain: null, emotions: null, symptoms: '', notes: '' };
  };

  return {
    dailyLogs,
    updateDailyLog,
    getDailyLog
  };
};
