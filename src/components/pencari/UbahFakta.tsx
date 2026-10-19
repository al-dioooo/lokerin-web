"use client";

/*
 * One Bahan CV: an experience with its points (tasks and results, one per line), or a skill, school
 * or award. The owner can fix what Ngobrol wrote down, delete it, or fold pieces of one job that
 * were saved separately back into that job, so its CV entry gets one heading with bullets.
 */

import { useState } from "react";
import { IconCheck, IconTrash } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { Laci } from "../lapis/Laci";
import { api, GalatApi } from "@/lib/api/klien";
import type { FaktaApi } from "@/lib/api/tipe";

export const JENIS_FAKTA: Record<FaktaApi["jenis"], string> = { pengalaman: "Pengalaman", pendidikan: "Pendidikan", keahlian: "Keahlian", prestasi: "Prestasi", lainnya: "Lainnya" };

export function poinFakta(f: Pick<FaktaApi, "detail">) {
  return (f.detail ?? "").split("\n").map((b) => b.trim()).filter(Boolean);
}

/** The points of a Bahan CV as a short bullet list; `batas` keeps long ones to a few lines. */
export function PoinFakta({ f, batas }: { f: Pick<FaktaApi, "detail">; batas?: number }) {
  const poin = poinFakta(f);
  if (!poin.length) return null;
  const tampil = batas ? poin.slice(0, batas) : poin;
  return (
    <ul className="mt-1 grid gap-0.5 text-sm text-abu">
      {tampil.map((p, i) => (
        <li key={i} className="flex gap-2"><span aria-hidden="true">•</span><span className="min-w-0">{p}</span></li>
      ))}
      {tampil.length < poin.length && <li className="pl-4">dan {poin.length - tampil.length} poin lagi</li>}
    </ul>
  );
}

export function UbahFakta({ fakta, semua, onTutup, onBerubah }: { fakta: FaktaApi | null; semua: FaktaApi[]; onTutup: () => void; onBerubah: () => void }) {
  return (
    <Laci buka={fakta !== null} onTutup={onTutup} label="Bahan CV" judul={fakta ? "Ubah bahan CV" : ""}>
      {fakta && <Isian key={fakta.id} fakta={fakta} semua={semua} onTutup={onTutup} onBerubah={onBerubah} />}
    </Laci>
  );
}

