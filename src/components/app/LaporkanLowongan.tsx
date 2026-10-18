"use client";

/*
 * Laporkan is a Laci tied to the job on screen: pick one reason, then send. The report goes to
 * Lokerin for review; nothing happens to the job until someone has looked at it (PRD, Laporkan).
 */

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconCircleCheck, IconFlag } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { api, apiAktif, GalatApi } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";

const ALASAN = [
  { id: "biaya", label: "Minta bayar di depan", contoh: "Biaya daftar, seragam, pelatihan, atau jaminan" },
  { id: "upah", label: "Upah atau jam kerja tidak sesuai", contoh: "Beda dengan yang tertulis di sini" },
  { id: "palsu", label: "Usaha atau alamatnya tidak ada" },
  { id: "terisi", label: "Lowongan sudah tidak buka" },
  { id: "kasar", label: "Isinya kasar atau menipu" },
  { id: "lain", label: "Lainnya" },
] as const;

type IdAlasan = (typeof ALASAN)[number]["id"];

/** `contoh` marks a sample job: the drawer works, but nothing is sent. */
export function LaporkanLowongan({ lowonganId, judul, contoh = false }: { lowonganId: string; judul: string; contoh?: boolean }) {
  const { pengguna } = useSesi();
  const [buka, setBuka] = useState(false);
  const [pilih, setPilih] = useState<IdAlasan | null>(null);
  const [detail, setDetail] = useState("");
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");
  const [selesai, setSelesai] = useState<string | null>(null);
  const kirimSungguhan = apiAktif && !contoh;
  const perluMasuk = kirimSungguhan && !pengguna;
  const alasan = ALASAN.find((a) => a.id === pilih);
  const siapKirim = alasan && (alasan.id !== "lain" || detail.trim().length >= 3);

  function mulai() {
    setPilih(null);
    setDetail("");
    setGalat("");
    setSelesai(null);
    setBuka(true);
  }

  async function kirim() {
    if (!alasan || !siapKirim) return;
    if (!kirimSungguhan) {
      setSelesai("Ini lowongan contoh, jadi laporan tidak dikirim. Di aplikasi yang tersambung, laporan masuk ke tim Lokerin.");
      return;
    }
    setProses(true);
    setGalat("");
    const isi = alasan.id === "lain" ? detail.trim() : [alasan.label, detail.trim()].filter(Boolean).join(": ");
    try {
      const hasil = await api<{ pesan: string }>(`/lowongan/${encodeURIComponent(lowonganId)}/laporkan`, { method: "POST", body: { alasan: isi.slice(0, 500) } });
      setSelesai(hasil.pesan);
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Laporan belum terkirim. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  const aksi = selesai ? (
    <button type="button" className="tombol tombol-garis min-h-14 text-lg" onClick={() => setBuka(false)}>Tutup</button>
  ) : perluMasuk ? (
    <Link href="/masuk" className="tombol tombol-utama min-h-14 text-lg">Masuk dulu</Link>
  ) : (
    <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={!siapKirim || proses} onClick={() => void kirim()}>{proses ? "Mengirim..." : "Kirim laporan"}</button>
  );

  return (
    <>
      <button type="button" onClick={mulai} aria-haspopup="dialog" className="mt-2 inline-flex min-h-14 items-center gap-1.5 text-sm font-semibold text-abu underline underline-offset-4"><IconFlag size={16} />Laporkan lowongan ini</button>
      <Laci
        buka={buka}
        onTutup={() => setBuka(false)}
        label="Laporkan"
        judul={selesai ? "Laporan diterima" : "Ada yang salah dengan lowongan ini?"}
        keterangan={selesai ? undefined : `${judul}. Tim Lokerin meninjau setiap laporan, dan namamu tidak ditunjukkan ke pemberi kerja.`}
        aksi={aksi}
      >
        {selesai ? (
          <p className="flex items-start gap-2 rounded-2xl bg-daun-muda p-4 text-[17px] text-daun"><IconCircleCheck size={22} className="mt-0.5 shrink-0" />{selesai}</p>
        ) : perluMasuk ? (
          <p className="rounded-2xl bg-kabut p-4 text-[17px] text-abu">Masuk dulu supaya laporanmu bisa ditinjau dan tidak dikirim berkali-kali oleh orang yang sama.</p>
        ) : (
          <div className="grid gap-2.5">
            <div className="grid gap-2.5" role="group" aria-label="Alasan melapor">
              {ALASAN.map((a) => (
                <button key={a.id} type="button" aria-pressed={pilih === a.id} className="alur-pilihan text-left" onClick={() => setPilih(a.id)}>
                  <span className="grid gap-0.5">
                    <span>{a.label}</span>
                    {"contoh" in a && <span className="text-sm font-normal text-abu">{a.contoh}</span>}
                  </span>
                  {pilih === a.id && <IconCheck size={22} className="shrink-0" />}
                </button>
              ))}
            </div>
            {pilih && (
              <label className="mt-2 grid gap-1.5 text-[15px] text-abu">
                {pilih === "lain" ? "Ceritakan singkat apa yang salah" : "Mau menambahkan sesuatu? (boleh dikosongkan)"}
                <textarea rows={3} maxLength={400} value={detail} onChange={(e) => setDetail(e.target.value)} className="input-mulai min-h-24 py-3 text-[17px] text-tinta" />
              </label>
            )}
            {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
          </div>
        )}
      </Laci>
    </>
  );
}
