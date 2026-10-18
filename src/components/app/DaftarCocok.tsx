"use client";

import { m } from "motion/react";
import { useState, type CSSProperties } from "react";
import { LOWONGAN_TAYANG, PEKERJA, type JenisUpah, type PersonaId } from "@/lib/data";
import { BarisLowongan } from "./KartuLowonganApp";
import { TabPil } from "./TabPil";

const JENIS: { id: JenisUpah | "semua"; label: string }[] = [
  { id: "semua", label: "Semua upah" },
  { id: "harian", label: "Harian" },
  { id: "mingguan", label: "Mingguan" },
  { id: "bulanan", label: "Bulanan" },
  { id: "borongan", label: "Borongan" },
];

export function DaftarCocok() {
  const [persona, setPersona] = useState<PersonaId>("las");
  const [jenis, setJenis] = useState<JenisUpah | "semua">("semua");
  const daftar = LOWONGAN_TAYANG
    .filter((l) => jenis === "semua" || l.jenisUpah === jenis)
    .toSorted((a, b) => (b.cocok?.[persona] ?? 0) - (a.cocok?.[persona] ?? 0));
  return (
    <section aria-labelledby="judul-cocok">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="judul-cocok" className="text-lg">Cocok untuk CV {PEKERJA.persona[persona].judul}</h2>
          <p className="text-sm text-abu">Diurutkan dari yang paling cocok dengan pengalamanmu.</p>
        </div>
        <TabPil label="Pilih CV" nilai={persona} onUbah={setPersona} pilihan={(Object.keys(PEKERJA.persona) as PersonaId[]).map((p) => ({ id: p, label: PEKERJA.persona[p].judul }))} />
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Jenis upah">
        {JENIS.map((j) => <button key={j.id} type="button" className="chip-peta shrink-0" aria-pressed={jenis === j.id} onClick={() => setJenis(j.id)}>{j.label}</button>)}
      </div>
      {daftar.length ? <m.ul key={`${persona}-${jenis}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="urut grid gap-2">{daftar.map((l, i) => <li key={l.id} style={{ "--i": i } as CSSProperties}><BarisLowongan lowongan={l} persona={persona} /></li>)}</m.ul> : <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada lowongan dengan upah {jenis} di sekitarmu.</p>}
    </section>
  );
}
