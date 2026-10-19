import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { BarisLowongan } from "@/components/app/KartuLowonganApp";
import { PetaKota } from "@/components/kota/PetaKota";
import { PetaMapbox } from "@/components/kota/PetaMapbox";
import { LOWONGAN_TAYANG } from "@/lib/data";
import { RADIUS_PETA_KM, lowonganSekitar } from "@/lib/api/sumber";

export const metadata = { title: "Peta Kerja Sekitar" };

export default function Peta() {
  return (
    <Halaman>
    <div className="grid gap-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight">Peta Kerja <span className="text-jingga">Sekitar.</span></h1>
        <p className="mt-1 max-w-xl text-[15px] text-abu">Titik jingga sedang mencari orang. Ketuk titik atau geser kartu di bawah peta.</p>
      </div>
      <Suspense fallback={<div className="grid gap-4" role="status" aria-label="Memuat peta"><div className="h-80 animate-pulse rounded-3xl bg-kabut" /><div className="h-48 animate-pulse rounded-2xl bg-kabut" /></div>}>
        <IsiPeta />
      </Suspense>
    </div>
    </Halaman>
  );
}

async function IsiPeta() {
  const sekitar = await lowonganSekitar();
  if (sekitar.data) return <PetaMapbox awal={sekitar.data.lowongan} pusat={sekitar.data.pusat} radiusKm={RADIUS_PETA_KM} />;
  const dekat = LOWONGAN_TAYANG.toSorted((a, b) => a.jarakKm - b.jarakKm).slice(0, 6);
  return (
    <>
      <PetaKota />
      <section aria-labelledby="judul-terdekat">
        <h2 id="judul-terdekat" className="mb-3 text-lg">Paling dekat denganmu</h2>
        <ul className="grid gap-2">{dekat.map((l) => <li key={l.id}><BarisLowongan lowongan={l} /></li>)}</ul>
      </section>
    </>
  );
}
