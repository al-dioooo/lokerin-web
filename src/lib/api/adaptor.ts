// Turns backend Lowongan into the `Lowongan` shape the existing components already render.

import type { KategoriSlug } from "@/components/icons/categories";
import type { StatusUpah } from "@/components/ui/CekUpah";
import type { JenisUpah, Lowongan } from "@/lib/data";
import type { LowonganApi } from "./tipe";

const PUSAT_PURWOKERTO = { lat: -7.4246, lng: 109.2343 };

const KATEGORI_BACKEND: Record<string, KategoriSlug> = {
  kuliner: "dapur",
  toko_ritel: "toko",
  bengkel: "bengkel",
  konstruksi: "bangunan",
  kebersihan: "bersih",
  rumah_tangga: "bersih",
  pengantaran: "kurir",
  pertanian: "kebun",
  produksi: "angkut",
  perawatan: "asuh",
  admin: "magang",
  teknologi: "magang",
  desain: "magang",
  pemasaran: "magang",
};

export function kategoriDari(api: Pick<LowonganApi, "kategori" | "judul" | "segmen">): KategoriSlug {
  const judul = api.judul.toLowerCase();
  if (api.segmen === "magang") return "magang";
  if (/\blas\b|welder|teralis|kanopi/.test(judul)) return "las";
  if (/ojek|driver|sopir|supir/.test(judul)) return "ojek";
  if (/kurir|antar|galon/.test(judul)) return "kurir";
  if (/jahit|konveksi/.test(judul)) return "jahit";
  if (/laundry|setrika|cuci baju/.test(judul)) return "laundry";
  if (/anak|lansia|pengasuh|baby/.test(judul)) return "asuh";
  if (/acara|tenda|hajatan/.test(judul)) return "acara";
  if (/bongkar|angkut|gudang/.test(judul)) return "angkut";
  return KATEGORI_BACKEND[api.kategori] ?? "toko";
}

export function jarakKm(lat: number | null, lng: number | null, dari = PUSAT_PURWOKERTO) {
  if (lat == null || lng == null) return 0;
  const rad = (d: number) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat - dari.lat) / 2) ** 2 +
    Math.cos(rad(dari.lat)) * Math.cos(rad(lat)) * Math.sin(rad(lng - dari.lng) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)) * 10) / 10;
}

export function statusUpah(api: Pick<LowonganApi, "pemeriksaan">): StatusUpah {
  const kode = api.pemeriksaan?.masalah.map((m) => m.kode) ?? [];
  if (kode.includes("minta_biaya") || kode.includes("upah_tidak_wajar")) return "curiga";
  if (kode.includes("upah_rendah")) return "rendah";
  return "wajar";
}

function hari(n: number | null) {
  if (!n) return "";
  if (n >= 7) return "Setiap hari";
  if (n === 6) return "Senin–Sabtu";
  if (n === 5) return "Senin–Jumat";
  return `${n} hari seminggu`;
}

export function waktuLalu(iso: string | null, sekarang = Date.now()) {
  if (!iso) return "Baru saja";
  const menit = Math.max(0, Math.round((sekarang - new Date(iso).getTime()) / 60_000));
  if (menit < 1) return "Baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hariLalu = Math.round(jam / 24);
  return hariLalu === 1 ? "Kemarin" : `${hariLalu} hari lalu`;
}

export function tanggalPanjang(iso: string | null) {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}

/** A start date (YYYY-MM-DD) as people say it, by the Jakarta calendar: "Hari ini", "Besok", "20 Okt". */
export function tanggalMulai(tanggal: string | null, sekarang = Date.now()) {
  const cocok = tanggal ? /^(\d{4})-(\d{2})-(\d{2})/.exec(tanggal) : null;
  if (!cocok) return tanggal;
  const hari = Date.UTC(Number(cocok[1]), Number(cocok[2]) - 1, Number(cocok[3]));
  const [t, b, h] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(sekarang).split("-").map(Number);
  const selisih = Math.round((hari - Date.UTC(t!, b! - 1, h!)) / 86_400_000);
  if (selisih === 0) return "Hari ini";
  if (selisih === 1) return "Besok";
  const tahunLain = Number(cocok[1]) !== t;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", ...(tahunLain ? { year: "numeric" } : {}), timeZone: "UTC" }).format(hari);
}

export function keLowongan(api: LowonganApi, sekarang = Date.now()): Lowongan {
  const jenis = api.upah.jenis ?? "harian";
  const jenisUpah: JenisUpah = jenis === "per_jam" ? "harian" : jenis;
  const upah = jenis === "per_jam" ? (api.upah.min ?? 0) * (api.jam_per_hari ?? 8) : (api.upah.min ?? 0);
  const mendesakMenit = api.butuh_hari_ini
    ? Math.max(1, Math.round((new Date(api.butuh_hari_ini).getTime() - sekarang) / 60_000))
    : undefined;
  const jam = api.jam_kerja ?? "";
  const pk = api.pemberi_kerja;
  return {
    id: api.id,
    segmen: api.segmen,
    kategori: kategoriDari(api),
    judul: api.judul,
    usaha: pk.nama_usaha,
    pemilik: pk.jenis === "rumah_tangga" ? "Rumah tangga" : pk.jenis === "perusahaan" ? "Perusahaan" : "UMKM",
    upah,
    jenisUpah,
    area: api.lokasi.kecamatan ?? api.lokasi.kota ?? "Banyumas",
    jarakKm: api.jarak_km ?? jarakKm(api.lokasi.lat, api.lokasi.lng),
    jadwal: mendesakMenit ? `Hari ini, ${jam}` : [hari(api.hari_per_minggu), jam].filter(Boolean).join(", ") || "Jadwal menyusul",
    deskripsi: api.deskripsi,
    syarat: api.syarat,
    cekUpah: statusUpah(api),
    // Ticked documents only count once Lokerin has actually verified the business.
    verifikasi: {
      ktp: pk.terverifikasi && pk.yang_dicek.includes("KTP"),
      npwp: pk.terverifikasi && pk.yang_dicek.includes("NPWP"),
      fotoUsaha: pk.terverifikasi && pk.yang_dicek.includes("Foto usaha"),
      tanggal: tanggalPanjang(pk.diverifikasi_pada),
    },
    wa: "",
    mendesakMenit,
    titik: api.lokasi.lat != null && api.lokasi.lng != null ? { lat: api.lokasi.lat, lng: api.lokasi.lng } : undefined,
    dipasang: waktuLalu(api.diterbitkan_pada, sekarang),
  };
}
