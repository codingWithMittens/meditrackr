import { useUserLocalStorage } from './useUserLocalStorage';

export const useMedications = (userId) => {
  console.log('useMedications - userId:', userId);
  const [medications, setMedications] = useUserLocalStorage('medications', [], userId);
  console.log('useMedications - loaded medications count:', medications.length);

  // Debug first medication's takenLog for demo user
  if (userId === 'demo_user_2024' && medications.length > 0) {
    console.log('First medication takenLog sample:', {
      name: medications[0].name,
      takenLogLength: medications[0].takenLog?.length,
      takenLogSample: medications[0].takenLog?.slice(0, 3)
    });
  }

  const addMedication = (medicationData) => {
    console.log('addMedication - userId:', userId, 'data:', medicationData);
    const newMed = {
      ...medicationData,
      id: Date.now(),
      takenLog: []
    };
    console.log('addMedication - new medication:', newMed);
    setMedications(prev => {
      const newList = [...prev, newMed];
      console.log('addMedication - new list length:', newList.length);
      return newList;
    });
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
