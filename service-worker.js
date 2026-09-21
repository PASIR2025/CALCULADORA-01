const CACHE_NAME = 'calc-v2-motor';
const APP_SHELL = [
  '/',
  'index.html',
  'manifest.json',
  'service-worker.js',
  'imagenes/logo.png',
  'imagenes/itm.png',
  'imagenes/contactor.png',
  'imagenes/rele.png',
  'imagenes/motor.png',
  'imagenes/diferencial.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
