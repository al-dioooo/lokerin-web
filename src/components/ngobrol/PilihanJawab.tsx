"use client";

/*
 * What tanya_pengguna asked, as big answer buttons right under the question on the stage. A tap
 * answers as if the person had typed it (ADR 0008). Single-choice questions answer on the tap;
 * multiple-choice ones collect taps first and answer with "Kirim jawaban".
 */

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconKeyboard } from "../icons/tabler";
import type { PertanyaanAgen } from "@/lib/api/tipe";

export function PilihanJawab({ tanya, onJawab, onKetik, sibuk }: { tanya: PertanyaanAgen; onJawab: (teks: string) => void; onKetik: () => void; sibuk: boolean }) {
  const [dipilih, setDipilih] = useState<string[]>([]);
  const kotak = useRef<HTMLDivElement>(null);
  // Bring the answers up once the question lands, without moving focus away from the reader.
  useEffect(() => {
    const t = window.setTimeout(() => kotak.current?.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 350);
    return () => window.clearTimeout(t);
  }, []);
  function ketuk(label: string) {
    if (!tanya.boleh_banyak) return onJawab(label);
    setDipilih((d) => (d.includes(label) ? d.filter((x) => x !== label) : [...d, label]));
  }
  return (
    <div ref={kotak} className="pilihan-jawab" role="group" aria-label={tanya.pertanyaan}>
      <ul className={tanya.pilihan.length > 3 ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
        {tanya.pilihan.map((p) => {
          const aktif = dipilih.includes(p.label);
          return (
            <li key={p.label}>
              <button type="button" disabled={sibuk} aria-pressed={tanya.boleh_banyak ? aktif : undefined} onClick={() => ketuk(p.label)} className="pilihan-jawab-tombol">
                <span className="flex items-center gap-2">{tanya.boleh_banyak && <span className="pilihan-jawab-centang" aria-hidden="true">{aktif && <IconCheck size={16} />}</span>}{p.label}</span>
                {p.keterangan && <span className="pilihan-jawab-ket">{p.keterangan}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {tanya.boleh_banyak && (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={!dipilih.length || sibuk} onClick={() => onJawab(dipilih.join(", "))}>
          {dipilih.length ? `Kirim jawaban (${dipilih.length})` : "Pilih dulu"}
        </button>
      )}
      {tanya.boleh_ketik && (
        <button type="button" className="pilihan-jawab-ketik" onClick={onKetik}><IconKeyboard size={18} />Jawab dengan kata-katamu</button>
      )}
    </div>
  );
}
