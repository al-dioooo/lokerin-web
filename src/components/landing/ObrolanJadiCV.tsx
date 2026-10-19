"use client";

import { useState } from "react";
import { LasIcon, OjekIcon } from "../icons/categories";
import { MicIcon } from "../icons/interface";
import { AksiContoh } from "../ui/AksiContoh";

const OBROLAN = [
  { siapa: "lokerin", teks: "Halo, Pak. Biasanya kerja apa?" },
  { siapa: "darto", teks: "Siang ngelas pagar di bengkel, malamnya ngojek.", tanda: ["las", "ojek"] },
  { siapa: "lokerin", teks: "Ngelasnya sudah berapa lama, di mana?" },
  { siapa: "darto", teks: "Lima tahun, di bengkel Sokaraja. Bisa kanopi juga.", tanda: ["las"] },
  { siapa: "lokerin", teks: "Ngojeknya jam berapa saja?" },
  { siapa: "darto", teks: "Jam enam sore sampai sepuluh malam.", tanda: ["ojek"] },
] as const;

const PERSONA = {
  las: { judul: "Tukang Las", Icon: LasIcon, baris: [["Pengalaman", "Las pagar dan kanopi, 5 tahun"], ["Tempat", "Bengkel di Sokaraja"], ["Waktu", "Senin–Sabtu, siang"]] },
  ojek: { judul: "Driver Ojol", Icon: OjekIcon, baris: [["Pengalaman", "Antar penumpang dan makanan"], ["Kendaraan", "Motor sendiri"], ["Waktu", "Setiap hari, 18.00–22.00"]] },
} as const;

export function ObrolanJadiCV() {
  const [persona, setPersona] = useState<keyof typeof PERSONA>("las");
  const aktif = PERSONA[persona];
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_auto_1fr]">
      <div className="kartu-panggilan">
        <div className="flex items-center justify-between gap-3 border-b border-garis pb-3">
          <span className="flex items-center gap-2 text-sm font-bold"><span className="grid size-8 place-items-center rounded-full bg-jingga-muda text-jingga-tua"><MicIcon size={16} /></span>Ngobrol dengan Lokerin</span>
          <span className="gelombang" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
          <span className="font-mono text-xs text-abu tabular-nums">01:42</span>
        </div>
        <ol className="mt-3 grid gap-2" aria-label="Contoh obrolan">
          {OBROLAN.map((o, i) => {
            const relevan = "tanda" in o && (o.tanda as readonly string[]).includes(persona);
            return <li key={i} className={`gelembung ${o.siapa === "darto" ? "gelembung-kamu" : ""}`} data-relevan={relevan || undefined}><span className="sr-only">{o.siapa === "darto" ? "Pak Darto: " : "Lokerin: "}</span>{o.teks}</li>;
          })}
        </ol>
      </div>
      <div className="panah-cv" aria-hidden="true"><span className="piksel">jadi</span></div>
      <div className="kartu-cv">
        <div className="flex items-center justify-between gap-3">
          <div><p className="piksel text-[11px] uppercase text-jingga-tua">CV dari obrolan</p><h3 className="text-xl">Pak Darto</h3><p className="text-sm text-abu">Purwokerto, Banyumas</p></div>
          <span className="grid size-12 place-items-center rounded-2xl bg-kabut"><aktif.Icon size={34} /></span>
        </div>
        <div className="mt-4 inline-flex rounded-full bg-kabut p-1" role="tablist" aria-label="Persona">
          {(Object.keys(PERSONA) as (keyof typeof PERSONA)[]).map((k) => <button key={k} type="button" role="tab" aria-selected={persona === k} className="tab-persona" onClick={() => setPersona(k)}>{PERSONA[k].judul}</button>)}
        </div>
        <dl className="mt-4 grid gap-2 text-sm" role="tabpanel">
          {aktif.baris.map(([label, isi]) => <div key={label} className="baris-cv"><dt className="text-abu">{label}</dt><dd className="font-bold">{isi}</dd></div>)}
        </dl>
        <p className="mt-3 text-xs text-abu">Satu profil, dua CV. Lowongan las dicocokkan ke CV Tukang Las, lowongan antar ke CV Driver Ojol.</p>
        <div className="mt-4 flex flex-wrap gap-2"><AksiContoh aksi="cv" variant="garis" size="kecil">Cetak PDF</AksiContoh><AksiContoh aksi="cv" variant="garis" size="kecil">Bagikan Kartu Kerja</AksiContoh></div>
      </div>
    </div>
  );
}
