import Link from "next/link";
import { Suspense } from "react";
import { KartuSatu } from "@/components/app/KartuPersona";
import { API_URL, apiAktif } from "@/lib/api/klien";
import { PEKERJA } from "@/lib/data";

export const metadata = { title: "Kartu Kerja · Lokerin" };

type KartuApi = { id: string; nama: string; kota: string; judul: string; ringkasan: string; keahlian: string[] };

async function ambil(id: string): Promise<{ nama: string; kota: string; kartu: { id: string; judul: string; ringkasan: string; keahlian: string[] } } | null> {
  const contoh = Object.entries(PEKERJA.persona).find(([k]) => `darto-${k}` === id);
  if (contoh) return { nama: PEKERJA.nama, kota: PEKERJA.kota, kartu: { id, judul: contoh[1].judul, ringkasan: contoh[1].ringkas, keahlian: [...contoh[1].keahlian] } };
  if (!apiAktif) return null;
  try {
    const res = await fetch(`${API_URL}/kartu-kerja/${encodeURIComponent(id)}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const k = (await res.json()) as KartuApi;
    return { nama: k.nama, kota: k.kota, kartu: { id: k.id, judul: k.judul, ringkasan: k.ringkasan, keahlian: k.keahlian } };
  } catch {
    return null;
  }
}

async function Isi({ params }: Pick<PageProps<"/kartu/[id]">, "params">) {
  const data = await ambil((await params).id);
  if (!data) return <p className="text-center text-abu">Kartu Kerja ini tidak ditemukan.</p>;
  return <KartuSatu nama={data.nama} kota={data.kota} kartu={data.kartu} />;
}

export default function KartuPublik({ params }: PageProps<"/kartu/[id]">) {
  return (
    <main id="utama" className="grid min-h-dvh place-items-center gap-6 bg-kertas px-4 py-10">
      <Suspense fallback={<div className="kartu-persona animate-pulse" />}><Isi params={params} /></Suspense>
      <Link href="/masuk" className="tombol tombol-garis">Buat Kartu Kerja-mu di Lokerin</Link>
    </main>
  );
}
