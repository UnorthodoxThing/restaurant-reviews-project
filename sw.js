const appName = "restaurant-reviews";
const staticCacheName = appName + "-v1.0";
const contentImgsCache = appName + "-images";
let allCaches = [
  staticCacheName,
  contentImgsCache
]

/* At Service Worker Install time, cache all static assets */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/', // this caches index.html
        '/restaurant.html',
        '/css/styles.css',
        '/css/major-responsive.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        'js/register-sw.js',
        'data/restaurants.json'
      ]);
    })
  );
});

/* At Service Worker Activation, Delete previous caches, if any */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith(appName) &&
            !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/* Fetch requests, and respond */
self.addEventListener('fetch', function(e) {
  // Respond with cached elements, else fall back to network
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('Found ', e.request, ' in cache');
        return response;
      } else {
        console.log('Could not find ', e.request, ' in cache...');
      }
      return fetch(e.request)
        .then(function(response) {
          const clonedResponse = response.clone();
          caches.open('v1').then(function(cache) {
            cache.put(e.request, clonedResponse);
          })
          return response;
        })
        .catch(function(err) {
          console.error(err);
        });
    })
  );
});
