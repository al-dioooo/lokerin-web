import { Suspense } from "react";
import { DaftarCocok } from "@/components/app/DaftarCocok";
import { Halaman } from "@/components/app/Halaman";
import { TautanNgobrol } from "@/components/app/TautanNgobrol";
import { RakMendesak } from "@/components/app/RakMendesak";
import { IconMicrophone, IconSearch, IconShieldCheck } from "@/components/icons/tabler";
import { BerandaSesuaiPeran } from "@/components/app/BerandaSesuaiPeran";
import { SapaNama } from "@/components/app/SapaNama";
import { daftarLowongan, jumlahDitahan, lowonganMendesak } from "@/lib/api/sumber";

export const metadata = { title: "Beranda" };

export default function Beranda() {
  return (
    <Halaman>
      <BerandaSesuaiPeran>
        <Suspense fallback={<div className="grid gap-4" role="status" aria-label="Memuat lowongan"><div className="h-24 animate-pulse rounded-2xl bg-kabut" /><div className="h-48 animate-pulse rounded-2xl bg-kabut" /><div className="h-64 animate-pulse rounded-2xl bg-kabut" /></div>}>
          <IsiBeranda />
        </Suspense>
      </BerandaSesuaiPeran>
    </Halaman>
  );
}

async function IsiBeranda() {
  const [mendesak, semua, ditahan] = await Promise.all([lowonganMendesak(), daftarLowongan(), jumlahDitahan()]);
  return (
    <div className="grid gap-8">
      <section>
        <p className="text-sm text-abu">Halo,</p>
        <h1 className="text-[1.75rem] leading-tight"><SapaNama />. <span className="text-jingga">Mau kerja apa hari ini?</span></h1>
        <TautanNgobrol className="kolom-cari mt-4">
          <IconSearch size={20} className="text-abu" />
          <span className="flex-1 text-sm text-abu">Cari kerja, misalnya &ldquo;las pagar di Sokaraja&rdquo;</span>
          <span className="tombol tombol-utama min-h-9 px-3 text-sm"><IconMicrophone size={16} />Ngobrol</span>
        </TautanNgobrol>
      </section>

      <RakMendesak awal={mendesak.data} />

      <DaftarCocok awal={semua.data} />

      <p className="flex items-start gap-2 rounded-2xl bg-daun-muda p-4 text-sm text-daun"><IconShieldCheck size={20} className="shrink-0" /><span>{semua.dariServer ? "Lowongan yang minta biaya di depan tidak pernah tayang di sini. Lencana Terverifikasi menunjukkan apa saja yang sudah dicek." : `Semua lowongan di sini dari usaha yang sudah dicek. ${ditahan} lowongan ditahan karena minta biaya di depan dan upahnya tidak masuk akal.`}</span></p>
    </div>
  );
}
