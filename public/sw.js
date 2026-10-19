// Lokerin service worker. Bump VERSI when the precache list or the caching rules change.
const VERSI = "v2";
const SHELL = `lokerin-shell-${VERSI}`; // offline page and its files, kept until the next version
const HALAMAN = `lokerin-halaman-${VERSI}`; // pages, network first
const ASET = `lokerin-aset-${VERSI}`; // static files, stale-while-revalidate
const BATAS = { [HALAMAN]: 40, [ASET]: 150 };

const OFFLINE = "/offline";
const HALAMAN_AWAL = ["/", "/app"];
const BERKAS_AWAL = ["/manifest.webmanifest", "/icons/192", "/icon.svg", "/logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL);
      await shell.add(OFFLINE);
      // Keep the CSS, JS and fonts the offline page points to, so it renders with no network at all.
      const html = await (await shell.match(OFFLINE)).text();
      const aset = new Set(html.match(/\/_next\/static\/[\w\-.~/@%]+/g) ?? []);
      await Promise.allSettled([...aset, ...BERKAS_AWAL].map((url) => shell.add(url)));
      const halaman = await caches.open(HALAMAN);
      await Promise.allSettled(HALAMAN_AWAL.map((url) => halaman.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const tetap = [SHELL, HALAMAN, ASET];
      for (const nama of await caches.keys()) {
        if (nama.startsWith("lokerin-") && !tetap.includes(nama)) await caches.delete(nama);
      }
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!bolehDisimpan(req, url)) return; // let the browser handle it untouched

  if (req.mode === "navigate") event.respondWith(halamanDulu(event));
  else if (statis(url)) event.respondWith(lamaSambilSegarkan(event));
});

// Never touch API traffic: other origins, chat and live events, signed-in requests, streams.
function bolehDisimpan(req, url) {
  if (url.origin !== self.location.origin) return false;
  if (/(?:^|\/)(?:chat|events)(?:\/|$)/.test(url.pathname)) return false;
  if (req.headers.has("authorization") || req.headers.has("range")) return false;
  if ((req.headers.get("accept") ?? "").includes("text/event-stream")) return false;
  return true;
}

function statis(url) {
  const p = url.pathname;
  if (p === "/sw.js") return false;
  return (
    p.startsWith("/_next/static/") ||
    p.startsWith("/_next/image") ||
    p.startsWith("/icons/") ||
    p.startsWith("/apple-icon") ||
    /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|gif|webp|avif|svg|ico|webmanifest)$/.test(p)
  );
}

// Network first; when offline, the last saved copy of the page, then the offline page.
async function halamanDulu(event) {
  const cache = await caches.open(HALAMAN);
  try {
    const res = (await event.preloadResponse) || (await fetch(event.request));
    // A redirected response cannot be replayed for a navigation, so it is not stored.
    if (res.ok && res.type === "basic" && !res.redirected) {
      event.waitUntil(simpan(cache, HALAMAN, event.request, res.clone()));
    }
    return res;
  } catch {
    const opsi = { ignoreSearch: true, ignoreVary: true };
    return (await cache.match(event.request, opsi)) || (await caches.match(OFFLINE, opsi)) || Response.error();
  }
}

// Answer from the cache right away and refresh it in the background.
async function lamaSambilSegarkan(event) {
  const cache = await caches.open(ASET);
  const lama = await caches.match(event.request, { ignoreVary: true });
  const baru = fetch(event.request).then((res) => {
    if (res.ok && res.type === "basic") event.waitUntil(simpan(cache, ASET, event.request, res.clone()));
    return res;
  });
  if (!lama) return baru;
  event.waitUntil(baru.catch(() => {}));
  return lama;
}

// Store, then drop the oldest entries so the cache stays small on cheap phones.
async function simpan(cache, nama, req, res) {
  await cache.put(req, res);
  const kunci = await cache.keys();
  const lebih = kunci.length - BATAS[nama];
  for (let i = 0; i < lebih; i++) await cache.delete(kunci[i]);
}

// Kabar sent as Web Push (ADR 0008). The payload never carries contact details; the link opens them.
self.addEventListener("push", (event) => {
  let isi = {};
  try {
    isi = event.data ? event.data.json() : {};
  } catch {
    isi = { isi: event.data ? event.data.text() : "" };
  }
  const tautan = isi.tautan || "/app";
  event.waitUntil(
    self.registration.showNotification(isi.judul || "Lokerin", {
      body: isi.isi || "",
      tag: tautan,
      icon: "/icons/192",
      badge: "/icons/96",
      lang: "id",
      data: { tautan },
    }),
  );
});

// Open the link in a Lokerin window that is already open, or a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const tujuan = new URL(event.notification.data?.tautan || "/app", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const jendela = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const ada = jendela.find((c) => c.url.startsWith(self.location.origin));
      if (ada) {
        await ada.focus();
        if ("navigate" in ada) await ada.navigate(tujuan);
        return;
      }
      await self.clients.openWindow(tujuan);
    })(),
  );
});
