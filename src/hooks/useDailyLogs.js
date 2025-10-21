import { useLocalStorage } from './useLocalStorage';

export const useDailyLogs = () => {
  const [dailyLogs, setDailyLogs] = useLocalStorage('dailyLogs', {});

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
