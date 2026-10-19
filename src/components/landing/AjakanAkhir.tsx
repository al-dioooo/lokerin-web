"use client";

import Link from "next/link";
import { m, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { MicIcon } from "../icons/interface";
import { GARIS } from "../kota/iso";
import { Muncul } from "../gerak/Muncul";
import { useKemajuan } from "./gulir";

// Greys from the town in the hero: lit faces white, shade a step darker, far things paler.
const BAYANG = "#F1EFEB";
const JAUH = "#F6F5F2";
const ALUR = "#D9D6D0";
const KERTAS = "#FAFAF7";

// Shapes of the panorama, back to front. The road winds from the foot of the mountain to the
// front of the picture and narrows as it goes back; its centre line is also the path the ojek
// rides along.
const JAUH_PATH = "M-10 262C60 238 120 232 190 214c60-15 110 6 170 0 40-4 80-26 130-30 60-5 120 30 200 26 70-4 130-40 210-40 80 0 150 30 240 40 40 4 60 0 70-2V440H-10Z";
const GUNUNG = "M290 312C420 282 510 200 562 160c8-6 17-9 27-9h22c10 0 19 3 27 9 52 40 142 122 272 152";
const BARISAN = "M-10 318C120 300 240 296 360 306c100 8 160 2 240-2 90-4 160 6 240 2 110-5 230-14 370-6";
const BUKIT_KIRI = "M-10 334C100 304 260 304 470 364";
const BUKIT_KANAN = "M716 366C860 316 1040 304 1210 322";
const SUNGAI = "M730 368C800 368 870 352 940 357C1010 362 1090 344 1210 338";
const JALAN = "M604 316C632 327 646 336 624 348C580 370 470 392 420 440L592 440C592 402 650 382 676 362C694 346 660 326 612 316Z";
const JALUR_OJEK = "M608 316C640 326 664 336 650 350C610 370 530 390 506 440";
const DEPAN_KIRI = "M-10 392C120 380 300 384 456 404";
const DEPAN_KANAN = "M604 404C700 384 900 378 1210 390";
const TEPI_BAWAH = "M-10 420C140 408 260 426 420 418C600 408 760 428 920 416C1040 408 1120 414 1210 420";

// Trees along the ridge in front of the mountain: x, and size.
const RIMBUN: [number, number][] = [[24, .5], [52, .42], [96, .46], [210, .4], [236, .5], [262, .38], [404, .44], [430, .36], [480, .42], [742, .4], [770, .48], [800, .36], [930, .44], [958, .38], [1010, .5], [1134, .42], [1162, .5]];
// The village by the road at the foot of the mountain: x, y, and whether there is work there.
const DESA: [number, number, boolean][] = [[548, 306, false], [580, 312, true], [664, 308, false], [694, 312, false]];

function Lapis({ y, children }: { y: MotionValue<number>; children: ReactNode }) {
  return <m.g style={{ y }}>{children}</m.g>;
}

function Pin({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cy="2" rx="6" ry="2" fill="#16181D" opacity=".08" />
      <g className="pin-ayun" style={{ animationDelay: `${i * 0.4}s` }}>
        <path d="M0 0-7.1-9.2A9 9 0 1 1 7.1-9.2Z" fill="#EA5A0C" stroke="#C2410C" strokeWidth=".8" />
        <circle cy="-15" r="3.4" fill="#FFFFFF" />
      </g>
    </g>
  );
}

function Pohon({ x, y, s = 1, redup = false }: { x: number; y: number; s?: number; redup?: boolean }) {
  const garis = redup ? "#B9B5AE" : GARIS;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v-14" stroke={garis} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-11-14a8 8 0 0 1 3-13 10 10 0 0 1 17-2 8 8 0 0 1 2 15Z" fill="#FFFFFF" stroke={garis} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3-15a7 7 0 0 0 6-9" fill="none" stroke={redup ? "#E4E2DE" : ALUR} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/** A house seen from the front. `kerja` gives it the orange roof that means there is work here. */
function Rumah({ x, y, w = 34, h = 22, kerja = false, s = 1 }: { x: number; y: number; w?: number; h?: number; kerja?: boolean; s?: number }) {
  const atap = kerja ? "#F9A15A" : "#EEEDEA";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill="#FFFFFF" stroke={GARIS} strokeWidth="1.3" />
      <rect x={w / 2 - 9} y={-h} width="9" height={h} fill={BAYANG} stroke={GARIS} strokeWidth="1.3" />
      <path d={`M${-w / 2 - 4} ${-h}L${-w / 2 + 6} ${-h - 13}H${w / 2 - 6}L${w / 2 + 4} ${-h}Z`} fill={atap} stroke={GARIS} strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="-4" y="-12" width="8" height="12" fill={kerja ? "#FDE6D2" : "#F3F3EF"} stroke={GARIS} strokeWidth="1.1" />
      <rect x={-w / 2 + 4} y={-h + 6} width="7" height="6" fill="#F3F3EF" stroke={GARIS} strokeWidth="1" />
    </g>
  );
}

/** The warung with its striped awning, where the Butuh Hari Ini job is. */
function Warung({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-26" y="-30" width="52" height="30" fill="#FFF6EE" stroke={GARIS} strokeWidth="1.3" />
      <path d="M-30-30-24-44H24L30-30Z" fill="#EEEDEA" stroke={GARIS} strokeWidth="1.3" strokeLinejoin="round" />
      <g stroke={GARIS} strokeWidth="1.1">
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${-30 + i * 10} -30h10v7a5 5 0 0 1-10 0Z`} fill={i % 2 ? "#FFFFFF" : "#F26A1B"} />)}
      </g>
      <rect x="-20" y="-14" width="40" height="14" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.1" />
      <path d="M-16-9h10M2-9h12" stroke={ALUR} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Awan({ x, y, s = 1, kelas }: { x: number; y: number; s?: number; kelas: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={kelas}>
        <path d="M-34 0a12 12 0 0 1 8-20 16 16 0 0 1 28-8 13 13 0 0 1 22 6 10 10 0 0 1 10 22Z" fill="#FFFFFF" stroke="#CFCCC6" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M-20-6h28" stroke="#E4E2DE" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Burung({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="burung-kepak" style={{ animationDelay: `${i * 0.3}s` }} d="M-6 0q3-4 6 0q3-4 6 0" fill="none" stroke="#8C8880" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Motor() {
  return (
    <g transform="translate(0 -1)">
      <ellipse cy="1" rx="18" ry="2.5" fill="#16181D" opacity=".08" />
      <circle cx="-11" cy="-6" r="6" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.5" />
      <circle cx="11" cy="-6" r="6" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.5" />
      <path d="M-11-6h8l5-9h8l1 9" fill="none" stroke={GARIS} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="-21" y="-25" width="13" height="11" rx="2" fill="#F26A1B" stroke={GARIS} strokeWidth="1.1" />
      <path d="M-5-15l3-10 7 2" fill="none" stroke={GARIS} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="-1" cy="-30" r="4.8" fill="#EA5A0C" stroke={GARIS} strokeWidth="1.1" />
      <path d="M11-16l3.5-2" stroke={GARIS} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

/**
 * An ojek with a delivery box rides the winding road toward the viewer and grows as it comes
 * closer. SVG motion keeps it on the road in the drawing's own coordinates; with reduced motion
 * it simply stands on the road near the front.
 */
function Ojek() {
  const diam = useReducedMotion();
  if (diam) return <g transform="translate(560 392) scale(1.05)"><Motor /></g>;
  return (
    <g>
      <animateMotion dur="14s" repeatCount="indefinite" path={JALUR_OJEK} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1" />
      <g>
        <animateTransform attributeName="transform" type="scale" dur="14s" repeatCount="indefinite" values=".3;1.35" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1" />
        <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;.08;.9;1" />
        <Motor />
      </g>
    </g>
  );
}

function Panorama({ p }: { p: MotionValue<number> }) {
  const jauhY = useTransform(p, [0, 1], [26, 0]);
  const matahariY = useTransform(p, [0, 1], [50, 0]);
  const gunungY = useTransform(p, [0, 1], [44, 0]);
  const barisanY = useTransform(p, [0, 1], [24, 0]);
  const bukitY = useTransform(p, [0, 1], [12, 0]);
  return (
    <svg viewBox="0 0 1200 440" preserveAspectRatio="xMidYMax slice" className="ajakan-panorama" aria-hidden="true">
      <defs>
        <clipPath id="klip-gunung"><path d={`${GUNUNG}Z`} /></clipPath>
        <clipPath id="klip-bukit-kiri"><path d={`${BUKIT_KIRI}V440H-10Z`} /></clipPath>
        <clipPath id="klip-bukit-kanan"><path d={`${BUKIT_KANAN}V440H716Z`} /></clipPath>
      </defs>

      <Awan x={230} y={128} kelas="awan-geser" />
      <Awan x={1030} y={104} s={0.85} kelas="awan-geser awan-lambat" />
      <Awan x={460} y={78} s={0.6} kelas="awan-geser awan-pelan" />
      <Burung x={352} y={186} i={0} /><Burung x={374} y={176} i={1} /><Burung x={394} y={190} i={2} />
      <Burung x={804} y={150} i={3} /><Burung x={824} y={142} i={4} />

      {/* The sun sits half behind the far ridge and rises a little as the page reaches the end. */}
      <Lapis y={matahariY}>
        <g transform="translate(930 186)">
          <g className="sinar-putar" stroke="#F7C9A0" strokeWidth="1.6" strokeLinecap="round">
            {Array.from({ length: 14 }, (_, i) => <path key={i} d="M0-64v-14" transform={`rotate(${i * (360 / 14)})`} />)}
          </g>
          <circle r="50" fill="#FFF1E8" stroke="#F7C9A0" strokeWidth="1.4" />
          <circle r="36" fill="none" stroke="#FDE0CA" strokeWidth="1.2" />
        </g>
      </Lapis>

      <Lapis y={jauhY}>
        <path d={JAUH_PATH} fill={JAUH} stroke="#E4E2DE" strokeWidth="1.2" />
        <path d="M120 236c30-6 50-2 70-8M780 210c40 0 70 12 110 20" fill="none" stroke="#E4E2DE" strokeWidth="1.2" strokeLinecap="round" />
      </Lapis>

      <Lapis y={gunungY}>
        <path d={`${GUNUNG}Z`} fill="#FFFFFF" />
        <g clipPath="url(#klip-gunung)">
          {/* The far side of the cone is in shade; hatching gives it volume without a gradient. */}
          <path d="M606 154C624 200 650 250 640 320H920V120Z" fill={BAYANG} />
          <g stroke={ALUR} strokeWidth="1.2" strokeLinecap="round">
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${660 + i * 24} ${196 + i * 11}l12 22`} />)}
          </g>
          <path d="M596 156C588 200 566 250 520 312M616 156c14 44 40 100 92 156M578 158c-26 38-74 96-150 154M630 160c32 40 82 96 168 152" fill="none" stroke={ALUR} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M556 190c14 6 28 5 40-2M626 192c12 7 26 8 40 3M512 232c12 5 24 5 34-1M670 236c12 6 26 7 40 2" fill="none" stroke="#E4E2DE" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <path d={GUNUNG} fill="none" stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M589 153c7 5 15 6 22 0" fill="none" stroke={GARIS} strokeWidth="1.3" strokeLinecap="round" />
        <g fill="#FFFFFF" stroke="#CFCCC6" strokeWidth="1.2">
          <circle className="asap-naik" cx="600" cy="140" r="7" />
          <circle className="asap-naik asap-2" cx="609" cy="132" r="5.5" />
          <circle className="asap-naik asap-3" cx="595" cy="126" r="4.5" />
        </g>
        <Pin x={536} y={232} i={0} />
      </Lapis>

      <Lapis y={barisanY}>
        <path d={`${BARISAN}V440H-10Z`} fill="#FFFFFF" />
        <g fill="none" stroke="#ECEAE6" strokeWidth="1.2" strokeLinecap="round">
          {/* Fields in the middle distance: long flat strips that get further apart toward the front. */}
          {[322, 330, 340, 352].map((y) => <path key={y} d={`M440 ${y}C540 ${y - 6} 700 ${y - 6} 760 ${y}`} />)}
        </g>
        <path d={BARISAN} fill="none" stroke="#BDBAB4" strokeWidth="1.3" />
        {RIMBUN.map(([x, s]) => <Pohon key={x} x={x} y={300 + Math.abs(x - 600) / 80} s={s} redup />)}
        {DESA.map(([x, y, kerja]) => <Rumah key={x} x={x} y={y} s={0.42} kerja={kerja} />)}
      </Lapis>

      <Lapis y={bukitY}>
        <path d={`${BUKIT_KIRI}V440H-10Z`} fill="#FFFFFF" />
        <g clipPath="url(#klip-bukit-kiri)" fill="none" stroke={ALUR} strokeWidth="1.2" strokeLinecap="round">
          {/* Sawah terraces follow the curve of the hill. */}
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-10 ${346 + i * 12}C100 ${316 + i * 12} 260 ${316 + i * 12} 470 ${376 + i * 12}`} />)}
        </g>
        <path d={BUKIT_KIRI} fill="none" stroke={GARIS} strokeWidth="1.4" />
        <path d={`${BUKIT_KANAN}V440H716Z`} fill="#FBFAF8" />
        <g clipPath="url(#klip-bukit-kanan)" fill="none" stroke="#E4E2DE" strokeWidth="1.2" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M716 ${378 + i * 12}C860 ${328 + i * 12} 1040 ${316 + i * 12} 1210 ${334 + i * 12}`} />)}
        </g>
        <path d={BUKIT_KANAN} fill="none" stroke={GARIS} strokeWidth="1.4" />
        {/* An irrigation canal runs through the sawah. */}
        <path d={SUNGAI} fill="none" stroke={GARIS} strokeWidth="9" strokeLinecap="round" />
        <path d={SUNGAI} fill="none" stroke="#F3F3EF" strokeWidth="6.4" strokeLinecap="round" />
        <path d={SUNGAI} fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeDasharray="6 22" strokeLinecap="round" className="air-mengalir" />
        <Pohon x={70} y={330} s={0.7} /><Pohon x={92} y={327} s={0.56} />
        <Pohon x={150} y={322} s={0.62} /><Pohon x={430} y={356} s={0.6} /><Pohon x={452} y={360} s={0.48} />
        <Pohon x={790} y={346} s={0.56} /><Pohon x={1160} y={326} s={0.6} /><Pohon x={1182} y={328} s={0.46} />
        <Rumah x={322} y={334} s={0.66} kerja />
        <Pin x={322} y={300} i={2} />
        <Pohon x={372} y={340} s={0.6} />
        <Pohon x={968} y={318} s={0.64} /><Rumah x={1040} y={318} s={0.62} kerja /><Pohon x={1090} y={318} s={0.54} />
        <Pin x={1040} y={286} i={4} />
      </Lapis>

      {/* A bank on each side of the road, where the nearest houses stand. */}
      <path d={`${DEPAN_KIRI}V440H-10Z`} fill="#FFFFFF" />
      <path d={DEPAN_KIRI} fill="none" stroke={GARIS} strokeWidth="1.4" />
      <path d={`${DEPAN_KANAN}V440H604Z`} fill="#FFFFFF" />
      <path d={DEPAN_KANAN} fill="none" stroke={GARIS} strokeWidth="1.4" />
      <g stroke={ALUR} strokeWidth="1.2" strokeLinecap="round">
        {[[24, 412], [250, 418], [430, 420], [700, 410], [940, 412], [1170, 408]].map(([x, y]) => <path key={x} d={`M${x} ${y}l-3-6M${x + 5} ${y}v-7M${x + 10} ${y}l3-6`} />)}
      </g>

      {/* The road and the village along it are in front of everything. */}
      <path d={JALAN} fill="#ECEAE6" stroke={GARIS} strokeWidth="1.4" strokeLinejoin="round" />
      <path d={JALUR_OJEK} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="12 10" strokeLinecap="round" />
      <Ojek />

      <Pohon x={50} y={404} s={1.6} /><Pohon x={90} y={408} s={1.15} />
      <g transform="translate(176 402) scale(1.55)"><Warung x={0} y={0} /></g>
      <Pin x={176} y={318} i={3} />
      <Pohon x={292} y={404} s={1.35} />
      <Rumah x={372} y={408} s={1.2} />
      <g stroke={GARIS} strokeWidth="1.3" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${628 + i * 20} ${398 - i * 6}v-11`} />)}
        <path d="M628 392l80-24" />
      </g>
      <Rumah x={800} y={396} s={1.3} kerja />
      <Pin x={800} y={334} i={5} />
      <Rumah x={896} y={392} w={30} s={1.1} />
      <Pohon x={966} y={394} s={1.4} /><Pohon x={1086} y={398} s={1.75} /><Pohon x={1132} y={402} s={1.15} />

      {/* The ground curves gently into the footer. */}
      <path d={`${TEPI_BAWAH}V450H-10Z`} fill={KERTAS} />
      <path d={TEPI_BAWAH} fill="none" stroke={GARIS} strokeWidth="1.4" />
    </svg>
  );
}

/** Closing call to action over Gunung Slamet, the mountain every Banyumas town looks up to. */
export function AjakanAkhir() {
  const ref = useRef<HTMLElement>(null);
  const p = useKemajuan(ref, ["start end", "end end"]);
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
      <Panorama p={p} />
    </section>
  );
}
