import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Gerak, Paralaks } from "@/components/gerak/Gerak";
import { Maju, Muncul } from "@/components/gerak/Muncul";
import { GulirHalus } from "@/components/gerak/GulirHalus";
import { MicIcon } from "@/components/icons/interface";
import { KotaIsometrik } from "@/components/kota/KotaIsometrik";
import { PetaKota } from "@/components/kota/PetaKota";
import { ObrolanJadiCV } from "@/components/landing/ObrolanJadiCV";
import { PenghitungLangsung } from "@/components/landing/PenghitungLangsung";
import { RakKategori } from "@/components/landing/RakKategori";
import { CekUpah } from "@/components/ui/CekUpah";

const LANGKAH_USAHA = [
  ["Ceritakan lowongannya", "Sebutkan pekerjaan, upah, jam, dan lokasi. Bisa bicara 30 detik atau isi formulir singkat."],
  ["Usahamu kami cek", "KTP, NPWP, atau foto usaha. Pekerja melihat apa saja yang sudah dicek dan kapan."],
  ["Pelamar masuk langsung", "Begitu ada yang menekan “Saya bisa”, kamu melihatnya tanpa memuat ulang, lalu lanjut di WhatsApp."],
];

function Judul({ label, children, id }: { label: string; children: React.ReactNode; id: string }) {
  return <Muncul className="mb-8 max-w-2xl"><p className="pil-piksel mb-4">{label}</p><h2 id={id} className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">{children}</h2></Muncul>;
}

export default function Home() {
  return (
    <GulirHalus>
    <Gerak>
      <header className="kepala">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Lokerin, beranda" className="inline-flex min-h-11 items-center"><Logo size={26} /></Link>
          <nav aria-label="Utama" className="hidden items-center gap-7 text-sm font-semibold md:flex"><a href="#peta">Cari kerja</a><a href="#cara-kerja">Obrolan jadi CV</a><a href="#pasang-lowongan">Pasang lowongan</a></nav>
          <Link href="/masuk" className="tombol tombol-utama min-h-9 px-4 text-sm">Masuk</Link>
        </div>
      </header>
      <main id="utama">
        <section className="hero-tengah" aria-labelledby="judul-utama">
          <div className="hero-latar" aria-hidden="true"><Paralaks className="h-full w-full" jarak={160}><KotaIsometrik className="h-full w-full" judul="" /></Paralaks></div>
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
            <PenghitungLangsung />
            <h1 id="judul-utama" className="judul-utama">Cari kerja<span>cukup ngobrol.</span></h1>
            <p className="mt-4 max-w-xl text-base text-abu sm:text-lg">Lowongan warung, bengkel, dan UMKM terverifikasi di dekatmu. Ceritakan pengalamanmu, CV-mu tersusun dari obrolan.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/masuk" className="tombol tombol-utama min-h-12 px-6 text-base"><MicIcon size={18} />Mulai ngobrol</Link>
              <Link href="/masuk" className="tombol tombol-garis min-h-12 px-6 text-base">Pasang lowongan</Link>
            </div>
            <p className="mt-4 text-xs text-abu">Tidak bisa bicara sekarang? Semua langkah juga bisa diketuk dan diketik.</p>
          </div>
        </section>

        <section id="peta" className="shell relative z-10 -mt-28 sm:-mt-36" aria-label="Peta Kerja Sekitar">
          <Maju><PetaKota /></Maju>
          <p className="mt-3 text-center text-xs text-abu">Contoh data. Nama usaha dan upah di peta ini belum lowongan sungguhan.</p>
        </section>

        <section id="cara-kerja" className="shell py-20 sm:py-28" aria-labelledby="judul-cv">
          <Judul label="Obrolan jadi CV" id="judul-cv">Ceritakan pengalamanmu sekali. <span className="text-jingga">Lokerin menyusun CV-nya.</span></Judul>
          <Muncul jeda={0.1}><ObrolanJadiCV /></Muncul>
        </section>

        <section id="kategori" className="border-y border-garis bg-kertas py-16 sm:py-20" aria-labelledby="judul-kategori">
          <div className="shell">
            <Judul label="Jenis pekerjaan" id="judul-kategori">Dari dapur warung sampai <span className="text-jingga">bengkel las.</span></Judul>
            <Muncul jeda={0.1}><RakKategori /></Muncul>
          </div>
        </section>

        <section id="pasang-lowongan" className="shell py-20 sm:py-28" aria-labelledby="judul-usaha">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Judul label="Untuk pemilik usaha" id="judul-usaha">Butuh orang hari ini? <span className="text-jingga">Pasang lowongan sambil bicara.</span></Judul>
              <div className="flex flex-wrap gap-3"><Link href="/masuk" className="tombol tombol-utama min-h-12 px-6 text-base">Pasang lowongan</Link></div>
            </div>
            <Muncul jeda={0.15}><ol className="grid gap-3">
              {LANGKAH_USAHA.map(([judul, isi], i) => (
                <li key={judul} className="langkah" data-genap={i % 2 === 1 || undefined}>
                  <span className="piksel text-sm text-jingga-tua">0{i + 1}</span>
                  <div><h3 className="text-base">{judul}</h3><p className="mt-1 text-sm text-abu">{isi}</p></div>
                </li>
              ))}
              <li className="langkah">
                <span className="piksel text-sm text-jingga-tua">!</span>
                <div><h3 className="text-base">Upah dicek sebelum tayang</h3><p className="mt-1 mb-2 text-sm text-abu">Lokerin membandingkan upah dengan UMK setempat, supaya pekerja tidak tertipu dan lowongan palsu tertahan.</p><div className="flex flex-wrap gap-2"><CekUpah status="wajar" /><CekUpah status="rendah" /><CekUpah status="curiga" /></div></div>
              </li>
            </ol></Muncul>
          </div>
        </section>
      </main>
      <footer className="border-t border-garis">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-abu"><Logo size={22} /><span>Banyumas, Jawa Tengah · Lokerin © 2026</span><Link href="/desain" className="font-semibold text-tinta underline underline-offset-4">Sistem desain</Link></div>
      </footer>
    </Gerak>
    </GulirHalus>
  );
}
