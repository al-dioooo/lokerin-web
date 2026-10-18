import { DaftarCocok } from "@/components/app/DaftarCocok";
import { Halaman } from "@/components/app/Halaman";
import { TautanNgobrol } from "@/components/app/TautanNgobrol";
import { KartuMendesak } from "@/components/app/KartuLowonganApp";
import { IconMicrophone, IconSearch, IconShieldCheck } from "@/components/icons/tabler";
import { BUTUH_HARI_INI, LOWONGAN, PEKERJA } from "@/lib/data";

export const metadata = { title: "Beranda" };

export default function Beranda() {
  const ditahan = LOWONGAN.filter((l) => l.cekUpah === "curiga").length;
  return (
    <Halaman>
    <div className="grid gap-8">
      <section>
        <p className="text-sm text-abu">Halo,</p>
        <h1 className="text-[1.75rem] leading-tight">{PEKERJA.nama}. <span className="text-jingga">Mau kerja apa hari ini?</span></h1>
        <TautanNgobrol className="kolom-cari mt-4">
          <IconSearch size={20} className="text-abu" />
          <span className="flex-1 text-sm text-abu">Cari kerja, misalnya &ldquo;las pagar di Sokaraja&rdquo;</span>
          <span className="tombol tombol-utama min-h-9 px-3 text-sm"><IconMicrophone size={16} />Ngobrol</span>
        </TautanNgobrol>
      </section>

      <section aria-labelledby="judul-mendesak">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="judul-mendesak" className="text-lg">Butuh hari ini</h2>
            <p className="text-sm text-abu">Usaha di sekitarmu yang butuh orang sebelum malam.</p>
          </div>
          <span className="piksel shrink-0 text-[11px] uppercase text-jingga-tua">{BUTUH_HARI_INI.length} lowongan</span>
        </div>
        <ul className="rak-mendesak urut">{BUTUH_HARI_INI.map((l, i) => <li key={l.id} style={{ "--i": i } as React.CSSProperties}><KartuMendesak lowongan={l} /></li>)}</ul>
      </section>

      <DaftarCocok />

      <p className="flex items-start gap-2 rounded-2xl bg-daun-muda p-4 text-sm text-daun"><IconShieldCheck size={20} className="shrink-0" /><span>Semua lowongan di sini dari usaha yang sudah dicek. {ditahan} lowongan ditahan karena minta biaya di depan dan upahnya tidak masuk akal.</span></p>
    </div>
    </Halaman>
  );
}
