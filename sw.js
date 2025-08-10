// Simplified Service Worker without caching.
// This file prevents old versions from sticking in the browser cache.

const VERSION = 'no-cache-v1';

// Install event: claim immediately
self.addEventListener('install', (event) => {
  // Force the waiting Service Worker to become the active Service Worker
  self.skipWaiting();
});

// Activate event: take control of all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Unregister any existing caches to avoid stale responses
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network only (no cache)
// We deliberately avoid responding from cache to ensure the latest files are fetched.
self.addEventListener('fetch', (event) => {
  // Only handle requests from the same origin
  const requestURL = new URL(event.request.url);
  if (requestURL.origin !== location.origin) {
    return;
  }
  event.respondWith(fetch(event.request));
});