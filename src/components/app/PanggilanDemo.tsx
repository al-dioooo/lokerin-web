"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getKategori } from "../icons/categories";
import { IconMicrophone, IconPlayerStop, IconSend, IconSparkles } from "../icons/tabler";
import { cariLowongan, upahTeks } from "@/lib/data";

type Efek = { las?: Partial<Record<"ada" | "pengalaman" | "waktu", string>>; ojek?: Partial<Record<"ada" | "pengalaman" | "waktu", string>>; lowongan?: string[] };
type Langkah = { siapa: "ai" | "kamu"; teks: string; efek?: Efek };

const NASKAH: Langkah[] = [
  { siapa: "ai", teks: "Halo, Pak Darto. Ceritakan saja, biasanya kerja apa?" },
  { siapa: "kamu", teks: "Siang saya ngelas pagar di bengkel, malamnya ngojek.", efek: { las: { ada: "Tukang Las" }, ojek: { ada: "Driver Ojol" } } },
  { siapa: "ai", teks: "Ngelasnya sudah berapa lama, dan di mana?" },
  { siapa: "kamu", teks: "Lima tahun, di bengkel Sokaraja. Bisa kanopi juga.", efek: { las: { pengalaman: "Las pagar dan kanopi, 5 tahun di Sokaraja" } } },
  { siapa: "ai", teks: "Kalau ngojek, biasanya jam berapa?" },
  { siapa: "kamu", teks: "Jam enam sore sampai sepuluh malam.", efek: { ojek: { waktu: "Setiap hari, 18.00–22.00" }, las: { waktu: "Senin–Sabtu, siang" } } },
  { siapa: "ai", teks: "Sudah saya catat jadi dua CV. Ini lowongan las di dekat Bapak.", efek: { lowongan: ["las-pagar-pak-jaya", "las-teralis-borongan"] } },
];

type Cv = { las: Record<string, string>; ojek: Record<string, string>; lowongan: string[] };
const KOSONG: Cv = { las: {}, ojek: {}, lowongan: [] };

function terapkan(cv: Cv, efek?: Efek): Cv {
  if (!efek) return cv;
  return { las: { ...cv.las, ...efek.las }, ojek: { ...cv.ojek, ...efek.ojek }, lowongan: efek.lowongan ?? cv.lowongan };
}

