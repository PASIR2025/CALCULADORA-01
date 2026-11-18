const CACHE_NAME = 'calc-v3-responsive';
const OLD_CACHE = 'calc-v2-motor';
const scope = self.registration.scope;
const appUrl = path => new URL(path, scope).href;
const APP_SHELL = [
  './', 'index.html', 'instalar.html', 'manifest.json', 'interfaz.css?v=3',
  'imagenes/logo.png', 'imagenes/itm.png', 'imagenes/contactor.png',
  'imagenes/rele.png', 'imagenes/motor.png', 'imagenes/diferencial.png',
  'imagenes/tiktok.png', 'imagenes/facebook.png', 'imagenes/youtube.png',
  'imagenes/manuales.png', 'imagenes/whatsapp.png'
].map(appUrl);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL.map(url => new Request(url, {cache:'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key === OLD_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request, {cache:'no-cache'});
        if (response.ok) {
          try { await cache.put(request, response.clone()); } catch (_) {}
        }
        return response;
      } catch (_) {
        return (await cache.match(request)) || (await cache.match(appUrl('index.html'))) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type !== 'opaque') {
      try { await cache.put(request, response.clone()); } catch (_) {}
    }
    return response;
  })());
});
