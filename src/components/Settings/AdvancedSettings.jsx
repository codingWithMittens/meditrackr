import React, { useState, useRef } from 'react';
import { Upload, Download, AlertTriangle, FileText, User, Mail, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

const AdvancedSettings = ({ user }) => {
  const { deleteAccount } = useAuth();
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState('');
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importMode, setImportMode] = useState('file');
  const [pastedData, setPastedData] = useState('');

  const handleExportData = () => {
    if (!user) return;

    try {
      // Get user-specific data
      const exportData = {
        user: { id: user.id, name: user.name, email: user.email },
        medications: JSON.parse(localStorage.getItem(`medications_${user.id}`) || '[]'),
        pharmacies: JSON.parse(localStorage.getItem(`pharmacies_${user.id}`) || '[]'),
        providers: JSON.parse(localStorage.getItem(`providers_${user.id}`) || '[]'),
        timePeriods: JSON.parse(localStorage.getItem(`timePeriods_${user.id}`) || '[]'),
        dailyLogs: JSON.parse(localStorage.getItem(`dailyLogs_${user.id}`) || '{}'),
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
      link.download = `medmindr-${user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      setImportStatus('Error exporting data: ' + error.message);
      setTimeout(() => setImportStatus(''), 5000);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will permanently delete all your data and cannot be undone.\n\nType "DELETE" to confirm.'
    );

    if (confirmed) {
      const confirmText = window.prompt('Please type "DELETE" to confirm account deletion:');
      if (confirmText === 'DELETE') {
        const result = await deleteAccount();
        if (!result.success) {
          alert('Error deleting account: ' + result.error);
        }
        // If successful, user will be logged out automatically
      }
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result);

        // Validate the imported data structure
        const requiredFields = ['medications', 'pharmacies', 'providers', 'timePeriods'];
        const isValidData = requiredFields.every(field =>
          importData.hasOwnProperty(field) && Array.isArray(importData[field])
        );

        if (!isValidData) {
          throw new Error('Invalid file format. Please select a valid MedMindr export file.');
        }

        // Confirm before overwriting
        const confirmed = window.confirm(
          'This will replace all your current data. Are you sure you want to continue?'
        );

        if (confirmed) {
          // Import all data to localStorage
          localStorage.setItem('medications', JSON.stringify(importData.medications || []));
          localStorage.setItem('pharmacies', JSON.stringify(importData.pharmacies || []));
          localStorage.setItem('providers', JSON.stringify(importData.providers || []));
          localStorage.setItem('timePeriods', JSON.stringify(importData.timePeriods || []));
          localStorage.setItem('dailyLogs', JSON.stringify(importData.dailyLogs || {}));

          setImportStatus('Data imported successfully! Please refresh the page to see changes.');

          // Auto-refresh after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setImportStatus('Error importing data: ' + error.message);
        setTimeout(() => setImportStatus(''), 5000);
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const handlePasteImport = () => {
    try {
      const importData = JSON.parse(pastedData);

      // Validate the imported data structure
      const requiredFields = ['medications', 'pharmacies', 'providers', 'timePeriods'];
      const isValidData = requiredFields.every(field =>
        importData.hasOwnProperty(field) && Array.isArray(importData[field])
      );

      if (!isValidData) {
        throw new Error('Invalid JSON format. Please ensure the data includes medications, pharmacies, providers, and timePeriods arrays.');
      }

      // Confirm before overwriting
      const confirmed = window.confirm(
        'This will replace all your current data. Are you sure you want to continue?'
      );

      if (confirmed) {
        // Import all data to localStorage
        localStorage.setItem('medications', JSON.stringify(importData.medications || []));
        localStorage.setItem('pharmacies', JSON.stringify(importData.pharmacies || []));
        localStorage.setItem('providers', JSON.stringify(importData.providers || []));
        localStorage.setItem('timePeriods', JSON.stringify(importData.timePeriods || []));
        localStorage.setItem('dailyLogs', JSON.stringify(importData.dailyLogs || {}));

        setImportStatus('Data imported successfully! Please refresh the page to see changes.');
        setPastedData('');
        setShowImportOptions(false);

        // Auto-refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setImportStatus('Error importing pasted data: ' + error.message);
      setTimeout(() => setImportStatus(''), 5000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-gray-600">Manage your account and data</p>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-500" />
            Profile Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Last login: {new Date(user.lastLogin).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-800 font-medium">Important Notice</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Import features will replace your current data. Always export your data first as a backup before importing.
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-green-500" />
          Export Your Data
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Download all your medication data as a JSON file. This includes medications, pharmacies, providers, time periods, and daily logs.
        </p>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          Export My Data
        </button>
      </div>

      {/* Danger Zone */}
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-700">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-red-600 text-sm mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Import Section */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-500" />
          Import Data
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Import data from a previously exported MedMindr JSON file or paste JSON data directly. This will replace your current data.
        </p>

        <button
          onClick={() => setShowImportOptions(!showImportOptions)}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 mb-4"
        >
          <Upload className="w-4 h-4" />
          {showImportOptions ? 'Hide Import Options' : 'Show Import Options'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportData}
          className="hidden"
        />

        {showImportOptions && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setImportMode('file')}
                className={`px-4 py-2 rounded ${importMode === 'file' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setImportMode('paste')}
                className={`px-4 py-2 rounded ${importMode === 'paste' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Paste JSON
              </button>
            </div>

            {importMode === 'file' ? (
              <div>
                <p className="text-gray-600 text-sm mb-3">Select a MedMindr export file (.json) to import:</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 text-sm mb-3">Paste your MedMindr export JSON data below:</p>
                <textarea
                  value={pastedData}
                  onChange={(e) => setPastedData(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder='Paste JSON data here... e.g., {"medications": [...], "pharmacies": [...], ...}'
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handlePasteImport}
                    disabled={!pastedData.trim()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Import Pasted Data
                  </button>
                  <button
                    onClick={() => setPastedData('')}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {importStatus && (
        <div className={`mt-4 p-3 rounded-lg ${
          importStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {importStatus}
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;