/**
 * Service Worker for Smart Calculator & Real-Time FX iPhone Fullscreen PWA
 * Supports offline App Shell caching and network-first FX rate caching
 */

const CACHE_NAME = 'smart-calc-fx-pwa-v1';
const FX_API_CACHE = 'smart-calc-fx-api-v1';

const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './app_icon.png',
  './apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-1024.png',
  './icons/apple-touch-icon.png',
  './icons/apple-touch-icon-180x180.png',
  './icons/apple-touch-icon-167x167.png',
  './icons/apple-touch-icon-152x152.png',
  './icons/apple-touch-icon-120x120.png',
  './icons/apple-splash-1170x2532.png',
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== FX_API_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for Exchange Rate API, Stale-While-Revalidate for App Shell
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Live Exchange Rate API: Network-first with offline cache fallback
  if (url.hostname.includes('open.er-api.com')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(FX_API_CACHE).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Standard App Shell & CDN assets: Cache-first, fallback to network and update cache
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});