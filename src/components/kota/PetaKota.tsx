"use client";

import { useEffect, useRef, useState } from "react";
import { TautanArah } from "../app/TautanArah";
import { getKategori, type KategoriSlug } from "../icons/categories";
import { ClockIcon, CoinIcon, LocationIcon } from "../icons/interface";
import { AksiContoh } from "../ui/AksiContoh";
import { Bacakan } from "../ui/Bacakan";
import { CekUpah, type StatusUpah } from "../ui/CekUpah";
import { HitungMundur } from "../ui/HitungMundur";
import { LencanaTerverifikasi, type VerifikasiProps } from "../ui/LencanaTerverifikasi";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "./KotaIsometrik";
import { upahTeks, type Lowongan as LowonganData } from "@/lib/data";

type Lowongan = {
  id: string;
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

/** A place on the drawing: left and top as percentages of the town. */
type Pin = Lowongan & { kiri: number; atas: number; menit?: number; href?: string };

const LOWONGAN: Lowongan[] = [
  { id: "warung", kategori: "dapur", judul: "Tukang cuci piring", usaha: "Warung Bu Wati", upah: "Rp120.000/hari", lokasi: "Purwokerto · 1,2 km", jadwal: "Hari ini · 16.00–22.00", cek: "wajar", verifikasi: { ktp: true, fotoUsaha: true, tanggal: "18 Oktober 2026" }, mendesak: true },
  { id: "bengkel", kategori: "las", judul: "Bantu las pagar", usaha: "Bengkel Las Pak Jaya", upah: "Rp150.000/hari", lokasi: "Sokaraja · 3,5 km", jadwal: "Senin–Sabtu · 08.00–16.00", cek: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026" } },
  { id: "laundry", kategori: "laundry", judul: "Setrika dan lipat", usaha: "Laundry Mbak Rini", upah: "Rp1.600.000/bulan", lokasi: "Purwokerto · 2 km", jadwal: "Senin–Sabtu · 09.00–17.00", cek: "rendah", verifikasi: { ktp: true, fotoUsaha: true, tanggal: "16 Oktober 2026" } },
  { id: "bangunan", kategori: "angkut", judul: "Angkut bata dan semen", usaha: "Toko Bangunan Pak Slamet", upah: "Rp130.000/hari", lokasi: "Sokaraja · 4 km", jadwal: "Sabtu–Minggu · 07.00–15.00", cek: "wajar", verifikasi: { ktp: true, npwp: true, tanggal: "15 Oktober 2026" } },
];

const CONTOH: Pin[] = LOWONGAN.map((l) => ({ ...l, ...LOKASI_KERJA[l.id as keyof typeof LOKASI_KERJA] }));
const MAKS_PIN = 10;

/**
 * Places real jobs on the drawing by their distance east and north of the centre, scaled so the
 * farthest one still sits inside the town. A pin that would cover another moves to a free spot
 * nearby; when none is free it stays off the map and only shows in the list. New and urgent jobs
 * get their pins first.
 */
function tataPin(lowongan: LowonganData[], pusat: { lat: number; lng: number }, baru?: ReadonlySet<string>): Pin[] {
  const kmLng = 111.32 * Math.cos((pusat.lat * Math.PI) / 180);
  const utama = (l: LowonganData) => (baru?.has(l.id) ? 2 : 0) + (l.mendesakMenit ? 1 : 0);
  const titik = lowongan
    .filter((l) => l.titik)
    .toSorted((a, b) => utama(b) - utama(a) || a.jarakKm - b.jarakKm)
    .slice(0, MAKS_PIN * 2)
    .map((l) => ({ l, timur: (l.titik!.lng - pusat.lng) * kmLng, utara: (l.titik!.lat - pusat.lat) * 110.57 }));
  const jangkau = Math.max(1, ...titik.map((t) => Math.hypot(t.timur, t.utara)));
  const geser = [[0, 0], [0, 11], [13, 0], [-13, 0], [0, -11], [13, 11], [-13, 11], [13, -11], [-13, -11], [0, 22], [26, 0], [-26, 0]];
  const terpasang: Pin[] = [];
  for (const { l, timur, utara } of titik) {
    if (terpasang.length >= MAKS_PIN) break;
    const asalKiri = 50 + (timur / jangkau) * 38;
    const asalAtas = 56 - (utara / jangkau) * 30;
    const tempat = geser
      .map(([x, y]) => ({ kiri: Math.min(92, Math.max(8, asalKiri + x!)), atas: Math.min(90, Math.max(22, asalAtas + y!)) }))
      .find((c) => terpasang.every((p) => Math.abs(p.kiri - c.kiri) >= 12 || Math.abs(p.atas - c.atas) >= 10));
    if (!tempat) continue;
    terpasang.push({
      id: l.id,
      kategori: l.kategori,
      judul: l.judul,
      usaha: l.usaha,
      upah: upahTeks(l),
      lokasi: `${l.area} · ${String(l.jarakKm).replace(".", ",")} km`,
      jadwal: l.jadwal,
      cek: l.cekUpah,
      verifikasi: l.verifikasi,
      mendesak: Boolean(l.mendesakMenit),
      menit: l.mendesakMenit,
      href: `/app/lowongan/${l.id}`,
      ...tempat,
    });
  }
  return terpasang;
}

function bacaan(l: Lowongan) {
  return `${l.mendesak ? "Butuh hari ini. " : ""}${l.judul} di ${l.usaha}. Upah ${l.upah.replace("/", " per ")}. Lokasi ${l.lokasi.replace("·", ",")}. Jadwal ${l.jadwal.replace("·", ",")}.`;
}

function KartuPilihan({ lowongan, sampai }: { lowongan: Pin; sampai: number }) {
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
        {lowongan.href ? (
          <TautanArah arah="maju" href={lowongan.href} className="tombol tombol-utama flex-1">Lihat dan lamar</TautanArah>
        ) : (
          <AksiContoh aksi="lamar" className="flex-1">Saya bisa</AksiContoh>
        )}
        <Bacakan teks={bacaan(lowongan)} label={`Bacakan lowongan ${lowongan.judul}`} ringkas />
      </div>
    </article>
  );
}

type PropsPeta = {
  /** Real jobs to place on the town. Without them the four sample places show, as on the landing page. */
  lowongan?: LowonganData[];
  pusat?: { lat: number; lng: number };
  /** Jobs that arrived over the live feed since the page opened; their pins drop in. */
  baru?: ReadonlySet<string>;
};

export function PetaKota({ lowongan, pusat = { lat: -7.4246, lng: 109.2343 }, baru }: PropsPeta = {}) {
  const langsung = lowongan !== undefined;
  const pins = langsung ? tataPin(lowongan, pusat, baru) : CONTOH;
  const [pilih, setPilih] = useState<string>(pins[0]?.id ?? "warung");
  const [mulai] = useState(() => (typeof window === "undefined" ? 0 : Date.now()));
  const aktif = pins.find((l) => l.id === pilih) ?? pins[0];
  const sampai = aktif?.menit ? mulai + aktif.menit * 60_000 : mulai + (4 * 3600 + 31 * 60 + 51) * 1000;
  const gulir = useRef<HTMLDivElement>(null);
  const terbaru = [...(baru ?? [])].reverse().map((id) => pins.find((p) => p.id === id)).find(Boolean);
  const fokus = terbaru ?? pins.find((p) => p.mendesak) ?? pins[0];
  const kiriFokus = fokus?.kiri;
  // On a phone the town is wider than the screen: start on the urgent place, and slide to a new pin.
  useEffect(() => {
    const el = gulir.current;
    if (el && kiriFokus !== undefined && el.scrollWidth > el.clientWidth) el.scrollTo({ left: (kiriFokus / 100) * el.scrollWidth - el.clientWidth / 2, behavior: terbaru ? "smooth" : "auto" });
  }, [kiriFokus, terbaru]);
  return (
    <div className="bingkai-peta">
      <div className="bingkai-kepala">
        <span className="flex gap-1.5" aria-hidden="true"><i /><i /><i /></span>
        <span className="font-mono text-xs text-abu">lokerin.id/peta · Purwokerto</span>
        <span className="hidden text-xs font-bold text-daun sm:inline">● {langsung ? `${lowongan.length} lowongan di sekitar` : "4 lowongan terverifikasi"}</span>
      </div>
      <div className="bingkai-isi">
        <div className="panggung-gulir" ref={gulir} tabIndex={0} aria-label="Peta, geser ke samping untuk melihat semua tempat">
        <div className="panggung-kota" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
          <KotaIsometrik className="absolute inset-0 h-full w-full" />
          {pins.map((l) => {
            const dipilih = l.id === pilih;
            const pinBaru = baru?.has(l.id);
            return (
              <button key={l.id} type="button" className="pin-kota" data-aktif={dipilih} data-mendesak={l.mendesak ? true : undefined} data-baru={pinBaru || undefined} style={{ left: `${l.kiri}%`, top: `${l.atas}%` }} onClick={() => setPilih(l.id)} aria-pressed={dipilih} aria-label={`${l.judul}, ${l.usaha}${l.mendesak ? ", butuh hari ini" : ""}${pinBaru ? ", baru dipasang" : ""}`}>
                <span className="pin-label">{pinBaru ? "Baru" : l.mendesak ? "Butuh hari ini" : getKategori(l.kategori).label}</span>
                <span className="pin-kaki" aria-hidden="true" />
              </button>
            );
          })}
        </div>
        </div>
        <div className="panel-peta min-w-0">
          <p className="piksel mb-2 text-[11px] uppercase text-jingga-tua">Ketuk tempat yang jingga</p>
          <div className={langsung ? "saringan-baris mb-3" : "mb-3 flex flex-wrap gap-1.5"} role="group" aria-label="Lowongan di peta ini">
            {pins.map((l) => <button key={l.id} type="button" className="chip-peta shrink-0" aria-pressed={l.id === pilih} onClick={() => setPilih(l.id)}>{l.usaha}</button>)}
          </div>
          {aktif ? <KartuPilihan key={aktif.id} lowongan={aktif} sampai={sampai} /> : <p className="kartu-peta text-sm text-abu">Belum ada lowongan di sekitar sini. Pin baru muncul begitu ada usaha yang memasang lowongan.</p>}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{terbaru ? `Lowongan baru di peta: ${terbaru.judul}, ${terbaru.usaha}.` : ""}</p>
    </div>
  );
}
