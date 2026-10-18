import { connection } from "next/server";
import { HitungMundur } from "../ui/HitungMundur";
import { KartuLowongan } from "../ui/KartuLowongan";

async function demoDeadline(minutes: number) {
  await connection();
  return Date.now() + minutes * 60 * 1000;
}

export async function ContohHitungMundur() {
  return <HitungMundur until={await demoDeadline(272)} />;
}

export async function ContohKartuMendesak() {
  return <KartuLowongan kategori="dapur" judul="Tukang cuci piring" pemberiKerja="Warung Bu Wati" upah="Rp120.000/hari" lokasi="Purwokerto" jarak="1,2 km" jadwal="Hari ini · 16.00–22.00" verifikasi={{ ktp: true, npwp: true, fotoUsaha: true, tanggal: "18 Oktober 2026" }} mendesak={{ until: await demoDeadline(272) }} />;
}

export function KartuLoading() {
  return <div className="card min-h-96 p-5" role="status"><span className="urgent-tag">BUTUH HARI INI</span><p className="mt-5 text-abu">Menyiapkan contoh lowongan…</p></div>;
}
