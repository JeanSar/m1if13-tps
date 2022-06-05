import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration'


addEventListener('message', (event) => {
    if (event.data && event.data.type == 'skipWaiting') {
      skipWaiting();
    }
  });

//precacheAndRoute(self.__precacheManifest);
precacheAndRoute(self.__WB_MANIFEST);

//This is how you can use the network first strategy for files ending with .js
registerRoute(
    /.*\.js/,
    new NetworkFirst()
)

// Use cache but update cache files in the background ASAP
registerRoute(
    /.*\.css/,
    new StaleWhileRevalidate({
        cacheName: 'css-cache'
    })
)

//Cache first, but defining duration and maximum files
registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
)



