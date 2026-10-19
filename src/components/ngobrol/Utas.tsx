"use client";

/*
 * The text side of Ngobrol (ADR 0009): a light, readable thread. Replies are short paragraphs; what
 * the agent prepared shows as a card right where it happened, not in a separate panel. While a tool
 * runs, a quiet label says what Lokerin is doing. The newest question shows as answer buttons.
 */

import { m } from "motion/react";
import { memo, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { IconArrowDown, IconMicrophone, IconSend } from "../icons/tabler";
import { JUDUL_WIDGET, WidgetAgen } from "./WidgetAgen";
import { PilihanJawab } from "./PilihanJawab";
import { Bacakan, TeksAgen } from "./TeksAgen";
import { PEGAS_LENTERA } from "./PanggungSuara";
import { LABEL_ALAT, type Pesan } from "@/lib/api/obrolan";
import type { PertanyaanAgen } from "@/lib/api/tipe";
import { MenyusunCv } from "../cv/MenyusunCv";

export function OrbKecil() {
  return <span className="orb-kecil" aria-hidden="true" />;
}

/** Index of the last card per thing (a CV revised three times in one reply shows once, as it is now). */
function kartuTerakhir(p: Pesan) {
  const terakhir = new Map<string, number>();
  p.bagian.forEach((b, i) => {
    const id = b.jenis === "alat" ? b.hasil?.id : undefined;
    if (b.jenis === "alat" && b.hasil?.widget && typeof id === "string") terakhir.set(`${b.hasil.widget}:${id}`, i);
  });
  return terakhir;
}

function PesanAi({ p, awalRangkaian, sedangMengalir }: { p: Pesan; awalRangkaian: boolean; sedangMengalir: boolean }) {
  const teks = p.bagian.flatMap((b) => (b.jenis === "teks" ? [b.teks] : [])).join("\n\n");
  const terakhir = kartuTerakhir(p);
  return (
    <div className="pesan-ai">
      {awalRangkaian && <p className="pesan-ai-nama"><OrbKecil />Lokerin</p>}
      {p.bagian.map((b, i) => {
        if (b.jenis === "teks") return <TeksAgen key={i} teks={b.teks} />;
        if (b.status === "jalan" && (b.nama === "siapkan_cv_khusus" || b.nama === "ubah_cv_khusus")) return <MenyusunCv key={b.id} ringkas jenis={b.nama === "ubah_cv_khusus" ? "ubah" : "susun"} />;
        if (b.status === "jalan") return <p key={b.id} className="alat-jalan" role="status">{LABEL_ALAT[b.nama] ?? "Lokerin sedang bekerja"}…</p>;
        if (b.status === "galat") return <p key={b.id} className="text-[15px] text-merah">Ada yang belum berhasil. Coba ulangi.</p>;
        if (!b.hasil?.widget || b.hasil.widget === "pertanyaan") return null;
        if (typeof b.hasil.id === "string" && terakhir.get(`${b.hasil.widget}:${b.hasil.id}`) !== i) return null;
        return (
          <section key={b.id} className="kartu-alat" aria-label={JUDUL_WIDGET[b.hasil.widget] ?? "Hasil"}>
            <h3>{JUDUL_WIDGET[b.hasil.widget] ?? "Hasil"}</h3>
            <WidgetAgen hasil={b.hasil} />
          </section>
        );
      })}
      {teks && !sedangMengalir && <Bacakan id={p.id} teks={teks} />}
    </div>
  );
}

/** Memoized: switching between voice and text must not redraw every card in the thread. */
export const Utas = memo(function Utas({
  pesan,
  sibuk,
  pertanyaan,
  saran,
  onKirim,
}: {
  pesan: Pesan[];
  sibuk: boolean;
  pertanyaan: PertanyaanAgen | null;
  saran: string[];
  onKirim: (teks: string) => void;
}) {
  const gulir = useRef<HTMLDivElement>(null);
  const diBawah = useRef(true);
  const [tampilKeBawah, setTampilKeBawah] = useState(false);

  // Follow new text only while the reader is already at the bottom; never yank them back up.
  const isiTerakhir = JSON.stringify(pesan.at(-1)?.bagian.length) + (pesan.at(-1)?.bagian.at(-1)?.jenis === "teks" ? (pesan.at(-1)?.bagian.at(-1) as { teks: string }).teks.length : 0) + String(pertanyaan?.id);
  const peranTerakhir = pesan.at(-1)?.peran;
  useEffect(() => {
    const el = gulir.current;
    // Sending (typing or tapping an answer) always brings the reader down to follow the reply.
    if (peranTerakhir === "kamu") diBawah.current = true;
    if (el && diBawah.current) el.scrollTo({ top: el.scrollHeight });
  }, [pesan.length, isiTerakhir, peranTerakhir]);

  function saatGulir() {
    const el = gulir.current;
    if (!el) return;
    const dekat = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    diBawah.current = dekat;
    setTampilKeBawah(!dekat);
  }

  const terakhir = pesan.at(-1);
  return (
    <div ref={gulir} onScroll={saatGulir} className="utas">
      <div className="utas-isi" role="log" aria-live="polite" aria-label="Isi obrolan">
        {!pesan.length && (
          <div className="utas-kosong">
            <span className="orb-sambut" aria-hidden="true" />
            <p className="text-[1.6rem] font-extrabold leading-tight">Mau dibantu apa?</p>
            <p className="text-[17px] text-abu">Ketik dengan kata-katamu sendiri, atau ketuk salah satu.</p>
            <ul className="mt-2 grid w-full gap-2">
              {saran.map((s) => (
                <li key={s}><button type="button" className="saran" onClick={() => onKirim(s)}>{s}</button></li>
              ))}
            </ul>
          </div>
        )}
        {pesan.map((p, i) =>
          p.peran === "kamu" ? (
            <div key={p.id} className="pesan-kamu-baris">
              <p className="pesan-kamu">{p.bagian.map((b) => (b.jenis === "teks" ? b.teks : "")).join("")}</p>
            </div>
          ) : (
            <PesanAi key={p.id} p={p} awalRangkaian={pesan[i - 1]?.peran !== "ai"} sedangMengalir={sibuk && i === pesan.length - 1} />
          ),
        )}
        {sibuk && terakhir?.peran === "kamu" && (
          <p className="pesan-ai-nama mengetik" role="status"><OrbKecil />Lokerin sedang berpikir…</p>
        )}
        {pertanyaan && !sibuk && (
          <div className="mt-1">
            <PilihanJawab key={pertanyaan.id} tanya={pertanyaan} sibuk={sibuk} onJawab={onKirim} tema="terang" />
          </div>
        )}
      </div>
      {tampilKeBawah && (
        <button type="button" className="tombol-ke-bawah" aria-label="Ke pesan terbaru" onClick={() => gulir.current?.scrollTo({ top: gulir.current.scrollHeight, behavior: "smooth" })}>
          <IconArrowDown size={20} />
        </button>
      )}
    </div>
  );
});

export function Penyusun({
  onKirim,
  onSuara,
  sibuk,
  fokus,
  adaLentera,
}: {
  onKirim: (teks: string) => void;
  onSuara: () => void;
  sibuk: boolean;
  fokus: number;
  /** The lentera sits here only in text mode; on the voice stage it is the big one. */
  adaLentera: boolean;
}) {
  const [teks, setTeks] = useState("");
  const kotak = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (fokus) kotak.current?.focus();
  }, [fokus]);

  function kirim(e?: FormEvent) {
    e?.preventDefault();
    const isi = teks.trim();
    if (!isi || sibuk) return;
    setTeks("");
    onKirim(isi);
  }
  function tombol(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) kirim(e);
  }
  return (
    <form className="penyusun" onSubmit={kirim}>
      <textarea
        ref={kotak}
        rows={1}
        value={teks}
        onChange={(e) => setTeks(e.target.value)}
        onKeyDown={tombol}
        enterKeyHint="send"
        placeholder="Tulis pesan…"
        aria-label="Tulis pesan untuk Lokerin"
        className="penyusun-kotak"
        maxLength={2000}
      />
      {teks.trim() ? (
        <button type="submit" className="penyusun-kirim" aria-label="Kirim" disabled={sibuk}><IconSend size={22} /></button>
      ) : adaLentera ? (
        <m.button layoutId="lentera" transition={PEGAS_LENTERA} type="button" className="penyusun-suara" aria-label="Ngobrol pakai suara" onClick={onSuara}>
          <IconMicrophone size={22} stroke={2} />
        </m.button>
      ) : (
        <span className="penyusun-suara opacity-0" aria-hidden="true" />
      )}
    </form>
  );
}
