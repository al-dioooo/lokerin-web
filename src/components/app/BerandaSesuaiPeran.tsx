"use client";

import type { ReactNode } from "react";
import { BerandaPemberi } from "../pemberi/BerandaPemberi";
import { useSesi } from "@/lib/api/sesi";

/** The worker home is rendered on the server; employers get their own home instead. */
export function BerandaSesuaiPeran({ children }: { children: ReactNode }) {
  const { pengguna } = useSesi();
  return pengguna?.peran === "pemberi" ? <BerandaPemberi /> : <>{children}</>;
}
