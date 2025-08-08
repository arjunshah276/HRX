// public/sw.js - minimal service worker to avoid registration 404
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// Basic fetch handler (pass-through)
self.addEventListener('fetch', (event) => {
  // optional: you can add caching logic here later
  event.respondWith(fetch(event.request));
});
