import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { KATEGORI } from "@/components/icons/categories";
import { ContohKartuMendesak, ContohHitungMundur, KartuLoading } from "@/components/desain/ContohMendesak";
import { ContohTombol } from "@/components/desain/ContohTombol";
import { Mic } from "@/components/ui/Mic";
import { CekUpah } from "@/components/ui/CekUpah";
import { Bacakan } from "@/components/ui/Bacakan";
import { KartuKerja } from "@/components/ui/KartuKerja";
import { KartuLowongan } from "@/components/ui/KartuLowongan";
import { LencanaTerverifikasi } from "@/components/ui/LencanaTerverifikasi";
import { PinPeta } from "@/components/ui/PinPeta";
import { PetaKota } from "@/components/kota/PetaKota";
import { UbinKategori } from "@/components/ui/UbinKategori";

export const metadata: Metadata = { title: "Garis Kota · Sistem Desain Lokerin" };

const warna = [
  ["putih", "#FFFFFF", "Latar halaman"], ["kertas", "#FAFAF7", "Latar bagian"],
  ["kabut", "#F3F3EF", "Kartu kategori"], ["garis", "#D9D9D4", "Batas dan pemisah"],
  ["abu", "#5C6066", "Teks pendamping"], ["tinta", "#16181D", "Teks dan ikon"],
  ["jingga", "#EA5A0C", "Aksi utama dan judul"], ["jingga-terang", "#F26A1B", "Aksen ilustrasi"],
  ["jingga-tua", "#C2410C", "Tautan dan angka"], ["jingga-muda", "#FFF1E8", "Latar jingga"],
  ["daun", "#18794E", "Usaha terverifikasi"], ["daun-muda", "#E8F5EE", "Latar verifikasi"],
  ["kuning-tua", "#8A5A00", "Upah di bawah UMK"], ["kuning-muda", "#FFF6DB", "Latar peringatan"],
  ["merah", "#B42318", "Upah perlu diperiksa"], ["merah-muda", "#FDECEA", "Latar perhatian"],
];
const bagian = [["warna", "Warna"], ["huruf", "Huruf"], ["logo", "Logo"], ["kategori", "Ikon kategori"], ["tombol", "Tombol"], ["lowongan", "Kartu lowongan"], ["peta", "Peta"], ["kartu-kerja", "Kartu Kerja"]];

function Bagian({ nomor, judul, id, children }: { nomor: string; judul: string; id: string; children: ReactNode }) {
  return <section id={id} className="py-10 sm:py-14"><div className="section-heading"><span className="font-mono text-sm text-jingga-tua">{nomor}</span><h2 className="text-3xl">{judul}</h2></div>{children}</section>;
}

