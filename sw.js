const CACHE_NAME = 'invoice-pro-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Install event: cache all necessary files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Fetch event: serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
