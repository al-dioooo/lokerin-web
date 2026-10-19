"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconUserCircle } from "../icons/tabler";
import { apiAktif } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";
import type { Peran } from "@/lib/api/tipe";

const PERAN_LAIN: Record<Peran, { judul: string; pesan: string }> = {
  pencari: { judul: "Halaman ini untuk pencari kerja", pesan: "Kamu masuk sebagai pemberi kerja. Lowongan dan pelamarmu ada di Beranda." },
  pemberi: { judul: "Halaman ini untuk pemberi kerja", pesan: "Kamu masuk sebagai pencari kerja. Lowongan yang cocok untukmu ada di Beranda." },
};

/**
 * Shows a page meant for one role only to that role. The pages are static and the session lives in
 * the browser, so the check happens here: a signed-out visitor is asked to sign in (unless
 * `bolehTamu`), and someone with the other role is pointed back to their own Beranda instead of
 * seeing a screen the server refuses to fill. Without the server, the page shows its own notice.
 */
export function HanyaUntuk({ peran, masuk, bolehTamu = false, children }: { peran: Peran; masuk?: string; bolehTamu?: boolean; children: ReactNode }) {
  const { pengguna, siap } = useSesi();
  if (!apiAktif) return children;
  if (!siap) return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-3xl bg-kabut" role="status" aria-label="Memuat" />;
  if (!pengguna) return bolehTamu ? children : <Arahan judul="Masuk dulu" pesan={masuk ?? "Halaman ini butuh akunmu."} href="/masuk" label="Masuk" />;
  if (pengguna.peran !== peran) return <Arahan {...PERAN_LAIN[peran]} href="/app" label="Ke Beranda" />;
  return children;
}

function Arahan({ judul, pesan, href, label }: { judul: string; pesan: string; href: string; label: string }) {
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-3 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-kabut text-abu"><IconUserCircle size={28} /></span>
      <h1 className="text-xl">{judul}</h1>
      <p className="text-[15px] text-abu">{pesan}</p>
      <Link href={href} className="tombol tombol-utama mt-2 min-h-12 px-6 text-base">{label}</Link>
    </div>
  );
}
