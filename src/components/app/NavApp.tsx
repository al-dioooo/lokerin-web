"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconIdBadge2, IconMap, IconMicrophone, IconUser } from "../icons/tabler";

const KIRI = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/peta", label: "Peta", Icon: IconMap },
];
const KANAN = [
  { href: "/app/profil", label: "Profil", Icon: IconUser },
  { href: "/app/kartu", label: "Kartu", Icon: IconIdBadge2 },
];
const URUTAN = ["/app", "/app/peta", "/app/ngobrol", "/app/profil", "/app/kartu"];

function indeks(path: string) {
  if (path.startsWith("/app/lowongan")) return 0;
  const i = URUTAN.findLastIndex((href) => (href === "/app" ? path === "/app" : path.startsWith(href)));
  return i < 0 ? 0 : i;
}

/** Slide direction for a tab change, so pages move the way the pill moves. */
function arah(dari: number, ke: number) {
  return [ke >= dari ? "nav-kanan" : "nav-kiri"];
}

function Item({ href, label, Icon, aktif, dari, ke }: { href: string; label: string; Icon: typeof IconHome; aktif: boolean; dari: number; ke: number }) {
  return (
    <Link href={href} transitionTypes={arah(dari, ke)} className="pil-item" aria-label={label} aria-current={aktif ? "page" : undefined}>
      {aktif && <m.span layoutId="pil-sorot" className="pil-sorot" transition={{ type: "spring", stiffness: 520, damping: 40 }} />}
      <m.span className="relative flex items-center" whileTap={{ scale: 0.88 }}>
        <Icon size={20} stroke={aktif ? 2.2 : 1.75} />
        <span className="pil-label">{label}</span>
      </m.span>
    </Link>
  );
}

export function PilNav() {
  const path = usePathname();
  const sekarang = indeks(path);
  const diNgobrol = sekarang === 2;
  return (
    <nav aria-label="Menu aplikasi" className="pil-nav" style={{ viewTransitionName: "pil-nav" }}>
      <div className="pil-sisi">
        {KIRI.map((m, i) => <Item key={m.href} {...m} aktif={sekarang === i} dari={sekarang} ke={i} />)}
      </div>
      <Link href="/app/ngobrol" transitionTypes={arah(sekarang, 2)} className="pil-ngobrol" aria-current={diNgobrol ? "page" : undefined} aria-label="Ngobrol: cari kerja dan susun CV dengan bicara">
        {!diNgobrol && <span className="pil-ajak" aria-hidden="true">Ceritakan kerjamu, CV jadi sendiri</span>}
        <m.span className="pil-ngobrol-orb" whileHover={{ scale: 1.08, rotate: -8 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}><IconMicrophone size={26} stroke={2} /></m.span>
        <span className="pil-ngobrol-label piksel">Ngobrol</span>
      </Link>
      <div className="pil-sisi">
        {KANAN.map((m, i) => <Item key={m.href} {...m} aktif={sekarang === i + 3} dari={sekarang} ke={i + 3} />)}
      </div>
    </nav>
  );
}
