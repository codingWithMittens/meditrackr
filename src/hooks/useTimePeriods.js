import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_TIME_PERIODS } from '../constants/medications';

export const useTimePeriods = () => {
  const [timePeriods, setTimePeriods] = useLocalStorage('timePeriods', DEFAULT_TIME_PERIODS);

  const updateTimePeriod = (id, updates) => {
    setTimePeriods(prev => prev.map(period =>
      period.id === id ? { ...period, ...updates } : period
    ));
  };

  const addTimePeriod = () => {
    const newId = Math.max(...timePeriods.map(p => p.id), 0) + 1;
    setTimePeriods(prev => [...prev, {
      id: newId,
      name: 'Custom',
      time: '09:00',
      color: 'amber',
      isCustom: true
    }]);
  };

  const deleteTimePeriod = (id) => {
    if (timePeriods.length > 1) {
      setTimePeriods(prev => prev.filter(p => p.id !== id));
    }
  };

  return {
    timePeriods,
    updateTimePeriod,
    addTimePeriod,
    deleteTimePeriod
  };
};