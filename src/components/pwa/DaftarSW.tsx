"use client";

import { useEffect } from "react";

// Registers /sw.js in production builds. A new worker takes over on its own (skipWaiting in sw.js),
// so there is no "update available" prompt; the next page load simply uses it.
export function DaftarSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // A worker left over from `next start` on the same port would serve stale files in dev.
      navigator.serviceWorker.getRegistrations().then((daftar) => {
        for (const r of daftar) if (r.active?.scriptURL.endsWith("/sw.js")) r.unregister();
      }).catch(() => {});
      return;
    }

    let reg: ServiceWorkerRegistration | undefined;
    const daftar = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then((r) => { reg = r; }).catch(() => {});
    };
    // Installed apps can stay open for days: look for a new worker whenever the app comes back to the front.
    const cekBaru = () => {
      if (document.visibilityState === "visible") reg?.update().catch(() => {});
    };

    if (document.readyState === "complete") daftar();
    else window.addEventListener("load", daftar, { once: true });
    document.addEventListener("visibilitychange", cekBaru);
    return () => {
      window.removeEventListener("load", daftar);
      document.removeEventListener("visibilitychange", cekBaru);
    };
  }, []);

  return null;
}
