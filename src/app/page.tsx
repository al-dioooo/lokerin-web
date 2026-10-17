import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/Logo";
import { BangunanIcon, DapurIcon, LasIcon } from "@/components/icons/categories";
import { ContohPapanLed, PapanLoading } from "@/components/desain/ContohMendesak";
import { Mic } from "@/components/ui/Mic";

export default function Home() {
  return <>
    <div className="warung-stripe" />
    <header className="shell flex flex-wrap items-center justify-between gap-3 border-b-3 border-arang py-5">
      <Link href="/" aria-label="Lokerin, beranda" className="inline-flex min-h-12 items-center"><Logo /></Link>
      <p className="eyebrow hidden text-abu lg:block">Lowongan terverifikasi di dekatmu</p>
      <Link href="/desain" className="inline-flex min-h-12 items-center gap-2 text-sm font-extrabold underline decoration-2 underline-offset-4">Lihat desain <span aria-hidden="true">↗</span></Link>
    </header>
    <main id="utama" className="shell pb-12">
      <section className="grid items-center gap-10 py-10 md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-16 lg:gap-20">
        <div>
          <p className="eyebrow mb-6 inline-flex items-center gap-2 border-2 border-arang bg-kunyit px-3 py-2"><span aria-hidden="true">●</span> Banyumas & sekitarnya</p>
          <h1 className="text-[clamp(2.6rem,6.8vw,5.5rem)] leading-[1.06] tracking-tight">Cari kerja<br />cukup<br /><span className="text-cabai">ngobrol.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-abu">Lowongan warung, bengkel, dan UMKM jarang masuk portal kerja dan rawan penipuan.</p>
          <p className="mt-4 max-w-lg text-xl font-bold">Sebutkan keahlian dan lokasimu, lalu lowongan yang cocok muncul.</p>
          <div className="mt-8 hidden items-center gap-4 border-t-2 border-dashed border-kardus pt-5 md:flex" aria-hidden="true"><DapurIcon size={44} /><LasIcon size={44} /><BangunanIcon size={44} /><span className="text-sm font-bold text-abu">Satu profil untuk<br />beberapa keahlian.</span></div>
        </div>
        <div className="px-2 pt-4">
          <div className="paper taped -rotate-1 px-6 py-8 text-center sm:px-10">
            <p className="eyebrow mb-4 text-cabai">Papan pengumuman</p>
            <h2 className="text-3xl leading-tight lg:text-4xl">Kerja dekat<br />rumah.</h2>
            <p className="mb-8 mt-3 text-base text-abu">Ceritakan apa yang kamu bisa.</p>
            <div className="py-4"><Mic /></div>
            <p className="mt-5 border-t-2 border-dashed border-kardus pt-4 text-sm font-bold">Untuk tukang, pengemudi, penjaga toko,<br className="hidden sm:block" /> dan semua yang mau bekerja.</p>
          </div>
        </div>
      </section>
      <section aria-labelledby="urgent-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><h2 id="urgent-title" className="text-2xl">Butuh hari ini</h2><p className="text-sm text-abu">Contoh lowongan · Bukan iklan aktif</p></div>
        <Suspense fallback={<PapanLoading />}><ContohPapanLed /></Suspense>
      </section>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-3 border-arang pt-6"><p className="max-w-lg text-base text-abu">Lokerin masih dibangun. Halaman sistem desain berisi warna, huruf, ikon, dan komponen yang dipakai aplikasi.</p><Link href="/desain" className="tombol bg-kertas-terang">Lihat sistem desain <span aria-hidden="true">↗</span></Link></div>
    </main>
    <footer className="shell flex flex-wrap justify-between gap-2 border-t border-kardus py-6 text-xs font-bold uppercase tracking-wider text-abu"><span>Lokerin © 2026</span><span>Banyumas, Jawa Tengah</span></footer>
  </>;
}
