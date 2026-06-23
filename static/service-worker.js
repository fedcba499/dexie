// Very simple cache setup

const CACHE_NAME = "todo-cache-v3";

const FILES_TO_CACHE = [
    "/",    // Flask page (index.html)
    "/static/app.js",
    "/static/manifest.json",
    "/static/icon-192.png",
    "/static/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith((async () => {
        // Always forward non-GET requests to the network (POST/PUT/DELETE etc.)
        if (event.request.method !== 'GET') {
            return fetch(event.request);
        }

        const cached = await caches.match(event.request);
        return cached || fetch(event.request);
    })());
});