export function PanggilanDemo() {
  const [status, setStatus] = useState<"siap" | "jalan" | "selesai">("siap");
  const [langkah, setLangkah] = useState(0);
  const [tambahan, setTambahan] = useState<{ posisi: number; teks: string }[]>([]);
  const [detik, setDetik] = useState(0);
  const [ketik, setKetik] = useState("");
  const daftar = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (status !== "jalan") return;
    const t = window.setTimeout(() => {
      if (langkah >= NASKAH.length) setStatus("selesai");
      else setLangkah((n) => n + 1);
    }, langkah === 0 ? 400 : 1700);
    return () => window.clearTimeout(t);
  }, [status, langkah]);

  useEffect(() => {
    if (status !== "jalan") return;
    const t = window.setInterval(() => setDetik((d) => d + 1), 1000);
    return () => window.clearInterval(t);
  }, [status]);

  useEffect(() => {
    daftar.current?.lastElementChild?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [langkah, tambahan]);

  const tampil = NASKAH.slice(0, langkah);
  const cv = tampil.reduce((acc, l) => terapkan(acc, l.efek), KOSONG);
  const jam = `${String(Math.floor(detik / 60)).padStart(2, "0")}:${String(detik % 60).padStart(2, "0")}`;

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (!ketik.trim()) return;
    setTambahan((t) => [...t, { posisi: langkah, teks: ketik.trim() }]);
    setKetik("");
    if (status === "siap") setStatus("jalan");
  }

  const pesan: { siapa: "ai" | "kamu"; teks: string; kunci: string }[] = [];
  tampil.forEach((l, i) => {
    pesan.push({ ...l, kunci: `n${i}` });
    tambahan.filter((t) => t.posisi === i + 1).forEach((t, j) => pesan.push({ siapa: "kamu", teks: t.teks, kunci: `t${i}-${j}` }));
  });

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.1fr_1fr]">
      <section className="kartu-panggilan grid gap-4" aria-label="Panggilan suara">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold">Ngobrol dengan Lokerin</span>
          <span className="font-mono text-xs text-abu tabular-nums" aria-label={`Durasi ${jam}, batas 3 menit`}>{jam} / 03:00</span>
        </div>
        <div className="grid place-items-center gap-3 py-2">
          <button type="button" onClick={() => setStatus(status === "jalan" ? "selesai" : "jalan")} disabled={status === "selesai"} className="bola-mic" data-aktif={status === "jalan" || undefined} aria-label={status === "jalan" ? "Akhiri panggilan" : "Mulai ngobrol"}>
            {status === "jalan" ? <IconPlayerStop size={30} /> : <IconMicrophone size={32} />}
          </button>
          <span className="gelombang" aria-hidden="true" data-diam={status !== "jalan" || undefined}>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
          <p className="text-center text-xs text-abu">{status === "siap" ? "Ketuk mikrofon untuk mulai. Ini demo: mikrofon belum dipakai, obrolan diputar otomatis." : status === "jalan" ? "Lokerin sedang mendengarkan…" : "Obrolan selesai. CV-mu tersimpan."}</p>
        </div>
        <ol ref={daftar} className="obrolan" aria-live="polite" aria-label="Isi obrolan">
          {pesan.length === 0 && <li className="text-center text-xs text-abu">Obrolan akan muncul di sini, lengkap dengan teksnya.</li>}
          {pesan.map((p) => <li key={p.kunci} className={`gelembung ${p.siapa === "kamu" ? "gelembung-kamu" : ""}`}><span className="sr-only">{p.siapa === "kamu" ? "Kamu: " : "Lokerin: "}</span>{p.teks}</li>)}
        </ol>
        <form onSubmit={kirim} className="flex gap-2">
          <label htmlFor="ketik-jawaban" className="sr-only">Ketik jawabanmu</label>
          <input id="ketik-jawaban" value={ketik} onChange={(e) => setKetik(e.target.value)} placeholder="Tidak bisa bicara? Ketik di sini" className="input-ketik" />
          <button type="submit" className="tombol tombol-garis px-3" aria-label="Kirim"><IconSend size={18} /></button>
        </form>
      </section>

      <section className="kartu-cv grid gap-4" aria-label="CV yang tersusun" aria-live="polite">
        <div>
          <p className="piksel text-[11px] uppercase text-jingga-tua">Tersusun dari obrolan</p>
          <h2 className="text-xl">CV Pak Darto</h2>
        </div>
        {(["las", "ojek"] as const).map((p) => {
          const data = cv[p];
          const { Icon } = getKategori(p === "las" ? "las" : "ojek");
          return (
            <div key={p} className="persona-isi" data-kosong={!data.ada || undefined}>
              <div className="flex items-center gap-2"><span className="ubin-ikon size-9"><Icon size={24} /></span><span className="font-bold">{data.ada ?? (p === "las" ? "Persona 1" : "Persona 2")}</span></div>
              <dl className="mt-2 grid gap-1 text-sm">
                <div className="baris-cv"><dt className="text-abu">Pengalaman</dt><dd className="isi-baru" key={data.pengalaman}>{data.pengalaman ?? "…"}</dd></div>
                <div className="baris-cv"><dt className="text-abu">Waktu</dt><dd className="isi-baru" key={data.waktu}>{data.waktu ?? "…"}</dd></div>
              </dl>
            </div>
          );
        })}
        {cv.lowongan.length > 0 && (
          <div className="isi-baru">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-bold"><IconSparkles size={16} className="text-jingga" />Lowongan yang cocok</p>
            <ul className="grid gap-2">
              {cv.lowongan.map((id) => { const l = cariLowongan(id); return l && <li key={id}><Link href={`/app/lowongan/${id}`} className="flex items-center justify-between gap-2 rounded-xl border border-garis bg-white p-3 text-sm"><span><span className="block font-bold">{l.judul}</span><span className="text-xs text-abu">{l.usaha}</span></span><span className="font-bold tabular-nums">{upahTeks(l)}</span></Link></li>; })}
            </ul>
          </div>
        )}
        {status === "selesai" && <Link href="/app/profil" className="tombol tombol-utama">Lihat CV lengkap</Link>}
      </section>
    </div>
  );
}
