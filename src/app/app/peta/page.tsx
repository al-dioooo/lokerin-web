import { BarisLowongan } from "@/components/app/KartuLowonganApp";
import { PetaKota } from "@/components/kota/PetaKota";
import { LOWONGAN_TAYANG } from "@/lib/data";

export const metadata = { title: "Peta Kerja Sekitar" };

export default function Peta() {
  const dekat = LOWONGAN_TAYANG.toSorted((a, b) => a.jarakKm - b.jarakKm).slice(0, 6);
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight">Peta Kerja <span className="text-jingga">Sekitar.</span></h1>
        <p className="mt-1 max-w-xl text-sm text-abu">Tempat yang jingga sedang mencari orang. Ketuk untuk melihat lowongannya. Pin baru muncul begitu ada usaha yang memasang lowongan.</p>
      </div>
      <PetaKota />
      <section aria-labelledby="judul-terdekat">
        <h2 id="judul-terdekat" className="mb-3 text-lg">Paling dekat denganmu</h2>
        <ul className="grid gap-2">{dekat.map((l) => <li key={l.id}><BarisLowongan lowongan={l} /></li>)}</ul>
      </section>
    </div>
  );
}
