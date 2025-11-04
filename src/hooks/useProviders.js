import { useUserLocalStorage } from './useUserLocalStorage';

export const useProviders = (userId) => {
  const [providers, setProviders] = useUserLocalStorage('providers', [], userId);

  const addProvider = (providerData) => {
    const newProvider = {
      ...providerData,
      id: Date.now()
    };
    setProviders(prev => [...prev, newProvider]);
  };

  const updateProvider = (id, providerData) => {
    setProviders(prev => prev.map(provider =>
      provider.id === id ? { ...providerData, id } : provider
    ));
  };

  const deleteProvider = (id) => {
    setProviders(prev => prev.filter(provider => provider.id !== id));
  };

  return {
    providers,
    addProvider,
    updateProvider,
    deleteProvider
  };
};