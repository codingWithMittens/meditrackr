import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check, Wifi, WifiOff } from 'lucide-react';
import pwaService from '../../services/pwaService';

const PWAInstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check initial PWA status
    const status = pwaService.getInstallationStatus();
    setShowInstallButton(status.canInstall && !status.isInstalled);
    setIsOnline(status.isOnline);

    // Listen for PWA events
    const handleInstallAvailable = () => {
      console.log('PWA Install Button: Install available');
      setShowInstallButton(true);
    };

    const handleInstallCompleted = () => {
      console.log('PWA Install Button: Install completed');
      setShowInstallButton(false);
      setIsInstalling(false);
    };

    const handleUpdateAvailable = () => {
      console.log('PWA Install Button: Update available');
      setShowUpdateButton(true);
    };

    const handleOnlineStatus = (event) => {
      setIsOnline(event.detail.isOnline);
    };

    // Add event listeners
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-online-status', handleOnlineStatus);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-online-status', handleOnlineStatus);
    };
  }, []);

  const handleInstallClick = async () => {
    setIsInstalling(true);

    try {
      const success = await pwaService.installPWA();
      console.log('PWA Install Button: Install result:', success);

      if (!success) {
        setIsInstalling(false);
      }
    } catch (error) {
      console.error('PWA Install Button: Install error:', error);
      setIsInstalling(false);
    }
  };

  const handleUpdateClick = () => {
    pwaService.applyUpdate();
    setShowUpdateButton(false);
  };

  // Don't show anything if already installed as PWA
  if (pwaService.isInstalled()) {
    return null;
  }

  return (
    <div className="pwa-controls">
      {/* Install Button */}
      {showInstallButton && (
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg p-2 flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Install MedMindr App
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Add MedMindr to your home screen for quick access, offline support, and push notifications.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isInstalling
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isInstalling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install App
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowInstallButton(false)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Button */}
      {showUpdateButton && (
        <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Update Available
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                A new version of MedMindr is available with bug fixes and improvements.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Check className="w-4 h-4" />
                  Update Now
                </button>
                <button
                  onClick={() => setShowUpdateButton(false)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Online/Offline Status */}
      <div
        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-all duration-300 cursor-help ${
          isOnline
            ? 'text-green-700 bg-green-100 border border-green-200'
            : 'text-amber-700 bg-amber-100 border border-amber-200'
        }`}
        title={isOnline
          ? "✅ Online: Connected to internet. App can sync data and receive updates. All features available."
          : "📶 Offline: No internet connection. App still works! Your medication data is stored locally on your device. You can track medications, view schedules, and add daily logs. Data will sync when connection returns. Push notifications require internet."
        }
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Offline - Using cached data</span>
          </>
        )}
      </div>
    </div>
  );
};

export default PWAInstallButton;