function Isian({ fakta, semua, onTutup, onBerubah }: { fakta: FaktaApi; semua: FaktaApi[]; onTutup: () => void; onBerubah: () => void }) {
  const [jenis, setJenis] = useState(fakta.jenis);
  const [judul, setJudul] = useState(fakta.judul);
  const [tempat, setTempat] = useState(fakta.tempat ?? "");
  const [periode, setPeriode] = useState(fakta.periode ?? "");
  const [poin, setPoin] = useState(poinFakta(fakta).join("\n"));
  const [gabung, setGabung] = useState<string[]>([]);
  const [tergabung, setTergabung] = useState<string[]>([]);
  const [hapus, setHapus] = useState(false);
  const [proses, setProses] = useState<"" | "simpan" | "gabung">("");
  const [galat, setGalat] = useState("");
  const lain = semua.filter((f) => f.id !== fakta.id && f.status === "terkonfirmasi" && !tergabung.includes(f.id));

  async function simpan() {
    setProses("simpan");
    setGalat("");
    try {
      await api(`/fakta/${fakta.id}`, {
        method: "PATCH",
        body: { jenis, judul: judul.trim(), tempat: tempat.trim() || null, periode: periode.trim() || null, detail: poin.trim() || null },
      });
      onBerubah();
      onTutup();
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan. Coba lagi.");
    } finally {
      setProses("");
    }
  }

  async function gabungkan() {
    setProses("gabung");
    setGalat("");
    try {
      await api(`/fakta/${fakta.id}/gabung`, { method: "POST", body: { ids: gabung } });
      // The server added each title as a point; show them here too, after what is being edited.
      const judulBaru = semua.filter((f) => gabung.includes(f.id)).map((f) => f.judul);
      setPoin((p) => [p.trim(), ...judulBaru].filter(Boolean).join("\n"));
      setTergabung((t) => [...t, ...gabung]);
      setGabung([]);
      onBerubah();
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tergabung. Coba lagi.");
    } finally {
      setProses("");
    }
  }

  async function hapusSekarang() {
    try {
      await api(`/fakta/${fakta.id}`, { method: "DELETE" });
      setHapus(false);
      onBerubah();
      onTutup();
    } catch (e) {
      setHapus(false);
      setGalat(e instanceof GalatApi ? e.message : "Belum terhapus. Coba lagi.");
    }
  }

  const label = "grid gap-1.5 text-[15px] font-semibold text-abu";
  const isian = "input-mulai min-h-14 text-lg text-tinta";
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Jenis">
        {(Object.keys(JENIS_FAKTA) as FaktaApi["jenis"][]).map((j) => (
          <button key={j} type="button" className="chip-peta" aria-pressed={jenis === j} onClick={() => setJenis(j)}>{JENIS_FAKTA[j]}</button>
        ))}
      </div>
      <label className={label}>{jenis === "pengalaman" ? "Posisi atau kerja apa?" : "Judul"}<input value={judul} onChange={(e) => setJudul(e.target.value)} className={isian} maxLength={200} /></label>
      <label className={label}>Di mana? (boleh kosong)<input value={tempat} onChange={(e) => setTempat(e.target.value)} className={isian} placeholder="Usaha, perusahaan, atau sekolah" maxLength={200} /></label>
      <label className={label}>Kapan atau berapa lama? (boleh kosong)<input value={periode} onChange={(e) => setPeriode(e.target.value)} className={isian} placeholder="Misalnya Jan–Jun 2026 atau 3 tahun" maxLength={80} /></label>
      <label className={label}>
        Tugas dan hasilmu di sini
        <textarea value={poin} onChange={(e) => setPoin(e.target.value)} rows={5} className="input-mulai min-h-32 py-3 text-[17px] font-normal leading-snug text-tinta" placeholder={"Satu baris satu poin, misalnya:\nMembuat campaign bulanan\nMencapai 200% KPI konten"} />
        <span className="text-sm font-normal">Satu baris jadi satu poin di CV lamaran.</span>
      </label>

      {lain.length > 0 && (
        <section className="grid gap-2 rounded-2xl bg-kabut p-3" aria-labelledby={`gabung-${fakta.id}`}>
          <h3 id={`gabung-${fakta.id}`} className="text-[15px]">Pekerjaan ini tersimpan terpisah-pisah?</h3>
          <p className="text-sm text-abu">Pilih bahan yang sebenarnya bagian dari pekerjaan ini. Judulnya jadi poin di sini, lalu bahan itu dihapus.</p>
          <ul className="grid gap-1.5">
            {lain.map((f) => {
              const dipilih = gabung.includes(f.id);
              return (
                <li key={f.id}>
                  <button type="button" aria-pressed={dipilih} onClick={() => setGabung((g) => (dipilih ? g.filter((x) => x !== f.id) : [...g, f.id]))} className={`flex w-full items-start gap-2 rounded-xl border bg-white p-2.5 text-left text-[15px] ${dipilih ? "border-jingga" : "border-garis"}`}>
                    <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${dipilih ? "border-jingga bg-jingga text-white" : "border-garis"}`}>{dipilih && <IconCheck size={14} stroke={3} />}</span>
                    <span className="min-w-0"><span className="block font-semibold leading-snug">{f.judul}</span><span className="block text-xs text-abu">{JENIS_FAKTA[f.jenis]}{f.tempat ? ` · ${f.tempat}` : ""}</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="tombol tombol-garis min-h-11" disabled={!gabung.length || proses !== ""} onClick={() => void gabungkan()}>
            {proses === "gabung" ? "Menggabungkan…" : gabung.length ? `Gabungkan ${gabung.length} ke sini` : "Pilih yang mau digabung"}
          </button>
        </section>
      )}

      {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
      <div className="aksi-laci grid grid-cols-[auto_1fr]">
        <button type="button" className="tombol tombol-halus text-merah" onClick={() => setHapus(true)} aria-label="Hapus bahan CV ini"><IconTrash size={18} /></button>
        <button type="button" className="tombol tombol-utama" disabled={judul.trim().length < 2 || proses !== ""} onClick={() => void simpan()}>{proses === "simpan" ? "Menyimpan…" : "Simpan"}</button>
      </div>
      <Dialog buka={hapus} onTutup={() => setHapus(false)} bahaya judul="Hapus bahan CV ini?" labelYa="Ya, hapus" onYa={() => void hapusSekarang()}>
        &ldquo;{fakta.judul}&rdquo; tidak dipakai lagi untuk CV lamaran berikutnya. CV yang sudah dikirim tidak berubah.
      </Dialog>
    </div>
  );
}
