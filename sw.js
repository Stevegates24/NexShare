/* NexShare Service Worker v1 */
const CACHE = 'nexshare-v1';
const CORE = [
  './nexshare.html',
  './manifest.json',
  './nexshare-icon.svg',
];

/* ── Install: cache core files ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first for core, network-first for everything else ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET, chrome-extension, and PeerJS/CDN requests — let those go straight to network
  if (e.request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  const isCoreFile = CORE.some(p => url.pathname.endsWith(p.replace('./', '/')));

  if (isCoreFile) {
    // Cache-first: serve from cache, fall back to network and update cache
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  } else {
    // Network-first for CDN scripts (PeerJS, jsQR, etc.) — fall back to cache
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && url.hostname !== 'fonts.gstatic.com') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});

/* ── Background sync placeholder (future: resume transfers) ── */
self.addEventListener('sync', e => {
  // Reserved for future resumable transfer support
});

/* ── Push notifications placeholder ── */
self.addEventListener('push', e => {
  // Reserved for future incoming file notifications
});
