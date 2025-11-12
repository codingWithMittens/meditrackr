import demoData from '../data/demoData.json';
import { ensureDemoDataToYesterday } from '../data/updateDemoToYesterday.js';

export const createDemoUser = async () => {
  try {
    const { user, medications, providers, pharmacies, timePeriods, dailyLogs } = demoData;

    // Store demo user in registered users
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const existingDemoIndex = users.findIndex(u => u.id === user.id);

    // Remove existing demo user if it exists
    if (existingDemoIndex !== -1) {
      users.splice(existingDemoIndex, 1);
    }

    // Add the demo user (with a simple password hash for consistency)
    const demoUser = {
      ...user,
      passwordHash: btoa('demo123'), // Simple demo password
    };

    users.push(demoUser);
    localStorage.setItem('registered_users', JSON.stringify(users));

    // Clear any existing demo data (force fresh data)
    const demoDataKeys = [
      `medications_${user.id}`,
      `providers_${user.id}`,
      `pharmacies_${user.id}`,
      `timePeriods_${user.id}`,
      `dailyLogs_${user.id}`
    ];

    console.log('Clearing existing demo data keys:', demoDataKeys);
    demoDataKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('Removed:', key);
    });

    // Store demo data with user-specific keys
    console.log('Storing demo data...');
    console.log('Demo medications to store:', medications);
    localStorage.setItem(`medications_${user.id}`, JSON.stringify(medications));
    localStorage.setItem(`providers_${user.id}`, JSON.stringify(providers));
    localStorage.setItem(`pharmacies_${user.id}`, JSON.stringify(pharmacies));
    localStorage.setItem(`timePeriods_${user.id}`, JSON.stringify(timePeriods));
    localStorage.setItem(`dailyLogs_${user.id}`, JSON.stringify(dailyLogs));

    // Verify the data was saved correctly
    const savedMeds = localStorage.getItem(`medications_${user.id}`);
    console.log('Verification - saved medications:', savedMeds);

    // Mark demo tour as not completed so it will show for demo
    localStorage.removeItem(`tour_completed_${user.id}`);

    console.log('Demo user created successfully with sample data');

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email }
    };

  } catch (error) {
    console.error('Error creating demo user:', error);
    return {
      success: false,
      error: 'Failed to create demo user'
    };
  }
};

export const resetDemoData = async () => {
  try {
    const result = await createDemoUser();
    return result;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to reset demo data'
    };
  }
};

export const isDemoUser = (userId) => {
  return userId === 'demo_user_2024';
};

// Ensure demo data is current (has entries up to yesterday)
export function ensureCurrentDemoData() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { success: false, error: 'localStorage not available' };
  }

  try {
    const updated = ensureDemoDataToYesterday();
    return {
      success: true,
      updated,
      message: updated ? 'Demo data updated to current date' : 'Demo data already current'
    };
  } catch (error) {
    console.error('Error ensuring current demo data:', error);
    return { success: false, error: error.message };
  }
}
