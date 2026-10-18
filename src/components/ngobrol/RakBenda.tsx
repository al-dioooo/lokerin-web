"use client";

import type { CSSProperties } from "react";
import { BENDA, bendaDariTeks, type BendaId } from "./BendaKerja";

const MULAI_PENCARI: BendaId[] = ["las", "ojek", "dapur", "laundry"];
const MULAI_PEMBERI: { id: BendaId; kalimat: string }[] = [
  { id: "dapur", kalimat: "Butuh tukang masak untuk warung, 90 ribu sehari" },
  { id: "las", kalimat: "Butuh tukang las untuk pagar, borongan" },
  { id: "angkut", kalimat: "Butuh orang bantu angkut barang besok pagi" },
  { id: "laundry", kalimat: "Butuh orang setrika di laundry, bulanan" },
];

/**
 * The tools of the work being talked about. Before anyone speaks they are dim prompts you can tap
 * to start; once a job is mentioned its tool rises out of the town and stays lit.
 */
export function RakBenda({ teks, onMulai, pemberi = false }: { teks: string[]; onMulai?: (kalimat: string) => void; pemberi?: boolean }) {
  const disebut = bendaDariTeks(teks);

  if (!disebut.length) {
    const pilihan = pemberi ? MULAI_PEMBERI : MULAI_PENCARI.map((id) => ({ id, kalimat: BENDA[id].mulai }));
    if (!onMulai) return null;
    return (
      <div className="rak-benda" aria-label="Contoh untuk memulai">
        {pilihan.map(({ id, kalimat }, i) => {
          const { Gambar } = BENDA[id];
          return (
            <button key={id} type="button" className="benda benda-ajak" style={{ "--i": i } as CSSProperties} onClick={() => onMulai(kalimat)} aria-label={`Mulai dengan: ${kalimat}`}>
              <Gambar size={72} />
              <span>&ldquo;{kalimat}&rdquo;</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="rak-benda rak-nyala" aria-label="Pekerjaan yang sudah disebut">
      {disebut.map((id, i) => {
        const { Gambar, label } = BENDA[id];
        return (
          <li key={id} className="benda benda-nyala" style={{ "--i": i } as CSSProperties}>
            <Gambar size={72} />
            <span>{label}</span>
          </li>
        );
      })}
    </ul>
  );
}
