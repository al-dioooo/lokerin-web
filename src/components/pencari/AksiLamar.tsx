"use client";

/*
 * Applying is a Laci with one decision per step: which CV (Persona), whether to add a
 * CV Khusus, then a single "Kirim Lamaran" button. Sending is the person's own tap (ADR 0004).
 */

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconCircleCheck, IconFileCv, IconInfoCircle } from "../icons/tabler";
import { LaporkanLowongan } from "../app/LaporkanLowongan";
import { Laci } from "../lapis/Laci";
import { TawaranKabar } from "../app/TawaranKabar";
import { Bacakan } from "../ui/Bacakan";
import { api, GalatApi } from "@/lib/api/klien";
import { IntipCv } from "../cv/PratinjauCv";
import { useApi } from "@/lib/api/hooks";
import { useSesi } from "@/lib/api/sesi";
import type { LamaranApi, PersonaApi, ProfilApi } from "@/lib/api/tipe";

type Langkah = "persona" | "cv" | "kirim" | "selesai";
type CvSiap = { id: string; isi: { judul: string } };

/**
 * `diLaci`: inside a drawer (from Ngobrol) the Lamar button is a plain full-width button instead of
 * the page's floating bar, and "Lihat lamaranku" calls `onLihatLamaran` instead of leaving the screen.
 */
