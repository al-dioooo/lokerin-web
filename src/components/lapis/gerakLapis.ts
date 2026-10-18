"use client";

import { useSyncExternalStore } from "react";

// Spring values from Apple's fluid-interface guidance, in Motion's bounce/duration terms.
// Default UI settles without overshoot; a sheet that was flicked may bounce slightly.
export const PEGAS_TENANG = { type: "spring" as const, bounce: 0, duration: 0.35 };
export const PEGAS_LACI = { type: "spring" as const, bounce: 0.15, duration: 0.32 };

/** Where a flick would come to rest, using the same decay as scrolling. */
export function proyeksi(kecepatan: number, laju = 0.998) {
  return ((kecepatan / 1000) * laju) / (1 - laju);
}

function berlanggananMedia(query: string) {
  return (fn: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  };
}

export function useMedia(query: string, awal = false) {
  return useSyncExternalStore(berlanggananMedia(query), () => window.matchMedia(query).matches, () => awal);
}

/** Phones get bottom sheets; tablets and desktops get a side panel. */
export function useLayarLebar() {
  return useMedia("(min-width: 768px)");
}

export function useGerakDikurangi() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
