"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { GARIS } from "../kota/iso";
import { Muncul } from "../gerak/Muncul";
import { useKemajuan } from "./gulir";

const POIN = [
  ["Lencana yang bisa dibaca", "Terverifikasi selalu menyebut apa yang dicek (KTP, NPWP, atau foto usaha) dan tanggalnya."],
  ["Upah dibandingkan dengan UMK", "Upah di bawah UMK diberi peringatan. Upah yang terlalu tinggi juga ditandai, karena sering jadi umpan penipuan."],
  ["Nomormu tidak langsung tersebar", "Pemilik usaha baru melihat kontakmu setelah lamaranmu lolos."],
  ["Suara tidak disimpan", "Yang disimpan hanya teks obrolan dan hasilnya, dan kamu bisa menghapusnya."],
] as const;

// One row of the clipboard: a small drawing of the document, its name, and a tick that lands on scroll.
function Baris({ y, judul, p, mulai, children }: { y: number; judul: string; p: MotionValue<number>; mulai: number; children: ReactNode }) {
  const scale = useTransform(p, [mulai, mulai + 0.06], [0.3, 1]);
  const opacity = useTransform(p, [mulai, mulai + 0.04], [0, 1]);
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x="114" y="0" width="56" height="42" rx="8" fill="#F3F3EF" stroke={GARIS} strokeWidth="1.4" />
      {children}
      <text x="184" y="18" fontSize="14" fontWeight="800" fill="#16181D">{judul}</text>
      <text x="184" y="34" fontSize="10.5" fontWeight="600" fill="#5C6066">dicek 18 Okt 2026</text>
      <g transform="translate(296 21)">
        <circle r="14" fill="none" stroke="#D9D9D4" strokeWidth="1.4" strokeDasharray="3 4" />
        <m.g style={{ scale, opacity }}>
          <circle r="14" fill="#18794E" />
          <path d="m-6 0 4 4 8-8" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </m.g>
      </g>
    </g>
  );
}

/** A clipboard where KTP, NPWP and the shop photo get ticked one by one, then the stamp lands. */
function PapanCek({ p }: { p: MotionValue<number> }) {
  const capScale = useTransform(p, [0.5, 0.56], [1.7, 1]);
  const capOpacity = useTransform(p, [0.5, 0.54], [0, 1]);
  const labelY = useTransform(p, [0.2, 0.6], [24, 0]);
  return (
    <svg viewBox="0 0 440 370" className="h-auto w-full" role="img" aria-label="Papan periksa: KTP, NPWP, dan foto usaha dicentang satu per satu, lalu dicap Terverifikasi">
      <ellipse cx="210" cy="352" rx="150" ry="11" fill="#F3F3EF" />
      <rect x="92" y="40" width="236" height="296" rx="18" fill="#FFFFFF" stroke={GARIS} strokeWidth="2" />
      <rect x="170" y="26" width="80" height="30" rx="8" fill="#F3F3EF" stroke={GARIS} strokeWidth="2" />
      <circle cx="210" cy="41" r="4" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
      <Baris y={78} judul="KTP" p={p} mulai={0.24}>
        <rect x="122" y="8" width="40" height="26" rx="4" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.2" /><circle cx="132" cy="19" r="4" fill="#DEDCD7" /><path d="M128 28h8M141 15h15M141 21h11" stroke="#BDBAB4" strokeWidth="2" strokeLinecap="round" />
      </Baris>
      <Baris y={146} judul="NPWP" p={p} mulai={0.32}>
        <rect x="122" y="8" width="40" height="26" rx="4" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.2" /><path d="M128 15h28M128 21h20M128 27h24" stroke="#BDBAB4" strokeWidth="2" strokeLinecap="round" />
      </Baris>
      <Baris y={214} judul="Foto usaha" p={p} mulai={0.4}>
        <rect x="124" y="5" width="36" height="32" rx="3" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.2" /><path d="M128 14h28v4a3.5 3.5 0 0 1-7 0 3.5 3.5 0 0 1-7 0 3.5 3.5 0 0 1-7 0 3.5 3.5 0 0 1-7 0Z" fill="#F26A1B" /><path d="M131 22v9M153 22v9M129 26h26" stroke={GARIS} strokeWidth="1.2" strokeLinecap="round" />
      </Baris>
      <g transform="translate(210 300) rotate(-7)">
        <m.g style={{ scale: capScale, opacity: capOpacity }}>
          <rect x="-82" y="-19" width="164" height="38" rx="9" fill="#E8F5EE" stroke="#18794E" strokeWidth="2.5" />
          <text y="6" textAnchor="middle" fontSize="15" fontWeight="900" letterSpacing="1.5" fill="#18794E">TERVERIFIKASI</text>
        </m.g>
      </g>
      <g transform="translate(384 96) rotate(8)">
        <m.g style={{ y: labelY }}>
          <path d="M0 -40v26" stroke={GARIS} strokeWidth="1.4" />
          <rect x="-50" y="-14" width="100" height="52" rx="10" fill="#FFF1E8" stroke="#EA5A0C" strokeWidth="1.6" />
          <circle cx="0" cy="-6" r="3" fill="#FFFFFF" stroke="#EA5A0C" strokeWidth="1.4" />
          <text y="12" textAnchor="middle" fontSize="12" fontWeight="800" fill="#16181D">Rp120rb/hari</text>
          <text y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill="#18794E">di atas UMK</text>
        </m.g>
      </g>
    </svg>
  );
}

export function BisaDipercaya() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useKemajuan(ref, ["start end", "end start"]);
  return (
    <section id="terverifikasi" className="shell py-20 sm:py-28" aria-labelledby="judul-percaya">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div ref={ref} className="mx-auto w-full max-w-[460px] lg:order-2"><PapanCek p={p} /></div>
        <div>
          <Muncul className="max-w-xl"><p className="pil-piksel mb-4">Bisa dipercaya</p><h2 id="judul-percaya" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Yang memasang lowongan <span className="text-jingga">sudah dicek dulu.</span></h2></Muncul>
          <Muncul jeda={0.1}>
            <dl className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {POIN.map(([judul, isi]) => <div key={judul} className="border-t border-garis pt-4"><dt className="font-bold">{judul}</dt><dd className="mt-1 text-sm text-abu">{isi}</dd></div>)}
            </dl>
          </Muncul>
        </div>
      </div>
    </section>
  );
}
