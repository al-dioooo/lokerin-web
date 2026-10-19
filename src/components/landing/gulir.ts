"use client";

import { useMotionValue, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import type { RefObject } from "react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Scroll progress (0 to 1) of a section. With reduced motion the value stays at 1, so every
 * scroll-linked illustration shows its finished state and nothing moves.
 */
export function useKemajuan(target: RefObject<HTMLElement | null>, offset: Offset): MotionValue<number> {
  const diam = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset });
  const selesai = useMotionValue(1);
  return diam ? selesai : scrollYProgress;
}
