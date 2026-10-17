import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { KATEGORI } from "@/components/icons/categories";
import { ContohKartuMendesak, ContohPapanLed, PapanLoading } from "@/components/desain/ContohMendesak";
import { ContohTombol } from "@/components/desain/ContohTombol";
import { Mic } from "@/components/ui/Mic";
import { CekUpah } from "@/components/ui/CekUpah";
import { KartuKerja } from "@/components/ui/KartuKerja";
import { KartuLowongan } from "@/components/ui/KartuLowongan";
import { LencanaTerverifikasi } from "@/components/ui/LencanaTerverifikasi";
import { PinPeta } from "@/components/ui/PinPeta";
import { UbinKategori } from "@/components/ui/UbinKategori";

export const metadata: Metadata = { title: "Sistem Desain Lokerin" };

const warna = [
  { nama: "kertas", hex: "#F3EAD7", style: "bg-kertas text-arang", guna: "Latar halaman" },
  { nama: "kertas-terang", hex: "#FBF6EC", style: "bg-kertas-terang text-arang", guna: "Kartu kertas" },
  { nama: "kardus", hex: "#C9A36B", style: "bg-kardus text-arang", guna: "Kardus & selotip" },
  { nama: "arang", hex: "#1B1712", style: "bg-arang text-kertas", guna: "Tinta & garis" },
  { nama: "abu", hex: "#5E564A", style: "bg-abu text-kertas", guna: "Teks pendamping" },
  { nama: "cabai", hex: "#C8261B", style: "bg-cabai text-white", guna: "Aksi & mendesak" },
  { nama: "kunyit", hex: "#F5B400", style: "bg-kunyit text-arang", guna: "Suara & perhatian" },
  { nama: "daun", hex: "#1E6E3A", style: "bg-daun text-white", guna: "Verifikasi & upah" },
  { nama: "langit", hex: "#1F5AA6", style: "bg-langit text-white", guna: "Tautan & informasi" },
  { nama: "malam", hex: "#14110D", style: "bg-malam text-led", guna: "Latar papan LED" },
  { nama: "led", hex: "#FF3B2F", style: "bg-malam text-led", guna: "Teks di atas malam" },
];

