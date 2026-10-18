import type { CSSProperties } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { IconArrowRight, IconKey, IconPhoneOff, IconTrash } from "@/components/icons/tabler";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "@/components/kota/KotaIsometrik";
import { TombolGoogle } from "@/components/masuk/TombolGoogle";
import { PilihAkunContoh } from "@/components/masuk/PilihAkunContoh";
import { AUTH_DEMO } from "@/lib/auth";

export const metadata = { title: "Masuk · Lokerin" };

const PIN: { di: keyof typeof LOKASI_KERJA; teks: string; mendesak?: boolean }[] = [
  { di: "warung", teks: "Butuh hari ini · cuci piring", mendesak: true },
  { di: "bengkel", teks: "Tukang las · Rp150.000/hari" },
  { di: "laundry", teks: "Setrika · Purwokerto" },
  { di: "bangunan", teks: "Sopir pikap · Sokaraja" },
];

const JANJI = [
  { Icon: IconKey, teks: "Tanpa kata sandi baru" },
  { Icon: IconPhoneOff, teks: "Nomor HP tidak diminta" },
  { Icon: IconTrash, teks: "Akun bisa dihapus kapan saja" },
];

export default function Masuk() {
  return (
    <div className="masuk-layar">
      <section className="masuk-kota" aria-hidden="true">
        <div className="masuk-kota-teks">
          <p className="pil-piksel"><span className="titik-hidup" />Banyumas, hari ini</p>
          <p className="mt-4 max-w-md text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] font-extrabold leading-tight tracking-tight">Empat tempat di dekatmu <span className="text-jingga">sedang cari orang.</span></p>
        </div>
        <div className="masuk-kota-peta">
          <div className="relative w-full" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
            <KotaIsometrik className="absolute inset-0 h-full w-full" judul="" />
            {PIN.map(({ di, teks, mendesak }, i) => {
              const { kiri, atas } = LOKASI_KERJA[di];
              return <span key={di} className="pin-siang" data-mendesak={mendesak || undefined} style={{ left: `${kiri}%`, top: `${atas}%`, "--i": i } as CSSProperties}>{teks}</span>;
            })}
          </div>
        </div>
      </section>

      <main id="utama" className="masuk-kartu">
        <Link href="/" aria-label="Lokerin, halaman utama" className="inline-flex"><Logo size={30} /></Link>
        <h1 className="mt-8 text-[1.9rem] leading-tight">Masuk ke Lokerin</h1>
        <p className="mt-2 text-[15px] text-abu">Satu akun untuk cari kerja di sekitar rumah, atau cari orang untuk usahamu.</p>
        <div className="mt-7"><TombolGoogle /></div>
        <PilihAkunContoh />
        <ul className="mt-7 grid gap-3 border-t border-dashed border-garis pt-6 text-sm">
          {JANJI.map(({ Icon, teks }) => <li key={teks} className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-jingga-muda text-jingga-tua"><Icon size={16} /></span>{teks}</li>)}
        </ul>
        <Link href="/app" className="mt-8 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-abu underline-offset-4 hover:text-tinta hover:underline">Lihat aplikasinya dulu tanpa masuk <IconArrowRight size={16} /></Link>
        {AUTH_DEMO && <p className="mt-auto pt-8 text-xs text-abu">Versi demo: tombol di atas memakai akun contoh dan belum tersambung ke Google.</p>}
      </main>
    </div>
  );
}
