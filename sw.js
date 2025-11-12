// MedMindr Service Worker
const CACHE_NAME = 'medmindr-v1.0.0';
const BASE_PATH = '/meditrackr';

// Resources to cache for offline use
const CACHE_RESOURCES = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/assets/index.css`,
  `${BASE_PATH}/assets/index.js`,
  `${BASE_PATH}/icons/icon-192x192.svg`,
  `${BASE_PATH}/icons/icon-512x512.svg`
];

// Install event - cache core resources
self.addEventListener('install', event => {
  console.log('MedMindr SW: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('MedMindr SW: Caching core resources');
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log('MedMindr SW: Core resources cached');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('MedMindr SW: Activating...');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('MedMindr SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('MedMindr SW: Activated and ready');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle medication data requests specially
  if (event.request.url.includes('medications_') ||
      event.request.url.includes('dailyLogs_') ||
      event.request.url.includes('pharmacies_') ||
      event.request.url.includes('providers_')) {

    // Always go to network for user data, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first strategy for static resources
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('MedMindr SW: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache failed requests
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(error => {
            console.log('MedMindr SW: Network request failed:', error);

            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(`${BASE_PATH}/index.html`);
            }

            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  console.log('MedMindr SW: Push received');

  let notificationData = {
    title: 'MedMindr Reminder',
    body: 'It\'s time to take your medication',
    icon: `${BASE_PATH}/icons/icon-192x192.svg`,
    badge: `${BASE_PATH}/icons/badge-72x72.png`,
    tag: 'medication-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'taken',
        title: '✅ Mark as Taken',
        icon: `${BASE_PATH}/icons/check.png`
      },
      {
        action: 'snooze',
        title: '⏰ Snooze 15 min',
        icon: `${BASE_PATH}/icons/snooze.png`
      },
      {
        action: 'view',
        title: '👁️ View Details',
        icon: `${BASE_PATH}/icons/view.png`
      }
    ],
    data: {
      timestamp: Date.now(),
      url: `${BASE_PATH}/?notification=medication-reminder`
    }
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('MedMindr SW: Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: notificationData.data,
      vibrate: [200, 100, 200]
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('MedMindr SW: Notification clicked:', event);

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  if (action === 'taken') {
    // Handle mark as taken
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          if (clientList.length > 0) {
            const client = clientList[0];
            client.postMessage({
              type: 'MEDICATION_TAKEN',
              data: notificationData
            });
            return client.focus();
          }
        })
    );
  } else if (action === 'snooze') {
    // Schedule another notification in 15 minutes
    console.log('MedMindr SW: Snoozing notification for 15 minutes');
    // This would integrate with your notification scheduling system
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clientList => {
          // Check if app is already open
          for (let client of clientList) {
            if (client.url.includes(BASE_PATH)) {
              client.postMessage({
                type: 'NOTIFICATION_CLICKED',
                data: notificationData
              });
              return client.focus();
            }
          }

          // Open new window if app not open
          return clients.openWindow(notificationData.url || `${BASE_PATH}/`);
        })
    );
  }
});

// Background sync event (for offline actions)
self.addEventListener('sync', event => {
  console.log('MedMindr SW: Background sync:', event.tag);

  if (event.tag === 'medication-sync') {
    event.waitUntil(
      // Sync offline medication data when back online
      syncOfflineData()
    );
  }
});

async function syncOfflineData() {
  try {
    console.log('MedMindr SW: Syncing offline medication data');

    // Get any offline actions stored in IndexedDB
    // This would integrate with your data layer

    console.log('MedMindr SW: Offline data sync completed');
  } catch (error) {
    console.error('MedMindr SW: Error syncing offline data:', error);
  }
}

// Message event - handle messages from main app
self.addEventListener('message', event => {
  console.log('MedMindr SW: Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});