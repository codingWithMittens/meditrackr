import React, { useState } from 'react';
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
import { useMedications } from './hooks/useMedications.js';
import { useTimePeriods } from './hooks/useTimePeriods.js';
import { useDailyLogs } from './hooks/useDailyLogs.js';
import { usePharmacies } from './hooks/usePharmacies.js';
import { useProviders } from './hooks/useProviders.js';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';

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

  const { medications, addMedication, updateMedication, deleteMedication, toggleTaken } = useMedications(user?.id);
  const { timePeriods, updateTimePeriod, addTimePeriod, deleteTimePeriod } = useTimePeriods(user?.id);
  const { dailyLogs, updateDailyLog, getDailyLog } = useDailyLogs(user?.id);
  const { pharmacies, addPharmacy, updatePharmacy, deletePharmacy, setDefaultPharmacy } = usePharmacies(user?.id);
  const { providers, addProvider, updateProvider, deleteProvider } = useProviders(user?.id);

  const [currentView, setCurrentView] = useState('calendar');

  const handleNavigateToReports = () => {
    setCurrentView('print');
  };

  const handleBackToCalendar = () => {
    setCurrentView('calendar');
  };
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const handleSaveMedication = (formData) => {
    if (editingMed) {
      updateMedication(editingMed.id, formData);
    } else {
      addMedication(formData);
    }
    setShowForm(false);
    setEditingMed(null);
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
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

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
        />

        {showForm && (
          <MedicationForm
            editingMed={editingMed}
            timePeriods={timePeriods}
            pharmacies={pharmacies}
            providers={providers}
            onSave={handleSaveMedication}
            onCancel={handleCancelForm}
          />
        )}

        {!showForm && currentView === 'calendar' && (
          <Calendar
            medications={medications}
            timePeriods={timePeriods}
            toggleTaken={toggleTaken}
            onAddNew={handleAddNew}
            updateDailyLog={updateDailyLog}
            getDailyLog={getDailyLog}
            onNavigateToReports={handleNavigateToReports}
          />
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
            onAdd={addPharmacy}
            onUpdate={updatePharmacy}
            onDelete={deletePharmacy}
            onSetDefault={setDefaultPharmacy}
          />
        )}

        {!showForm && currentView === 'providers' && (
          <ProviderSettings
            providers={providers}
            onAdd={addProvider}
            onUpdate={updateProvider}
            onDelete={deleteProvider}
          />
        )}

        {!showForm && currentView === 'advanced' && (
          <AdvancedSettings
            user={user}
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
          />
        )}
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