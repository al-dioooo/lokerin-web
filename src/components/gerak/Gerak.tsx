"use client";

import { LazyMotion, MotionConfig, domMax, m, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/** Loads only the Motion features we use and follows the user's reduced-motion setting. */
export function Gerak({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 420, damping: 36 }}>{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Moves slower than the page as you scroll, for depth. */
export function Paralaks({ children, className, jarak = 140 }: { children: ReactNode; className?: string; jarak?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, jarak]);
  return <m.div className={className} style={{ y }}>{children}</m.div>;
}
