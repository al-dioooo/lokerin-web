"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLangsung } from "@/lib/api/hooks";
import { API_URL, apiAktif } from "@/lib/api/klien";
import { BUTUH_HARI_INI, LOWONGAN_TAYANG } from "@/lib/data";

type Statistik = { lowongan_terbit: number; lowongan_hari_ini: number; butuh_hari_ini: number; pemberi_kerja_terverifikasi: number };

// Only used when the app runs without the server. With the server, nothing is shown as a number
// until the real counts arrive, so a visitor never sees sample figures on the live site.
const CONTOH: Statistik = { lowongan_terbit: LOWONGAN_TAYANG.length, lowongan_hari_ini: 6, butuh_hari_ini: BUTUH_HARI_INI.length, pemberi_kerja_terverifikasi: 11 };

function Angka({ n }: { n: number }) {
  return <span key={n} className="angka-berdetak">{n}</span>;
}

/**
 * Two short facts for the pill. On a day with new jobs it leads with those; on a quiet day it
 * counts the jobs still open and the verified businesses, so the counter never reads "0".
 */
function isi(s: Statistik | null): [ReactNode, ReactNode | null] {
  if (!s || (s.lowongan_hari_ini === 0 && s.lowongan_terbit === 0)) return ["Lowongan terverifikasi di Banyumas", null];
  const pertama = s.lowongan_hari_ini > 0
    ? <><Angka n={s.lowongan_hari_ini} />&nbsp;lowongan baru hari ini</>
    : <><Angka n={s.lowongan_terbit} />&nbsp;lowongan terbuka</>;
  const kedua = s.butuh_hari_ini > 0
    ? <><Angka n={s.butuh_hari_ini} />&nbsp;butuh hari ini</>
    : s.pemberi_kerja_terverifikasi > 0 ? <><Angka n={s.pemberi_kerja_terverifikasi} />&nbsp;usaha terverifikasi</> : null;
  return [pertama, kedua];
}

/** The landing page's live counter, updated when a job is posted or closed. */
export function PenghitungLangsung() {
  const [s, setS] = useState<Statistik | null>(apiAktif ? null : CONTOH);
  const [segar, setSegar] = useState(0);

  useEffect(() => {
    if (!apiAktif) return;
    let batal = false;
    fetch(`${API_URL}/lowongan/statistik`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Statistik | null) => { if (d && !batal) setS(d); })
      .catch(() => {});
    return () => { batal = true; };
  }, [segar]);

  useLangsung(null, (p) => {
    if (p.type === "lowongan.baru" || p.type === "butuh_hari_ini" || p.type === "lowongan.tutup") setSegar((n) => n + 1);
  });

  const [pertama, kedua] = isi(s);
  return (
    <p className="pil-piksel" aria-live="polite">
      <span className="titik-hidup" aria-hidden="true" />
      {pertama}
      {kedua && <span className="hidden sm:inline">&nbsp;·&nbsp;{kedua}</span>}
    </p>
  );
}
