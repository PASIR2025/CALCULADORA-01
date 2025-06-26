self.addEventListener('install', function (e) {
  console.log('Service Worker instalado');
  e.waitUntil(
    caches.open('calc-cache').then(function (cache) {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './imagenes/logo.png',
        './imagenes/icon-192.png',
        './imagenes/icon-512.png'
        // puedes añadir más archivos aquí si deseas que estén disponibles sin conexión
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});