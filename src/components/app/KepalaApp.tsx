"use client";

import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

/** How long the page has to stay still before a hidden header comes back. */
const DIAM_MS = 260;

// A page can dock one control into the header (Beranda docks its search bar once it scrolls
// under the header). While something is docked the header stays put instead of tucking away.
let dok: ReactNode = null;
const pendengarDok = new Set<() => void>();
export function aturDok(isi: ReactNode) {
  dok = isi;
  pendengarDok.forEach((fn) => fn());
}
function useDok() {
  return useSyncExternalStore(
    (fn) => {
      pendengarDok.add(fn);
      return () => pendengarDok.delete(fn);
    },
    () => dok,
    () => null,
  );
}

/**
 * The app header follows the scroll. At the top of a page it sits flat on the page. Once you
 * scroll it turns into a slim frosted bar, and when the page title (the first visible h1) has
 * gone under it, the title appears in the bar so you still know where you are. Scrolling down
 * tucks it away; scrolling up, or simply stopping, brings it back. Keyboard focus always shows it.
 * An h1 can give a shorter name for the bar with data-ringkas.
 */
export function KepalaApp({ kiri, kanan }: { kiri: ReactNode; kanan: ReactNode }) {
  const path = usePathname();
  const [tergulir, setTergulir] = useState(false);
  const [sembunyi, setSembunyi] = useState(false);
  const [judul, setJudul] = useState({ teks: "", tampil: false });
  const isiDok = useDok();
  const [jalur, setJalur] = useState(path);
  if (jalur !== path) {
    setJalur(path);
    setSembunyi(false);
    setJudul((j) => ({ ...j, tampil: false }));
  }

  useEffect(() => {
    let akhir = window.scrollY;
    let bingkai = 0;
    let diam = 0;
    const hemat = window.matchMedia("(prefers-reduced-motion: reduce)");
    function hitung() {
      bingkai = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - akhir;
      akhir = y;
      setTergulir(y > 4);
      if (y < 96 || hemat.matches || dok) setSembunyi(false);
      else if (dy > 4) setSembunyi(true);
      else if (dy < -4) setSembunyi(false);
      window.clearTimeout(diam);
      diam = window.setTimeout(() => setSembunyi(false), DIAM_MS);
    }
    const saatGulir = () => {
      if (!bingkai) bingkai = requestAnimationFrame(hitung);
    };
    bingkai = requestAnimationFrame(hitung);
    window.addEventListener("scroll", saatGulir, { passive: true });
    return () => {
      window.removeEventListener("scroll", saatGulir);
      cancelAnimationFrame(bingkai);
      window.clearTimeout(diam);
    };
  }, []);

  // Watch the page title. Pages stream in and kept-alive pages stay in the DOM hidden, so look
  // again whenever the content changes and only take an h1 that is actually on screen.
  useEffect(() => {
    const utama = document.getElementById("utama");
    if (!utama) return;
    let io: IntersectionObserver | null = null;
    let h1: HTMLElement | null = null;
    function pasang() {
      const baru = Array.from(utama!.querySelectorAll<HTMLElement>("h1")).find((h) => h.offsetParent !== null && !h.classList.contains("sr-only")) ?? null;
      if (baru === h1) return;
      io?.disconnect();
      h1 = baru;
      if (!h1) return setJudul((j) => ({ ...j, tampil: false }));
      const teks = h1.dataset.ringkas ?? h1.textContent?.replace(/\s+/g, " ").trim() ?? "";
      io = new IntersectionObserver(
        ([e]) => setJudul({ teks, tampil: !e.isIntersecting && e.boundingClientRect.top < 64 }),
        { rootMargin: "-64px 0px 0px 0px" },
      );
      io.observe(h1);
    }
    const awal = requestAnimationFrame(pasang);
    const mo = new MutationObserver(pasang);
    mo.observe(utama, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(awal);
      mo.disconnect();
      io?.disconnect();
    };
  }, [path]);

  return (
    <header className="app-atas" data-tergulir={tergulir || undefined} data-sembunyi={(sembunyi && !isiDok) || undefined} data-dok={isiDok ? true : undefined}>
      <div className="app-atas-kiri">{kiri}</div>
      <p className="app-atas-judul" data-tampil={(judul.tampil && !isiDok) || undefined} aria-hidden="true">{judul.teks}</p>
      <AnimatePresence initial={false}>
        {isiDok && (
          <m.div
            key="dok"
            className="app-atas-dok"
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
          >
            {isiDok}
          </m.div>
        )}
      </AnimatePresence>
      {kanan}
    </header>
  );
}
