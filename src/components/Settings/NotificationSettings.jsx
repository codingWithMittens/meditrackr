import React, { useState, useEffect } from 'react';
import { Bell, BellOff, TestTube, Settings, Clock, Smartphone, Volume2, VolumeX } from 'lucide-react';
import notificationService from '../../services/notificationService';

const NotificationSettings = ({ medications = [], onBack }) => {
  const [notificationStatus, setNotificationStatus] = useState({
    permission: 'default',
    isSupported: false,
    scheduledCount: 0,
    canSchedule: false,
    nextReminder: null
  });
  const [isEnabling, setIsEnabling] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    sound: true,
    vibration: true,
    snoozeMinutes: 15,
    requireInteraction: true,
    showOnLockScreen: true
  });

  useEffect(() => {
    // Load notification status
    updateNotificationStatus();
    
    // Load settings from localStorage
    loadSettings();
    
    // Schedule reminders if enabled
    if (settings.enabled && notificationStatus.canSchedule) {
      scheduleReminders();
    }
  }, []);

  useEffect(() => {
    // Update reminders when medications change
    if (settings.enabled && notificationStatus.canSchedule) {
      scheduleReminders();
    }
  }, [medications, settings.enabled]);

  const updateNotificationStatus = () => {
    const status = notificationService.getNotificationStatus();
    setNotificationStatus(status);
    setSettings(prev => ({ ...prev, enabled: status.permission === 'granted' }));
  };

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('notification_settings');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = (newSettings) => {
    try {
      localStorage.setItem('notification_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleEnableNotifications = async () => {
    setIsEnabling(true);
    
    try {
      const permission = await notificationService.requestPermission();
      console.log('Notification permission result:', permission);
      
      if (permission === 'granted') {
        const newSettings = { ...settings, enabled: true };
        saveSettings(newSettings);
        scheduleReminders();
        updateNotificationStatus();
      } else if (permission === 'denied') {
        // Show instructions for enabling in browser settings
        alert('Notifications were blocked. To enable notifications:\n\n1. Click the lock icon in your browser\'s address bar\n2. Set "Notifications" to "Allow"\n3. Refresh the page and try again');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisableNotifications = () => {
    notificationService.clearAllScheduledNotifications();
    const newSettings = { ...settings, enabled: false };
    saveSettings(newSettings);
    updateNotificationStatus();
  };

  const scheduleReminders = () => {
    if (medications.length > 0) {
      notificationService.scheduleMedicationReminders(medications);
      updateNotificationStatus();
    }
  };

  const handleTestNotification = () => {
    notificationService.testNotification();
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
    
    // Reschedule reminders if needed
    if (key === 'snoozeMinutes' && settings.enabled) {
      scheduleReminders();
    }
  };

  const formatNextReminder = (nextTime) => {
    if (!nextTime) return 'None scheduled';
    
    const now = new Date();
    const timeDiff = nextTime - now;
    
    if (timeDiff < 0) return 'Overdue';
    if (timeDiff < 60000) return 'Less than 1 minute';
    if (timeDiff < 3600000) return `${Math.floor(timeDiff / 60000)} minutes`;
    if (timeDiff < 86400000) return `${Math.floor(timeDiff / 3600000)} hours`;
    
    return nextTime.toLocaleDateString() + ' at ' + nextTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPermissionStatusMessage = () => {
    switch (notificationStatus.permission) {
      case 'granted':
        return { text: 'Notifications are enabled', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
      case 'denied':
        return { text: 'Notifications are blocked', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'default':
        return { text: 'Notification permission not requested', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      default:
        return { text: 'Unknown notification status', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  if (!notificationStatus.isSupported) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200"
          >
            ← Back
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <BellOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Notifications Not Supported
          </h3>
          <p className="text-red-600">
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, Safari, or Edge for the best experience.
          </p>
        </div>
      </div>
    );
  }

  const statusMessage = getPermissionStatusMessage();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notification Settings</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md border border-gray-200/50 transition-all duration-200"
        >
          ← Back
        </button>
      </div>

      {/* Status Overview */}
      <div className={`${statusMessage.bg} ${statusMessage.border} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center gap-3 mb-3">
          {settings.enabled ? (
            <Bell className={`w-5 h-5 ${statusMessage.color}`} />
          ) : (
            <BellOff className={`w-5 h-5 ${statusMessage.color}`} />
          )}
          <h3 className={`font-semibold ${statusMessage.color}`}>
            {statusMessage.text}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Scheduled reminders:</span>
            <span className="ml-2 font-medium">{notificationStatus.scheduledCount}</span>
          </div>
          <div>
            <span className="text-gray-600">Next reminder:</span>
            <span className="ml-2 font-medium">
              {formatNextReminder(notificationStatus.nextReminder)}
            </span>
          </div>
        </div>
      </div>

      {/* Enable/Disable Notifications */}
      <div className="mb-6">
        {!settings.enabled ? (
          <div className="text-center py-6">
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Enable Medication Reminders
            </h3>
            <p className="text-gray-600 mb-4">
              Never miss a dose! Get notifications when it's time to take your medications.
            </p>
            <button
              onClick={handleEnableNotifications}
              disabled={isEnabling}
              className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                isEnabling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isEnabling ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  Enable Notifications
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Notification Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => handleSettingChange('sound', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    {settings.sound ? (
                      <Volume2 className="w-4 h-4 text-blue-600" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium">Sound</span>
                  </div>
                </label>
                <p className="text-sm text-gray-600 ml-7">Play notification sound</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.vibration}
                    onChange={(e) => handleSettingChange('vibration', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Vibration</span>
                  </div>
                </label>
                <p className="text-sm text-gray-600 ml-7">Vibrate device on notification</p>
              </div>
            </div>

            {/* Snooze Duration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Snooze Duration</span>
              </label>
              <select
                value={settings.snoozeMinutes}
                onChange={(e) => handleSettingChange('snoozeMinutes', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleTestNotification}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                <TestTube className="w-4 h-4" />
                Test Notification
              </button>
              
              <button
                onClick={() => scheduleReminders()}
                className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                Refresh Reminders
              </button>
              
              <button
                onClick={handleDisableNotifications}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                <BellOff className="w-4 h-4" />
                Disable All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Medication List */}
      {medications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Medications with Reminders</h3>
          <div className="space-y-2">
            {medications
              .filter(med => med.frequency !== 'as-needed')
              .map(medication => (
                <div key={medication.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-600">{medication.dosage}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {medication.times.map(time => (
                        <span key={time.time} className="mr-2">
                          {time.label || time.time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;