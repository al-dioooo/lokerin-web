"use client";

/*
 * Opening things in a drawer instead of a new page. Ngobrol provides the drawer (PenyediaLaci in
 * components/ngobrol/LaciNgobrol); anything rendered inside it, cards and the screens shown in the
 * drawer alike, can open a job, a CV, applications or applicants there. Outside a drawer host the
 * same links simply navigate.
 */

import Link from "next/link";
import { createContext, useContext, type ComponentProps, type MouseEvent } from "react";

export type IsiLaci =
  | { jenis: "lowongan"; id: string }
  | { jenis: "cv"; id: string }
  | { jenis: "lamaran"; id?: string }
  | { jenis: "pelamar"; id?: string }
  | { jenis: "profil" }
  | { jenis: "lowongan_saya" };

export const KonteksLaci = createContext<((isi: IsiLaci) => void) | null>(null);

export function useBukaLaci() {
  return useContext(KonteksLaci);
}

/** A click handler that opens `isi` in the drawer, leaving modified clicks (new tab) to the link. */
export function useKlikLaci() {
  const buka = useBukaLaci();
  return (isi: IsiLaci) =>
    buka
      ? (e: MouseEvent<HTMLAnchorElement>) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          buka(isi);
        }
      : undefined;
}

/** Kabar links point at pages; inside Ngobrol the same places open in the drawer. */
export function laciDariTautan(href: string): IsiLaci | null {
  const url = new URL(href, "http://lokerin.lokal");
  const lamaran = url.searchParams.get("lamaran") ?? undefined;
  const lowongan = url.pathname.match(/^\/app\/lowongan\/([^/]+)$/);
  if (lowongan) return { jenis: "lowongan", id: decodeURIComponent(lowongan[1]!) };
  const cv = url.pathname.match(/^\/app\/cv\/([^/]+)$/);
  if (cv) return { jenis: "cv", id: decodeURIComponent(cv[1]!) };
  if (url.pathname === "/app/lamaran") return { jenis: "lamaran", id: lamaran };
  if (url.pathname === "/app/pelamar") return { jenis: "pelamar", id: lamaran };
  if (url.pathname === "/app/profil") return { jenis: "profil" };
  return null;
}

/** A link that keeps its href (for new tabs and outside a drawer host) but opens in the drawer when it can. */
export function TautanLaci({ isi, ...props }: Omit<ComponentProps<typeof Link>, "onClick"> & { isi: IsiLaci | null; label?: string }) {
  const klik = useKlikLaci();
  const { label, ...sisa } = props;
  return <Link {...sisa} aria-label={label ?? sisa["aria-label"]} onClick={isi ? klik(isi) : undefined} />;
}
