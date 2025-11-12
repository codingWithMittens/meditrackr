// PWA Service Management
class PWAService {
  constructor() {
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    this.installPromptEvent = null;
    
    this.init();
  }

  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/meditrackr/sw.js');
        console.log('PWA: Service worker registered successfully');
        
        // Listen for updates
        this.swRegistration.addEventListener('updatefound', () => {
          console.log('PWA: New service worker version available');
          this.handleServiceWorkerUpdate();
        });
        
      } catch (error) {
        console.error('PWA: Service worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault(); // Prevent automatic prompt
      this.installPromptEvent = e;
      
      // Show custom install button/prompt
      this.showInstallButton();
    });

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.installPromptEvent = null;
      this.hideInstallButton();
      
      // Track installation
      this.trackEvent('pwa_installed');
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      console.log('PWA: Back online');
      this.isOnline = true;
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      console.log('PWA: Gone offline');
      this.isOnline = false;
      this.handleOnlineStatusChange(false);
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }
  }

  // Install PWA
  async installPWA() {
    if (!this.installPromptEvent) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      // Show install prompt
      this.installPromptEvent.prompt();
      
      // Wait for user choice
      const { outcome } = await this.installPromptEvent.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted installation');
        this.trackEvent('pwa_install_accepted');
      } else {
        console.log('PWA: User dismissed installation');
        this.trackEvent('pwa_install_dismissed');
      }
      
      this.installPromptEvent = null;
      return outcome === 'accepted';
      
    } catch (error) {
      console.error('PWA: Error during installation:', error);
      return false;
    }
  }

  // Check if PWA can be installed
  canInstall() {
    return !!this.installPromptEvent;
  }

  // Check if running as installed PWA
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // Show install button in UI
  showInstallButton() {
    const event = new CustomEvent('pwa-install-available');
    window.dispatchEvent(event);
  }

  // Hide install button from UI
  hideInstallButton() {
    const event = new CustomEvent('pwa-install-completed');
    window.dispatchEvent(event);
  }

  // Handle service worker updates
  handleServiceWorkerUpdate() {
    const newWorker = this.swRegistration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New version available
          console.log('PWA: New version available');
          this.showUpdatePrompt();
        }
      }
    });
  }

  // Show update prompt to user
  showUpdatePrompt() {
    const event = new CustomEvent('pwa-update-available');
    window.dispatchEvent(event);
  }

  // Apply service worker update
  applyUpdate() {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  // Handle online/offline status changes
  handleOnlineStatusChange(isOnline) {
    const event = new CustomEvent('pwa-online-status', { 
      detail: { isOnline } 
    });
    window.dispatchEvent(event);

    if (isOnline) {
      // Trigger background sync when back online
      this.triggerBackgroundSync();
    }
  }

  // Trigger background sync
  async triggerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('medication-sync');
        console.log('PWA: Background sync registered');
      } catch (error) {
        console.error('PWA: Background sync registration failed:', error);
      }
    }
  }

  // Handle messages from service worker
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'MEDICATION_TAKEN':
        // Handle medication taken from notification
        console.log('PWA: Medication marked as taken via notification');
        const medicationEvent = new CustomEvent('medication-taken-notification', { 
          detail: data 
        });
        window.dispatchEvent(medicationEvent);
        break;
        
      case 'NOTIFICATION_CLICKED':
        // Handle notification click
        console.log('PWA: Notification clicked');
        const clickEvent = new CustomEvent('notification-clicked', { 
          detail: data 
        });
        window.dispatchEvent(clickEvent);
        break;
        
      default:
        console.log('PWA: Unknown message from service worker:', type);
    }
  }

  // Get PWA installation status
  getInstallationStatus() {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isInstalled(),
      isOnline: this.isOnline,
      hasServiceWorker: !!this.swRegistration
    };
  }

  // Track PWA events (integrate with analytics)
  trackEvent(eventName, data = {}) {
    console.log(`PWA Event: ${eventName}`, data);
    
    // Here you could integrate with Google Analytics, etc.
    // gtag('event', eventName, { ...data, category: 'PWA' });
  }

  // Share content using Web Share API
  async shareContent(shareData) {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('PWA: Content shared successfully');
        return true;
      } catch (error) {
        console.error('PWA: Error sharing content:', error);
        return false;
      }
    }
    return false;
  }

  // Get app info for sharing
  getShareableContent(medicationData) {
    return {
      title: 'MedMindr - My Medication Progress',
      text: `Check out my medication adherence progress! I've been tracking ${medicationData.totalMedications} medications with ${medicationData.adherenceRate}% adherence.`,
      url: window.location.origin + '/meditrackr/'
    };
  }
}

// Create singleton instance
const pwaService = new PWAService();

export default pwaService;