import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import Header from './components/Header.jsx';
import Calendar from './components/Calendar/Calendar.jsx';
import MedicationForm from './components/MedicationForm/MedicationForm.jsx';
import MedicationList from './components/MedicationList/MedicationList.jsx';
import PrintView from './components/PrintView/PrintView.jsx';
import TimePeriodSettings from './components/Settings/TimePeriodSettings.jsx';
import PharmacySettings from './components/Settings/PharmacySettings.jsx';
import ProviderSettings from './components/Settings/ProviderSettings.jsx';
import AdvancedSettings from './components/Settings/AdvancedSettings.jsx';
import AuthScreen from './components/Auth/AuthScreen.jsx';
import Tour from './components/Tour/Tour.jsx';
import './components/Tour/tour.css';
import './styles/print.css';
import pwaService from './services/pwaService';
import notificationService from './services/notificationService';
import PWAInstallButton from './components/PWA/PWAInstallButton';
import NotificationSettings from './components/Settings/NotificationSettings';

// Add pulse animation styles
const pulseStyles = `
  @keyframes pulse {
    0% {
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.7), 0 0 0 0 rgba(59, 130, 246, 0.4);
      transform: scale(1.02);
    }
    100% {
      box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.5);
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = pulseStyles;
document.head.appendChild(styleSheet);
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { useTour } from './hooks/useTour.jsx';
import { tourSampleData } from './data/tourData.js';
import { useMedications } from './hooks/useMedications.js';
import { useTimePeriods } from './hooks/useTimePeriods.js';
import { useDailyLogs } from './hooks/useDailyLogs.js';
import { usePharmacies } from './hooks/usePharmacies.js';
import { useProviders } from './hooks/useProviders.js';

function AppContent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-500 to-teal-600 p-4 rounded-2xl shadow-lg mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-teal-700 bg-clip-text text-transparent mb-4">
            MedMindr
          </h1>
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <AuthenticatedContent key={user?.id} user={user} logout={logout} />;
}

// Separate component for authenticated users to avoid hooks order issues
function AuthenticatedContent({ user, logout }) {
  const {
    currentStep,
    isActive,
    hasCompletedTour,
    nextStep,
    prevStep,
    completeTour,
    skipTour,
    resetTour
  } = useTour();

  const { medications, addMedication, updateMedication, deleteMedication, toggleTaken } = useMedications(user?.id);
  const { timePeriods, updateTimePeriod, addTimePeriod, deleteTimePeriod } = useTimePeriods(user?.id);
  const { dailyLogs, updateDailyLog, getDailyLog } = useDailyLogs(user?.id);
  const { pharmacies, addPharmacy, updatePharmacy, deletePharmacy, setDefaultPharmacy } = usePharmacies(user?.id);
  const { providers, addProvider, updateProvider, deleteProvider } = useProviders(user?.id);

  const [currentView, setCurrentView] = useState('calendar');
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // PWA and notification state
  useEffect(() => {
    // Initialize PWA services
    console.log('Initializing PWA services...');

    // Check if demo user has current data (up to yesterday)
    if (user && user.id === 'demo_user_2024') {
      console.log('Demo user detected - checking data currency...');
      import('./services/demoService').then(({ ensureCurrentDemoData }) => {
        const result = ensureCurrentDemoData();
        console.log('Demo data currency check:', result);

        if (result.updated) {
          console.log('Demo data was updated - reloading medications...');
          // The medications will be reloaded by the useMedications hook automatically
          // due to localStorage changes
        }
      }).catch(error => {
        console.error('Error checking demo data currency:', error);
      });
    }

    // Listen for notification events
    const handleNotificationClick = (event) => {
      console.log('App: Notification clicked', event.detail);
      // Handle medication reminder notifications
      if (event.detail.medicationId) {
        setCurrentView('calendar');
        // Could also open the specific day modal
      }
    };

    const handleMedicationTaken = (event) => {
      console.log('App: Medication taken via notification', event.detail);
      // Mark medication as taken
      if (event.detail.medicationId && event.detail.timestamp) {
        const { medicationId, timeSlot } = event.detail;
        const today = new Date().toISOString().split('T')[0];
        toggleTaken(medicationId, today, timeSlot);
      }
    };

    window.addEventListener('notification-medication-click', handleNotificationClick);
    window.addEventListener('medication-taken-notification', handleMedicationTaken);

    return () => {
      window.removeEventListener('notification-medication-click', handleNotificationClick);
      window.removeEventListener('medication-taken-notification', handleMedicationTaken);
    };
  }, [user]);

  // Tour form prefill data
  const [prefillData, setPrefillData] = useState(null);

  // Demo data loading handler
  useEffect(() => {
    const handleLoadDemoData = async () => {
      // Import demo data
      try {
        const { resetDemoData } = await import('./services/demoService');
        const result = await resetDemoData();
        if (result.success) {
          // Refresh to show demo data
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to load demo data:', error);
      }
    };

    window.addEventListener('loadDemoData', handleLoadDemoData);
    return () => window.removeEventListener('loadDemoData', handleLoadDemoData);
  }, []);

  const handleSaveMedication = (formData) => {
    if (editingMed) {
      updateMedication(editingMed.id, formData);
    } else {
      addMedication(formData);
    }
    setShowForm(false);
    setEditingMed(null);

    // Advance tour if medication was added during tour
    if (isActive && currentStep === 9) { // medication-form-guide step
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  };

  const handleEditMedication = (med) => {
    setEditingMed(med);
    setShowForm(true);
    setCurrentView('calendar');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMed(null);
  };

  const handleAddNew = () => {
    setShowForm(true);
    setEditingMed(null);
    setCurrentView('calendar');

    // Auto-prefill medication form if on tour step
    if (isActive && currentStep === 8) {
      setTimeout(() => {
        const updatedMedication = {
          ...tourSampleData.medication,
          provider: providers.length > 0 ? providers[providers.length - 1].id : '',
          pharmacy: pharmacies.length > 0 ? pharmacies[pharmacies.length - 1].id : ''
        };
        handlePrefillMedicationForm(updatedMedication);
      }, 500);
    }
  };

  // Tour prefill functions
  const handlePrefillMedicationForm = (data) => {
    setPrefillData({ type: 'medication', data });
  };

  const handlePrefillPharmacyForm = (data) => {
    setPrefillData({ type: 'pharmacy', data });
  };

  const handlePrefillProviderForm = (data) => {
    setPrefillData({ type: 'provider', data });
  };

  const clearPrefillData = () => {
    setPrefillData(null);
  };

  const handleNavigateToReports = () => {
    setCurrentView('print');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
  };

  const handleNavigateToPharmacies = () => {
    setCurrentView('pharmacies');

    // Auto-prefill pharmacy form if on tour step
    if (isActive && currentStep === 6) {
      setTimeout(() => {
        handlePrefillPharmacyForm(tourSampleData.pharmacy);
      }, 500);
    }
  };

  const handleNavigateToProviders = () => {
    setCurrentView('providers');

    // Auto-prefill provider form if on tour step
    if (isActive && currentStep === 2) {
      setTimeout(() => {
        handlePrefillProviderForm(tourSampleData.provider);
      }, 500);
    }
  };

  const handleNavigateToNotifications = () => {
    setCurrentView('notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          showForm={showForm}
          showSettingsMenu={showSettingsMenu}
          setShowSettingsMenu={setShowSettingsMenu}
          user={user}
          onLogout={logout}
          onStartTour={resetTour}
          onNavigateToNotifications={handleNavigateToNotifications}
        />

        {showForm && (
          <MedicationForm
            editingMed={editingMed}
            timePeriods={timePeriods}
            pharmacies={pharmacies}
            providers={providers}
            onSave={handleSaveMedication}
            onCancel={handleCancelForm}
            prefillData={prefillData?.type === 'medication' ? prefillData.data : null}
            onPrefillUsed={clearPrefillData}
          />
        )}

        {!showForm && currentView === 'calendar' && (
          <>
            <PWAInstallButton />
            <Calendar
              medications={medications}
              timePeriods={timePeriods}
              toggleTaken={toggleTaken}
              onAddNew={handleAddNew}
              updateDailyLog={updateDailyLog}
              getDailyLog={getDailyLog}
              onNavigateToReports={handleNavigateToReports}
              userId={user?.id}
            />
          </>
        )}

        {!showForm && currentView === 'list' && (
          <MedicationList
            medications={medications}
            onEdit={handleEditMedication}
            onDelete={deleteMedication}
            onAddNew={handleAddNew}
          />
        )}

        {!showForm && currentView === 'periods' && (
          <TimePeriodSettings
            timePeriods={timePeriods}
            onUpdate={updateTimePeriod}
            onAdd={addTimePeriod}
            onDelete={deleteTimePeriod}
          />
        )}

        {!showForm && currentView === 'pharmacies' && (
          <PharmacySettings
            pharmacies={pharmacies}
            onAdd={(data) => {
              addPharmacy(data);
              // Advance tour if pharmacy was added during tour
              if (isActive && currentStep === 7) {
                setTimeout(() => {
                  setCurrentView('calendar');
                  nextStep();
                }, 500);
              }
            }}
            onUpdate={updatePharmacy}
            onDelete={deletePharmacy}
            onSetDefault={setDefaultPharmacy}
            onBackToCalendar={handleBackToCalendar}
            prefillData={prefillData?.type === 'pharmacy' ? prefillData.data : null}
            onPrefillUsed={clearPrefillData}
          />
        )}

        {!showForm && currentView === 'providers' && (
          <ProviderSettings
            providers={providers}
            onAdd={(data) => {
              addProvider(data);
              // Advance tour if provider was added during tour
              if (isActive && currentStep === 3) {
                setTimeout(() => {
                  setCurrentView('calendar');
                  nextStep();
                }, 500);
              }
            }}
            onUpdate={updateProvider}
            onDelete={deleteProvider}
            onBackToCalendar={handleBackToCalendar}
            prefillData={prefillData?.type === 'provider' ? prefillData.data : null}
            onPrefillUsed={clearPrefillData}
          />
        )}

        {!showForm && currentView === 'advanced' && (
          <AdvancedSettings
            user={user}
          />
        )}

        {!showForm && currentView === 'notifications' && (
          <NotificationSettings
            medications={medications}
            onBack={handleBackToCalendar}
          />
        )}

        {!showForm && currentView === 'print' && (
          <PrintView
            medications={medications}
            timePeriods={timePeriods}
            pharmacies={pharmacies}
            providers={providers}
            dailyLogs={dailyLogs}
            onBackToCalendar={handleBackToCalendar}
            user={user}
          />
        )}

        {/* Tour Component */}
        <Tour
          medications={medications}
          pharmacies={pharmacies}
          providers={providers}
          onAddMedication={handleAddNew}
          onNavigateToPharmacies={handleNavigateToPharmacies}
          onNavigateToProviders={handleNavigateToProviders}
          onNavigateToReports={handleNavigateToReports}
          currentView={currentView}
          setCurrentView={setCurrentView}
          // Tour state props
          currentStep={currentStep}
          isActive={isActive}
          hasCompletedTour={hasCompletedTour}
          nextStep={nextStep}
          prevStep={prevStep}
          completeTour={completeTour}
          skipTour={skipTour}
          // Form prefill props
          onPrefillMedicationForm={handlePrefillMedicationForm}
          onPrefillPharmacyForm={handlePrefillPharmacyForm}
          onPrefillProviderForm={handlePrefillProviderForm}
        />
      </div>
    </div>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;