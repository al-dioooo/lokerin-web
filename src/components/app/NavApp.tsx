"use client";

import { LayoutGroup, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconHome, IconIdBadge2, IconMap, IconMicrophone, IconUser } from "../icons/tabler";
import { aturArah } from "./Halaman";
import { TautanNgobrol } from "./TautanNgobrol";

const MENU = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/peta", label: "Peta", Icon: IconMap },
  { href: "/app/ngobrol", label: "Ngobrol", Icon: IconMicrophone },
  { href: "/app/profil", label: "Profil", Icon: IconUser },
  { href: "/app/kartu", label: "Kartu", Icon: IconIdBadge2 },
];

function indeks(path: string) {
  if (path.startsWith("/app/lowongan")) return 0;
  const i = MENU.findLastIndex(({ href }) => (href === "/app" ? path === "/app" : path.startsWith(href)));
  return i < 0 ? 0 : i;
}

export function PilNav() {
  const path = usePathname();
  // Highlight the tapped item right away instead of waiting for the next page to load.
  const [ketuk, setKetuk] = useState<number | null>(null);
  const [jalur, setJalur] = useState(path);
  if (jalur !== path) {
    // The page changed (tap, back button, or a link elsewhere): follow the URL again.
    setJalur(path);
    setKetuk(null);
  }
  const aktif = ketuk ?? indeks(path);

  function pergi(ke: number) {
    if (ke === aktif) return;
    aturArah(ke > aktif ? "kanan" : "kiri");
    setKetuk(ke);
  }

  return (
    <nav aria-label="Menu aplikasi" className="pil-nav">
      <LayoutGroup id="pil">
        {MENU.map(({ href, label, Icon }, i) => {
          const ini = i === aktif;
          if (i === 2) {
            return (
              <TautanNgobrol key={href} className="pil-ngobrol" aria-current={ini ? "page" : undefined} aria-label="Ngobrol: cari kerja dan susun CV dengan bicara">
                {!ini && <span className="pil-ajak" aria-hidden="true">Ceritakan kerjamu, CV jadi sendiri</span>}
                <m.span className="pil-ngobrol-orb" whileHover={{ scale: 1.06, rotate: -6 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                  <Icon size={26} stroke={2} />
                </m.span>
                <span className="pil-ngobrol-label piksel">{label}</span>
              </TautanNgobrol>
            );
          }
          return (
            <Link key={href} href={href} onClick={() => pergi(i)} className="pil-item" aria-current={ini ? "page" : undefined}>
              {ini && <m.span layoutId="pil-sorot" className="pil-sorot" transition={{ type: "spring", stiffness: 560, damping: 42 }} />}
              <Icon size={20} stroke={ini ? 2.2 : 1.75} className="relative" />
              <span className="pil-label relative">{label}</span>
            </Link>
          );
        })}
      </LayoutGroup>
    </nav>
  );
}
