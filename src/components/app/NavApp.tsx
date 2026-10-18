"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconIdBadge2, IconMap, IconMicrophone, IconUser } from "../icons/tabler";

const MENU = [
  { href: "/app", label: "Beranda", Icon: IconHome },
  { href: "/app/peta", label: "Peta", Icon: IconMap },
  { href: "/app/ngobrol", label: "Ngobrol", Icon: IconMicrophone, utama: true },
  { href: "/app/profil", label: "Profil", Icon: IconUser },
  { href: "/app/kartu", label: "Kartu Kerja", Icon: IconIdBadge2 },
];

function aktif(path: string, href: string) {
  return href === "/app" ? path === "/app" || path.startsWith("/app/lowongan") : path.startsWith(href);
}

export function NavSamping() {
  const path = usePathname();
  return (
    <nav aria-label="Menu aplikasi" className="grid gap-1">
      {MENU.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className="nav-samping" aria-current={aktif(path, href) ? "page" : undefined}><Icon size={20} />{label}</Link>
      ))}
    </nav>
  );
}

export function NavBawah() {
  const path = usePathname();
  return (
    <nav aria-label="Menu aplikasi" className="nav-bawah">
      {MENU.map(({ href, label, Icon, utama }) => (
        <Link key={href} href={href} className={utama ? "nav-bawah-mic" : "nav-bawah-item"} aria-current={aktif(path, href) ? "page" : undefined}>
          <span className="nav-bawah-ikon"><Icon size={utama ? 24 : 22} /></span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
