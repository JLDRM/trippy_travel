const assets = ['/', 'styles.css', 'assets/fonts/VT323-Regular.ttf', 'heartbeat-loader.css', 'minesweeper.css', 'assets/img/host.gif', 'assets/img/speech-bubble-down.png', 'assets/img/Clouds-02.png', 'landing.js', 'hall-of-fame.module.js', 'minesweeper.module.js','https://unpkg.com/rxjs@^7/dist/bundles/rxjs.umd.min.js']

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open('assets').then(cache => {
      cache.addAll(assets);
    })
  )
})

// Cache first pattern
/* self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      } else {
        return fetch(ev.request)
      }
    })
  )
}) */

// Stale while revalidate cache pattern
self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches.match(ev.request).then(cachedResponse => {

      const fetchPromise = fetch(ev.request).then(response => {
        return caches.open('assets').then(cache => {
          cache.put(ev.request, response.clone());
          return response;
        })
      }).catch((err) => {
        console.log('Error: ', ev.request, err);
      })

      return cachedResponse || fetchPromise;
    })
  )
})