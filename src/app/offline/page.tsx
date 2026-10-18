import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = { title: "Offline · Lokerin", robots: { index: false } };

// sw.js serves this page for any page that was never saved while the phone is offline.
// "Coba lagi" is a plain link to the current address, so it works even before the page's JavaScript loads.
export default function Offline() {
  return (
    <div className="flex min-h-dvh flex-col bg-putih pt-safe pb-safe px-safe">
      <main id="utama" className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10">
        <Logo size={28} />
        <div className="my-auto py-12">
          <span className="grid size-24 place-items-center rounded-full bg-kabut text-tinta" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 18h.01" />
              <path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
              <path d="M6.343 12.343a8 8 0 0 1 3.864-2.14m4.163.155a8 8 0 0 1 3.287 2" />
              <path d="M3.515 9.515a12 12 0 0 1 3.544-2.455m3.101-.92a12 12 0 0 1 10.325 3.374" />
              <path d="M3 3l18 18" />
            </svg>
          </span>
          <h1 className="mt-8 text-[clamp(2.25rem,1.9rem+1.8vw,3rem)] leading-tight">Kamu sedang offline</h1>
          <p className="mt-4 text-xl leading-relaxed text-abu">Halaman yang sudah tersimpan di HP-mu masih bisa dibuka. Sambungkan internet, lalu tekan Coba lagi.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="" className="tombol tombol-utama min-h-14 px-8 text-[19px]">Coba lagi</a>
            <Link href="/app" prefetch={false} className="tombol tombol-garis min-h-14 px-8 text-[19px]">Buka beranda</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
