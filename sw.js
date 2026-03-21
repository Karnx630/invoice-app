const CACHE_NAME = 'invoicer-pro-v3';

// Install phase: force the new service worker to take over immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate phase: clean up any old, broken caches from previous versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Take control of all open pages right away
    return self.clients.claim();
});

// Fetch phase: "Network First, Fallback to Cache"
self.addEventListener('fetch', (event) => {
    // Ignore non-GET requests (like form submissions)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If we get a valid response from the internet, save a copy to the cache
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // IF OFFLINE: Catch the error and serve the file from the cache
                return caches.match(event.request);
            })
    );
});
