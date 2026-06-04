const CACHE_NAME = 'memoji-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ASSETS.filter(url => !url.endsWith('.png') || true))
        .catch(() => cache.addAll(ASSETS.filter(url => !url.endsWith('.png'))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('./Memoji.html'));
    })
  );
});
