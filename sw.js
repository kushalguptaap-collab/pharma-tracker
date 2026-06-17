// Service Worker — Agarwal Pharma Field Tracker
const CACHE = 'pharma-tracker-v1';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([
      '/pharma-tracker/field-tracker.html',
      '/pharma-tracker/manifest.json'
    ]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// Keep alive ping — prevents browser from killing the worker
self.addEventListener('message', e => {
  if (e.data === 'keepalive') {
    e.ports[0].postMessage('alive');
  }
});

// Background sync support
self.addEventListener('sync', e => {
  if (e.tag === 'location-sync') {
    // Will retry any failed Firebase writes when back online
    console.log('Background sync triggered');
  }
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
