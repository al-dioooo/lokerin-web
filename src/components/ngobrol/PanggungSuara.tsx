"use client";

/*
 * The voice side of Ngobrol, on Alice's night town. Only what matters while talking is on screen:
 * the lentera, one line of live caption and what Lokerin is doing. Results stay in the thread;
 * a pill says how many there are and switches to text to read them.
 */

import { m } from "motion/react";
import { memo, type CSSProperties } from "react";
import { IconKeyboard, IconMicrophone, IconPlayerStop } from "../icons/tabler";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "../kota/KotaIsometrik";
import { PilihanJawab } from "./PilihanJawab";
import type { PertanyaanAgen } from "@/lib/api/tipe";
import { untukDibaca } from "./TeksAgen";
import type { StatusSuara } from "./useSuara";
import { RakBenda } from "./RakBenda";

type Tempat = keyof typeof LOKASI_KERJA;

/** The lentera's move between the stage and the composer: quick, with a slight settle. */
export const PEGAS_LENTERA = { layout: { type: "spring", bounce: 0.18, duration: 0.5 } } as const;

/** The town is a large SVG; it only redraws when the lit places change. */
const KotaMalam = memo(function KotaMalam({ nyalaKunci }: { nyalaKunci: string }) {
  return (
    <div className="ngobrol-kota" aria-hidden="true">
      <div className="ngobrol-kota-isi" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
        <KotaIsometrik className="kota-malam absolute inset-0 h-full w-full" nyala={nyalaKunci ? nyalaKunci.split(",") : []} judul="" />
      </div>
    </div>
  );
});

export function PanggungSuara({
  status,
  detik,
  batas,
  tugas,
  galat,
  kalimat,
  nyala,
  jumlahHasil,
  pertanyaan,
  sapaan,
  onLentera,
  onKetik,
  onLihatHasil,
  onJawab,
  adaLentera,
  teksObrolan,
  pemberi,
  onMulai,
}: {
  status: StatusSuara;
  detik: number;
  batas: number;
  tugas: string;
  galat: string;
  kalimat: { siapa: "kamu" | "ai"; teks: string } | null;
  nyala: Tempat[];
  jumlahHasil: number;
  pertanyaan: PertanyaanAgen | null;
  sapaan: string;
  onLentera: () => void;
  onKetik: () => void;
  onLihatHasil: () => void;
  onJawab: (teks: string) => void;
  /** False while the lentera lives in the composer (text mode); a same-size spacer keeps the layout. */
  adaLentera: boolean;
  /** Everything said so far, for the work tools that light up as jobs are mentioned (RakBenda). */
  teksObrolan: string[];
  pemberi: boolean;
  /** A tapped starter tool: the sentence to begin with. */
  onMulai: (kalimat: string) => void;
}) {
  const jam = (d: number) => `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;
  const keadaan =
    status === "menyambung" ? "Menyambungkan..." : status === "hidup" ? (tugas ? `${tugas}…` : "Lokerin mendengarkan") : "Ketuk lentera untuk bicara";
  return (
    <div className="panggung-suara" data-status={status === "hidup" ? "jalan" : "siap"} data-tanya={pertanyaan ? "" : undefined}>
      <KotaMalam nyalaKunci={nyala.join(",")} />

      <div className="panggung-isi">
        <p className="panggung-waktu piksel" aria-hidden={status !== "hidup"}>{status === "hidup" ? `${jam(detik)} / ${jam(batas)}` : " "}</p>

        {adaLentera ? (
          <m.button
            layoutId="lentera"
            transition={PEGAS_LENTERA}
            type="button"
            onClick={onLentera}
            disabled={status === "menyambung"}
            className="lentera"
            aria-label={status === "hidup" ? "Akhiri panggilan suara" : "Mulai ngobrol dengan suara"}
          >
            <span className="lentera-cincin" aria-hidden="true" />
            <span className="lentera-cincin lentera-cincin-2" aria-hidden="true" />
            <span className="lentera-inti">{status === "hidup" ? <IconPlayerStop size={34} /> : <IconMicrophone size={38} stroke={2} />}</span>
          </m.button>
        ) : (
          <span className="lentera" aria-hidden="true" />
        )}
        <span className="gelombang-malam" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</span>

        <p className="panggung-keadaan" role="status">{keadaan}</p>
        <p className="panggung-kalimat" data-siapa={kalimat?.siapa ?? "ai"}>{kalimat ? untukDibaca(kalimat.teks) : sapaan}</p>

        {pertanyaan ? <PilihanJawab key={pertanyaan.id} tanya={pertanyaan} sibuk={false} onJawab={onJawab} /> : <RakBenda teks={teksObrolan} pemberi={pemberi} onMulai={onMulai} />}
        {galat && <p role="alert" className="mx-auto max-w-sm rounded-2xl bg-white/10 px-4 py-2 text-center text-[15px] text-white">{galat}</p>}
      </div>

      <div className="panggung-kendali">
        <button type="button" className="tombol-malam" onClick={onKetik}><IconKeyboard size={22} />Ketik</button>
        {jumlahHasil > 0 && (
          <button type="button" className="tombol-malam tombol-malam-terang" onClick={onLihatHasil}>Lihat {jumlahHasil} hasil</button>
        )}
      </div>
    </div>
  );
}
