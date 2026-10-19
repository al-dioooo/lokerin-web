import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

// Shown for unknown addresses and for notFound(), such as a job that was removed or never existed.
export default function TidakDitemukan() {
  return (
    <main id="utama" className="grid min-h-dvh place-items-center bg-kertas px-5 py-16 text-center">
      <div className="grid max-w-md justify-items-center gap-3">
        <Link href="/" aria-label="Lokerin, halaman utama" className="inline-flex min-h-11 items-center"><Logo size={26} /></Link>
        <p className="pil-piksel mt-6">404</p>
        <h1 className="text-2xl">Halaman ini tidak ada</h1>
        <p className="text-[15px] text-abu">Mungkin lowongannya sudah dihapus, atau alamatnya salah ketik.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link href="/app" className="tombol tombol-utama min-h-12 px-6 text-base">Cari lowongan</Link>
          <Link href="/" className="tombol tombol-garis min-h-12 px-6 text-base">Halaman utama</Link>
        </div>
      </div>
    </main>
  );
}
