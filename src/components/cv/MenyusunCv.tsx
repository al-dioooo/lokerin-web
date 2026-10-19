"use client";

/*
 * The wait while a CV lamaran is written (about 20 seconds). A small sheet fills in line by line
 * and the steps say what is happening, so the wait reads as work being done for you rather than a
 * frozen button. The steps follow the clock, not the server: the last one stays until the CV is
 * really there, and nothing claims to be finished early.
 */

import { useEffect, useState, type CSSProperties } from "react";
import { IconCheck } from "../icons/tabler";
import "./menyusun.css";

const LANGKAH = {
  susun: [
    { mulai: 0, teks: "Membaca lowongan ini" },
    { mulai: 3, teks: "Memilih bahan CV yang cocok" },
    { mulai: 8, teks: "Menulis poin pengalamanmu" },
    { mulai: 14, teks: "Merapikan tata letak untuk perekrut" },
  ],
  ubah: [
    { mulai: 0, teks: "Membaca permintaanmu" },
    { mulai: 3, teks: "Mengubah bagian yang diminta" },
    { mulai: 9, teks: "Merapikan tata letak" },
  ],
} as const;

/** Lines of the sheet: the name, a title, then sections with their lines. */
const BARIS = ["nama", "judul", "bagian", "", "", "pendek", "bagian", "", "", "", "pendek", "bagian", "", "pendek"];

export function MenyusunCv({ jenis = "susun", bahan, ringkas = false }: { jenis?: "susun" | "ubah"; bahan?: number; ringkas?: boolean }) {
  const [detik, setDetik] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setDetik((d) => d + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  const langkah = LANGKAH[jenis];
  const aktif = langkah.reduce((i, l, n) => (detik >= l.mulai ? n : i), 0);
  // The sheet writes itself again every few seconds while the wait goes on.
  const siklus = Math.floor(detik / 6);
  const teksAktif = langkah[aktif]!.teks + (aktif === 1 && jenis === "susun" && bahan ? ` dari ${bahan} bahan CV-mu` : "");

  const kertas = (
    <div className="menyusun-kertas" aria-hidden="true">
      {BARIS.map((b, i) => (
        <i key={`${siklus}-${i}`} className={b || undefined} style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );

  if (ringkas) {
    return (
      <div className="menyusun-ringkas" role="status" aria-live="polite">
        {kertas}
        <div className="min-w-0">
          <p className="font-bold leading-snug">{jenis === "ubah" ? "Mengubah CV lamaran" : "Menyusun CV lamaran"}</p>
          <p className="menyusun-langkah-kini">{teksAktif}…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menyusun-cv">
      {kertas}
      <ol className="menyusun-langkah" role="status" aria-live="polite">
        {langkah.map((l, i) => (
          <li key={l.teks} data-keadaan={i < aktif ? "selesai" : i === aktif ? "aktif" : "nanti"}>
            <span className="menyusun-tanda" aria-hidden="true">{i < aktif && <IconCheck size={14} stroke={3} />}</span>
            <span>{i === aktif ? teksAktif : l.teks}</span>
          </li>
        ))}
      </ol>
      <p className="menyusun-catatan">
        {detik < 25 ? "Biasanya sekitar 20 detik. Hanya dari bahan CV yang kamu simpan." : "Sedikit lebih lama dari biasanya. Tunggu sebentar lagi, ya."}
      </p>
    </div>
  );
}
