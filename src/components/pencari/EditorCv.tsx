"use client";

/*
 * CV Khusus editor: what you see is the CV. Every line is editable in place. Lines the AI wrote
 * come from confirmed Fakta; anything new the person types is offered back as a Fakta to save.
 */

import Link from "next/link";
import { useState } from "react";
import { IconArrowLeft, IconCheck, IconDownload, IconPlus, IconPrinter } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { api, GalatApi, urlBertoken } from "@/lib/api/klien";
import { useApi } from "@/lib/api/hooks";
import type { CvApi, IsiCv } from "@/lib/api/tipe";
import "../lapis/lapis.css";
import "../mulai/alur.css";

type HasilSimpan = { isi: IsiCv; template: CvApi["template"]; calon_fakta: { item_id: string; text: string }[]; peringatan: string | null };

function Sunting({ nilai, onUbah, className = "", label }: { nilai: string; onUbah: (v: string) => void; className?: string; label: string }) {
  return (
    <span
      role="textbox"
      aria-label={label}
      contentEditable
      suppressContentEditableWarning
      className={`cv-sunting ${className}`}
      onBlur={(e) => onUbah(e.currentTarget.textContent?.trim() ?? "")}
    >
      {nilai}
    </span>
  );
}

export function EditorCv({ id }: { id: string }) {
  const cv = useApi<CvApi>(`/cv/${id}`);
  const [isiEdit, setIsiEdit] = useState<IsiCv | null>(null);
  const [templateEdit, setTemplate] = useState<CvApi["template"] | null>(null);
  const isi = isiEdit ?? cv.data?.isi ?? null;
  const template = templateEdit ?? cv.data?.template ?? "satu_kolom";
  const setIsi = (ubah: IsiCv | ((x: IsiCv | null) => IsiCv | null)) =>
    setIsiEdit((lama) => (typeof ubah === "function" ? ubah(lama ?? cv.data?.isi ?? null) : ubah));
  const [status, setStatus] = useState<"" | "simpan" | "tersimpan">("");
  const [galat, setGalat] = useState("");
  const [calon, setCalon] = useState<HasilSimpan["calon_fakta"]>([]);
  const [disimpan, setDisimpan] = useState<string[]>([]);

  if (cv.galat) return <p className="rounded-2xl bg-merah-muda p-4 text-merah">{cv.galat.message}</p>;
  if (!isi) return <p className="py-10 text-center text-abu">Memuat CV...</p>;

  const ubahItem = (b: number, i: number, text: string) =>
    setIsi((x) => x && { ...x, bagian: x.bagian.map((s, si) => (si !== b ? s : { ...s, items: s.items.map((it, ii) => (ii !== i ? it : { ...it, text })) })) });
  const tambahItem = (b: number) =>
    setIsi((x) => x && { ...x, bagian: x.bagian.map((s, si) => (si !== b ? s : { ...s, items: [...s.items, { id: crypto.randomUUID(), text: "Tulis poin baru", fakta_ids: [] }] })) });

  async function simpan() {
    if (!isi) return;
    setStatus("simpan");
    setGalat("");
    try {
      const hasil = await api<HasilSimpan>(`/cv/${id}`, { method: "PATCH", body: { isi: { ...isi, bagian: isi.bagian.map((s) => ({ ...s, items: s.items.filter((it) => it.text.trim()) })) }, template } });
      setIsi(hasil.isi);
      setCalon(hasil.calon_fakta.filter((c) => !disimpan.includes(c.item_id)));
      setStatus("tersimpan");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan. Coba lagi.");
      setStatus("");
    }
  }

  async function jadikanFakta(c: HasilSimpan["calon_fakta"][number]) {
    await api("/fakta", { method: "POST", body: { jenis: "pengalaman", judul: c.text.slice(0, 200) } });
    setDisimpan((d) => [...d, c.item_id]);
    setCalon((x) => x.filter((y) => y.item_id !== c.item_id));
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 pb-32">
      <Link href="/app/lamaran" className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold text-abu"><IconArrowLeft size={18} />Kembali</Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="piksel text-[11px] uppercase text-jingga-tua">CV Khusus</p>
          <h1 className="text-[1.75rem] leading-tight">Ketuk tulisan untuk mengubahnya</h1>
        </div>
        <div className="flex rounded-full border border-garis bg-white p-1" role="radiogroup" aria-label="Tata letak CV">
          {(["satu_kolom", "dua_kolom"] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={template === t} onClick={() => setTemplate(t)} className={`min-h-11 rounded-full px-4 text-sm font-bold ${template === t ? "bg-tinta text-white" : "text-abu"}`}>
              {t === "satu_kolom" ? "Satu kolom" : "Dua kolom"}
            </button>
          ))}
        </div>
      </div>
      {template === "dua_kolom" && <p className="rounded-2xl bg-[#FFF6DB] p-3 text-[15px] text-[#8A5A00]">Dua kolom enak dilihat, tapi kurang ramah ATS: sistem lamaran otomatis bisa salah membaca urutannya. Untuk melamar ke kantor besar, pakai satu kolom.</p>}

      <article className={`lembar-cv cv-editor ${template === "dua_kolom" ? "cv-dua" : ""}`} lang={cv.data?.bahasa}>
        <header className="border-b border-garis pb-4">
          <h2 className="text-2xl"><Sunting label="Nama" nilai={isi.nama} onUbah={(v) => setIsi({ ...isi, nama: v })} /></h2>
          <p className="text-[17px] text-abu"><Sunting label="Judul CV" nilai={isi.judul} onUbah={(v) => setIsi({ ...isi, judul: v })} /></p>
          <p className="mt-1 text-sm text-abu">{[isi.kontak.kota, isi.kontak.telepon, isi.kontak.email].filter(Boolean).join(" · ")}</p>
        </header>
        <div className="cv-badan">
          <div className="cv-utama">
            <h3 className="mt-4 text-sm uppercase tracking-wide text-abu">{cv.data?.bahasa === "en" ? "Summary" : "Ringkasan"}</h3>
            <p className="mt-1 text-[16px]"><Sunting label="Ringkasan" nilai={isi.ringkasan} onUbah={(v) => setIsi({ ...isi, ringkasan: v })} /></p>
            {isi.bagian.map((s, b) => (
              <section key={s.id}>
                <h3 className="mt-5 text-sm uppercase tracking-wide text-abu">{s.judul}</h3>
                <ul className="mt-2 grid gap-1.5">
                  {s.items.map((it, i) => (
                    <li key={it.id} className="flex items-start gap-2 text-[16px]">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-tinta" />
                      <Sunting label={`Poin ${i + 1} di ${s.judul}`} nilai={it.text} onUbah={(v) => ubahItem(b, i, v)} className="flex-1" />
                      {it.fakta_ids.length > 0 && !it.diedit_pengguna && <span className="mt-1 shrink-0 rounded-full bg-daun-muda px-2 py-0.5 text-[11px] font-bold text-daun">Dari Fakta</span>}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => tambahItem(b)} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-jingga-tua print:hidden"><IconPlus size={16} />Tambah poin</button>
              </section>
            ))}
          </div>
          <aside className="cv-samping">
            <h3 className="mt-4 text-sm uppercase tracking-wide text-abu">{cv.data?.bahasa === "en" ? "Skills" : "Keahlian"}</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">{isi.keahlian.map((k) => <li key={k} className="chip-kategori py-1 pl-3 text-[13px]">{k}</li>)}</ul>
          </aside>
        </div>
      </article>

      {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}

      <div className="alur-lanjut">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2">
          <button type="button" className="tombol tombol-utama" disabled={status === "simpan"} onClick={() => void simpan()}>
            {status === "simpan" ? "Menyimpan..." : status === "tersimpan" ? <><IconCheck size={20} />Tersimpan</> : "Simpan CV"}
          </button>
          <a href={urlBertoken(`/cv/${id}/pdf`)} target="_blank" rel="noopener noreferrer" className="icon-button size-[60px] border border-garis bg-white" aria-label="Unduh PDF"><IconDownload size={22} /></a>
          <a href={urlBertoken(`/cv/${id}/html`)} target="_blank" rel="noopener noreferrer" className="icon-button size-[60px] border border-garis bg-white" aria-label="Buka versi cetak"><IconPrinter size={22} /></a>
        </div>
      </div>

      <Laci buka={calon.length > 0} onTutup={() => setCalon([])} label="Kamu menambah hal baru" judul="Simpan juga sebagai Fakta?" keterangan="Fakta yang tersimpan bisa dipakai untuk CV dan lamaran berikutnya.">
        <ul className="grid gap-2.5">
          {calon.map((c) => (
            <li key={c.item_id} className="rounded-2xl border border-garis p-3">
              <p className="text-[17px]">{c.text}</p>
              <button type="button" className="tombol tombol-utama mt-2 w-full" onClick={() => void jadikanFakta(c)}><IconCheck size={18} />Simpan sebagai Fakta</button>
            </li>
          ))}
        </ul>
      </Laci>
    </div>
  );
}
