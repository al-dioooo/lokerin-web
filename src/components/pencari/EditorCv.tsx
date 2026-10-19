"use client";

/*
 * CV Khusus page (ADR 0009). "Lihat" shows the paper exactly as the PDF prints. "Ubah isi" lists the
 * same content as large cards; tapping one opens a drawer with plain fields, because editing 11pt
 * serif text at phone scale is hard for anyone. Every save goes to the server right away, and
 * anything new the person types is offered back as a Fakta. On a wide screen both sit side by side.
 */

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { IconArrowLeft, IconCheck, IconCircleCheck, IconDownload, IconPencil, IconPlus, IconShare, IconTrash, IconX } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { Laci } from "../lapis/Laci";
import { bagianTerurut, KertasCv, SkalaKertas } from "../cv/KertasCv";
import { api, GalatApi } from "@/lib/api/klien";
import { useApi } from "@/lib/api/hooks";
import type { BagianCv, CvApi, EntriCv, IsiCv, KelompokKeahlian } from "@/lib/api/tipe";
import { bagikanCv, bisaBagikanBerkas, unduhCv } from "@/lib/cv";
import "../lapis/lapis.css";
import "../mulai/alur.css";

type HasilSimpan = { isi: IsiCv; template: CvApi["template"]; calon_fakta: { item_id: string; text: string }[]; peringatan: string | null };
type Sunting =
  | { jenis: "diri" }
  | { jenis: "ringkasan" }
  | { jenis: "entri"; bagianId: string; entri: EntriCv; baru: boolean }
  | { jenis: "keahlian"; kelompok: KelompokKeahlian; baru: boolean };

const id = () => crypto.randomUUID();

function Bidang({ label, children, bantuan }: { label: string; children: React.ReactNode; bantuan?: string }) {
  return (
    <label className="grid gap-1.5 text-[15px] font-semibold text-abu">
      {label}
      {children}
      {bantuan && <span className="text-sm font-normal">{bantuan}</span>}
    </label>
  );
}

const INPUT = "input-mulai min-h-14 text-[17px] text-tinta";

function FormDiri({ isi, onSimpan }: { isi: IsiCv; onSimpan: (isi: IsiCv) => void }) {
  const [nama, setNama] = useState(isi.nama);
  const [judul, setJudul] = useState(isi.judul);
  const [kota, setKota] = useState(isi.kontak.kota ?? "");
  const [telepon, setTelepon] = useState(isi.kontak.telepon ?? "");
  const [email, setEmail] = useState(isi.kontak.email ?? "");
  const [tautan, setTautan] = useState((isi.kontak.tautan ?? []).join(", "));
  return (
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onSimpan({ ...isi, nama: nama.trim(), judul: judul.trim(), kontak: { kota: kota.trim() || undefined, telepon: telepon.trim() || undefined, email: email.trim() || undefined, tautan: tautan.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5) } }); }}>
      <Bidang label="Nama lengkap"><input className={INPUT} value={nama} onChange={(e) => setNama(e.target.value)} maxLength={120} required /></Bidang>
      <Bidang label="Posisi yang dilamar"><input className={INPUT} value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={160} /></Bidang>
      <Bidang label="Kota atau kecamatan"><input className={INPUT} value={kota} onChange={(e) => setKota(e.target.value)} maxLength={80} /></Bidang>
      <Bidang label="Nomor HP" bantuan="Perekrut baru melihatnya setelah kamu lolos."><input className={INPUT} value={telepon} onChange={(e) => setTelepon(e.target.value)} inputMode="tel" maxLength={40} /></Bidang>
      <Bidang label="Email (boleh kosong)"><input className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" maxLength={120} /></Bidang>
      <Bidang label="Tautan (boleh kosong)" bantuan="Misalnya portofolio atau LinkedIn. Pisahkan dengan koma."><input className={INPUT} value={tautan} onChange={(e) => setTautan(e.target.value)} maxLength={500} /></Bidang>
      <button type="submit" className="tombol tombol-utama min-h-14 text-lg">Simpan</button>
    </form>
  );
}

