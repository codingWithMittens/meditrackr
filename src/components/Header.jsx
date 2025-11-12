import React from 'react';
import ReactDOM from 'react-dom';
import { Calendar, Settings, AlertCircle, Clock, MapPin, User, Wrench, LogOut, PlayCircle, Bell } from 'lucide-react';

const Header = ({
  currentView,
  setCurrentView,
  showForm,
  showSettingsMenu,
  setShowSettingsMenu,
  user,
  onLogout,
  onStartTour,
  onNavigateToNotifications
}) => {
  const handleTitleClick = () => {
    setCurrentView('calendar');
    // Close any open menus
    setShowSettingsMenu(false);
  };
    return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-lg border border-white/50 p-1 sm:p-6 mb-1 sm:mb-6 no-print">
      <div className="flex items-center justify-between">
        {/* Title and Logo - Clickable Home Link */}
        <button
          onClick={handleTitleClick}
          className="flex items-center gap-2 sm:gap-2 calendar-header hover:scale-105 transition-transform duration-200 cursor-pointer"
          title="Back to Calendar - MedMindr"
        >
          <div className="bg-gradient-to-br from-blue-500 to-teal-600 p-0.5 sm:p-3 rounded sm:rounded-2xl shadow-lg">
            <Calendar className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="hidden sm:block text-3xl font-bold bg-gradient-to-r from-gray-800 to-teal-700 bg-clip-text text-transparent">MedMindr</h1>
        </button>

        {/* Navigation and Settings */}
        <div className="flex items-center justify-end">
          {/* User Menu with Settings - Mobile: Icon Only */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="flex items-center gap-2 sm:gap-2 bg-white/70 text-gray-700 p-1 sm:px-3 sm:py-2 rounded sm:rounded-xl hover:bg-white/80 hover:shadow-md border border-gray-200/50 transition-all duration-200 user-menu"
                title={`Settings & Account - ${user.name}`}
              >
                {/* Mobile: Just Settings Icon */}
                <Settings className="w-4 h-4 sm:hidden" />

                {/* Desktop: Full Layout */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium max-w-20 truncate">
                    {user.name}
                  </span>
                  <Settings className="w-4 h-4" />
                </div>
              </button>
                          {showSettingsMenu && ReactDOM.createPortal(
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowSettingsMenu(false)}
                  />
                  {/* Dropdown menu */}
                  <div className="fixed top-12 sm:top-20 right-2 sm:right-6 w-52 sm:w-56 bg-white backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 z-[9999]">
                    <button
                      onClick={() => {
                        setCurrentView('list');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200 rounded-t-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Medications</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('periods');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-teal-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200"
                    >
                      <Clock className="w-5 h-5 text-teal-600" />
                      <span className="font-semibold text-gray-700">Time Periods</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('pharmacies');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200 settings-pharmacies"
                    >
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-gray-700">Pharmacies</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('providers');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-violet-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200 settings-providers"
                    >
                      <User className="w-5 h-5 text-violet-600" />
                      <span className="font-semibold text-gray-700">Providers</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToNotifications?.();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200 settings-notifications"
                    >
                      <Bell className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-700">Notifications</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('advanced');
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200"
                    >
                      <Wrench className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-gray-700">Account</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log('Features Tour clicked');
                        setShowSettingsMenu(false);
                        setCurrentView('calendar'); // Ensure we're on calendar for tour
                        setTimeout(() => {
                          console.log('Calling onStartTour');
                          onStartTour();
                        }, 100);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-green-50/60 flex items-center gap-3 border-b border-gray-100/50 transition-colors duration-200"
                    >
                      <PlayCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-700">Features Tour</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50/60 flex items-center gap-3 transition-colors duration-200 rounded-b-xl"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-gray-700">Logout</span>
                    </button>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
