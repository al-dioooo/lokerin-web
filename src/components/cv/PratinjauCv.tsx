"use client";

/*
 * Showing someone else's (or your own) CV Khusus without leaving the screen: a peek of the paper's
 * top, then the whole page in a drawer with Unduh PDF. Employers read the CV here first; the PDF is
 * for keeping, printing or forwarding. Contact stays hidden until the Lamaran is Lolos (server side).
 */

import { useState, useSyncExternalStore } from "react";
import { IconDownload, IconFileCv, IconShare } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { KertasCv, SkalaKertas } from "./KertasCv";
import { GalatApi } from "@/lib/api/klien";
import { useApi } from "@/lib/api/hooks";
import type { CvApi } from "@/lib/api/tipe";
import { bagikanCv, bisaBagikanBerkas, unduhCv } from "@/lib/cv";

export function TombolUnduhCv({ id, utama = true }: { id: string; utama?: boolean }) {
  const [proses, setProses] = useState<"" | "unduh" | "bagikan">("");
  const [pesan, setPesan] = useState("");
  const bisaBagikan = useSyncExternalStore(() => () => {}, bisaBagikanBerkas, () => false);
  async function ambil(cara: "unduh" | "bagikan") {
    setProses(cara);
    setPesan("");
    try {
      if (cara === "unduh") setPesan(`Tersimpan sebagai “${await unduhCv(id)}”.`);
      else await bagikanCv(id);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setPesan(e instanceof GalatApi ? e.message : "PDF belum bisa dibuat. Coba lagi.");
    } finally {
      setProses("");
    }
  }
  return (
    <div className="grid gap-1.5">
      <div className={`grid gap-2 ${bisaBagikan ? "grid-cols-[1fr_auto]" : ""}`}>
        <button type="button" className={`tombol ${utama ? "tombol-utama" : "tombol-garis"} min-h-14`} disabled={proses !== ""} onClick={() => void ambil("unduh")}>
          <IconDownload size={20} />{proses === "unduh" ? "Membuat PDF..." : "Unduh PDF"}
        </button>
        {bisaBagikan && <button type="button" className="tombol tombol-garis min-h-14 px-5" disabled={proses !== ""} onClick={() => void ambil("bagikan")}><IconShare size={20} />Bagikan</button>}
      </div>
      {pesan && <p className="text-center text-sm text-abu" role="status">{pesan}</p>}
    </div>
  );
}

/** Just the top of the paper, for cards and links. */
export function IntipCv({ id }: { id: string }) {
  const cv = useApi<CvApi>(`/cv/${id}`);
  if (!cv.data) return <span className="block h-40 animate-pulse rounded-2xl bg-kabut" role="status" aria-label="Memuat CV" />;
  const { isi, template, bahasa, kontak_disembunyikan } = cv.data;
  return (
    <span className="kertas-intip block" aria-hidden="true">
      <SkalaKertas><KertasCv isi={isi} template={template} bahasa={bahasa} kontakTersembunyi={kontak_disembunyikan} statis /></SkalaKertas>
    </span>
  );
}

export function PratinjauCv({ id, judul = "CV lamaran" }: { id: string; judul?: string }) {
  const cv = useApi<CvApi>(`/cv/${id}`);
  const [buka, setBuka] = useState(false);
  const [penuh, setPenuh] = useState(false);
  if (cv.galat) return <p className="text-sm text-abu">CV belum bisa dibuka.</p>;
  if (!cv.data) return <div className="h-40 animate-pulse rounded-2xl bg-kabut" role="status" aria-label="Memuat CV" />;
  const { isi, template, bahasa, kontak_disembunyikan } = cv.data;
  return (
    <>
      <div className="grid gap-2">
        {/* The paper is also a big tap target; the button below is the one for keyboards and screen readers. */}
        <div className="kertas-intip cursor-pointer" aria-hidden="true" onClick={() => setBuka(true)}>
          <SkalaKertas><KertasCv isi={isi} template={template} bahasa={bahasa} kontakTersembunyi={kontak_disembunyikan} statis /></SkalaKertas>
        </div>
        <button type="button" onClick={() => setBuka(true)} className="tombol tombol-garis min-h-12" aria-haspopup="dialog"><IconFileCv size={18} />Buka {judul}</button>
      </div>
      <Laci buka={buka} onTutup={() => setBuka(false)} label={judul} judul={`CV ${isi.nama}`} aksi={<TombolUnduhCv id={id} />}>
        <div className="grid gap-3">
          {kontak_disembunyikan && <p className="rounded-2xl bg-kabut p-3 text-[15px] text-abu">Nomor HP dan email terlihat setelah kamu meloloskan pelamar ini.</p>}
          <SkalaKertas penuh={penuh}><KertasCv isi={isi} template={template} bahasa={bahasa} kontakTersembunyi={kontak_disembunyikan} /></SkalaKertas>
          {/* At phone width the page is about half size; real size scrolls sideways for easy reading. */}
          <button type="button" className="tombol tombol-halus min-h-11 w-fit justify-self-center md:hidden" onClick={() => setPenuh((p) => !p)}>{penuh ? "Kecilkan" : "Lihat ukuran asli"}</button>
        </div>
      </Laci>
    </>
  );
}