function FormRingkasan({ isi, onSimpan }: { isi: IsiCv; onSimpan: (isi: IsiCv) => void }) {
  const [teks, setTeks] = useState(isi.ringkasan);
  return (
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onSimpan({ ...isi, ringkasan: teks.trim() }); }}>
      <Bidang label="Ringkasan" bantuan="2–3 kalimat. Tulis **seperti ini** untuk menebalkan kata penting.">
        <textarea className="input-mulai min-h-36 py-3 text-[17px] text-tinta" value={teks} onChange={(e) => setTeks(e.target.value)} maxLength={2000} />
      </Bidang>
      <button type="submit" className="tombol tombol-utama min-h-14 text-lg">Simpan</button>
    </form>
  );
}

function FormEntri({ entri, onSimpan, onHapus }: { entri: EntriCv; onSimpan: (e: EntriCv) => void; onHapus: () => void }) {
  const [judul, setJudul] = useState(entri.judul);
  const [tempat, setTempat] = useState(entri.tempat ?? "");
  const [keterangan, setKeterangan] = useState(entri.keterangan ?? "");
  const [periode, setPeriode] = useState(entri.periode ?? "");
  const [poin, setPoin] = useState(entri.poin.length ? entri.poin : [{ id: id(), text: "", fakta_ids: [] }]);
  const [tanyaHapus, setTanyaHapus] = useState(false);
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSimpan({ ...entri, judul: judul.trim(), tempat: tempat.trim() || undefined, keterangan: keterangan.trim() || undefined, periode: periode.trim() || undefined, poin: poin.map((p) => ({ ...p, text: p.text.trim() })).filter((p) => p.text) });
      }}
    >
      <Bidang label="Posisi atau nama"><input className={INPUT} value={judul} onChange={(e) => setJudul(e.target.value)} maxLength={160} required placeholder="Misalnya Tukang Las" /></Bidang>
      <Bidang label="Tempat"><input className={INPUT} value={tempat} onChange={(e) => setTempat(e.target.value)} maxLength={160} placeholder="Misalnya Bengkel Las Jaya, Sokaraja" /></Bidang>
      <div className="grid grid-cols-2 gap-3">
        <Bidang label="Periode"><input className={INPUT} value={periode} onChange={(e) => setPeriode(e.target.value)} maxLength={60} placeholder="2019 – sekarang" /></Bidang>
        <Bidang label="Keterangan"><input className={INPUT} value={keterangan} onChange={(e) => setKeterangan(e.target.value)} maxLength={120} placeholder="Paruh waktu" /></Bidang>
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold text-abu">Yang kamu kerjakan</legend>
        {poin.map((p, i) => (
          <div key={p.id} className="flex items-start gap-2">
            <textarea
              aria-label={`Poin ${i + 1}`}
              className="input-mulai min-h-20 flex-1 py-3 text-[17px] text-tinta"
              value={p.text}
              maxLength={600}
              onChange={(e) => setPoin((d) => d.map((x) => (x.id === p.id ? { ...x, text: e.target.value } : x)))}
              placeholder="Misalnya Mengerjakan **30 kanopi** baja ringan bersama tim 3 orang"
            />
            <button type="button" className="icon-button size-12 shrink-0 border border-garis bg-white" aria-label={`Hapus poin ${i + 1}`} onClick={() => setPoin((d) => d.filter((x) => x.id !== p.id))}><IconX size={18} /></button>
          </div>
        ))}
        <button type="button" className="tombol tombol-garis min-h-12" onClick={() => setPoin((d) => [...d, { id: id(), text: "", fakta_ids: [] }])}><IconPlus size={18} />Tambah poin</button>
      </fieldset>
      <button type="submit" className="tombol tombol-utama min-h-14 text-lg">Simpan</button>
      <button type="button" className="tombol tombol-halus min-h-12 text-merah" onClick={() => setTanyaHapus(true)}><IconTrash size={18} />Hapus dari CV</button>
      <Dialog buka={tanyaHapus} onTutup={() => setTanyaHapus(false)} bahaya judul="Hapus dari CV ini?" labelYa="Ya, hapus" onYa={() => { setTanyaHapus(false); onHapus(); }}>
        Hanya hilang dari CV ini. Bahan CV-mu tetap ada.
      </Dialog>
    </form>
  );
}

