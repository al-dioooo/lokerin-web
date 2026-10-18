"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { aturArah, type Arah } from "./Halaman";

/** A Link that tells the next page which way to come in from. */
export function TautanArah({ arah, onClick, ...props }: ComponentProps<typeof Link> & { arah: Arah }) {
  return <Link {...props} onClick={(e) => { aturArah(arah); onClick?.(e); }} />;
}
