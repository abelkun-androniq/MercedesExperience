// Offline cache for the whole tour. tools/build.mjs stamps VERSION (content hash) and FILES (every site file) into the copy
// in _site/; this source copy precaches nothing. Install caches every stop, so one visit with signal covers the museum.
const VERSION = "dev";
const FILES = [];
const CACHE = `tour-${VERSION}`;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("tour-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Cache first: in the museum a weak signal is worse than none, so never wait on the network for a cached file.
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const page = req.mode === "navigate" || /\/(stop|index|teaser)\.html$|\/$/.test(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: page });   // stop.html?s=… is one cached page
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === "basic") cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (page) return (await cache.match("index.html")) ?? Response.error();
      throw err;
    }
  })());
});

self.addEventListener("message", e => {
  if (e.data?.type !== "status") return;
  e.waitUntil(caches.open(CACHE).then(async cache => {
    let cached = 0;
    for (const f of FILES) if (await cache.match(f)) cached++;
    e.ports[0].postMessage({ version: VERSION, total: FILES.length, cached });
  }));
});
