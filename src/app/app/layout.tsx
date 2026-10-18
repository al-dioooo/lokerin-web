import type { Metadata } from "next";
import Link from "next/link";
import { PilNav } from "@/components/app/NavApp";
import { Logo } from "@/components/brand/Logo";
import { IconBell } from "@/components/icons/tabler";
import { PEKERJA } from "@/lib/data";

export const metadata: Metadata = { title: { default: "Lokerin", template: "%s · Lokerin" } };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="app-kerangka">
      <header className="app-atas" style={{ viewTransitionName: "app-atas" }}>
        <Link href="/" aria-label="Lokerin, halaman utama" className="inline-flex min-h-11 items-center"><Logo size={22} /></Link>
        <span className="piksel hidden rounded-full border border-garis bg-white px-3 py-1 text-[10px] uppercase text-abu sm:inline">Contoh data · belum tersambung ke server</span>
        <div className="flex items-center gap-2">
          <button type="button" className="icon-button size-10 min-h-10 min-w-10 border border-garis bg-white" aria-label="Notifikasi"><IconBell size={20} /></button>
          <Link href="/app/profil" className="avatar" aria-label={`Profil ${PEKERJA.nama}`}>PD</Link>
        </div>
      </header>
      <main id="utama" className="app-isi">{children}</main>
      <PilNav />
    </div>
  );
}
