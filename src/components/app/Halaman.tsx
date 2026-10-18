import { ViewTransition, type ReactNode } from "react";

const ARAH = { "nav-kanan": "nav-kanan", "nav-kiri": "nav-kiri", "nav-maju": "nav-maju", "nav-mundur": "nav-mundur", default: "none" };

/** Wraps a page so it slides with the pill nav (left/right) or moves deeper and back (maju/mundur). */
export function Halaman({ children }: { children: ReactNode }) {
  return <ViewTransition enter={ARAH} exit={ARAH} default="none">{children}</ViewTransition>;
}

/** Shared element that morphs between a list and the detail page. */
export function Bersama({ nama, children }: { nama: string; children: ReactNode }) {
  return <ViewTransition name={nama} share="morph" default="none">{children}</ViewTransition>;
}
