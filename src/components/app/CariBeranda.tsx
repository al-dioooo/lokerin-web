"use client";

import { useEffect, useRef } from "react";
import { IconMicrophone, IconSearch } from "../icons/tabler";
import { aturDok } from "./KepalaApp";
import { TautanNgobrol } from "./TautanNgobrol";

/** Slim version of the search bar that lives in the header while the big one is scrolled away. */
function CariRingkas() {
  return (
    <TautanNgobrol className="cari-dok" aria-label="Cari kerja lewat Ngobrol">
      <IconSearch size={18} className="shrink-0 text-abu" />
      <span className="min-w-0 flex-1 truncate">Cari kerja…</span>
      <span className="cari-dok-mic" aria-hidden="true"><IconMicrophone size={16} stroke={2} /></span>
    </TautanNgobrol>
  );
}

/**
 * The Beranda search bar. It opens Ngobrol, where you search by talking or typing. Once it slides
 * under the header it docks there as a slim bar, so searching stays one tap away down the page.
 */
export function CariBeranda() {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => aturDok(!e.isIntersecting && e.boundingClientRect.top < 64 ? <CariRingkas /> : null), {
      rootMargin: "-60px 0px 0px 0px",
    });
    io.observe(el);
    return () => {
      io.disconnect();
      aturDok(null);
    };
  }, []);
  return (
    <TautanNgobrol ref={ref} className="kolom-cari kolom-cari-beranda mt-4">
      <IconSearch size={20} className="shrink-0 text-abu" />
      <span className="min-w-0 flex-1 truncate text-[15px] text-abu">Cari kerja, misalnya &ldquo;las pagar&rdquo;</span>
      <span className="tombol tombol-utama min-h-10 shrink-0 px-3 text-sm"><IconMicrophone size={16} />Ngobrol</span>
    </TautanNgobrol>
  );
}
