// Disclaimer: I'm not really a JS guy, this is all pretty new to me
// Most of this code is copy-pasta from Google's tutorial:
// https://codelabs.developers.google.com/codelabs/your-first-pwapp/

// Note: This file must be located in the root directory to have proper
// access to other root-directory files for caching purposes

// TODO: this doesn't do much right now, cache notes later!

const CACHE_NAME = "cardi-offline-cache";

const FILES_TO_CACHE = ['/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('offline.html');
      });
    })
  );
});