function Bagian({ nomor, judul, id, children }: { nomor: string; judul: string; id: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-8 py-10 sm:py-14"><div className="section-heading"><span className="font-papan text-cabai">{nomor}</span><h2 className="text-2xl sm:text-3xl">{judul}</h2></div>{children}</section>;
}

export default function DesainPage() {
  return <>
    <div className="warung-stripe" />
    <header className="shell flex flex-wrap items-center justify-between gap-4 border-b-3 border-arang py-5"><Link href="/" aria-label="Lokerin, kembali ke beranda" className="inline-flex min-h-12 items-center"><Logo size={36} /></Link><Link href="/" className="inline-flex min-h-12 items-center font-bold underline decoration-2 underline-offset-4">← Beranda</Link></header>
    <main id="utama" className="shell pb-16">
      <div className="border-b-3 border-arang py-12 sm:py-20"><p className="eyebrow mb-5 text-cabai">Buku contoh / Edisi 01 / Cat Warung</p><h1 className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl">Sistem Desain <span className="text-cabai">Lokerin</span></h1><p className="mt-6 max-w-2xl text-xl text-abu">Warna, huruf, dan bentuknya diambil dari papan warung, cap stempel, dan papan LED di depan toko. Hurufnya besar karena banyak pengguna jarang membaca teks panjang.</p><nav aria-label="Bagian sistem desain" className="mt-8 flex flex-wrap gap-x-6 gap-y-1">{[["warna", "Warna"], ["huruf", "Huruf"], ["logo", "Logo"], ["kategori", "Kategori"], ["komponen", "Komponen"], ["kartu", "Kartu & peta"]].map(([id, label]) => <a key={id} href={`#${id}`} className="inline-flex min-h-12 items-center text-base font-bold underline underline-offset-4">{label} ↗</a>)}</nav></div>

      <Bagian nomor="01" judul="Sebelas kaleng cat" id="warna">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{warna.map((color) => <div key={color.nama} className="overflow-hidden rounded-kertas border-3 border-arang"><div className={`flex h-24 items-end p-4 ${color.style}`}><span className="text-xl font-extrabold">{color.nama === "led" ? "● ● ●" : "Aa"}</span></div><div className="border-t-3 border-arang bg-kertas-terang p-3"><p className="break-words font-bold">{color.nama}</p><p className="text-sm text-abu">{color.hex}</p><p className="mt-2 text-sm">{color.guna}</p></div></div>)}</div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3"><div className="paper p-5"><p className="font-bold">Garis tinta 3 px</p><p className="text-base text-abu">Sudut melengkung 5 px.</p></div><div className="paper p-5"><p className="font-bold">Bayangan cetak 4 px</p><p className="text-base text-abu">Saat ditekan: bergeser 2 px.</p></div><div className="paper taped rotate-1 p-5"><p className="font-bold">Kertas & selotip</p><p className="text-base text-abu">Miring 1 sampai 2 derajat.</p></div></div>
      </Bagian>

      <Bagian nomor="02" judul="Tiga jenis huruf" id="huruf">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]"><div className="space-y-6"><div><p className="eyebrow mb-3 text-abu">Bungee · Judul besar · 36–72 px</p><p className="font-papan text-4xl leading-tight sm:text-6xl">Butuh tukang las<br /><span className="text-cabai">hari ini</span></p></div><div className="border-t-2 border-kardus pt-5"><p className="eyebrow mb-3 text-abu">Bungee · Judul bagian · 24–36 px</p><p className="font-papan text-2xl sm:text-3xl">Kerja dekat rumah</p></div><div><p className="eyebrow mb-3 text-abu">Bungee · Label kategori · 16 px</p><p className="font-papan text-base">Tukang las</p></div></div><div className="paper space-y-6 p-6"><div><p className="eyebrow mb-3 text-abu">Atkinson Hyperlegible Next</p><p className="text-2xl font-bold">Huruf yang mirip tetap mudah dibedakan.</p><p className="mt-3 text-lg">Teks utama 18 px. Ceritakan keahlianmu, lokasi, dan kapan kamu bisa bekerja.</p><p className="mt-3 text-sm text-abu">Teks pendamping 14 px · Purwokerto, Banyumas</p></div><div className="rounded bg-malam p-4 text-led"><p className="text-xs text-kertas">DOTO · ANGKA 800–900</p><p className="led-text text-4xl">04:32:00</p></div></div></div>
      </Bagian>

      <Bagian nomor="03" judul="Logo" id="logo"><div className="paper flex flex-wrap items-center justify-between gap-8 p-6 sm:p-10"><div><Logo size={54} /><p className="mt-4 max-w-md text-base text-abu">Pin lokasi yang kepalanya berupa gelembung percakapan: cari kerja di dekatmu cukup dengan bicara.</p></div><div className="flex items-end gap-6">{[24, 48, 80].map((size) => <div key={size} className="flex flex-col items-center gap-3"><LogoMark size={size} /><span className="text-xs text-abu">{size} px</span></div>)}</div></div><div className="mt-6 flex flex-wrap gap-6"><a className="inline-flex min-h-12 items-center font-bold text-langit underline underline-offset-4" href="/logo.svg" download>Unduh logo SVG ↓</a><a className="inline-flex min-h-12 items-center font-bold text-langit underline underline-offset-4" href="/icon.svg" download>Unduh ikon SVG ↓</a></div></Bagian>

      <Bagian nomor="04" judul="14 kategori pekerjaan" id="kategori"><p className="mb-8 max-w-2xl text-abu">Mode baca-dengar. Ketuk ubin untuk mendengar jenis pekerjaan dalam Bahasa Indonesia. Ketuk lagi untuk menghentikan.</p><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{KATEGORI.map(({ slug }) => <UbinKategori key={slug} kategori={slug} />)}</div></Bagian>

      <Bagian nomor="05" judul="Tombol dan komponen" id="komponen"><div className="grid items-center gap-10 lg:grid-cols-[1.7fr_1fr]"><div><h3 className="mb-6 text-xl font-extrabold">Tombol utama, sorot, dan garis</h3><ContohTombol /><p className="mt-5 text-sm text-abu">Ukuran kecil, sedang, besar. Area ketuk minimal 48 px. Coba tombol Tab untuk melihat penanda fokus.</p></div><div className="paper bg-kardus p-8"><Mic /></div></div><div className="mt-12 grid gap-8 lg:grid-cols-2"><div className="paper p-6"><h3 className="mb-6 text-xl font-extrabold">Lencana Terverifikasi</h3><div className="flex flex-col items-start gap-6"><LencanaTerverifikasi ktp fotoUsaha tanggal="18 Oktober 2026" /><LencanaTerverifikasi ktp npwp fotoUsaha tanggal="17 Oktober 2026" /><LencanaTerverifikasi /></div></div><div className="paper p-6"><h3 className="mb-6 text-xl font-extrabold">Cek upah wajar</h3><div className="flex flex-wrap gap-4"><CekUpah status="wajar" /><CekUpah status="rendah" /><CekUpah status="curiga" /></div><p className="mt-5 text-sm text-abu">Contoh keadaan tampilan. Perbandingan UMK Banyumas pada halaman ini adalah simulasi, bukan perhitungan upah resmi.</p></div></div><div className="mt-12"><h3 className="mb-5 text-xl font-extrabold">Papan LED Butuh Hari Ini</h3><Suspense fallback={<PapanLoading />}><ContohPapanLed /></Suspense></div></Bagian>

      <Bagian nomor="06" judul="Kartu lowongan" id="lowongan"><p className="mb-10 text-abu">Nama usaha, verifikasi, dan upah di bawah adalah data contoh.</p><div className="grid items-start gap-8 lg:grid-cols-3"><Suspense fallback={<div className="paper min-h-96 p-6" role="status">Menyiapkan contoh lowongan…</div>}><ContohKartuMendesak /></Suspense><KartuLowongan kategori="las" judul="Bantu las pagar" pemberiKerja="Bengkel Las Pak Jaya" upah="Rp150.000/hari" lokasi="Sokaraja" jarak="3,5 km" jadwal="Senin–Sabtu · 08.00–16.00" verifikasi={{ ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026" }} className="lg:rotate-1" /><KartuLowongan kategori="toko" judul="Jaga toko sembako" pemberiKerja="Toko Bu Siti" upah="Rp1.500.000/bulan" lokasi="Ajibarang" jarak="2 km" jadwal="Senin–Sabtu · 07.00–15.00" statusUpah="rendah" verifikasi={{ ktp: true, fotoUsaha: true, tanggal: "16 Oktober 2026" }} className="lg:-rotate-1" /></div></Bagian>

      <Bagian nomor="07" judul="Kartu Kerja dan peta" id="kartu"><div className="grid gap-12 lg:grid-cols-2"><div><h3 className="mb-2 text-xl font-extrabold">Kartu Kerja</h3><p className="mb-8 text-abu">Satu profil dengan beberapa keahlian, ukuran 9:16 untuk status WhatsApp.</p><KartuKerja nama="Pak Darto" personas={["Tukang Las", "Driver Ojol"]} kota="Purwokerto, Banyumas" /></div><div><h3 className="mb-2 text-xl font-extrabold">Pin Peta Kerja Sekitar</h3><p className="mb-8 text-abu">Kenali pekerjaan dari ikonnya. Lingkaran cabai menandai yang butuh hari ini.</p><div className="paper relative overflow-hidden bg-kardus p-6"><p className="eyebrow mb-8">Ilustrasi peta · Bukan lokasi asli</p><div className="absolute inset-x-0 top-1/2 h-12 -rotate-12 border-y-3 border-arang bg-kertas" aria-hidden="true" /><div className="relative grid grid-cols-2 gap-y-8 text-center">{([['dapur', 'Purwokerto', true], ['las', 'Sokaraja', false], ['toko', 'Ajibarang', false], ['kurir', 'Purwokerto', true]] as const).map(([kategori, kota, urgent]) => <div key={kategori} className="flex flex-col items-center gap-2"><PinPeta kategori={kategori} mendesak={urgent} /><span className="rounded border-2 border-arang bg-kertas-terang px-2 py-1 text-sm font-bold">{kota}</span>{urgent && <span className="bg-cabai px-2 text-xs font-bold text-white">Butuh hari ini</span>}</div>)}</div></div><div className="mt-8 border-l-4 border-langit pl-5"><p className="font-bold">Aksesibilitas</p><p className="mt-2 text-base text-abu">Semua ikon digambar sebagai vektor. Teks tetap tersedia saat suara tidak didukung. Gerakan mengikuti pengaturan perangkat.</p></div></div></div></Bagian>
    </main><footer className="border-t-3 border-arang bg-kunyit py-6"><div className="shell flex flex-wrap items-center justify-between gap-4"><Logo size={30} /><p className="text-sm font-bold">Cat Warung · Banyumas · 2026</p><Link href="/" className="inline-flex min-h-12 items-center font-bold underline">Kembali ke beranda ↗</Link></div></footer>
  </>;
}
