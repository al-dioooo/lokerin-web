"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, apiAktif, GalatApi, urlBertoken } from "./klien";

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

  useEffect(() => {
    if (!apiAktif || !aktif || typeof EventSource === "undefined") return;
    const path = kota ? `/events?kota=${encodeURIComponent(kota)}` : "/events";
    const sumber = new EventSource(urlBertoken(path));
    let pertama = true;
    const nama = [
      "lowongan.baru", "butuh_hari_ini", "lowongan.tutup", "lamaran.masuk", "lamaran.status",
      "suara.mulai", "suara.transkrip", "suara.tugas", "suara.widget", "suara.peringatan", "suara.selesai",
    ];
    const terima = (e: MessageEvent) => {
      try {
        cb.current({ type: e.type, data: JSON.parse(e.data) });
      } catch {}
    };
    nama.forEach((n) => sumber.addEventListener(n, terima as EventListener));
    sumber.addEventListener("siap", () => {
      if (!pertama) cbSambung.current?.();
      pertama = false;
    });
    return () => sumber.close();
  }, [kota, aktif]);
}
