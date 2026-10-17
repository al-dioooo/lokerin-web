import { connection } from "next/server";
import { PapanLed } from "../ui/PapanLed";
import { KartuLowongan } from "../ui/KartuLowongan";

// Request-time demo deadlines keep the examples useful after a static build.
// Parents provide a Suspense boundary for Next.js Cache Components.
async function demoDeadline(minutes: number) {
  await connection();
  return Date.now() + minutes * 60 * 1000;
}

export async function ContohPapanLed() {
  const until = await demoDeadline(272);
  return <PapanLed until={until} teks="BUTUH HARI INI · TUKANG CUCI PIRING · WARUNG BU WATI · RP120.000/HARI" />;
}

export async function ContohKartuMendesak() {
  const until = await demoDeadline(120);
  return <KartuLowongan kategori="dapur" judul="Tukang cuci piring" pemberiKerja="Warung Bu Wati" upah="Rp120.000/hari" lokasi="Purwokerto" jarak="1,2 km" jadwal="Hari ini · 16.00–22.00" verifikasi={{ ktp: true, fotoUsaha: true, tanggal: "18 Oktober 2026" }} mendesak={{ until }} />;
}

export function PapanLoading() {
  return <div className="led-board min-h-72 p-8" role="status"><p className="eyebrow text-kertas">Butuh hari ini</p><p className="led-text mt-5 text-5xl">--:--:--</p><p className="mt-4 text-kertas">Menyiapkan papan lowongan…</p></div>;
}
