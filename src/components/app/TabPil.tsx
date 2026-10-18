"use client";

import { startTransition, type CSSProperties } from "react";

/** Segmented tabs with a sliding thumb. Changes run in a transition so keyed ViewTransitions crossfade. */
export function TabPil<T extends string>({ pilihan, nilai, onUbah, label, className = "" }: { pilihan: { id: T; label: string }[]; nilai: T; onUbah: (v: T) => void; label: string; className?: string }) {
  const i = Math.max(0, pilihan.findIndex((p) => p.id === nilai));
  return (
    <div className={`tab-pil ${className}`} role="tablist" aria-label={label} style={{ "--n": pilihan.length, "--i": i } as CSSProperties}>
      <span className="tab-pil-geser" aria-hidden="true" />
      {pilihan.map((p) => (
        <button key={p.id} type="button" role="tab" aria-selected={p.id === nilai} onClick={() => startTransition(() => onUbah(p.id))}>{p.label}</button>
      ))}
    </div>
  );
}
