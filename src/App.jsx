import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Calendar from './components/Calendar/Calendar.jsx';
import MedicationForm from './components/MedicationForm/MedicationForm.jsx';
import MedicationList from './components/MedicationList/MedicationList.jsx';
import PrintView from './components/PrintView/PrintView.jsx';
import TimePeriodSettings from './components/Settings/TimePeriodSettings.jsx';
import { useMedications } from './hooks/useMedications.js';
import { useTimePeriods } from './hooks/useTimePeriods.js';
import { useDailyLogs } from './hooks/useDailyLogs.js';

function App() {
  const { medications, addMedication, updateMedication, deleteMedication, toggleTaken } = useMedications();
  const { timePeriods, updateTimePeriod, addTimePeriod, deleteTimePeriod } = useTimePeriods();
  const { updateDailyLog, getDailyLog } = useDailyLogs();

  const [currentView, setCurrentView] = useState('calendar');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          showForm={showForm}
          showSettingsMenu={showSettingsMenu}
          setShowSettingsMenu={setShowSettingsMenu}
        />

        {showForm && (
          <MedicationForm
            editingMed={editingMed}
            timePeriods={timePeriods}
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

        {!showForm && currentView === 'print' && (
          <PrintView
            medications={medications}
            timePeriods={timePeriods}
          />
        )}
      </div>
    </div>
  );
}

export default App;