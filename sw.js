// Service Worker - freeze fix patch
// Chitarra Coach - bump cache + fast activation
const CACHE = 'ccpwa-v1.0.3'; // <- bump this number on each release

const CORE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  // Install new SW and skip waiting so it becomes active immediately.
  self.skipWaiting(); // MDN: ServiceWorkerGlobalScope.skipWaiting()
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
});

self.addEventListener('activate', (e) => {
  // Clean old caches and take control of existing clients right away.
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : 0)))
      .then(() => self.clients.claim()) // MDN: Clients.claim()
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // …eventuale pulizia cache…
    await self.clients.claim();
    const all = await self.clients.matchAll({ includeUncontrolled: true });
    for (const client of all) client.postMessage({ type: 'SW_READY' });
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Network-first for cross-origin (e.g., YouTube); let browser handle it.
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return resp;
    }).catch(() => cached))
  );
});
