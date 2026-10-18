"use client";

import { useState } from "react";
import { LOWONGAN_TAYANG, PEKERJA, type JenisUpah, type PersonaId } from "@/lib/data";
import { BarisLowongan } from "./KartuLowonganApp";

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
        <div className="inline-flex rounded-full bg-kabut p-1" role="tablist" aria-label="Pilih CV">
          {(Object.keys(PEKERJA.persona) as PersonaId[]).map((p) => <button key={p} type="button" role="tab" aria-selected={persona === p} className="tab-persona" onClick={() => setPersona(p)}>{PEKERJA.persona[p].judul}</button>)}
        </div>
      </div>
      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Jenis upah">
        {JENIS.map((j) => <button key={j.id} type="button" className="chip-peta shrink-0" aria-pressed={jenis === j.id} onClick={() => setJenis(j.id)}>{j.label}</button>)}
      </div>
      {daftar.length ? <ul className="grid gap-2">{daftar.map((l) => <li key={l.id}><BarisLowongan lowongan={l} persona={persona} /></li>)}</ul> : <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada lowongan dengan upah {jenis} di sekitarmu.</p>}
    </section>
  );
}
