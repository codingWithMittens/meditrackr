import React, { useState, useRef } from 'react';
import { Download, FileText, ChevronDown, ChevronUp, Settings, ArrowLeft, Calendar } from 'lucide-react';
import MedicationTable from './MedicationTable';
import HistoricalView from './HistoricalView';

const PrintView = ({ medications, timePeriods, pharmacies, providers, dailyLogs, onBackToCalendar }) => {
  const [printViewType, setPrintViewType] = useState('list');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFieldOptions, setShowFieldOptions] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    genericName: false,
    dosage: true,
    frequency: true,
    times: true,
    indication: false,
    provider: false,
    providerDetails: false,
    pharmacy: false,
    pharmacyDetails: false,
    startDate: false,
    endDate: false,
    notes: false
  });

  const handleExportData = () => {
    try {
      // Get all app data (use props to ensure current state)
      const exportData = {
        medications: medications || [],
        pharmacies: pharmacies || [],
        providers: providers || [],
        timePeriods: timePeriods || [],
        dailyLogs: dailyLogs || {},
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0'
      };

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `medmindr-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    }
  };



  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSelectAll = () => {
    const allFields = {
      name: true,
      genericName: true,
      dosage: true,
      frequency: true,
      times: true,
      indication: true,
      provider: true,
      providerDetails: true,
      pharmacy: true,
      pharmacyDetails: true,
      startDate: true,
      endDate: true,
      notes: true
    };
    setSelectedFields(allFields);
  };

  const handleSelectNone = () => {
    const noFields = {
      name: true, // Keep name always selected as it's essential
      genericName: false,
      dosage: false,
      frequency: false,
      times: false,
      indication: false,
      provider: false,
      providerDetails: false,
      pharmacy: false,
      pharmacyDetails: false,
      startDate: false,
      endDate: false,
      notes: false
    };
    setSelectedFields(noFields);
  };

  // Essential fields shown when collapsed
  const essentialFields = ['name', 'dosage', 'frequency', 'times'];

  // Additional fields shown when expanded
  const additionalFields = ['genericName', 'indication', 'provider', 'providerDetails', 'pharmacy', 'pharmacyDetails', 'startDate', 'endDate', 'notes'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6 no-print">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCalendar}
            className="flex items-center gap-2 bg-white/70 text-gray-700 px-3 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200"
            title="Back to Calendar"
          >
            <ArrowLeft className="w-4 h-4" />
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Calendar</span>
          </button>
          <h2 className="text-2xl font-bold">Reports</h2>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className="w-4 h-4" />
          </button>

          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <button
                onClick={() => {
                  window.print();
                  setShowExportDropdown(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Print/PDF</span>
              </button>
              <button
                onClick={() => {
                  handleExportData();
                  setShowExportDropdown(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
              >
                <Download className="w-5 h-5 text-green-500" />
                <span className="font-medium">JSON File</span>
              </button>
            </div>
          )}
        </div>
      </div>



      <div className="border-t border-gray-200 pt-6">
        <div className="flex gap-2 mb-6 no-print">
          <button
            onClick={() => setPrintViewType('list')}
            className={`px-4 py-2 rounded ${printViewType === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Med List
          </button>
          <button
            onClick={() => setPrintViewType('historical')}
            className={`px-4 py-2 rounded ${printViewType === 'historical' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Historical
          </button>
        </div>

        {printViewType === 'list' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg no-print">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Field Selection
              </h3>
              <button
                onClick={() => setShowFieldOptions(!showFieldOptions)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showFieldOptions ? 'Less Fields' : 'More Fields'}
                {showFieldOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
                        </div>

            {/* Select All/None - Only when additional fields are shown */}
            {showFieldOptions && (
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Select None
                </button>
              </div>
            )}

            {/* Essential Fields - Always Visible */}
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {essentialFields.map(fieldKey => {
                  const fieldLabels = {
                    name: 'Drug Name',
                    dosage: 'Dosage',
                    frequency: 'Frequency',
                    times: 'Times'
                  };
                  return (
                    <label key={fieldKey} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFields[fieldKey]}
                        onChange={() => handleFieldToggle(fieldKey)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{fieldLabels[fieldKey]}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Additional Fields - Collapsible */}
            {showFieldOptions && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Fields</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {additionalFields.map(fieldKey => {
                    const fieldLabels = {
                      genericName: 'Generic Name',
                      indication: 'Indication',
                      provider: 'Provider Name',
                      providerDetails: 'Provider Contact',
                      pharmacy: 'Pharmacy Name',
                      pharmacyDetails: 'Pharmacy Contact',
                      startDate: 'Start Date',
                      endDate: 'End Date',
                      notes: 'Notes'
                    };
                    return (
                      <label key={fieldKey} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFields[fieldKey]}
                          onChange={() => handleFieldToggle(fieldKey)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{fieldLabels[fieldKey]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

                {printViewType === 'list' ? (
          <MedicationTable
            medications={medications}
            selectedFields={selectedFields}
            pharmacies={pharmacies}
            providers={providers}
          />
        ) : (
          <HistoricalView
            medications={medications}
            dailyLogs={dailyLogs}
          />
        )}
      </div>
    </div>
  );
};

export default PrintView;