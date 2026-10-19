"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { api, apiAktif, GalatApi, urlBertoken } from "./klien";
import { useSesi } from "./sesi";
import { baca, basikan, langgan as langganSimpanan, tulis } from "./simpanan";

type Muat<T> = { data: T | null; galat: GalatApi | null; memuat: boolean; muatUlang: () => void };

/** Data younger than this is shown without asking the server again. */
const SEGAR_MS = 15_000;
const jalurKunci = new Map<string, string>();

function ambilKunci(kunci: string, path: string, paksa = false) {
  const lama = baca(kunci);
  if (lama.janji) return;
  if (!paksa && lama.waktu && Date.now() - lama.waktu < SEGAR_MS) return;
  const janji = api<unknown>(path)
    .then((data) => tulis(kunci, { data, galat: null, waktu: Date.now(), janji: null }))
    .catch((e: unknown) => {
      const galat = e instanceof GalatApi ? e : new GalatApi(0, "galat", "Gagal memuat.");
      // Keep showing what we had; the error is there for screens that want to say so.
      tulis(kunci, { ...baca(kunci), galat, waktu: Date.now(), janji: null });
    });
  tulis(kunci, { ...lama, janji });
}

// Whatever is on screen is checked again when the person comes back to the tab, the connection
// returns, or anything was saved (a write anywhere can change what another screen shows).
if (typeof window !== "undefined") {
  let terakhir = 0;
  const segarkan = (paksa: boolean) => () => {
    if (document.visibilityState !== "visible") return;
    // Focus can fire many times in a row (switching apps, dismissing a dialog); once is enough.
    if (!paksa && Date.now() - terakhir < 5_000) return;
    terakhir = Date.now();
    for (const kunci of basikan()) {
      const path = jalurKunci.get(kunci);
      if (path) ambilKunci(kunci, path, paksa);
    }
  };
  window.addEventListener("focus", segarkan(false));
  window.addEventListener("online", segarkan(true));
  window.addEventListener("lokerin:tersimpan", segarkan(true));
}

/**
 * Loads `path` and keeps it fresh; `null` skips the request. Results are shared and remembered per
 * account, so coming back to a screen shows the last data at once while a fresh copy loads behind it.
 */
export function useApi<T>(path: string | null): Muat<T> {
  const { pengguna, siap } = useSesi();
  // Keyed by account: one person's data is never shown to the next one on the same phone.
  const kunci = path && apiAktif && siap ? `${pengguna?.id ?? "tamu"}|${path}` : null;
  const berlangganan = useCallback((fn: () => void) => (kunci ? langganSimpanan(kunci, fn) : () => {}), [kunci]);
  const entri = useSyncExternalStore(
    berlangganan,
    () => (kunci ? baca(kunci) : null),
    () => null,
  );

  useEffect(() => {
    if (!kunci || !path) return;
    jalurKunci.set(kunci, path);
    ambilKunci(kunci, path);
  }, [kunci, path]);

  const muatUlang = useCallback(() => {
    if (kunci && path) ambilKunci(kunci, path, true);
  }, [kunci, path]);

  const data = (entri?.data ?? null) as T | null;
  const galat = entri?.galat ?? null;
  // "Loading" means nothing to show yet; a refresh behind shown data does not count.
  const memuat = path !== null && apiAktif && data === null && galat === null;
  return { data, galat, memuat, muatUlang };
}

export type PeristiwaLangsung = { type: string; data: unknown };

const NAMA_PERISTIWA = [
  "lowongan.baru", "butuh_hari_ini", "lowongan.tutup", "lamaran.masuk", "lamaran.status", "kabar.baru",
  "suara.mulai", "suara.transkrip", "suara.tugas", "suara.widget", "suara.peringatan", "suara.selesai",
];

type Pendengar = { peristiwa: (p: PeristiwaLangsung) => void; tersambung: () => void };
type Saluran = { sumber: EventSource; pendengar: Set<Pendengar> };

// One EventSource per URL, shared by every screen that listens, so the bell, the feed and a list
// on the same page do not each hold a connection open (browsers allow only six per server).
const saluran = new Map<string, Saluran>();

function langgan(url: string, pendengar: Pendengar) {
  let s = saluran.get(url);
  if (!s) {
    const sumber = new EventSource(url);
    const baru: Saluran = { sumber, pendengar: new Set() };
    let pertama = true;
    const terima = (e: MessageEvent) => {
      let data: unknown;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      baru.pendengar.forEach((p) => {
        try {
          p.peristiwa({ type: e.type, data });
        } catch {}
      });
    };
    NAMA_PERISTIWA.forEach((n) => sumber.addEventListener(n, terima as EventListener));
    sumber.addEventListener("siap", () => {
      if (!pertama) baru.pendengar.forEach((p) => p.tersambung());
      pertama = false;
    });
    saluran.set(url, baru);
    s = baru;
  }
  const aktif = s;
  aktif.pendengar.add(pendengar);
  return () => {
    aktif.pendengar.delete(pendengar);
    if (aktif.pendengar.size) return;
    aktif.sumber.close();
    saluran.delete(url);
  };
}

/**
 * Live updates over Server-Sent Events. The browser reconnects on its own; after a reconnect
 * `onTersambung` runs so screens can reload what they missed.
 */
export function useLangsung(
  kota: string | null,
  onPeristiwa: (p: PeristiwaLangsung) => void,
  opsi: { aktif?: boolean; onTersambung?: () => void } = {},
) {
  const cb = useRef(onPeristiwa);
  const cbSambung = useRef(opsi.onTersambung);
  useEffect(() => {
    cb.current = onPeristiwa;
    cbSambung.current = opsi.onTersambung;
  });
  const aktif = opsi.aktif ?? true;
  // The private channel follows the signed-in account, so sign-in and sign-out reconnect.
  const akun = useSesi().pengguna?.id ?? null;

  useEffect(() => {
    if (!apiAktif || !aktif || typeof EventSource === "undefined") return;
    const path = kota ? `/events?kota=${encodeURIComponent(kota)}` : "/events";
    return langgan(urlBertoken(path), {
      peristiwa: (p) => cb.current(p),
      tersambung: () => cbSambung.current?.(),
    });
  }, [kota, aktif, akun]);
}
