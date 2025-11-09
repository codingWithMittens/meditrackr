import { useState, useEffect, createContext, useContext } from 'react';

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        console.log('Auth check - checking localStorage...');
        const currentUser = localStorage.getItem('current_authenticated_user');
        console.log('Auth check - current_authenticated_user:', currentUser);

        if (currentUser) {
          const userData = JSON.parse(currentUser);
          console.log('Auth check - parsed user data:', userData);
          setUser(userData);

          // Debug: Check what medication data exists for this user
          const medKey = `medications_${userData.id}`;
          const medications = localStorage.getItem(medKey);
          console.log(`Auth check - medications for user ${userData.id}:`, medications);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      const { email, password, name } = userData;

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: name.trim(),
        passwordHash: btoa(password), // Simple encoding (NOT secure for production)
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Save user to registered users
      users.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(users));

      // Log in the new user
      const { passwordHash, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('current_authenticated_user', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const { email, password } = credentials;

      // Get registered users
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('No account found with this email address');
      }

      // Check password (simple comparison for local storage)
      if (user.passwordHash !== btoa(password)) {
        throw new Error('Invalid password');
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      // Set current user
      const { passwordHash, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('current_authenticated_user', JSON.stringify(userWithoutPassword));

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_authenticated_user');
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, ...updates } : u
      );

      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('current_authenticated_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      // Remove user from registered users
      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const updatedUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('registered_users', JSON.stringify(updatedUsers));

      // Clean up user data
      const userDataKeys = [
        `medications_${user.id}`,
        `pharmacies_${user.id}`,
        `providers_${user.id}`,
        `timePeriods_${user.id}`,
        `dailyLogs_${user.id}`
      ];

      userDataKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      // Logout
      logout();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};