"use client";

import { useEffect, useState } from "react";
import { useLangsung } from "@/lib/api/hooks";
import { API_URL, apiAktif } from "@/lib/api/klien";
import { BUTUH_HARI_INI, LOWONGAN_TAYANG } from "@/lib/data";

type Statistik = { lowongan_terbit: number; lowongan_hari_ini: number; butuh_hari_ini: number; pemberi_kerja_terverifikasi: number };

const CONTOH: Statistik = { lowongan_terbit: LOWONGAN_TAYANG.length, lowongan_hari_ini: 6, butuh_hari_ini: BUTUH_HARI_INI.length, pemberi_kerja_terverifikasi: 11 };

/** The landing page's live counter: jobs today and Butuh Hari Ini, updated when a job is posted. */
export function PenghitungLangsung() {
  const [s, setS] = useState<Statistik>(CONTOH);
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

  return (
    <p className="pil-piksel" aria-live="polite">
      <span className="titik-hidup" aria-hidden="true" />
      <span key={s.lowongan_hari_ini} className="angka-berdetak">{s.lowongan_hari_ini}</span>&nbsp;lowongan baru hari ini
      <span className="hidden sm:inline">&nbsp;·&nbsp;<span key={`m${s.butuh_hari_ini}`} className="angka-berdetak">{s.butuh_hari_ini}</span>&nbsp;butuh hari ini</span>
    </p>
  );
}
