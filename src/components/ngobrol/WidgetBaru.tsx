"use client";

/*
 * Cards for the tools added in ADR 0008. As with the others, anything final (sending a report,
 * passing an applicant) only happens when the person taps the button on the card.
 */

import { useState } from "react";
import { IconBrandWhatsapp, IconCircleCheck, IconFlag, IconShare, IconUserCheck } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { IkonKabar } from "../app/IkonKabar";
import { waktuLalu } from "@/lib/api/adaptor";
import { api, GalatApi } from "@/lib/api/klien";
import type { DaftarKabarApi, KartuKerjaApi, LamaranApi, TahapApi } from "@/lib/api/tipe";
import { laciDariTautan, TautanLaci } from "../lapis/konteksLaci";

export function KartuKerjaWidget({ kartu }: { kartu: KartuKerjaApi }) {
  const [disalin, setDisalin] = useState(false);
  const teks = `Kartu Kerja ${kartu.nama}: ${kartu.judul}. ${kartu.tautan}`;
  async function bagikan() {
    if (navigator.share) {
      await navigator.share({ title: `Kartu Kerja ${kartu.nama}`, text: `${kartu.judul}, ${kartu.kota}`, url: kartu.tautan }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(kartu.tautan).catch(() => {});
    setDisalin(true);
  }
  return (
    <div className="grid gap-2">
      <div className="rounded-2xl border border-garis bg-white p-4">
        <p className="piksel text-[10px] uppercase text-jingga-tua">Kartu Kerja</p>
        <p className="text-xl font-extrabold leading-tight">{kartu.nama}</p>
        <p className="text-[15px] text-abu">{kartu.judul} · {kartu.kota}</p>
        {kartu.keahlian.length > 0 && <ul className="mt-2 flex flex-wrap gap-1.5">{kartu.keahlian.slice(0, 4).map((k) => <li key={k} className="rounded-full bg-kabut px-3 py-1 text-xs font-bold">{k}</li>)}</ul>}
      </div>
      <a href={`https://wa.me/?text=${encodeURIComponent(teks)}`} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama min-h-14 text-lg"><IconBrandWhatsapp size={20} />Bagikan ke WhatsApp</a>
      <button type="button" className="tombol tombol-garis min-h-12" onClick={() => void bagikan()}><IconShare size={18} />{disalin ? "Tautan disalin" : "Bagikan cara lain"}</button>
    </div>
  );
}

export function LaporanSiap({ lowongan, alasan }: { lowongan: { id: string; judul: string; nama_usaha: string }; alasan: string }) {
  const [status, setStatus] = useState<"siap" | "kirim" | "beres">("siap");
  const [pesan, setPesan] = useState("");
  async function kirim() {
    setStatus("kirim");
    setPesan("");
    try {
      const hasil = await api<{ pesan: string }>(`/lowongan/${encodeURIComponent(lowongan.id)}/laporkan`, { method: "POST", body: { alasan } });
      setPesan(hasil.pesan);
      setStatus("beres");
    } catch (e) {
      setPesan(e instanceof GalatApi ? e.message : "Laporan belum terkirim.");
      setStatus("siap");
    }
  }
  return (
    <div className="grid gap-2">
      <div className="rounded-2xl border border-garis bg-white p-3">
        <p className="font-bold">{lowongan.judul}</p>
        <p className="text-sm text-abu">{lowongan.nama_usaha}</p>
        <p className="mt-2 text-[15px]">Alasan: {alasan}</p>
      </div>
      <p className="rounded-2xl bg-[#FFF6DB] p-3 text-sm text-[#8A5A00]">Jangan pernah membayar apa pun untuk mendapat pekerjaan.</p>
      {status === "beres" ? (
        <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 font-bold text-daun"><IconCircleCheck size={18} />{pesan}</p>
      ) : (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={status === "kirim"} onClick={() => void kirim()}><IconFlag size={20} />{status === "kirim" ? "Mengirim..." : "Kirim laporan"}</button>
      )}
      {status !== "beres" && pesan && <p role="alert" className="text-sm text-merah">{pesan}</p>}
    </div>
  );
}

export function DaftarKabarWidget({ daftar }: { daftar: DaftarKabarApi }) {
  if (!daftar.kabar.length) return <p className="text-[15px] text-abu">Belum ada kabar.</p>;
  return (
    <ul className="grid gap-2">
      {daftar.kabar.slice(0, 5).map((k) => (
        <li key={k.id}>
          <TautanLaci isi={laciDariTautan(k.tautan)} href={k.tautan} className="flex items-start gap-3 rounded-2xl border border-garis bg-white p-3">
            <IkonKabar jenis={k.jenis} />
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-snug">{k.judul}</span>
              <span className="block text-[15px] leading-snug text-abu">{k.isi}</span>
              <span className="mt-0.5 block text-sm text-abu">{waktuLalu(k.dibuat_pada)}</span>
            </span>
          </TautanLaci>
        </li>
      ))}
    </ul>
  );
}

export function PelamarWidget({ lamaran }: { lamaran: LamaranApi }) {
  return (
    <div className="grid gap-2">
      <div className="rounded-2xl border border-garis bg-white p-3">
        <p className="font-bold">{lamaran.pencari.nama}</p>
        <p className="text-sm text-abu">Sebagai {lamaran.persona.judul} · untuk {lamaran.lowongan.judul}</p>
        {lamaran.persona.ringkasan && <p className="mt-2 text-[15px]">{lamaran.persona.ringkasan}</p>}
        {lamaran.pesan && <p className="mt-2 rounded-xl bg-kabut p-2 text-[15px]">&ldquo;{lamaran.pesan}&rdquo;</p>}
        <p className="mt-2 text-sm text-abu">{lamaran.pencari.kontak_disembunyikan ? "Kontak terlihat setelah kamu meloloskannya." : [lamaran.pencari.telepon, lamaran.pencari.email].filter(Boolean).join(" · ")}</p>
      </div>
      <TautanLaci isi={{ jenis: "pelamar", id: lamaran.id }} href={`/app/pelamar?lamaran=${lamaran.id}`} className="tombol tombol-utama min-h-14 text-lg"><IconUserCheck size={20} />Buka untuk memutuskan</TautanLaci>
    </div>
  );
}

const JENIS_TAHAP: Record<TahapApi["jenis"], string> = { whatsapp: "Chat WhatsApp", meet: "Wawancara online", alamat: "Datang ke tempat", lainnya: "Tahap berikutnya" };

/** The model may give a local time without an offset; the API wants a full ISO time. */
function jadwalIso(jadwal?: string) {
  if (!jadwal) return null;
  const waktu = Date.parse(jadwal);
  return Number.isNaN(waktu) ? null : new Date(waktu).toISOString();
}

export function TahapSiap({ mode, lamaran, tahap }: { mode: "lolos" | "tambah"; lamaran: LamaranApi; tahap: Omit<TahapApi, "id" | "jadwal" | "catatan"> & { jadwal?: string; catatan?: string } }) {
  const [tanya, setTanya] = useState(false);
  const [status, setStatus] = useState<"siap" | "beres">("siap");
  const [galat, setGalat] = useState("");
  async function kirim() {
    setGalat("");
    try {
      await api(`/lamaran/${encodeURIComponent(lamaran.id)}/${mode === "lolos" ? "lolos" : "tahap"}`, {
        method: "POST",
        body: { jenis: tahap.jenis, detail: tahap.detail, jadwal: jadwalIso(tahap.jadwal), catatan: tahap.catatan ?? null },
      });
      setStatus("beres");
      setTanya(false);
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum terkirim.");
      setTanya(false);
    }
  }
  return (
    <div className="grid gap-2">
      <div className="rounded-2xl border border-garis bg-white p-3">
        <p className="text-sm text-abu">{mode === "lolos" ? "Loloskan" : "Tahap baru untuk"} <strong className="text-tinta">{lamaran.pencari.nama}</strong> · {lamaran.lowongan.judul}</p>
        <p className="mt-2 font-bold">{JENIS_TAHAP[tahap.jenis]}</p>
        <p className="text-[17px]">{tahap.detail}</p>
        {tahap.jadwal && jadwalIso(tahap.jadwal) && <p className="text-sm text-abu">{new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(jadwalIso(tahap.jadwal)!))}</p>}
        {tahap.catatan && <p className="text-sm text-abu">{tahap.catatan}</p>}
      </div>
      {status === "beres" ? (
        <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 font-bold text-daun"><IconCircleCheck size={18} />{lamaran.pencari.nama} sudah diberi tahu.</p>
      ) : (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" onClick={() => setTanya(true)}>Kirim ke pelamar</button>
      )}
      {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
      <Dialog buka={tanya} onTutup={() => setTanya(false)} judul={mode === "lolos" ? `Loloskan ${lamaran.pencari.nama}?` : "Kirim tahap baru?"} labelYa="Ya, kirim" onYa={kirim}>
        {mode === "lolos" ? `${lamaran.pencari.nama} langsung diberi tahu, dan kontaknya terbuka untukmu.` : `${lamaran.pencari.nama} langsung diberi tahu.`}
      </Dialog>
    </div>
  );
}
