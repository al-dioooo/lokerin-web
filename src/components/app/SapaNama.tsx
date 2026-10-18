"use client";

import { useSesi } from "@/lib/api/sesi";
import { PEKERJA } from "@/lib/data";

export function SapaNama() {
  const { pengguna } = useSesi();
  return <>{pengguna?.nama ?? PEKERJA.nama}</>;
}