function FormKeahlian({ kelompok, onSimpan, onHapus }: { kelompok: KelompokKeahlian; onSimpan: (k: KelompokKeahlian) => void; onHapus: () => void }) {
  const [label, setLabel] = useState(kelompok.label);
  const [isi, setIsi] = useState(kelompok.isi.join(", "));
  return (
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); onSimpan({ ...kelompok, label: label.trim(), isi: isi.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 20) }); }}>
      <Bidang label="Nama kelompok"><input className={INPUT} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={60} required placeholder="Misalnya Dapur" /></Bidang>
      <Bidang label="Keahlian" bantuan="Pisahkan dengan koma."><textarea className="input-mulai min-h-28 py-3 text-[17px] text-tinta" value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Masak nasi, Menggoreng, Kasir" /></Bidang>
      <button type="submit" className="tombol tombol-utama min-h-14 text-lg">Simpan</button>
      <button type="button" className="tombol tombol-halus min-h-12 text-merah" onClick={onHapus}><IconTrash size={18} />Hapus kelompok</button>
    </form>
  );
}

function KartuSunting({ judul, children, onClick, lencana }: { judul: React.ReactNode; children?: React.ReactNode; onClick: () => void; lencana?: string }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-start gap-3 rounded-2xl border border-garis bg-white p-4 text-left transition-transform active:scale-[.98]">
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-bold leading-snug">{judul}</span>
        {children && <span className="mt-1 block text-[15px] leading-snug text-abu">{children}</span>}
        {lencana && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-daun-muda px-2.5 py-0.5 text-xs font-bold text-daun"><IconCircleCheck size={14} />{lencana}</span>}
      </span>
      <IconPencil size={18} className="mt-1 shrink-0 text-abu" />
    </button>
  );
}

