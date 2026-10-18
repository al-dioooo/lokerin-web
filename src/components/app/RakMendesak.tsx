"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { Lowongan } from "@/lib/data";
import { useDaftarLangsung } from "@/lib/api/langsung";
import { KartuMendesak } from "./KartuLowonganApp";

/**
 * The Butuh Hari Ini strip on the worker home. A business that posts an urgent job shows up here
 * the moment it is published, and a filled job leaves, without reloading the page.
 */
export function RakMendesak({ awal }: { awal: Lowongan[] }) {
  const { daftar, baru, terakhir } = useDaftarLangsung(awal, {
    masuk: (l) => l.butuh_hari_ini !== null,
    muatUlang: "/lowongan?butuh_hari_ini=true",
  });
  const rak = useRef<HTMLUListElement>(null);

  // A new card lands at the start of the strip, so bring the strip back to the start.
  useEffect(() => {
    if (terakhir) rak.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [terakhir]);

  return (
    <section aria-labelledby="judul-mendesak">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="judul-mendesak" className="text-lg">Butuh hari ini</h2>
          <p className="text-sm text-abu">Usaha di sekitarmu yang butuh orang sebelum malam.</p>
        </div>
        <span className="piksel shrink-0 text-[11px] uppercase text-jingga-tua">{daftar.length} lowongan</span>
      </div>
      {daftar.length ? (
        <ul ref={rak} className="rak-mendesak urut">
          {daftar.map((l, i) => <li key={l.id} style={{ "--i": baru.has(l.id) ? 0 : i } as CSSProperties}><KartuMendesak lowongan={l} baru={baru.has(l.id)} /></li>)}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada yang butuh orang hari ini. Begitu ada, kartunya muncul di sini.</p>
      )}
      <p className="sr-only" aria-live="polite">{terakhir ? `Baru: ${terakhir.judul} di ${terakhir.usaha}, butuh hari ini.` : ""}</p>
    </section>
  );
}
