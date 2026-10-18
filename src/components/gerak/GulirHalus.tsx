"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

/** Lenis smooth scrolling for the landing page. Anchor links glide to their section. */
export function GulirHalus({ children }: { children: ReactNode }) {
  return <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -72 }, autoRaf: true }}>{children}</ReactLenis>;
}
