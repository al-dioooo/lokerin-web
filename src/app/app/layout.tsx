import type { Metadata } from "next";
import Link from "next/link";
import { NavBawah, NavSamping } from "@/components/app/NavApp";
import { Logo } from "@/components/brand/Logo";
import { IconBell } from "@/components/icons/tabler";
import { PEKERJA } from "@/lib/data";

export const metadata: Metadata = { title: { default: "Lokerin", template: "%s · Lokerin" } };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="app-kerangka">
      <aside className="app-samping">
        <Link href="/" aria-label="Lokerin, halaman utama" className="mb-8 inline-flex px-3"><Logo size={26} /></Link>
        <NavSamping />
        <div className="mt-auto rounded-2xl border border-garis bg-white p-3">
          <p className="piksel text-[10px] uppercase text-jingga-tua">Akun demo</p>
          <p className="mt-1 text-sm font-bold">{PEKERJA.nama}</p>
          <p className="text-xs text-abu">{PEKERJA.persona.las.judul} · {PEKERJA.persona.ojek.judul}</p>
        </div>
      </aside>
      <div className="app-utama">
        <header className="app-atas">
          <Link href="/" aria-label="Lokerin, halaman utama" className="inline-flex min-h-11 items-center lg:hidden"><Logo size={22} /></Link>
          <p className="piksel hidden text-[11px] uppercase text-abu lg:block">Contoh data · belum tersambung ke server</p>
          <button type="button" className="icon-button size-10 min-h-10 min-w-10 border border-garis bg-white" aria-label="Notifikasi"><IconBell size={20} /></button>
        </header>
        <main id="utama" className="app-isi">{children}</main>
      </div>
      <NavBawah />
    </div>
  );
}
