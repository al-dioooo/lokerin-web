"use client";

/*
 * What tanya_pengguna asked: one to three questions, one per screen ("1 dari 3"), answered with
 * big buttons. A single-choice question moves on with the tap; a multiple-choice one collects
 * ticks first. Every question can also be answered in your own words, or skipped. With more than
 * one question, a "Cek jawaban" step lists the answers with Ubah on each before they go out as one
 * message ("Shift: Pagi"), which is also what the agent reads (ADR 0008). One single-choice
 * question still answers on the tap, as before.
 */

import { useEffect, useRef, useState } from "react";
import { IconArrowLeft, IconCheck, IconKeyboard, IconPencil } from "../icons/tabler";
import type { PertanyaanAgen, SoalAgen } from "@/lib/api/tipe";

type Jawaban = { pilihan: string[]; ketik?: string };

const kosong: Jawaban = { pilihan: [] };
const teksJawaban = (j: Jawaban) => (j.ketik ? j.ketik : j.pilihan.join(", "));

export function PilihanJawab({ tanya, onJawab, sibuk, tema = "gelap" }: { tanya: PertanyaanAgen; onJawab: (teks: string) => void; sibuk: boolean; tema?: "gelap" | "terang" }) {
  const daftar = tanya.daftar;
  const banyakSoal = daftar.length > 1;
  const [langkah, setLangkah] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, Jawaban>>({});
  // Changing one answer from Cek jawaban goes straight back there, not on to the next question.
  const [dariCek, setDariCek] = useState(false);
  const kotak = useRef<HTMLDivElement>(null);

  // Bring the answers up once the question lands, without moving focus away from the reader.
  useEffect(() => {
    const t = window.setTimeout(() => kotak.current?.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 350);
    return () => window.clearTimeout(t);
  }, [langkah]);

  function kirimSemua(akhir: Record<string, Jawaban>) {
    onJawab(daftar.map((s) => `${s.judul || s.teks}: ${teksJawaban(akhir[s.id] ?? kosong)}`).join("\n"));
  }

  function selesai(soal: SoalAgen, j: Jawaban) {
    const baru = { ...jawaban, [soal.id]: j };
    setJawaban(baru);
    // One question: answer straight away with just the words, as a person would type them.
    if (!banyakSoal) return onJawab(teksJawaban(j));
    if (dariCek) {
      setDariCek(false);
      return setLangkah(daftar.length);
    }
    setLangkah((l) => l + 1);
  }

  const diCek = banyakSoal && langkah >= daftar.length;
  return (
    <div ref={kotak} className="pilihan-jawab" data-tema={tema}>
      {banyakSoal && (
        <div className="pilihan-jawab-kepala">
          {langkah > 0 ? (
            <button type="button" className="pilihan-jawab-kembali" onClick={() => setLangkah((l) => l - 1)}><IconArrowLeft size={18} />Kembali</button>
          ) : (
            <span />
          )}
          <span className="pilihan-jawab-langkah" aria-live="polite">{diCek ? "Cek jawaban" : `${langkah + 1} dari ${daftar.length}`}</span>
        </div>
      )}
      {diCek ? (
        <CekJawaban daftar={daftar} jawaban={jawaban} sibuk={sibuk} onUbah={(i) => { setDariCek(true); setLangkah(i); }} onKirim={() => kirimSemua(jawaban)} />
      ) : (
        <Soal key={daftar[langkah]!.id} soal={daftar[langkah]!} awal={jawaban[daftar[langkah]!.id]} sibuk={sibuk} onSelesai={(j) => selesai(daftar[langkah]!, j)} />
      )}
      {!diCek && (
        <button type="button" className="pilihan-jawab-lewati" disabled={sibuk} onClick={() => onJawab("Saya lewati pertanyaan ini.")}>
          Lewati
        </button>
      )}
    </div>
  );
}

