"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { GARIS } from "../kota/iso";
import { Muncul } from "../gerak/Muncul";
import { useKemajuan } from "./gulir";

const MASALAH = [
  ["Infonya beredar di grup “info loker” tanpa dicek.", "Ada yang minta transfer dulu sebelum wawancara."],
  ["Banyak pekerja jarang mengetik.", "Menulis CV terasa seperti urusan orang kantoran."],
  ["Pemilik warung butuh orang hari ini.", "Pasang iklan di portal kerja makan waktu berhari-hari."],
] as const;

// Each scrap of "info loker" starts on the phone screen and drifts off as the clean card arrives.
const SOBEKAN = [
  { x: 166, y: 74, putar: -6, ke: [-150, -30, -22] },
  { x: 196, y: 150, putar: 5, ke: [150, -10, 18] },
  { x: 170, y: 228, putar: -3, ke: [-140, 60, -14] },
] as const;

function Sobekan({ i, p }: { i: number; p: MotionValue<number> }) {
  const s = SOBEKAN[i];
  const x = useTransform(p, [0.18, 0.5], [0, s.ke[0]]);
  const y = useTransform(p, [0.18, 0.5], [0, s.ke[1]]);
  const rotate = useTransform(p, [0.18, 0.5], [0, s.ke[2]]);
  const opacity = useTransform(p, [0.18, 0.5], [1, 0.22]);
  return (
    <g transform={`translate(${s.x} ${s.y}) rotate(${s.putar})`}>
      <m.g style={{ x, y, rotate, opacity }}>
        <rect width="118" height="58" rx="10" fill="#F2F1EE" stroke={GARIS} strokeWidth="1.4" />
        {i === 0 && <><text x="10" y="20" className="piksel" fontSize="9" fill="#B42318">INFO LOKER!!</text><rect x="10" y="30" width="92" height="5" rx="2.5" fill="#CFCCC6" /><rect x="10" y="42" width="60" height="5" rx="2.5" fill="#CFCCC6" /></>}
        {i === 1 && <><text x="10" y="22" fontSize="11" fontWeight="800" fill="#16181D">gaji 5 jt/minggu</text><text x="10" y="40" fontSize="9.5" fontWeight="700" fill="#B42318">transfer dulu Rp50rb</text></>}
        {i === 2 && <><text x="10" y="22" fontSize="11" fontWeight="800" fill="#16181D">DM aja, cepat</text><rect x="10" y="32" width="70" height="5" rx="2.5" fill="#CFCCC6" /><circle cx="98" cy="36" r="10" fill="#FDECEA" stroke="#B42318" strokeWidth="1.4" /><text x="98" y="40" textAnchor="middle" fontSize="12" fontWeight="800" fill="#B42318">?</text></>}
      </m.g>
    </g>
  );
}

function KartuRapi({ p }: { p: MotionValue<number> }) {
  const y = useTransform(p, [0.32, 0.56], [70, 0]);
  const opacity = useTransform(p, [0.32, 0.5], [0, 1]);
  const scale = useTransform(p, [0.32, 0.56], [0.9, 1]);
  return (
    <g transform="translate(160 112)">
      <m.g style={{ y, opacity, scale }}>
        <rect width="160" height="172" rx="14" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.4" />
        <rect x="12" y="12" width="30" height="30" rx="9" fill="#FFF1E8" /><circle cx="27" cy="27" r="9" fill="#FFFFFF" stroke="#EA5A0C" strokeWidth="1.8" /><circle cx="27" cy="27" r="4.5" fill="none" stroke="#F26A1B" strokeWidth="1.4" />
        <text x="50" y="26" fontSize="13" fontWeight="800" fill="#16181D">Cuci piring</text>
        <text x="50" y="42" fontSize="10" fontWeight="600" fill="#5C6066">Warung Bu Wati</text>
        <rect x="12" y="56" width="98" height="22" rx="11" fill="#E8F5EE" />
        <path d="m21 67 3.5 3.5 6.5-7" fill="none" stroke="#18794E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="36" y="71" fontSize="10" fontWeight="800" fill="#18794E">Terverifikasi</text>
        <text x="12" y="102" fontSize="13" fontWeight="800" fill="#16181D">Rp120.000/hari</text>
        <text x="12" y="118" fontSize="10" fontWeight="600" fill="#5C6066">Purwokerto · 1,2 km</text>
        <rect x="12" y="132" width="136" height="28" rx="14" fill="#EA5A0C" />
        <text x="80" y="150" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FFFFFF">Saya bisa</text>
      </m.g>
    </g>
  );
}

/** A phone full of unchecked "info loker" scraps that turns into one checked job card as you scroll. */
function PonselLoker({ p }: { p: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 480 420" className="h-auto w-full" role="img" aria-label="Pesan info loker yang berantakan di ponsel berganti menjadi satu kartu lowongan terverifikasi">
      <ellipse cx="240" cy="398" rx="150" ry="12" fill="#F3F3EF" />
      <rect x="140" y="20" width="200" height="370" rx="30" fill="#FFFFFF" stroke={GARIS} strokeWidth="2" />
      <rect x="152" y="50" width="176" height="306" rx="16" fill="#FAFAF7" stroke="#D9D9D4" strokeWidth="1.2" />
      <path d="M220 35h40" stroke={GARIS} strokeWidth="2" strokeLinecap="round" />
      <path d="M226 372h28" stroke="#D9D9D4" strokeWidth="3" strokeLinecap="round" />
      {SOBEKAN.map((_, i) => <Sobekan key={i} i={i} p={p} />)}
      <KartuRapi p={p} />
    </svg>
  );
}

export function MasalahLoker() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useKemajuan(ref, ["start end", "end start"]);
  return (
    <section id="masalah" className="shell py-20 sm:py-28" aria-labelledby="judul-masalah">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <Muncul className="max-w-xl">
            <p className="pil-piksel mb-4">Kenapa Lokerin</p>
            <h2 id="judul-masalah" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Lowongan warung jarang sampai ke <span className="text-jingga">portal kerja.</span></h2>
            <p className="mt-5 flex items-baseline gap-3"><span className="text-4xl font-extrabold tracking-tight text-jingga-tua">59,30%</span><span className="text-sm text-abu">penduduk bekerja ada di sektor informal, sekitar 87,88 juta orang (BPS, Mei 2026).</span></p>
          </Muncul>
          <Muncul jeda={0.1}>
            <ul className="mt-7 grid gap-3">
              {MASALAH.map(([judul, isi]) => <li key={judul} className="masalah-baris"><span aria-hidden="true" /><div><p className="font-bold">{judul}</p><p className="text-sm text-abu">{isi}</p></div></li>)}
            </ul>
            <p className="mt-6 max-w-xl text-base">Di Lokerin, pemilik usaha dicek dulu, upah dibandingkan dengan UMK, dan pekerja cukup bercerita.</p>
          </Muncul>
        </div>
        <div ref={ref} className="mx-auto w-full max-w-[480px]"><PonselLoker p={p} /></div>
      </div>
    </section>
  );
}
