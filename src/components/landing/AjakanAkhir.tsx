"use client";

import Link from "next/link";
import { m, useTransform } from "motion/react";
import { useRef } from "react";
import { MicIcon } from "../icons/interface";
import { GARIS } from "../kota/iso";
import { Muncul } from "../gerak/Muncul";
import { useKemajuan } from "./gulir";

function Pin({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="pin-ayun" style={{ animationDelay: `${i * 0.4}s` }}>
        <path d="M0 0-7.1-9.2A9 9 0 1 1 7.1-9.2Z" fill="#EA5A0C" />
        <circle cy="-15" r="3.4" fill="#FFFFFF" />
      </g>
    </g>
  );
}

function Pohon({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v-14" stroke={GARIS} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-11-14a8 8 0 0 1 3-13 10 10 0 0 1 17-2 8 8 0 0 1 2 15Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  );
}

// An ojek with a delivery box, riding along the road at the foot of the mountain.
function Motor() {
  return (
    <g transform="translate(300 0)">
      <g className="motor-jalan">
      <g transform="translate(0 330)">
        <circle cx="-14" cy="0" r="7" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
        <circle cx="14" cy="0" r="7" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
        <path d="M-14 0h10l6-10h10l2 10" fill="none" stroke={GARIS} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="-26" y="-22" width="15" height="13" rx="2" fill="#F26A1B" stroke={GARIS} strokeWidth="1.2" />
        <path d="M-6-10l3-12 8 2" fill="none" stroke={GARIS} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="-2" cy="-28" r="5.5" fill="#EA5A0C" stroke={GARIS} strokeWidth="1.2" />
        <path d="M14-12l4-2" stroke={GARIS} strokeWidth="1.8" strokeLinecap="round" />
      </g>
      </g>
    </g>
  );
}

/** Closing call to action over Gunung Slamet, the mountain every Banyumas town looks up to. */
export function AjakanAkhir() {
  const ref = useRef<HTMLElement>(null);
  const p = useKemajuan(ref, ["start end", "end end"]);
  const gunungY = useTransform(p, [0, 1], [50, 0]);
  const matahariY = useTransform(p, [0, 1], [90, 0]);
  return (
    <section ref={ref} className="ajakan-akhir" aria-labelledby="judul-ajakan">
      <div className="shell relative z-10 flex flex-col items-center pt-20 text-center sm:pt-28">
        <Muncul className="flex flex-col items-center">
          <h2 id="judul-ajakan" className="max-w-2xl text-[clamp(1.9rem,1.3rem+2.4vw,3.2rem)] leading-[1.1]">Ada kerja di dekatmu. <span className="block text-jingga">Ceritakan saja.</span></h2>
          <p className="mt-4 max-w-lg text-base text-abu">Mulai dari satu kalimat: kamu bisa apa, di mana, dan jam berapa.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/masuk" className="tombol tombol-utama min-h-12 px-6 text-base"><MicIcon size={18} />Mulai ngobrol</Link>
            <Link href="/masuk" className="tombol tombol-garis min-h-12 px-6 text-base">Pasang lowongan</Link>
          </div>
        </Muncul>
      </div>
      <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" className="ajakan-panorama" aria-hidden="true">
        <m.g style={{ y: matahariY }}><circle cx="790" cy="150" r="62" fill="#FFF1E8" stroke="#F7C9A0" strokeWidth="1.4" /></m.g>
        <m.g style={{ y: gunungY }}>
          <path d="M110 330C320 280 470 150 568 116c12-4 20-4 30 2l10 6 10-6c10-6 18-6 30-2 98 34 248 164 458 214Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M608 124c-6 50-34 110-80 196M640 122c14 46 52 104 116 190M585 120c-30 40-90 110-170 200" fill="none" stroke="#D9D9D4" strokeWidth="1.4" strokeLinecap="round" />
          <Pin x={470} y={262} i={0} />
          <Pin x={720} y={238} i={1} />
        </m.g>
        <path d="M0 290c110-4 230 4 350 46H0Z" fill="#F2F1EE" /><path d="M0 290c110-4 230 4 350 46" fill="none" stroke={GARIS} strokeWidth="1.4" />
        <path d="M820 336c130-60 260-64 380-50v50Z" fill="#F2F1EE" /><path d="M820 336c130-60 260-64 380-50" fill="none" stroke={GARIS} strokeWidth="1.4" />
        <Pin x={1010} y={300} i={2} />
        <rect x="0" y="336" width="1200" height="30" fill="#FFFFFF" />
        <path d="M0 337h1200" stroke={GARIS} strokeWidth="1.4" />
        <path d="M0 349h1200" stroke="#D9D9D4" strokeWidth="1.4" strokeDasharray="14 12" />
        <Pohon x={160} y={336} /><Pohon x={186} y={336} s={0.8} /><Pohon x={930} y={336} s={0.9} /><Pohon x={1100} y={336} />
        <Motor />
      </svg>
    </section>
  );
}
