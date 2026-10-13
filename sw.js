// Scrap Super service worker: app shell offline cache (network-first)
const CACHE = "scrapsuper-v2";
const PAGES = ["index", "rates", "cart", "track", "news", "gallery", "locator", "careers", "about", "contact", "faq", "admin"].map(p => p + ".html");
const SHELL = ["./", ...PAGES, "style.css", "common.js", "pages.js", "admin.js", "store.js", "i18n.js", "data.js",
  "firebase-config.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
