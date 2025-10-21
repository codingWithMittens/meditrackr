import React from 'react';
import { Calendar, Settings, AlertCircle, Clock } from 'lucide-react';

const Header = ({
  currentView,
  setCurrentView,
  showForm,
  showSettingsMenu,
  setShowSettingsMenu
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-3 rounded-full">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Medication Manager</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <button
                onClick={() => {
                  setCurrentView('list');
                  setShowSettingsMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
              >
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Medications</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('periods');
                  setShowSettingsMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
              >
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Time Periods</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {!showForm && (
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              currentView === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
          <button
            onClick={() => setCurrentView('print')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              currentView === 'print' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print View
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
