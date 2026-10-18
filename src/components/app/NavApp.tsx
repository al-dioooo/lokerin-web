"use client";

import { LayoutGroup, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconBriefcase, IconHome, IconIdBadge2, IconMap, IconMicrophone, IconPlus, IconUser, IconUserCheck } from "../icons/tabler";
import { useSesi } from "@/lib/api/sesi";
import { aturArah } from "./Halaman";
import { TautanNgobrol } from "./TautanNgobrol";

const MENU_PENCARI = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/peta", label: "Peta", Icon: IconMap },
  { href: "/app/ngobrol", label: "Ngobrol", Icon: IconMicrophone },
  { href: "/app/lamaran", label: "Lamaran", Icon: IconBriefcase },
  { href: "/app/profil", label: "Profil", Icon: IconUser },
];

const MENU_CONTOH = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/peta", label: "Peta", Icon: IconMap },
  { href: "/app/ngobrol", label: "Ngobrol", Icon: IconMicrophone },
  { href: "/app/profil", label: "Profil", Icon: IconUser },
  { href: "/app/kartu", label: "Kartu", Icon: IconIdBadge2 },
];

const MENU_PEMBERI = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/pelamar", label: "Pelamar", Icon: IconUserCheck },
  { href: "/app/ngobrol", label: "Ngobrol", Icon: IconMicrophone },
  { href: "/app/pasang", label: "Pasang", Icon: IconPlus },
  { href: "/app/profil", label: "Usaha", Icon: IconUser },
];

function indeks(menu: typeof MENU_PENCARI, path: string) {
  if (path.startsWith("/app/lowongan")) return 0;
  const i = menu.findLastIndex(({ href }) => (href === "/app" ? path === "/app" : path.startsWith(href)));
  return i < 0 ? 0 : i;
}

export function PilNav() {
  const path = usePathname();
  const { pengguna } = useSesi();
  const pemberi = pengguna?.peran === "pemberi";
  const MENU = pemberi ? MENU_PEMBERI : pengguna ? MENU_PENCARI : MENU_CONTOH;
  // Highlight the tapped item right away instead of waiting for the next page to load.
  const [ketuk, setKetuk] = useState<number | null>(null);
  const [jalur, setJalur] = useState(path);
  if (jalur !== path) {
    // The page changed (tap, back button, or a link elsewhere): follow the URL again.
    setJalur(path);
    setKetuk(null);
  }
  const aktif = ketuk ?? indeks(MENU, path);

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
              <TautanNgobrol key={href} className="pil-ngobrol" aria-current={ini ? "page" : undefined} aria-label={pemberi ? "Ngobrol: pasang lowongan dan cek pelamar dengan bicara" : "Ngobrol: cari kerja dan susun CV dengan bicara"}>
                {!ini && <span className="pil-ajak" aria-hidden="true">{pemberi ? "Bilang butuh siapa, lowongan jadi sendiri" : "Ceritakan kerjamu, CV jadi sendiri"}</span>}
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
