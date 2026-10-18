"use client";

import type { CSSProperties } from "react";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { PetaKota } from "./PetaKota";
import { jarakKm } from "@/lib/api/adaptor";
import { useDaftarLangsung } from "@/lib/api/langsung";
import type { Titik } from "@/lib/api/sumber";
import type { Lowongan } from "@/lib/data";

/** Peta Kerja Sekitar from the server. A job published nearby drops a new pin without a reload. */
export function PetaLangsung({ awal, pusat, radiusKm }: { awal: Lowongan[]; pusat: Titik; radiusKm: number }) {
  const { daftar, baru } = useDaftarLangsung(awal, {
    masuk: (l) => l.lokasi.lat != null && jarakKm(l.lokasi.lat, l.lokasi.lng, pusat) <= radiusKm,
    muatUlang: `/lowongan/peta?lat=${pusat.lat}&lng=${pusat.lng}&radius_km=${radiusKm}`,
  });
  const dekat = daftar.toSorted((a, b) => Number(baru.has(b.id)) - Number(baru.has(a.id)) || a.jarakKm - b.jarakKm).slice(0, 6);
  return (
    <>
      <PetaKota lowongan={daftar} pusat={pusat} baru={baru} />
      <section aria-labelledby="judul-terdekat">
        <h2 id="judul-terdekat" className="mb-3 text-lg">Paling dekat denganmu</h2>
        {dekat.length ? (
          <ul className="urut grid gap-2">{dekat.map((l, i) => <li key={l.id} style={{ "--i": i } as CSSProperties}><BarisLowongan lowongan={l} baru={baru.has(l.id)} /></li>)}</ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada lowongan dalam {radiusKm} km.</p>
        )}
      </section>
    </>
  );
}