export function EditorCv({ id: cvId }: { id: string }) {
  const router = useRouter();
  const cv = useApi<CvApi>(`/cv/${cvId}`);
  const [isiEdit, setIsiEdit] = useState<IsiCv | null>(null);
  const isi = isiEdit ?? cv.data?.isi ?? null;
  const [tab, setTab] = useState<"lihat" | "ubah">("lihat");
  const [penuh, setPenuh] = useState(false);
  const [sunting, setSunting] = useState<Sunting | null>(null);
  const [status, setStatus] = useState<"" | "simpan" | "tersimpan">("");
  const [galat, setGalat] = useState("");
  const [calon, setCalon] = useState<HasilSimpan["calon_fakta"]>([]);
  const [unduh, setUnduh] = useState<"" | "unduh" | "bagikan">("");
  const [pesanUnduh, setPesanUnduh] = useState("");
  const bisaBagikan = useSyncExternalStore(() => () => {}, bisaBagikanBerkas, () => false);

  if (cv.galat) return <p className="rounded-2xl bg-merah-muda p-4 text-merah">{cv.galat.message}</p>;
  if (!isi || !cv.data) return <p className="py-10 text-center text-abu" role="status">Memuat CV...</p>;
  const template = cv.data.template;

  async function simpan(baru: IsiCv) {
    setIsiEdit(baru);
    setSunting(null);
    setStatus("simpan");
    setGalat("");
    try {
      const hasil = await api<HasilSimpan>(`/cv/${cvId}`, { method: "PATCH", body: { isi: baru } });
      setIsiEdit(hasil.isi);
      setCalon(hasil.calon_fakta);
      setStatus("tersimpan");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan. Coba lagi.");
      setStatus("");
    }
  }

  const ubahBagian = (bagianId: string, ubah: (b: BagianCv) => BagianCv) => ({ ...isi, bagian: isi.bagian.map((b) => (b.id === bagianId ? ubah(b) : b)) });
  const simpanEntri = (bagianId: string, entri: EntriCv) =>
    void simpan(ubahBagian(bagianId, (b) => ({ ...b, entri: b.entri.some((x) => x.id === entri.id) ? b.entri.map((x) => (x.id === entri.id ? entri : x)) : [...b.entri, entri] })));
  const hapusEntri = (bagianId: string, entriId: string) => void simpan(ubahBagian(bagianId, (b) => ({ ...b, entri: b.entri.filter((x) => x.id !== entriId) })));
  const simpanKelompok = (k: KelompokKeahlian) =>
    void simpan({ ...isi, keahlian: isi.keahlian.some((x) => x.id === k.id) ? isi.keahlian.map((x) => (x.id === k.id ? k : x)) : [...isi.keahlian, k] });

  async function jadikanFakta(c: HasilSimpan["calon_fakta"][number]) {
    await api("/fakta", { method: "POST", body: { jenis: "pengalaman", judul: c.text.replace(/\*\*/g, "").slice(0, 200) } });
    setCalon((x) => x.filter((y) => y.item_id !== c.item_id));
  }

  async function ambil(cara: "unduh" | "bagikan") {
    setUnduh(cara);
    setPesanUnduh("");
    try {
      if (cara === "unduh") setPesanUnduh(`Tersimpan sebagai “${await unduhCv(cvId)}”.`);
      else await bagikanCv(cvId);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setPesanUnduh(e instanceof GalatApi ? e.message : "PDF belum bisa dibuat. Coba lagi.");
    } finally {
      setUnduh("");
    }
  }

  const judulSunting =
    sunting?.jenis === "diri" ? "Data diri" : sunting?.jenis === "ringkasan" ? "Ringkasan" : sunting?.jenis === "entri" ? (sunting.baru ? "Tambah ke CV" : "Ubah") : sunting?.jenis === "keahlian" ? "Keahlian" : "";

  const daftarUbah = (
    <div className="grid gap-5">
      <section className="grid gap-2" aria-labelledby="ubah-diri">
        <h2 id="ubah-diri" className="text-[15px] font-bold uppercase tracking-wide text-abu">Data diri</h2>
        <KartuSunting judul={isi.nama} onClick={() => setSunting({ jenis: "diri" })}>
          {[isi.judul, isi.kontak.kota, isi.kontak.telepon].filter(Boolean).join(" · ")}
        </KartuSunting>
      </section>
      <section className="grid gap-2" aria-labelledby="ubah-ringkasan">
        <h2 id="ubah-ringkasan" className="text-[15px] font-bold uppercase tracking-wide text-abu">Ringkasan</h2>
        <KartuSunting judul={<span className="line-clamp-3 font-normal">{isi.ringkasan.replace(/\*\*/g, "") || "Tulis ringkasan singkat"}</span>} onClick={() => setSunting({ jenis: "ringkasan" })} />
      </section>
      {bagianTerurut(isi).map((b) => (
        <section key={b.id} className="grid gap-2" aria-labelledby={`ubah-${b.id}`}>
          <h2 id={`ubah-${b.id}`} className="text-[15px] font-bold uppercase tracking-wide text-abu">{b.judul}</h2>
          {b.entri.map((e) => (
            <KartuSunting
              key={e.id}
              judul={e.judul || "Tanpa judul"}
              onClick={() => setSunting({ jenis: "entri", bagianId: b.id, entri: e, baru: false })}
              lencana={e.fakta_ids.length && !e.diedit_pengguna ? "Dari bahan CV-mu" : undefined}
            >
              {[e.tempat, e.periode].filter(Boolean).join(" · ")}
              {e.poin.length > 0 && <span className="block">{e.poin.length} poin</span>}
            </KartuSunting>
          ))}
          <button type="button" className="tombol tombol-garis min-h-12" onClick={() => setSunting({ jenis: "entri", bagianId: b.id, entri: { id: id(), judul: "", poin: [], fakta_ids: [] }, baru: true })}><IconPlus size={18} />Tambah {b.judul.toLowerCase()}</button>
        </section>
      ))}
      <section className="grid gap-2" aria-labelledby="ubah-keahlian">
        <h2 id="ubah-keahlian" className="text-[15px] font-bold uppercase tracking-wide text-abu">Keahlian</h2>
        {isi.keahlian.map((k) => (
          <KartuSunting key={k.id} judul={k.label} onClick={() => setSunting({ jenis: "keahlian", kelompok: k, baru: false })}>{k.isi.join(", ")}</KartuSunting>
        ))}
        <button type="button" className="tombol tombol-garis min-h-12" onClick={() => setSunting({ jenis: "keahlian", kelompok: { id: id(), label: "", isi: [] }, baru: true })}><IconPlus size={18} />Tambah kelompok keahlian</button>
      </section>
    </div>
  );

  const kertas = (
    <div className="grid gap-3">
      <SkalaKertas penuh={penuh}><KertasCv isi={isi} template={template} bahasa={cv.data.bahasa} /></SkalaKertas>
      <button type="button" className="tombol tombol-halus min-h-11 w-fit justify-self-center lg:hidden" onClick={() => setPenuh((p) => !p)}>{penuh ? "Kecilkan" : "Lihat ukuran asli"}</button>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-4 pb-44">
      <button type="button" onClick={() => (history.length > 1 ? router.back() : router.push("/app/lamaran"))} className="inline-flex min-h-11 w-fit items-center gap-1.5 text-[15px] font-semibold text-abu"><IconArrowLeft size={18} />Kembali</button>
      <div>
        <p className="piksel text-[11px] uppercase text-jingga-tua">CV lamaran</p>
        <h1 className="text-[1.75rem] leading-tight">CV {isi.judul || isi.nama}</h1>
        <p className="mt-1 text-[15px] text-abu">Disusun dari bahan CV-mu untuk satu lowongan. Pemberi kerja melihat CV persis seperti ini.</p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-garis bg-white p-1 lg:hidden" role="tablist" aria-label="Tampilan CV">
        {(["lihat", "ubah"] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-12 rounded-full text-[16px] font-bold ${tab === t ? "bg-tinta text-white" : "text-abu"}`}>
            {t === "lihat" ? "Lihat" : "Ubah isi"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
        <div className={tab === "ubah" ? "" : "hidden lg:block"}>{daftarUbah}</div>
        <div className={`${tab === "lihat" ? "" : "hidden lg:block"} lg:sticky lg:top-6`}>{kertas}</div>
      </div>

      {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}

      <div className="alur-lanjut">
        <p className="mb-2 flex min-h-5 items-center justify-center gap-1.5 text-sm text-abu" role="status">
          {status === "simpan" ? "Menyimpan..." : status === "tersimpan" ? <><IconCheck size={16} className="text-daun" />Perubahan tersimpan</> : pesanUnduh}
        </p>
        <div className={`grid gap-2 ${bisaBagikan ? "grid-cols-[1fr_auto]" : ""}`}>
          <button type="button" className="tombol tombol-utama" disabled={unduh !== ""} onClick={() => void ambil("unduh")}>
            <IconDownload size={20} />{unduh === "unduh" ? "Membuat PDF..." : "Unduh PDF"}
          </button>
          {bisaBagikan && (
            <button type="button" className="tombol tombol-garis px-5" disabled={unduh !== ""} onClick={() => void ambil("bagikan")} aria-label="Bagikan PDF"><IconShare size={20} />Bagikan</button>
          )}
        </div>
      </div>

      <Laci buka={sunting !== null} onTutup={() => setSunting(null)} label="CV lamaran" judul={judulSunting}>
        {sunting?.jenis === "diri" && <FormDiri isi={isi} onSimpan={(x) => void simpan(x)} />}
        {sunting?.jenis === "ringkasan" && <FormRingkasan isi={isi} onSimpan={(x) => void simpan(x)} />}
        {sunting?.jenis === "entri" && (
          <FormEntri key={sunting.entri.id} entri={sunting.entri} onSimpan={(e) => simpanEntri(sunting.bagianId, e)} onHapus={() => (sunting.baru ? setSunting(null) : hapusEntri(sunting.bagianId, sunting.entri.id))} />
        )}
        {sunting?.jenis === "keahlian" && (
          <FormKeahlian key={sunting.kelompok.id} kelompok={sunting.kelompok} onSimpan={simpanKelompok} onHapus={() => (sunting.baru ? setSunting(null) : void simpan({ ...isi, keahlian: isi.keahlian.filter((k) => k.id !== sunting.kelompok.id) }))} />
        )}
      </Laci>

      <Laci buka={calon.length > 0 && sunting === null} onTutup={() => setCalon([])} label="Kamu menambah hal baru" judul="Simpan juga jadi bahan CV?" keterangan="Bahan CV yang tersimpan bisa dipakai lagi untuk lamaran berikutnya.">
        <ul className="grid gap-2.5">
          {calon.map((c) => (
            <li key={c.item_id} className="rounded-2xl border border-garis p-3">
              <p className="text-[17px]">{c.text.replace(/\*\*/g, "")}</p>
              <button type="button" className="tombol tombol-utama mt-2 w-full" onClick={() => void jadikanFakta(c)}><IconCheck size={18} />Simpan jadi bahan CV</button>
            </li>
          ))}
        </ul>
      </Laci>
    </div>
  );
}
