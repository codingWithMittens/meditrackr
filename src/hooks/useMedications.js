import { useLocalStorage } from './useLocalStorage';

export const useMedications = () => {
  const [medications, setMedications] = useLocalStorage('medications', []);

  const addMedication = (medicationData) => {
    const newMed = {
      ...medicationData,
      id: Date.now(),
      takenLog: []
    };
    setMedications(prev => [...prev, newMed]);
  };

  const updateMedication = (id, medicationData) => {
    setMedications(prev => prev.map(med =>
      med.id === id ? { ...medicationData, id, takenLog: med.takenLog } : med
    ));
  };

  const deleteMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const toggleTaken = (medId, date, time) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const logEntry = `${date}-${time}`;
        const currentLog = med.takenLog || [];
        const isCurrentlyTaken = currentLog.includes(logEntry);

        return {
          ...med,
          takenLog: isCurrentlyTaken
            ? currentLog.filter(entry => entry !== logEntry)
            : [...currentLog, logEntry]
        };
      }
      return med;
    }));
  };

  return {
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleTaken
  };
};
