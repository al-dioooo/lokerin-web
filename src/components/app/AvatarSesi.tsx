"use client";

import Link from "next/link";
import { useEffect } from "react";
import { apiAktif } from "@/lib/api/klien";
import { segarkanSesi, useSesi } from "@/lib/api/sesi";
import { PEKERJA } from "@/lib/data";

function inisial(nama: string) {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]!.toUpperCase())
    .join("");
}

export function AvatarSesi() {
  const { pengguna, siap } = useSesi();
  useEffect(() => {
    if (apiAktif) void segarkanSesi();
  }, []);
  if (!apiAktif) return <Link href="/app/profil" className="avatar" aria-label={`Profil ${PEKERJA.nama}`}>PD</Link>;
  if (siap && !pengguna) return <Link href="/masuk" className="tombol tombol-utama min-h-11 px-4 text-sm">Masuk</Link>;
  const nama = pengguna?.nama ?? "";
  return <Link href="/app/profil" className="avatar" aria-label={`Profil ${nama}`}>{inisial(nama) || "·"}</Link>;
}

export function PitaContoh() {
  if (apiAktif) return null;
  return <span className="piksel hidden rounded-full border border-garis bg-white px-3 py-1 text-[10px] uppercase text-abu sm:inline">Contoh data · belum tersambung ke server</span>;
}
