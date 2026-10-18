"use client";

import { useAnimate } from "motion/react";
import { useLayoutEffect, type ReactNode } from "react";

export type Arah = "kanan" | "kiri" | "maju" | "mundur";

// The direction of the last navigation. Links set it on click; the next page reads it when it shows.
let arahTerakhir: Arah | null = null;

export function aturArah(arah: Arah) {
  arahTerakhir = arah;
}

const AWAL: Record<Arah, [number, number]> = {
  kanan: [36, 0],
  kiri: [-36, 0],
  maju: [0, 28],
  mundur: [0, -20],
};

/**
 * Animates a page in each time it shows after an in-app navigation, including pages Next keeps
 * alive in the background. The old page is already hidden by then, so the two never overlap.
 * Direction follows the pill (left/right) or depth (into a job and back). First load renders as is.
 */
export function Halaman({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useLayoutEffect(() => {
    const arah = arahTerakhir;
    arahTerakhir = null;
    if (!arah || !scope.current) return;
    const [x, y] = AWAL[arah];
    animate(scope.current, { opacity: [0, 1] }, { duration: 0.2, ease: "easeOut" });
    animate(scope.current, { x: [x, 0], y: [y, 0] }, { type: "spring", stiffness: 340, damping: 32 });
  }, [animate, scope]);
  return <div ref={scope}>{children}</div>;
}
