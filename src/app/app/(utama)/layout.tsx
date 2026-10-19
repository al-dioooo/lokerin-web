import Link from "next/link";
import { PilNav } from "@/components/app/NavApp";
import { Logo } from "@/components/brand/Logo";
import { AvatarSesi, PitaContoh } from "@/components/app/AvatarSesi";
import { KepalaApp } from "@/components/app/KepalaApp";
import { LoncengKabar } from "@/components/app/LoncengKabar";

export default function AppUtamaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-kerangka">
      <KepalaApp
        kiri={
          <>
            <Link href="/" aria-label="Lokerin, halaman utama" className="app-atas-logo inline-flex min-h-11 items-center"><Logo size={22} /></Link>
            <PitaContoh />
          </>
        }
        kanan={
          <div className="flex items-center gap-2">
            <LoncengKabar />
            <AvatarSesi />
          </div>
        }
      />
      <main id="utama" className="app-isi">{children}</main>
      <PilNav />
    </div>
  );
}
