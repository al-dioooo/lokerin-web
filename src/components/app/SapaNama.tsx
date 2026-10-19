"use client";

import { apiAktif } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";
import { PEKERJA } from "@/lib/data";

/**
 * The name in the Beranda greeting. With the server connected, the session is only known in the
 * browser, so until then a soft placeholder holds the space instead of flashing the sample name.
 */
export function SapaNama() {
  const { pengguna, siap } = useSesi();
  if (!apiAktif) return <>{PEKERJA.nama}</>;
  if (!siap) return <span className="inline-block h-[0.9em] w-[6ch] animate-pulse rounded-md bg-kabut align-[-0.05em]" aria-hidden="true" />;
  return <>{pengguna?.nama ?? "Kamu"}</>;
}
