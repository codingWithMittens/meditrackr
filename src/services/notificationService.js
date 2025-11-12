// Notification Service for Medication Reminders
class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.scheduledNotifications = new Map();

    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Notifications: Not supported in this browser');
      return;
    }

    this.permission = Notification.permission;
    console.log('Notifications: Current permission:', this.permission);

    // Load scheduled notifications from storage
    this.loadScheduledNotifications();
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      return 'unsupported';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      console.log('Notifications: Permission response:', permission);

      if (permission === 'granted') {
        this.showWelcomeNotification();
      }

      return permission;
    } catch (error) {
      console.error('Notifications: Error requesting permission:', error);
      return 'error';
    }
  }

  // Show welcome notification after permission granted
  showWelcomeNotification() {
    this.showNotification({
      title: 'MedMindr Notifications Enabled! 🎉',
      body: 'You\'ll now receive reminders for your medications.',
      tag: 'welcome',
      requireInteraction: false
    });
  }

  // Show immediate notification
  showNotification(options) {
    if (this.permission !== 'granted') {
      console.warn('Notifications: Permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/meditrackr/icons/icon-192x192.svg',
      badge: '/meditrackr/icons/badge-72x72.svg',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      actions: [
        {
          action: 'taken',
          title: '✅ Mark as Taken'
        },
        {
          action: 'snooze',
          title: '⏰ Snooze 15 min'
        }
      ]
    };

    const notificationOptions = { ...defaultOptions, ...options };

    try {
      const notification = new Notification(options.title, notificationOptions);

      // Handle notification events
      notification.onclick = (event) => {
        console.log('Notifications: Clicked:', event);
        window.focus();
        notification.close();

        // Navigate to medication if specified
        if (options.medicationId) {
          this.handleNotificationClick(options);
        }
      };

      notification.onclose = () => {
        console.log('Notifications: Closed');
      };

      return notification;
    } catch (error) {
      console.error('Notifications: Error showing notification:', error);
      return null;
    }
  }

  // Schedule medication reminders
  scheduleMedicationReminders(medications) {
    console.log('Notifications: Scheduling reminders for', medications.length, 'medications');

    // Clear existing scheduled notifications
    this.clearAllScheduledNotifications();

    medications.forEach(medication => {
      if (medication.frequency === 'as-needed') {
        return; // Skip as-needed medications
      }

      medication.times.forEach(timeSlot => {
        this.scheduleRecurringReminder(medication, timeSlot);
      });
    });

    // Save to localStorage for persistence
    this.saveScheduledNotifications();
  }

  // Schedule recurring reminder for a specific medication time
  scheduleRecurringReminder(medication, timeSlot) {
    const scheduleId = `${medication.id}-${timeSlot.time}`;

    // Calculate next reminder time
    const now = new Date();
    const [hours, minutes] = timeSlot.time.split(':').map(Number);

    let nextReminder = new Date();
    nextReminder.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (nextReminder <= now) {
      nextReminder.setDate(nextReminder.getDate() + 1);
    }

    console.log(`Notifications: Scheduling ${medication.name} for ${nextReminder}`);

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      this.showMedicationReminder(medication, timeSlot);

      // Schedule next occurrence (daily)
      this.scheduleRecurringReminder(medication, timeSlot);

    }, nextReminder.getTime() - now.getTime());

    // Store the scheduled notification
    this.scheduledNotifications.set(scheduleId, {
      timeoutId,
      medication,
      timeSlot,
      nextTime: nextReminder
    });
  }

  // Show medication reminder notification
  showMedicationReminder(medication, timeSlot) {
    const title = `Time for ${medication.name}! 💊`;
    const body = `${medication.dosage} - ${timeSlot.label || timeSlot.time}`;

    this.showNotification({
      title,
      body,
      tag: `med-${medication.id}-${timeSlot.time}`,
      medicationId: medication.id,
      timeSlot: timeSlot.time,
      data: {
        medicationId: medication.id,
        medicationName: medication.name,
        dosage: medication.dosage,
        time: timeSlot.time,
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'taken',
          title: '✅ Taken'
        },
        {
          action: 'snooze',
          title: '⏰ Snooze 15min'
        },
        {
          action: 'skip',
          title: '⏭️ Skip'
        }
      ]
    });

    // Track notification shown
    this.trackNotificationEvent('medication_reminder_shown', {
      medicationId: medication.id,
      medicationName: medication.name,
      time: timeSlot.time
    });
  }

  // Handle notification click actions
  handleNotificationClick(options) {
    const event = new CustomEvent('notification-medication-click', {
      detail: {
        medicationId: options.medicationId,
        timeSlot: options.timeSlot,
        data: options.data
      }
    });
    window.dispatchEvent(event);
  }

  // Clear all scheduled notifications
  clearAllScheduledNotifications() {
    console.log('Notifications: Clearing all scheduled notifications');

    this.scheduledNotifications.forEach(({ timeoutId }) => {
      clearTimeout(timeoutId);
    });

    this.scheduledNotifications.clear();
  }

  // Clear specific medication notifications
  clearMedicationNotifications(medicationId) {
    const keysToRemove = [];

    this.scheduledNotifications.forEach((notification, key) => {
      if (notification.medication.id === medicationId) {
        clearTimeout(notification.timeoutId);
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach(key => {
      this.scheduledNotifications.delete(key);
    });

    this.saveScheduledNotifications();
  }

  // Get notification status and stats
  getNotificationStatus() {
    return {
      permission: this.permission,
      isSupported: this.isSupported,
      scheduledCount: this.scheduledNotifications.size,
      canSchedule: this.permission === 'granted' && this.isSupported,
      nextReminder: this.getNextScheduledTime()
    };
  }

  // Get next scheduled reminder time
  getNextScheduledTime() {
    let nextTime = null;

    this.scheduledNotifications.forEach(notification => {
      if (!nextTime || notification.nextTime < nextTime) {
        nextTime = notification.nextTime;
      }
    });

    return nextTime;
  }

  // Save scheduled notifications to localStorage
  saveScheduledNotifications() {
    try {
      const serializable = Array.from(this.scheduledNotifications.entries()).map(([key, value]) => ({
        key,
        medication: value.medication,
        timeSlot: value.timeSlot,
        nextTime: value.nextTime.getTime()
      }));

      localStorage.setItem('scheduled_notifications', JSON.stringify(serializable));
    } catch (error) {
      console.error('Notifications: Error saving scheduled notifications:', error);
    }
  }

  // Load scheduled notifications from localStorage
  loadScheduledNotifications() {
    try {
      const saved = localStorage.getItem('scheduled_notifications');
      if (!saved) return;

      const notifications = JSON.parse(saved);
      const now = new Date();

      notifications.forEach(({ key, medication, timeSlot, nextTime }) => {
        const scheduledTime = new Date(nextTime);

        // Only reschedule future notifications
        if (scheduledTime > now) {
          const timeoutId = setTimeout(() => {
            this.showMedicationReminder(medication, timeSlot);
            this.scheduleRecurringReminder(medication, timeSlot);
          }, scheduledTime.getTime() - now.getTime());

          this.scheduledNotifications.set(key, {
            timeoutId,
            medication,
            timeSlot,
            nextTime: scheduledTime
          });
        }
      });

      console.log('Notifications: Restored', this.scheduledNotifications.size, 'scheduled notifications');
    } catch (error) {
      console.error('Notifications: Error loading scheduled notifications:', error);
    }
  }

  // Test notification (for settings/debugging)
  testNotification() {
    this.showNotification({
      title: 'MedMindr Test Notification 🧪',
      body: 'This is a test to make sure notifications are working!',
      tag: 'test',
      requireInteraction: false
    });
  }

  // Track notification events
  trackNotificationEvent(eventName, data = {}) {
    console.log(`Notification Event: ${eventName}`, data);
    // Integration with analytics would go here
  }

  // Schedule a one-time reminder (for snooze functionality)
  scheduleOneTimeReminder(medication, timeSlot, delayMinutes = 15) {
    const futureTime = new Date();
    futureTime.setMinutes(futureTime.getMinutes() + delayMinutes);

    const timeoutId = setTimeout(() => {
      this.showMedicationReminder(medication, timeSlot);
    }, delayMinutes * 60 * 1000);

    console.log(`Notifications: Snoozed ${medication.name} for ${delayMinutes} minutes`);

    // Store with special snooze key
    const snoozeKey = `snooze-${medication.id}-${timeSlot.time}-${Date.now()}`;
    this.scheduledNotifications.set(snoozeKey, {
      timeoutId,
      medication,
      timeSlot,
      nextTime: futureTime,
      isSnooze: true
    });

    this.saveScheduledNotifications();

    return snoozeKey;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;