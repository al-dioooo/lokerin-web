"use client";

import { useEffect, useState } from "react";

function useCountdown(until: number) {
  const [clock, setClock] = useState<{ until: number; remaining: number } | null>(null);
  useEffect(() => {
    const update = () => setClock({ until, remaining: Math.max(0, Math.ceil((until - Date.now()) / 1000)) });
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, [until]);
  return clock?.until === until ? clock.remaining : null;
}

function timeLabel(seconds: number | null) {
  if (seconds === null) return "--:--:--";
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map((n) => String(n).padStart(2, "0")).join(":");
}

export function HitungMundur({ until }: { until: number }) {
  const remaining = useCountdown(until);
  return <span className="inline-flex flex-wrap items-center gap-2 rounded-kertas bg-malam px-3 py-2 text-led"><span className="text-xs">{remaining === 0 ? "Waktu habis" : "Sisa waktu"}</span><span role="timer" aria-label="Sisa waktu lowongan" aria-live="off" className="led-text text-2xl">{timeLabel(remaining)}</span></span>;
}

export function PapanLed({ until, teks, className = "" }: { until: number; teks: string; className?: string }) {
  const remaining = useCountdown(until);
  const [paused, setPaused] = useState(false);
  return (
    <section className={`led-board ${className}`} aria-label="Papan lowongan mendesak">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-led/30 px-5 py-4 sm:px-8">
        <span className="eyebrow text-kertas">● Butuh hari ini</span>
        <button type="button" className="min-h-12 min-w-12 rounded border border-kertas/60 px-3 text-sm font-bold text-kertas" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Jalankan teks" : "Jeda teks"}</button>
      </div>
      <div className="px-5 pt-5 sm:px-8"><p className="text-sm text-kertas">{remaining === 0 ? "Waktu lowongan berakhir" : "Waktu tersisa untuk melamar"}</p><p role="timer" aria-label="Sisa waktu untuk melamar" aria-live="off" className="led-text my-1 text-[clamp(2.6rem,8vw,5rem)] leading-tight tracking-tight">{timeLabel(remaining)}</p></div>
      <div className="overflow-hidden px-5 py-5 sm:px-8"><p className="sr-only">{teks}</p><div aria-hidden="true" className="led-marquee led-text whitespace-nowrap text-2xl sm:text-3xl" data-paused={paused}><span>{teks} ·</span><span aria-hidden="true">{teks} ·</span></div></div>
      <p className="border-t border-led/30 px-5 py-3 text-xs text-kertas sm:px-8">CONTOH LOWONGAN · BANYUMAS & SEKITARNYA</p>
    </section>
  );
}
