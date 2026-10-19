"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiAktif, GalatApi, urlBertoken } from "./klien";
import { useSesi } from "./sesi";

type Muat<T> = { data: T | null; galat: GalatApi | null; memuat: boolean; muatUlang: () => void };

/** Small fetch hook: loads on mount and when `path` changes; `null` skips the request. */
export function useApi<T>(path: string | null): Muat<T> {
  const [data, setData] = useState<T | null>(null);
  const [galat, setGalat] = useState<GalatApi | null>(null);
  const [putaran, setPutaran] = useState(0);
  const [selesai, setSelesai] = useState<string | null>(null);
  const kunci = path && apiAktif ? `${path}#${putaran}` : null;
  const memuat = kunci !== null && selesai !== kunci;

  useEffect(() => {
    if (!kunci || !path) return;
    const kendali = new AbortController();
    api<T>(path, { signal: kendali.signal })
      .then((hasil) => {
        setData(hasil);
        setGalat(null);
        setSelesai(kunci);
      })
      .catch((e: unknown) => {
        if (kendali.signal.aborted) return;
        setGalat(e instanceof GalatApi ? e : new GalatApi(0, "galat", "Gagal memuat."));
        setSelesai(kunci);
      });
    return () => kendali.abort();
  }, [kunci, path]);

  const muatUlang = useCallback(() => setPutaran((n) => n + 1), []);
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
