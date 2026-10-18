import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MicIcon } from "@/components/icons/interface";
import { KotaHero } from "@/components/landing/KotaHero";
import { AksiContoh } from "@/components/ui/AksiContoh";
import { UbinKategori } from "@/components/ui/UbinKategori";

export default function Home() {
  return <>
    <header className="shell relative z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 lg:py-7">
      <Link href="/" aria-label="Lokerin, beranda" className="inline-flex min-h-12 items-center"><Logo /></Link>
      <nav aria-label="Navigasi utama" className="order-3 flex w-full justify-between gap-4 text-sm sm:order-0 sm:w-auto sm:gap-7 sm:text-base lg:mr-auto lg:ml-12 lg:gap-10"><a className="inline-flex min-h-12 items-center hover:text-jingga-tua" href="#lowongan">Cari kerja</a><a className="inline-flex min-h-12 items-center hover:text-jingga-tua" href="#pasang-lowongan">Pasang lowongan</a><a className="inline-flex min-h-12 items-center hover:text-jingga-tua" href="#cara-kerja">Cara kerja</a></nav>
      <AksiContoh className="px-4 sm:px-7">Mulai ngobrol</AksiContoh>
    </header>
    <main id="utama">
      <div className="shell">
        <section className="hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">Untuk pekerja dan UMKM Banyumas</p><h1 id="hero-title" className="hero-title">Cari kerja<span>cukup ngobrol.</span></h1><p className="hero-description">Lowongan warung, bengkel, dan UMKM terverifikasi di dekatmu. Ceritakan pengalamanmu, CV-mu tersusun dari obrolan.</p><div className="mt-8 flex flex-wrap gap-3 lg:mt-9"><AksiContoh size="besar"><MicIcon size={27} />Mulai ngobrol</AksiContoh><a href="#pasang-lowongan" className="tombol tombol-garis min-h-16 px-7">Pasang lowongan</a></div></div><KotaHero /></section>
        <section aria-label="Kategori pekerjaan" className="relative mt-8 pb-12 lg:mt-0"><div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"><UbinKategori kategori="las" label="Las" /><UbinKategori kategori="ojek" label="Ojek" /><UbinKategori kategori="dapur" label="Dapur" /><UbinKategori kategori="bangunan" label="Bangunan" /></div><div className="mt-3 flex flex-wrap items-center justify-between gap-x-6"><p className="text-xs text-abu">Contoh lowongan · Belum menerima lamaran</p><Link href="/desain#kategori" className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-jingga-tua">Lihat 14 kategori <span aria-hidden="true">↗</span></Link></div></section>
      </div>
      <section id="cara-kerja" className="border-y border-garis bg-kertas py-14 sm:py-20"><div className="shell"><p className="eyebrow mb-5 text-abu">Cara kerja</p><h2 className="text-3xl sm:text-4xl">Mulai dari pengalamanmu.</h2><ol className="mt-10 grid gap-8 md:grid-cols-3">{[["Ceritakan yang kamu bisa", "Sebutkan pengalaman kerja, lokasi, dan kapan kamu bisa mulai."], ["Lihat pekerjaan di dekatmu", "Baca upah, jadwal, dan informasi usaha sebelum memilih lowongan."], ["Hubungi pemberi kerja", "Pilih “Saya bisa” untuk mulai menghubungi usaha yang kamu pilih."]].map(([judul, isi], i) => <li key={judul}><span className="font-mono text-sm text-jingga-tua">0{i + 1}</span><h3 className="mt-3 text-xl">{judul}</h3><p className="mt-3 text-base text-abu">{isi}</p></li>)}</ol><p className="mt-8 text-sm text-abu">Fitur ngobrol dan melamar masih disiapkan.</p></div></section>
      <section id="pasang-lowongan" className="shell flex flex-wrap items-center justify-between gap-8 py-14 sm:py-20"><div className="max-w-2xl"><p className="eyebrow mb-5 text-abu">Untuk pemilik usaha</p><h2 className="text-3xl sm:text-4xl">Butuh bantuan di tempat usahamu?</h2><p className="mt-5 text-abu">Siapkan pekerjaan, upah, dan jadwalnya. Data usaha diperiksa sebelum lowongan ditampilkan.</p></div><AksiContoh aksi="pasang" variant="garis" size="besar">Pasang lowongan</AksiContoh></section>
    </main>
    <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t border-garis py-6 text-sm text-abu"><span>Lokerin © 2026 · Banyumas, Jawa Tengah</span><Link href="/desain" className="inline-flex min-h-12 items-center underline underline-offset-4">Sistem desain</Link></footer>
  </>;
}
