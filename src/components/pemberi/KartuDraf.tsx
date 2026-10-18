"use client";

import { useState } from "react";
import { getKategori } from "../icons/categories";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { kategoriDari } from "@/lib/api/adaptor";
import { api, GalatApi } from "@/lib/api/klien";
import type { LowonganApi } from "@/lib/api/tipe";

const LABEL_JENIS: Record<string, string> = { harian: "Harian", paruh_waktu: "Paruh waktu", kontrak: "Kontrak", tetap: "Tetap", magang: "Magang" };

/**
 * A Draf Lowongan with its Pemeriksaan. Terbit is the employer's own decision (ADR 0004),
 * so it asks once in a Dialog: publishing makes the job visible to everyone nearby.
 */
export function KartuDraf({ lowongan, onBerubah, onUbah }: { lowongan: LowonganApi; onBerubah?: (l: LowonganApi) => void; onUbah?: () => void }) {
  const [tanya, setTanya] = useState(false);
  const [galat, setGalat] = useState("");
  const [l, setL] = useState(lowongan);
  const { Icon } = getKategori(kategoriDari(l));
  const masalah = l.pemeriksaan?.masalah ?? [];
  const tahan = masalah.filter((m) => m.tingkat === "tahan");
  const peringatan = masalah.filter((m) => m.tingkat === "peringatan");
  const terbit = l.status === "terbit";

  async function terbitkan() {
    setGalat("");
    try {
      const hasil = await api<LowonganApi>(`/pemberi/lowongan/${l.id}/terbit`, { method: "POST" });
      setL(hasil);
      onBerubah?.(hasil);
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum bisa terbit. Coba lagi.");
      throw e;
    }
  }

  return (
    <article className="rounded-3xl border border-garis bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="ubin-ikon size-14 shrink-0"><Icon size={38} /></span>
        <div className="min-w-0 flex-1">
          <p className="piksel text-[11px] uppercase text-jingga-tua">{terbit ? "Sudah terbit" : "Draf lowongan"}</p>
          <h3 className="text-xl leading-tight">{l.judul || "Posisi belum diisi"}</h3>
          <p className="text-[15px] text-abu">{l.pemberi_kerja.nama_usaha} · {l.lokasi.kecamatan ?? l.lokasi.kota ?? "lokasi belum diisi"}</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-[15px]">
        <div className="fakta"><dt>Upah</dt><dd className="font-bold tabular-nums">{l.upah.label}</dd></div>
        <div className="fakta"><dt>Jam kerja</dt><dd>{l.jam_kerja ?? "Belum diisi"}</dd></div>
        <div className="fakta"><dt>Jenis</dt><dd>{l.jenis_kerja ? (LABEL_JENIS[l.jenis_kerja] ?? l.jenis_kerja) : "Belum diisi"}</dd></div>
        <div className="fakta"><dt>Mulai</dt><dd>{l.mulai ?? "Belum diisi"}</dd></div>
      </dl>
      {l.deskripsi && <p className="mt-3 text-[15px]">{l.deskripsi}</p>}

      {!terbit && (
        <div className="mt-4 grid gap-2">
          {tahan.map((m) => (
            <p key={m.kode} className="flex items-start gap-2 rounded-2xl bg-merah-muda p-3 text-[15px] text-merah"><IconAlertTriangle size={20} className="mt-0.5 shrink-0" />{m.pesan}</p>
          ))}
          {peringatan.map((m) => (
            <p key={m.kode} className="flex items-start gap-2 rounded-2xl bg-[#FFF6DB] p-3 text-[15px] text-[#8A5A00]"><IconInfoCircle size={20} className="mt-0.5 shrink-0" />{m.pesan}</p>
          ))}
          {!masalah.length && <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 text-[15px] text-daun"><IconCircleCheck size={20} />Pemeriksaan lolos. Siap diterbitkan.</p>}
        </div>
      )}
      {galat && <p role="alert" className="mt-3 rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}

      <div className="mt-5 grid gap-2">
        {terbit ? (
          <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 text-[15px] font-bold text-daun"><IconCircleCheck size={20} />Sudah tampil untuk pencari kerja di sekitarmu.</p>
        ) : tahan.length ? (
          onUbah && <button type="button" className="tombol tombol-utama min-h-14 text-lg" onClick={onUbah}>Lengkapi yang kurang</button>
        ) : (
          <>
            <button type="button" className="tombol tombol-utama min-h-14 text-lg" onClick={() => setTanya(true)}>Terbitkan</button>
            {peringatan.length > 0 && onUbah && <button type="button" className="tombol tombol-garis min-h-14 text-lg" onClick={onUbah}>Ubah dulu</button>}
          </>
        )}
      </div>

      <Dialog buka={tanya} onTutup={() => setTanya(false)} judul="Terbitkan lowongan ini sekarang?" labelYa="Ya, terbitkan" onYa={terbitkan}>
        Pencari kerja di sekitar {l.lokasi.kecamatan ?? l.lokasi.kota ?? "usahamu"} langsung bisa melihat dan melamar. {peringatan.length ? "Masih ada catatan Pemeriksaan di atas; pastikan sudah benar." : ""}
      </Dialog>
    </article>
  );
}
