"use client";

/*
 * Cards in Ngobrol open what they point at in a drawer over the conversation instead of leaving
 * it: a job, a CV lamaran, the list of applications, applicants, the profile. The thread stays
 * where it was, and closing the drawer puts you back in the middle of the conversation. Opening
 * something from inside the drawer stacks on top, with Kembali to step back.
 */

import { Suspense, useCallback, useRef, useState, type ReactNode } from "react";
import { IconArrowLeft } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { RincianLowongan, bacaanLowongan } from "../app/RincianLowongan";
import { AksiLamar } from "../pencari/AksiLamar";
import { EditorCv } from "../pencari/EditorCv";
import { LamaranSaya } from "../pencari/LamaranSaya";
import { ProfilPencari } from "../pencari/ProfilLangsung";
import { BerandaPemberi } from "../pemberi/BerandaPemberi";
import { DaftarPelamar } from "../pemberi/DaftarPelamar";
import { keLowongan } from "@/lib/api/adaptor";
import { useApi } from "@/lib/api/hooks";
import type { LowonganApi } from "@/lib/api/tipe";
import { KonteksLaci, useBukaLaci, type IsiLaci } from "../lapis/konteksLaci";

const JUDUL: Record<IsiLaci["jenis"], string> = {
  lowongan: "Lowongan",
  cv: "CV lamaran",
  lamaran: "Lamaranku",
  pelamar: "Pelamar",
  profil: "Profilmu",
  lowongan_saya: "Lowonganmu",
};


function Memuat() {
  return <div className="h-48 animate-pulse rounded-2xl bg-kabut" role="status" aria-label="Memuat" />;
}

function LowonganDiLaci({ id }: { id: string }) {
  const buka = useBukaLaci();
  const r = useApi<LowonganApi>(`/lowongan/${encodeURIComponent(id)}`);
  if (r.galat && !r.data) {
    return <p className="rounded-2xl bg-kabut p-4 text-[15px] text-abu">{r.galat.status === 404 ? "Lowongan ini sudah tidak tayang." : "Lowongan belum bisa dibuka. Coba lagi sebentar lagi."}</p>;
  }
  if (!r.data) return <Memuat />;
  const l = keLowongan(r.data);
  return (
    <article className="grid grid-cols-1 gap-5">
      <RincianLowongan l={l} Judul="h3" />
      {l.cekUpah === "curiga" ? (
        <p className="rounded-2xl bg-merah-muda p-4 text-sm text-merah">Lowongan ini tidak bisa dilamar. Jangan pernah membayar biaya apa pun untuk mendapat pekerjaan.</p>
      ) : (
        <AksiLamar diLaci lowonganId={l.id} judul={l.judul} usaha={l.usaha} magang={r.data.segmen === "magang"} bacaan={bacaanLowongan(l)} onLihatLamaran={() => buka?.({ jenis: "lamaran" })} />
      )}
    </article>
  );
}

function Tampilan({ isi }: { isi: IsiLaci }) {
  switch (isi.jenis) {
    case "lowongan":
      return <LowonganDiLaci id={isi.id} />;
    case "cv":
      return <EditorCv id={isi.id} diLaci />;
    case "lamaran":
      return <LamaranSaya diLaci awalId={isi.id} />;
    case "pelamar":
      return <DaftarPelamar diLaci awalId={isi.id} />;
    case "profil":
      return <ProfilPencari />;
    case "lowongan_saya":
      return <BerandaPemberi diLaci />;
  }
}

export function PenyediaLaci({ children }: { children: ReactNode }) {
  const [tumpuk, setTumpuk] = useState<IsiLaci[]>([]);
  const [terbuka, setTerbuka] = useState(false);
  const terbukaRef = useRef(false);
  const buka = useCallback((isi: IsiLaci) => {
    // A fresh drawer starts a fresh stack; from inside an open one, it stacks on top.
    const lanjut = terbukaRef.current;
    setTumpuk((t) => (lanjut ? [...t, isi] : [isi]));
    terbukaRef.current = true;
    setTerbuka(true);
  }, []);
  const tutup = useCallback(() => {
    terbukaRef.current = false;
    setTerbuka(false);
  }, []);
  const atas = tumpuk.at(-1);
  return (
    <KonteksLaci.Provider value={buka}>
      {children}
      <Laci buka={terbuka} onTutup={tutup} judul={atas ? JUDUL[atas.jenis] : ""}>
        {tumpuk.length > 1 && (
          <button type="button" className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-abu" onClick={() => setTumpuk((t) => t.slice(0, -1))}>
            <IconArrowLeft size={18} />Kembali
          </button>
        )}
        <Suspense fallback={<Memuat />}>{atas && <Tampilan key={`${tumpuk.length}-${atas.jenis}`} isi={atas} />}</Suspense>
      </Laci>
    </KonteksLaci.Provider>
  );
}