function Soal({ soal, awal, sibuk, onSelesai }: { soal: SoalAgen; awal?: Jawaban; sibuk: boolean; onSelesai: (j: Jawaban) => void }) {
  const [dipilih, setDipilih] = useState<string[]>(awal?.pilihan ?? []);
  const [ketik, setKetik] = useState(awal?.ketik ?? "");
  const [bukaKetik, setBukaKetik] = useState(Boolean(awal?.ketik));
  const idTeks = `soal-${soal.id}`;

  function ketuk(label: string) {
    if (!soal.boleh_banyak) return onSelesai({ pilihan: [label] });
    setDipilih((d) => (d.includes(label) ? d.filter((x) => x !== label) : [...d, label]));
  }

  return (
    <div className="grid gap-2.5" role="group" aria-labelledby={idTeks}>
      <p id={idTeks} className="pilihan-jawab-soal">{soal.teks}</p>
      {soal.boleh_banyak && <p className="pilihan-jawab-petunjuk">Boleh pilih lebih dari satu.</p>}
      <ul className={soal.pilihan.length > 3 ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
        {soal.pilihan.map((p) => {
          const aktif = dipilih.includes(p.label) || (!soal.boleh_banyak && awal?.pilihan[0] === p.label && !awal.ketik);
          return (
            <li key={p.label}>
              <button type="button" disabled={sibuk} aria-pressed={soal.boleh_banyak || awal ? aktif : undefined} onClick={() => ketuk(p.label)} className="pilihan-jawab-tombol">
                <span className="flex items-center gap-2">{soal.boleh_banyak && <span className="pilihan-jawab-centang" aria-hidden="true">{aktif && <IconCheck size={16} />}</span>}{p.label}</span>
                {p.keterangan && <span className="pilihan-jawab-ket">{p.keterangan}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {soal.boleh_banyak && (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={!dipilih.length || sibuk} onClick={() => onSelesai({ pilihan: dipilih })}>
          {dipilih.length ? `Lanjut (${dipilih.length})` : "Pilih dulu"}
        </button>
      )}
      {soal.boleh_ketik &&
        (bukaKetik ? (
          <form
            className="pilihan-jawab-isian"
            onSubmit={(e) => {
              e.preventDefault();
              if (ketik.trim()) onSelesai({ pilihan: [], ketik: ketik.trim() });
            }}
          >
            <input autoFocus value={ketik} onChange={(e) => setKetik(e.target.value)} maxLength={200} placeholder="Tulis jawabanmu" aria-label={`Jawabanmu untuk: ${soal.teks}`} className="input-mulai min-h-14 flex-1 text-[17px] text-tinta" />
            <button type="submit" className="tombol tombol-utama min-h-14 px-5" disabled={!ketik.trim() || sibuk}>Pakai</button>
          </form>
        ) : (
          <button type="button" className="pilihan-jawab-ketik" onClick={() => setBukaKetik(true)}><IconKeyboard size={18} />Jawab sendiri</button>
        ))}
    </div>
  );
}

function CekJawaban({ daftar, jawaban, sibuk, onUbah, onKirim }: { daftar: SoalAgen[]; jawaban: Record<string, Jawaban>; sibuk: boolean; onUbah: (i: number) => void; onKirim: () => void }) {
  return (
    <div className="grid gap-2.5">
      <ul className="pilihan-jawab-ringkas">
        {daftar.map((s, i) => (
          <li key={s.id}>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold opacity-75">{s.judul || s.teks}</span>
              <span className="block text-[17px] font-bold leading-snug">{teksJawaban(jawaban[s.id] ?? kosong) || "Belum dijawab"}</span>
            </span>
            <button type="button" className="pilihan-jawab-ubah" onClick={() => onUbah(i)} aria-label={`Ubah jawaban ${s.judul || s.teks}`}><IconPencil size={16} />Ubah</button>
          </li>
        ))}
      </ul>
      <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={sibuk || daftar.some((s) => !teksJawaban(jawaban[s.id] ?? kosong))} onClick={onKirim}>
        Kirim jawaban
      </button>
    </div>
  );
}
