import Link from "next/link";
import { PilNav } from "@/components/app/NavApp";
import { Logo } from "@/components/brand/Logo";
import { AvatarSesi, PitaContoh } from "@/components/app/AvatarSesi";
import { LoncengKabar } from "@/components/app/LoncengKabar";

export default function AppUtamaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-kerangka">
      <header className="app-atas">
        <Link href="/" aria-label="Lokerin, halaman utama" className="inline-flex min-h-11 items-center"><Logo size={22} /></Link>
        <PitaContoh />
        <div className="flex items-center gap-2">
          <LoncengKabar />
          <AvatarSesi />
        </div>
      </header>
      <main id="utama" className="app-isi">{children}</main>
      <PilNav />
    </div>
  );
}
