const CACHE_NAME = 'bb-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/audio-engine.js',
  './js/modes/base-mode.js',
  './js/modes/pure-tone.js',
  './js/modes/music-ssb.js',
  './js/modes/drone.js',
  './js/utils/freq-distribution.js',
  './js/ui/controls.js',
  './js/ui/visualizer.js',
  './js/ui/info-panel.js',
  './js/ui/file-handler.js',
  './js/workers/ssb-worklet.js',
  './js/workers/hilbert-worker.js',
  './js/i18n/i18n.js',
  './js/i18n/zh.js',
  './js/i18n/en.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
