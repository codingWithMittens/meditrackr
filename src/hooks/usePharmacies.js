import { useUserLocalStorage } from './useUserLocalStorage';

export const usePharmacies = (userId) => {
  const [pharmaciesRaw, setPharmaciesRaw] = useUserLocalStorage('pharmacies', [], userId);

  // Ensure all pharmacies have isDefault field
  const pharmacies = pharmaciesRaw.map(pharmacy => ({
    ...pharmacy,
    isDefault: pharmacy.isDefault || false
  }));

  const setPharmacies = (updater) => {
    if (typeof updater === 'function') {
      setPharmaciesRaw(prev => updater(prev.map(p => ({ ...p, isDefault: p.isDefault || false }))));
    } else {
      setPharmaciesRaw(updater);
    }
  };

  const addPharmacy = (pharmacyData) => {
    const newPharmacy = {
      ...pharmacyData,
      id: Date.now(),
      isDefault: false
    };
    setPharmacies(prev => [...prev, newPharmacy]);
  };

  const updatePharmacy = (id, pharmacyData) => {
    setPharmacies(prev => prev.map(pharmacy =>
      pharmacy.id === id ? { ...pharmacyData, id } : pharmacy
    ));
  };

  const setDefaultPharmacy = (id) => {
    setPharmacies(prev => prev.map(pharmacy => ({
      ...pharmacy,
      isDefault: pharmacy.id === id
    })));
  };

  const deletePharmacy = (id) => {
    setPharmacies(prev => prev.filter(pharmacy => pharmacy.id !== id));
  };

  return {
    pharmacies,
    addPharmacy,
    updatePharmacy,
    deletePharmacy,
    setDefaultPharmacy
  };
};