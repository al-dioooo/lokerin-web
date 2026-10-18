"use client";

import { useEffect, useState } from "react";
import { IconClock } from "../icons/tabler";

function format(detik: number) {
  return [Math.floor(detik / 3600), Math.floor(detik / 60) % 60, detik % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Live countdown for Butuh Hari Ini listings. The deadline is set when the page opens. */
export function SisaWaktu({ menit, className = "" }: { menit: number; className?: string }) {
  const [sampai] = useState(() => (typeof window === "undefined" ? 0 : Date.now() + menit * 60000));
  const [sisa, setSisa] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setSisa(Math.max(0, Math.ceil((sampai - Date.now()) / 1000)));
    const awal = window.setTimeout(tick, 0);
    const jalan = window.setInterval(tick, 1000);
    return () => { window.clearTimeout(awal); window.clearInterval(jalan); };
  }, [sampai]);
  const label = sisa === null ? "Memuat sisa waktu" : sisa === 0 ? "Waktu habis" : `Sisa waktu ${Math.floor(sisa / 3600)} jam ${Math.floor(sisa / 60) % 60} menit`;
  return (
    <span role="timer" aria-label={label} className={`inline-flex items-center gap-1 rounded-full bg-jingga-muda px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-jingga-tua ${className}`}>
      <IconClock size={13} stroke={2} />{sisa === null ? "--:--:--" : format(sisa)}
    </span>
  );
}
