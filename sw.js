// Offline support: keep the game files on the device after the first visit.
const CACHE = 'kiki-glam-v5';
const CORE = ['./', './index.html', './privacy.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './fonts/grandstander-latin-700-normal.woff2', './fonts/grandstander-latin-900-normal.woff2', './fonts/nunito-latin-700-normal.woff2', './fonts/nunito-latin-900-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit || caches.match('./index.html'));
    return hit || net;
  }));
});
