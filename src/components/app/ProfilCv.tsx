"use client";

import Link from "next/link";
import { ViewTransition, useState } from "react";
import { getKategori } from "../icons/categories";
import { IconIdBadge2, IconMicrophone, IconPencil, IconPrinter } from "../icons/tabler";
import { PEKERJA, type PersonaId } from "@/lib/data";
import { TabPil } from "./TabPil";

export function ProfilCv() {
  const [persona, setPersona] = useState<PersonaId>("las");
  const [tampilHp, setTampilHp] = useState(false);
  const p = PEKERJA.persona[persona];
  const { Icon } = getKategori(persona === "las" ? "las" : "ojek");
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-4">
        <TabPil className="w-fit print:hidden" label="Pilih CV" nilai={persona} onUbah={setPersona} pilihan={(Object.keys(PEKERJA.persona) as PersonaId[]).map((k) => ({ id: k, label: `CV ${PEKERJA.persona[k].judul}` }))} />
        <ViewTransition key={persona} name="lembar-cv" share="auto" enter="auto" default="none">
        <article className="lembar-cv" role="tabpanel" aria-label={`CV ${p.judul}`}>
          <header className="flex items-start justify-between gap-4 border-b border-garis pb-4">
            <div>
              <p className="piksel text-[11px] uppercase text-jingga-tua">CV {p.judul}</p>
              <h2 className="text-2xl">{PEKERJA.nama}</h2>
              <p className="text-sm text-abu">{PEKERJA.kota} · {PEKERJA.umur} tahun</p>
              <p className="mt-1 text-sm text-abu">{tampilHp ? "0812 •••• 4471 (terlihat setelah kamu setuju)" : "Nomor HP disembunyikan"}</p>
            </div>
            <span className="ubin-ikon size-14"><Icon size={40} /></span>
          </header>
          <p className="mt-4 text-[15px]">{p.ringkas}</p>
          <h3 className="mt-5 text-sm uppercase tracking-wide text-abu">Pengalaman</h3>
          <ul className="mt-2 grid gap-2">
            {p.pengalaman.map((e) => (
              <li key={e.peran + e.tempat} className="flex items-start justify-between gap-3 rounded-xl bg-kertas p-3">
                <span><span className="block font-bold">{e.peran}</span><span className="text-sm text-abu">{e.tempat} · {e.lama}</span></span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${e.sumber === "suara" ? "bg-jingga-muda text-jingga-tua" : "bg-kabut text-abu"}`}>{e.sumber === "suara" ? "Dari obrolan" : "Dari formulir"}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm uppercase tracking-wide text-abu">Keahlian</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">{p.keahlian.map((k) => <li key={k} className="chip-kategori py-1 pl-3 text-[13px]">{k}</li>)}</ul>
          <h3 className="mt-5 text-sm uppercase tracking-wide text-abu">Bisa kerja</h3>
          <p className="mt-1 text-[15px]">{p.waktu}</p>
        </article>
        </ViewTransition>
      </div>
      <aside className="grid gap-3 print:hidden">
        <button type="button" className="tombol tombol-utama" onClick={() => window.print()}><IconPrinter size={18} />Cetak CV ini</button>
        <Link href="/app/kartu" className="tombol tombol-garis"><IconIdBadge2 size={18} />Buat Kartu Kerja</Link>
        <Link href="/app/ngobrol" className="tombol tombol-garis"><IconMicrophone size={18} />Tambah lewat ngobrol</Link>
        <button type="button" className="tombol tombol-halus"><IconPencil size={18} />Ubah lewat formulir</button>
        <div className="rounded-2xl border border-garis bg-white p-4 text-sm">
          <p className="font-bold">Yang terlihat oleh pemberi kerja</p>
          <label className="mt-3 flex items-center justify-between gap-3">
            <span>Tampilkan nomor HP di CV</span>
            <button type="button" role="switch" aria-checked={tampilHp} onClick={() => setTampilHp((v) => !v)} className="sakelar border-0 p-0"><span className="sr-only">Tampilkan nomor HP</span><span className="sakelar-jalur" aria-hidden="true"><span /></span></button>
          </label>
          <p className="mt-2 text-xs text-abu">Tanpa izinmu, pemberi kerja hanya bisa menghubungi lewat tombol WhatsApp setelah kamu menekan &ldquo;Saya bisa&rdquo;.</p>
        </div>
      </aside>
    </div>
  );
}
