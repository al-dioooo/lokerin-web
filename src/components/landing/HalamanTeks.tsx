import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

/** A plain reading page (privacy policy, terms): logo, title, date, then the text. */
export function HalamanTeks({ judul, berlaku, children }: { judul: string; berlaku: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-putih pt-safe pb-safe px-safe">
      <main id="utama" className="mx-auto w-full max-w-2xl px-6 py-10">
        <Link href="/" aria-label="Lokerin, ke beranda"><Logo size={28} /></Link>
        <h1 className="mt-10 text-[clamp(2rem,1.7rem+1.6vw,2.75rem)] leading-tight">{judul}</h1>
        <p className="mt-2 text-abu">Berlaku sejak {berlaku}</p>
        <div className="mt-8 grid gap-6 text-[17px] leading-relaxed">{children}</div>
        <p className="mt-12 border-t border-garis pt-6 text-sm text-abu">
          <Link href="/privasi" className="underline">Kebijakan Privasi</Link> · <Link href="/ketentuan" className="underline">Ketentuan Layanan</Link>
        </p>
      </main>
    </div>
  );
}

export function Bagian({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h2 className="text-xl font-bold">{judul}</h2>
      {children}
    </section>
  );
}
