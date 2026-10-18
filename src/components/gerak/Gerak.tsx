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

/** Fades and lifts its content in the first time it scrolls into view. */
export function Muncul({ children, className, jeda = 0 }: { children: ReactNode; className?: string; jeda?: number }) {
  return (
    <m.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ type: "spring", stiffness: 160, damping: 24, delay: jeda }}>
      {children}
    </m.div>
  );
}

/** Moves slower than the page as you scroll, for depth. */
export function Paralaks({ children, className, jarak = 140 }: { children: ReactNode; className?: string; jarak?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, jarak]);
  return <m.div className={className} style={{ y }}>{children}</m.div>;
}

/** Scales up slightly as it enters, like a window being brought forward. */
export function Maju({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div className={className} initial={{ opacity: 0, scale: 0.94, y: 40 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ type: "spring", stiffness: 120, damping: 22 }}>
      {children}
    </m.div>
  );
}
