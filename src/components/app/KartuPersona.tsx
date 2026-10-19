"use client";

import { useState, useSyncExternalStore } from "react";
import { Logo } from "../brand/Logo";
import { IconBrandWhatsapp, IconMapPin, IconMicrophone, IconPrinter } from "../icons/tabler";
import { TabPil } from "./TabPil";
import { TautanNgobrol } from "./TautanNgobrol";
import { useApi } from "@/lib/api/hooks";
import { apiAktif } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";
import type { KartuKerjaApi, ProfilApi } from "@/lib/api/tipe";
import { PEKERJA } from "@/lib/data";

type Kartu = { id: string; judul: string; ringkasan: string; keahlian: readonly string[] };

const CONTOH: Kartu[] = Object.entries(PEKERJA.persona).map(([k, p]) => ({ id: `darto-${k}`, judul: p.judul, ringkasan: p.ringkas, keahlian: p.keahlian }));

/** One Kartu Kerja per Persona (PRD), sized for a WhatsApp status, with a link anyone can open. */
export function KartuPersona() {
  const { pengguna } = useSesi();
  const pencari = apiAktif && pengguna?.peran === "pencari";
  const profil = useApi<ProfilApi>(pencari ? "/profil" : null);
  const milikSendiri = Boolean(profil.data?.persona.length);
  const kartu: Kartu[] = milikSendiri ? profil.data!.persona.map((p) => ({ id: p.id, judul: p.judul, ringkasan: p.ringkasan, keahlian: p.keahlian })) : CONTOH;
  const [pilih, setPilih] = useState<string | null>(null);
  const k = kartu.find((x) => x.id === pilih) ?? kartu[0];
  // The card as anyone with the link sees it, read from the same public endpoint as /kartu/[id].
  const publik = useApi<KartuKerjaApi>(milikSendiri ? `/kartu-kerja/${k.id}` : null);
  const terbit = publik.data?.id === k.id ? publik.data : null;
  const nama = terbit?.nama ?? profil.data?.pencari.nama ?? PEKERJA.nama;
  const kota = terbit?.kota ?? (profil.data ? [profil.data.pencari.kecamatan, profil.data.pencari.kota].filter(Boolean).join(", ") : PEKERJA.kota);
  const isi: Kartu = terbit ? { id: terbit.id, judul: terbit.judul, ringkasan: terbit.ringkasan, keahlian: terbit.keahlian } : k;
  const asal = useSyncExternalStore(() => () => {}, () => window.location.origin, () => "");
  const tautan = terbit?.tautan ?? `${asal}/kartu/${k.id}`;
  const pesan = encodeURIComponent(`Kartu Kerja saya di Lokerin: ${isi.judul}. Lihat di ${tautan}`);

  if (pencari && profil.data && !milikSendiri) {
    return (
      <div className="grid max-w-md gap-4">
        <h1 className="text-[1.75rem] leading-tight" data-ringkas="Kartu Kerja">Kartu Kerja <span className="text-jingga">untuk status WhatsApp.</span></h1>
        <p className="text-[15px] text-abu">Kartu dibuat dari Persona-mu. Ceritakan dulu kerja yang pernah kamu lakukan, nanti kartunya jadi sendiri.</p>
        <TautanNgobrol className="tombol tombol-utama min-h-14 text-lg"><IconMicrophone size={20} />Ceritakan di Ngobrol</TautanNgobrol>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-[1.75rem] leading-tight" data-ringkas="Kartu Kerja">Kartu Kerja <span className="text-jingga">untuk status WhatsApp.</span></h1>
        <p className="mt-1 max-w-md text-sm text-abu">Satu kartu untuk satu Persona. Orang yang membuka tautannya melihat ringkasan kerjamu tanpa nomor HP.</p>
        {kartu.length > 1 && <TabPil className="mt-5 w-fit" label="Pilih Persona" nilai={k.id} onUbah={setPilih} pilihan={kartu.map((x) => ({ id: x.id, label: x.judul }))} />}
        <div className="mt-5 flex flex-wrap gap-2 print:hidden">
          <a href={`https://wa.me/?text=${pesan}`} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama"><IconBrandWhatsapp size={18} />Bagikan ke WhatsApp</a>
          <button type="button" className="tombol tombol-garis" onClick={() => window.print()}><IconPrinter size={18} />Cetak atau simpan PDF</button>
        </div>
        <p className="mt-3 break-all text-xs text-abu">Tautan kartu: {tautan}</p>
      </div>
      <KartuSatu nama={nama} kota={kota} kartu={isi} />
    </div>
  );
}

export function KartuSatu({ nama, kota, kartu: k }: { nama: string; kota: string; kartu: Kartu }) {
  return (
    <article key={k.id} className="kartu-persona masuk-geser" aria-label={`Kartu Kerja ${nama}, ${k.judul}`}>
      <div className="flex items-center justify-between"><Logo size={22} /><span className="piksel text-[10px] uppercase text-abu">Kartu Kerja</span></div>
      <div className="my-auto py-6">
        <p className="piksel text-[11px] uppercase text-jingga-tua">{k.judul}</p>
        <h2 className="mt-1 break-words text-3xl leading-tight">{nama}</h2>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-abu"><IconMapPin size={16} />{kota}</p>
        <p className="mt-4 text-[15px]">{k.ringkasan}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">{k.keahlian.slice(0, 4).map((s) => <li key={s} className="rounded-full bg-kabut px-3 py-1 text-xs font-bold">{s}</li>)}</ul>
      </div>
      <p className="border-t border-garis pt-3 text-center text-xs font-bold">Lihat profil lengkap di Lokerin</p>
    </article>
  );
}