export default function DesainPage() {
  return <>
    <header className="shell flex flex-wrap items-center justify-between gap-4 border-b border-garis py-5"><Link href="/" aria-label="Lokerin, kembali ke beranda" className="inline-flex min-h-12 items-center"><Logo size={36} /></Link><Link href="/" className="inline-flex min-h-12 items-center text-base font-bold">← Beranda</Link></header>
    <main id="utama" className="shell pb-16">
      <div className="border-b border-garis py-12 sm:py-20"><p className="eyebrow mb-5 text-abu">Garis Kota · Edisi 02</p><h1 className="max-w-4xl text-4xl sm:text-6xl">Sistem desain <span className="text-jingga">Lokerin</span></h1><p className="mt-6 max-w-2xl text-xl text-abu">Garis kota Banyumas di atas putih. Jingga menandai pekerjaan dan tombol untuk mulai ngobrol.</p><nav aria-label="Bagian sistem desain" className="mt-8 flex flex-wrap gap-x-6 gap-y-1">{bagian.map(([id, label]) => <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center text-base font-bold underline decoration-garis underline-offset-4">{label}</a>)}</nav></div>
      <Bagian nomor="01" judul="Warna" id="warna"><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{warna.map(([nama, hex, guna]) => <div key={nama} className="card overflow-hidden"><div className="h-20 border-b border-garis" style={{ background: hex }} /><div className="p-4"><p className="break-words text-base font-bold">{nama}</p><p className="mt-1 font-mono text-xs text-abu">{hex}</p><p className="mt-3 text-sm text-abu">{guna}</p></div></div>)}</div><p className="mt-6 max-w-3xl text-base text-abu">Teks putih pada jingga memakai ukuran minimal 19 px dan tebal. Teks jingga yang lebih kecil memakai jingga-tua. Jingga-terang hanya untuk ilustrasi.</p></Bagian>
      <Bagian nomor="02" judul="Huruf" id="huruf"><div className="grid gap-8 lg:grid-cols-2"><div><p className="eyebrow mb-5 text-abu">Plus Jakarta Sans</p><p className="text-4xl leading-tight font-extrabold tracking-[-.03em] sm:text-6xl">Cari kerja<br /><span className="text-jingga">cukup ngobrol.</span></p><p className="mt-8">Ceritakan pengalamanmu, CV-mu tersusun dari obrolan.</p><p className="mt-4 text-sm text-abu">Judul 800 · Teks 500 · Isi 18 px / 1,6</p></div><div className="card p-6 sm:p-8"><p className="eyebrow mb-5 text-abu">JetBrains Mono</p><p className="font-mono text-4xl tabular-nums text-jingga-tua sm:text-5xl">04:32:00</p><p className="mt-6 font-mono text-sm text-abu">01 / 14</p><p className="mt-6 text-base text-abu">Angka hitung mundur, nomor kategori, dan label bagian.</p><div className="mt-8 border-t border-garis pt-6"><p className="font-bold">Bentuk</p><p className="mt-2 text-base text-abu">Sudut kartu 16 px. Garis 1 px. Tombol membulat dengan tinggi minimal 52 px.</p></div></div></div></Bagian>
      <Bagian nomor="03" judul="Logo" id="logo"><div className="card flex flex-wrap items-center justify-between gap-8 p-6 sm:p-10"><div><Logo size={64} /><p className="mt-5 max-w-md text-base text-abu">Titik pin jingga menggantikan titik pada huruf i.</p></div><div className="flex items-end gap-7">{[16, 32, 64].map((size) => <div key={size} className="flex flex-col items-center gap-3"><LogoMark size={size} /><span className="font-mono text-xs text-abu">{size} px</span></div>)}</div></div><div className="mt-4 flex flex-wrap gap-6"><a className="inline-flex min-h-12 items-center text-base font-bold text-jingga-tua underline underline-offset-4" href="/logo.svg" download>Unduh logo SVG ↓</a><a className="inline-flex min-h-12 items-center text-base font-bold text-jingga-tua underline underline-offset-4" href="/icon.svg" download>Unduh ikon SVG ↓</a></div></Bagian>
      <Bagian nomor="04" judul="Ikon kategori" id="kategori"><p className="mb-6 max-w-2xl text-base text-abu">Empat belas jenis pekerjaan. Tekan Bacakan untuk mendengar penjelasannya dalam Bahasa Indonesia.</p><div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">{KATEGORI.map(({ slug }) => <UbinKategori key={slug} kategori={slug} href={`#contoh-${slug}`} />)}</div><div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">{KATEGORI.map(({ slug, Icon, label, ucapan }) => <div key={slug} id={`contoh-${slug}`} className="scroll-mt-6 border-t border-garis pt-5"><Icon /><h3 className="mt-3 text-base">{label}</h3><p className="mt-2 text-sm text-abu">{ucapan}</p></div>)}</div><p className="mt-6 font-mono text-xs text-abu">Grid 48 × 48 · Garis 2 px · Ujung membulat</p></Bagian>
      <Bagian nomor="05" judul="Tombol" id="tombol"><ContohTombol /><div className="mt-10 grid items-center gap-8 md:grid-cols-2"><div className="card flex flex-col items-center p-8"><Mic /><p className="mt-6 text-center text-sm text-abu">Fitur ngobrol masih disiapkan.</p></div><div className="space-y-6"><div><h3 className="mb-3 text-xl">Mode baca-dengar</h3><Bacakan teks="Selamat datang di Lokerin. Cari kerja cukup ngobrol. Pilih jenis pekerjaan untuk mendengar penjelasannya." /></div><div className="border-t border-garis pt-6"><h3 className="mb-4 text-xl">Butuh hari ini</h3><Suspense fallback={<p className="font-mono text-jingga-tua">--:--:--</p>}><ContohHitungMundur /></Suspense></div></div></div></Bagian>
      <Bagian nomor="06" judul="Kartu lowongan" id="lowongan"><p className="mb-6 text-base text-abu">Data contoh · Belum menerima lamaran</p><div className="grid items-start gap-6 lg:grid-cols-2"><Suspense fallback={<KartuLoading />}><ContohKartuMendesak /></Suspense><KartuLowongan kategori="las" judul="Tukang las pagar" pemberiKerja="Bengkel Pak Darto" upah="Rp175.000/hari" lokasi="Sokaraja" jarak="3,5 km" jadwal="Senin–Sabtu · 08.00–16.00" verifikasi={{ ktp: true, fotoUsaha: true, tanggal: "17 Oktober 2026" }} /></div><div className="mt-8 grid gap-8 rounded-kartu bg-kertas p-6 md:grid-cols-2"><div><h3 className="mb-4 text-xl">Verifikasi usaha</h3><LencanaTerverifikasi ktp npwp fotoUsaha tanggal="18 Oktober 2026" /><div className="mt-5"><LencanaTerverifikasi /></div></div><div><h3 className="mb-4 text-xl">Cek upah</h3><div className="flex flex-wrap gap-3"><CekUpah status="wajar" /><CekUpah status="rendah" /><CekUpah status="curiga" /></div><p className="mt-4 text-sm text-abu">Status upah di halaman ini adalah contoh tampilan.</p></div></div></Bagian>
      <Bagian nomor="07" judul="Peta" id="peta"><p className="mb-6 max-w-2xl text-base text-abu">Kota digambar sebagai komponen SVG isometrik (<code className="font-mono text-sm">src/components/kota</code>): blok putih, sisi abu, garis tipis. Hanya tempat yang membuka lowongan berwarna jingga, dan setiap tempat bisa diketuk.</p><PetaKota /><div className="mt-6 flex flex-wrap items-center gap-5"><PinPeta kategori="las" /><PinPeta kategori="ojek" /><p className="max-w-lg text-base text-abu">Pin jingga menandai tempat kerja. Label Butuh Hari Ini menandai lowongan mendesak.</p></div></Bagian>
      <Bagian nomor="08" judul="Kartu Kerja" id="kartu-kerja"><div className="grid items-center gap-10 md:grid-cols-2"><div className="rounded-kartu bg-kabut p-5 sm:p-10"><KartuKerja nama="Budi Santoso" personas={["Tukang las", "Tukang bangunan", "Angkut barang"]} kota="Purwokerto, Banyumas" /></div><div><h3 className="text-2xl">Satu kartu, beberapa keahlian.</h3><p className="mt-5 max-w-lg text-abu">Kartu berukuran 9:16 untuk status WhatsApp. Nama, keahlian, dan kota bisa dilihat dalam satu tempat.</p><p className="mt-4 max-w-lg text-base text-abu">QR ini masih berupa contoh. Lencana verifikasi hanya digunakan untuk pemberi kerja.</p></div></div></Bagian>
    </main>
    <footer className="shell flex flex-wrap items-center justify-between gap-4 border-t border-garis py-6 text-sm text-abu"><span>Lokerin · Garis Kota · 2026</span><Link className="inline-flex min-h-12 items-center underline underline-offset-4" href="/">Kembali ke beranda</Link></footer>
  </>;
}
