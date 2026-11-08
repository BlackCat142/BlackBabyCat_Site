// service-worker.js — офлайн-режим и быстрая загрузка сайта TheWitcheryCat.
//
// Как работает:
// • страницы (HTML) — сначала из сети, если сети нет — из кэша, иначе страница «Нет подключения»;
// • скрипты и стили — тоже сначала из сети (чтобы не смешались старые и новые файлы);
// • картинки и иконки — сразу из кэша, а в фоне обновляются из сети;
// • Яндекс.Метрика, YouTube и прочие внешние сервисы не кэшируются.
//
// VERSION обновляется админкой при каждом сохранении — так посетители получают новую версию.

const VERSION = '2026-11-08T05:29:15.586Z';
const CACHE = `twc-${VERSION}`;

const PRECACHE = [
  '/', '/index.html', '/moon.html', '/moon/', '/textpesen.html', '/privacy-policy.html', '/offline.html',
  '/style.css', '/style-moon-rec.css', '/icons.css', '/pages.css', '/404.html',
  '/config.js', '/script.js', '/metrika.js', '/chatbot.js', '/moon-astro.js', '/moon-calendar.js', '/recommendations-engine.js',
  '/manifest.json', '/icons/logo.png', '/icons/favicon-32x32.png', '/icons/android-chrome-192x192.png'
];
const CDN_CACHEABLE = ['https://cdnjs.cloudflare.com/'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // по одному файлу: если какого-то нет, остальные всё равно закэшируются
    await Promise.all(PRECACHE.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('twc-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, offlinePage) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request, { ignoreSearch: true })
      || await cache.match(new URL(request.url).pathname.replace(/\/$/, '/index.html'))
      || await cache.match(request.url.replace(/(\/[^/.]+)$/, '$1.html'));   // /textpesen → /textpesen.html
    return cached || (offlinePage ? cache.match('/offline.html') : Response.error());
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const update = fetch(request).then(response => {
    if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  if (cached) { event.waitUntil(update); return cached; }
  return update;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate' || request.destination === 'document') {
      event.respondWith(networkFirst(request, true));
    } else if (['script', 'style', 'manifest'].includes(request.destination)) {
      event.respondWith(networkFirst(request, false));
    } else {
      event.respondWith(staleWhileRevalidate(request, event));
    }
    return;
  }

  if (CDN_CACHEABLE.some(prefix => request.url.startsWith(prefix))) {
    event.respondWith(cacheFirst(request));
  }
  // всё остальное (Метрика, YouTube, VK, band.link) — как обычно, без кэша
});
