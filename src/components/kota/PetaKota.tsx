"use client";

import { useEffect, useRef, useState } from "react";
import { getKategori, type KategoriSlug } from "../icons/categories";
import { ClockIcon, CoinIcon, LocationIcon } from "../icons/interface";
import { AksiContoh } from "../ui/AksiContoh";
import { Bacakan } from "../ui/Bacakan";
import { CekUpah, type StatusUpah } from "../ui/CekUpah";
import { HitungMundur } from "../ui/HitungMundur";
import { LencanaTerverifikasi, type VerifikasiProps } from "../ui/LencanaTerverifikasi";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "./KotaIsometrik";

type Lowongan = {
  id: keyof typeof LOKASI_KERJA;
  kategori: KategoriSlug;
  judul: string;
  usaha: string;
  upah: string;
  lokasi: string;
  jadwal: string;
  cek: StatusUpah;
  verifikasi: VerifikasiProps;
  mendesak?: boolean;
};

const LOWONGAN: Lowongan[] = [
  { id: "warung", kategori: "dapur", judul: "Tukang cuci piring", usaha: "Warung Bu Wati", upah: "Rp120.000/hari", lokasi: "Purwokerto · 1,2 km", jadwal: "Hari ini · 16.00–22.00", cek: "wajar", verifikasi: { ktp: true, fotoUsaha: true, tanggal: "18 Oktober 2026" }, mendesak: true },
  { id: "bengkel", kategori: "las", judul: "Bantu las pagar", usaha: "Bengkel Las Pak Jaya", upah: "Rp150.000/hari", lokasi: "Sokaraja · 3,5 km", jadwal: "Senin–Sabtu · 08.00–16.00", cek: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026" } },
  { id: "laundry", kategori: "laundry", judul: "Setrika dan lipat", usaha: "Laundry Mbak Rini", upah: "Rp1.600.000/bulan", lokasi: "Purwokerto · 2 km", jadwal: "Senin–Sabtu · 09.00–17.00", cek: "rendah", verifikasi: { ktp: true, fotoUsaha: true, tanggal: "16 Oktober 2026" } },
  { id: "bangunan", kategori: "angkut", judul: "Angkut bata dan semen", usaha: "Toko Bangunan Pak Slamet", upah: "Rp130.000/hari", lokasi: "Sokaraja · 4 km", jadwal: "Sabtu–Minggu · 07.00–15.00", cek: "wajar", verifikasi: { ktp: true, npwp: true, tanggal: "15 Oktober 2026" } },
];

function bacaan(l: Lowongan) {
  return `${l.mendesak ? "Butuh hari ini. " : ""}${l.judul} di ${l.usaha}. Upah ${l.upah.replace("/", " per ")}. Lokasi ${l.lokasi.replace("·", ",")}. Jadwal ${l.jadwal.replace("·", ",")}.`;
}

function KartuPilihan({ lowongan, sampai }: { lowongan: Lowongan; sampai: number }) {
  const { Icon } = getKategori(lowongan.kategori);
  return (
    <article className="kartu-peta" aria-live="polite">
      {lowongan.mendesak && <HitungMundur until={sampai} className="mb-3" />}
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-kabut"><Icon size={30} /></span>
        <div className="min-w-0">
          <h3 className="text-lg leading-tight">{lowongan.judul}</h3>
          <p className="text-sm text-abu">{lowongan.usaha}</p>
        </div>
      </div>
      <ul className="mt-3 grid gap-1.5 text-sm">
        <li className="flex items-center gap-2"><CoinIcon size={16} /><span className="font-bold tabular-nums">{lowongan.upah}</span></li>
        <li className="flex items-center gap-2"><LocationIcon size={16} />{lowongan.lokasi}</li>
        <li className="flex items-center gap-2"><ClockIcon size={16} />{lowongan.jadwal}</li>
      </ul>
      <div className="mt-3 flex flex-wrap items-start gap-2"><LencanaTerverifikasi {...lowongan.verifikasi} /><CekUpah status={lowongan.cek} /></div>
      <div className="mt-4 flex items-center gap-2">
        <AksiContoh aksi="lamar" className="flex-1">Saya bisa</AksiContoh>
        <Bacakan teks={bacaan(lowongan)} label={`Bacakan lowongan ${lowongan.judul}`} ringkas />
      </div>
    </article>
  );
}

export function PetaKota() {
  const [pilih, setPilih] = useState<Lowongan["id"]>("warung");
  const [sampai] = useState(() => (typeof window === "undefined" ? 0 : Date.now() + (4 * 3600 + 31 * 60 + 51) * 1000));
  const aktif = LOWONGAN.find((l) => l.id === pilih) ?? LOWONGAN[0];
  const gulir = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gulir.current;
    if (el && el.scrollWidth > el.clientWidth) el.scrollLeft = (LOKASI_KERJA.warung.kiri / 100) * el.scrollWidth - el.clientWidth / 2;
  }, []);
  return (
    <div className="bingkai-peta">
      <div className="bingkai-kepala">
        <span className="flex gap-1.5" aria-hidden="true"><i /><i /><i /></span>
        <span className="font-mono text-xs text-abu">lokerin.id/peta · Purwokerto</span>
        <span className="hidden text-xs font-bold text-daun sm:inline">● 4 lowongan terverifikasi</span>
      </div>
      <div className="bingkai-isi">
        <div className="panggung-gulir" ref={gulir} tabIndex={0} aria-label="Peta, geser ke samping untuk melihat semua tempat">
        <div className="panggung-kota" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
          <KotaIsometrik className="absolute inset-0 h-full w-full" />
          {LOWONGAN.map((l) => {
            const { kiri, atas } = LOKASI_KERJA[l.id];
            const dipilih = l.id === pilih;
            return (
              <button key={l.id} type="button" className="pin-kota" data-aktif={dipilih} data-mendesak={l.mendesak ? true : undefined} style={{ left: `${kiri}%`, top: `${atas}%` }} onClick={() => setPilih(l.id)} aria-pressed={dipilih} aria-label={`${l.judul}, ${l.usaha}${l.mendesak ? ", butuh hari ini" : ""}`}>
                <span className="pin-label">{l.mendesak ? "Butuh hari ini" : getKategori(l.kategori).label}</span>
                <span className="pin-kaki" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        </div>
        <div className="panel-peta">
          <p className="piksel mb-2 text-[11px] uppercase text-jingga-tua">Ketuk tempat yang jingga</p>
          <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Lowongan di peta ini">
            {LOWONGAN.map((l) => <button key={l.id} type="button" className="chip-peta" aria-pressed={l.id === pilih} onClick={() => setPilih(l.id)}>{l.usaha}</button>)}
          </div>
          <KartuPilihan key={aktif.id} lowongan={aktif} sampai={sampai} />
        </div>
      </div>
    </div>
  );
}
