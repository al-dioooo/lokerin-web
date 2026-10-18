"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export type Arah = "kanan" | "kiri" | "maju" | "mundur";

// The direction of the last navigation. Links set it on click; the next page reads it when it shows.
let arahTerakhir: Arah | null = null;

export function aturArah(arah: Arah) {
  arahTerakhir = arah;
}

/**
 * Slides a page in each time it shows after an in-app navigation, including pages Next keeps alive
 * in the background. The old page is already hidden by then, so the two never overlap.
 * It is a CSS animation that only styles the start, so the page always ends fully visible even if
 * the animation is paused or cut short. First load renders as is.
 */
export function Halaman({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const arah = arahTerakhir;
    arahTerakhir = null;
    if (!el || !arah) return;
    el.removeAttribute("data-arah");
    void el.offsetWidth; // restart the animation when a kept-alive page shows again
    el.setAttribute("data-arah", arah);
    const selesai = (e: AnimationEvent) => {
      if (e.target === el) el.removeAttribute("data-arah");
    };
    el.addEventListener("animationend", selesai);
    return () => el.removeEventListener("animationend", selesai);
  }, []);
  return <div ref={ref} className="halaman">{children}</div>;
}
