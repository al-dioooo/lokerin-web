"use client";

import { useEffect, useState } from "react";

export function HitungMundur({ until, className = "" }: { until: number; className?: string }) {
  const [clock, setClock] = useState<{ until: number; remaining: number } | null>(null);
  useEffect(() => {
    const update = () => setClock({ until, remaining: Math.max(0, Math.ceil((until - Date.now()) / 1000)) });
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, [until]);
  const remaining = clock?.until === until ? clock.remaining : null;
  const digits = remaining === null ? "--:--:--" : [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60].map((n) => String(n).padStart(2, "0")).join(":");
  const label = remaining === null ? "Memuat sisa waktu lowongan" : remaining === 0 ? "Waktu lowongan habis" : `Sisa waktu lowongan: ${Math.floor(remaining / 3600)} jam ${Math.floor(remaining / 60) % 60} menit ${remaining % 60} detik`;
  return <div className={`countdown-row flex flex-wrap items-center justify-between gap-3 ${className}`}><span className="urgent-tag">{remaining === 0 ? "WAKTU HABIS" : "BUTUH HARI INI"}</span><span role="timer" aria-label={label} aria-live="off" className="rounded-full bg-jingga-muda px-2.5 py-1 font-mono text-base font-bold tabular-nums text-jingga-tua">{digits}</span></div>;
}