export function AksiLamar({ lowonganId, judul, usaha, magang, bacaan, diLaci = false, onLihatLamaran }: { lowonganId: string; judul: string; usaha: string; magang: boolean; bacaan: string; diLaci?: boolean; onLihatLamaran?: () => void }) {
  const { pengguna, siap } = useSesi();
  const [buka, setBuka] = useState(false);
  const [langkah, setLangkah] = useState<Langkah>("persona");
  const [persona, setPersona] = useState<PersonaApi | null>(null);
  const [cv, setCv] = useState<CvSiap | null>(null);
  const [pesan, setPesan] = useState("");
  const [proses, setProses] = useState<"" | "cv" | "kirim">("");
  const [galat, setGalat] = useState("");
  const [terkirim, setTerkirim] = useState<LamaranApi | null>(null);
  const profil = useApi<ProfilApi>(buka && pengguna?.peran === "pencari" ? "/profil" : null);

  if (siap && pengguna?.peran === "pemberi") return null;

  function mulai() {
    setLangkah("persona");
    setGalat("");
    setBuka(true);
  }

  async function siapkanCv() {
    if (!persona) return;
    setProses("cv");
    setGalat("");
    try {
      setCv(await api<CvSiap>("/cv", { method: "POST", body: { lowongan_id: lowonganId, persona_id: persona.id } }));
      setLangkah("kirim");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "CV lamaran belum jadi. Coba lagi atau kirim tanpa CV.");
    } finally {
      setProses("");
    }
  }

  async function kirim() {
    if (!persona) return;
    setProses("kirim");
    setGalat("");
    try {
      const hasil = await api<LamaranApi>("/lamaran", {
        method: "POST",
        body: { lowongan_id: lowonganId, persona_id: persona.id, cv_khusus_id: cv?.id ?? null, pesan: pesan.trim() || null },
      });
      setTerkirim(hasil);
      setLangkah("selesai");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Lamaran belum terkirim. Coba lagi.");
    } finally {
      setProses("");
    }
  }

  const personas = profil.data?.persona ?? [];
  const aksi =
    langkah === "kirim" ? (
      <button type="button" className="tombol tombol-utama" disabled={proses !== ""} onClick={() => void kirim()}>{proses === "kirim" ? "Mengirim..." : "Kirim Lamaran"}</button>
    ) : langkah === "cv" ? (
      <>
        <button type="button" className="tombol tombol-utama" disabled={proses !== ""} onClick={() => void siapkanCv()}><IconFileCv size={20} />{proses === "cv" ? "Menyusun CV lamaran..." : "Susun CV lamaran"}</button>
        <button type="button" className="tombol tombol-garis" disabled={proses !== ""} onClick={() => setLangkah("kirim")}>Kirim tanpa CV</button>
      </>
    ) : langkah === "selesai" ? (
      onLihatLamaran ? (
        <button type="button" className="tombol tombol-utama" onClick={() => { setBuka(false); onLihatLamaran(); }}>Lihat lamaranku</button>
      ) : (
        <Link href="/app/lamaran" className="tombol tombol-utama">Lihat lamaranku</Link>
      )
    ) : undefined;

  return (
    <>
      <div className={diLaci ? "aksi-laci" : "aksi-lengket"}>
        <Bacakan teks={bacaan} label={`Bacakan lowongan ${judul}`} ringkas className="border border-garis bg-white" />
        {terkirim ? (
          onLihatLamaran ? (
            <button type="button" className="tombol tombol-utama flex-1" onClick={onLihatLamaran}><IconCircleCheck size={18} />Lamaran terkirim</button>
          ) : (
            <Link href="/app/lamaran" className="tombol tombol-utama flex-1"><IconCircleCheck size={18} />Lamaran terkirim</Link>
          )
        ) : siap && !pengguna ? (
          <Link href="/masuk" className="tombol tombol-utama flex-1">Masuk untuk melamar</Link>
        ) : (
          <button type="button" className="tombol tombol-utama flex-1 min-h-14 text-lg" onClick={mulai} aria-haspopup="dialog">Lamar</button>
        )}
      </div>
      <LaporkanLowongan lowonganId={lowonganId} judul={judul} />

      <Laci
        buka={buka}
        onTutup={() => setBuka(false)}
        label={`Lamar · ${usaha}`}
        judul={langkah === "persona" ? "Lamar sebagai apa?" : langkah === "cv" ? "Lampirkan CV lamaran?" : langkah === "kirim" ? `Kirim lamaran ke ${usaha}?` : "Lamaranmu sudah terkirim"}
        aksi={aksi}
      >
        {langkah === "persona" && (
          <div className="grid gap-2.5">
            {profil.memuat && <p className="py-4 text-center text-abu">Memuat kerja yang kamu bisa...</p>}
            {!profil.memuat && !personas.length && <p className="rounded-2xl bg-kabut p-4 text-[15px]">Lokerin belum tahu kamu bisa kerja apa. Ceritakan pengalamanmu di Ngobrol, atau isi profil dulu.</p>}
            {personas.map((p) => (
              <button key={p.id} type="button" className="alur-pilihan" aria-pressed={persona?.id === p.id} onClick={() => { setPersona(p); window.setTimeout(() => setLangkah("cv"), 200); }}>
                <span className="min-w-0"><span className="block">{p.judul}</span><span className="line-clamp-2 text-sm font-semibold text-abu">{p.ringkasan}</span></span>
                {persona?.id === p.id && <IconCheck size={22} />}
              </button>
            ))}
          </div>
        )}

        {langkah === "cv" && (
          <div className="grid gap-3 text-[17px]">
            <p>Lokerin menyusun CV khusus untuk lowongan ini, hanya dari bahan CV yang sudah kamu simpan. Tidak ada yang dikarang, dan kamu bisa mengubahnya sebelum mengirim.</p>
            {magang && <p className="flex items-start gap-2 rounded-2xl bg-[#FFF6DB] p-3 text-[15px] text-[#8A5A00]"><IconInfoCircle size={20} className="mt-0.5 shrink-0" />Lowongan magang biasanya membaca CV. Lamaranmu lebih kuat dengan CV lamaran.</p>}
            {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
          </div>
        )}

        {langkah === "kirim" && persona && (
          <div className="grid gap-4">
            <dl className="grid gap-2 rounded-2xl bg-kertas p-4 text-[17px]">
              <div className="flex justify-between gap-3"><dt className="text-abu">Lowongan</dt><dd className="text-right font-bold">{judul}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-abu">Sebagai</dt><dd className="text-right font-bold">{persona.judul}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-abu">CV lamaran</dt><dd className="text-right font-bold">{cv ? "Terlampir" : "Tidak"}</dd></div>
            </dl>
            {cv && (
              <Link href={`/app/cv/${cv.id}`} className="grid gap-2" aria-label="Lihat dan ubah CV lamaran">
                <IntipCv id={cv.id} />
                <span className="tombol tombol-garis min-h-12"><IconFileCv size={18} />Lihat dan ubah CV</span>
              </Link>
            )}
            <label className="grid gap-1.5 text-[15px] font-semibold text-abu">
              Pesan singkat untuk {usaha} (boleh dikosongkan)
              <textarea rows={2} value={pesan} onChange={(e) => setPesan(e.target.value)} className="input-mulai min-h-20 py-3 text-[17px] font-normal text-tinta" placeholder="Misalnya: Saya bisa mulai besok pagi." />
            </label>
            <p className="text-[15px] text-abu">Nomor HP-mu baru terlihat oleh {usaha} kalau lamaranmu lolos.</p>
            {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
          </div>
        )}

        {langkah === "selesai" && (
          <p className="flex items-start gap-2 rounded-2xl bg-daun-muda p-4 text-[17px] text-daun">
            <IconCircleCheck size={22} className="mt-0.5 shrink-0" />
            {usaha} akan melihat lamaranmu sebagai {persona?.judul}{cv ? ", lengkap dengan CV lamaran" : ""}. Kamu dapat kabar di sini begitu lamaranmu dilihat atau lolos.
          </p>
        )}
      </Laci>
      <TawaranKabar picu={langkah === "selesai"} alasan="Kami kabari begitu usaha membuka atau membalas lamaranmu, walau Lokerin sedang tertutup." />
    </>
  );
}
