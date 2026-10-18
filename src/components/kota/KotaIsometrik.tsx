import type { ReactNode } from "react";
import {
  ABU, ATAP_JINGGA, AtapPelana, Bidang, GARIS, Garis, JINGGA, JendelaKanan, JendelaKiri, Kotak, Lantai, Motor, PanelKiri, Pagar, Pohon, TeritisKanan, TeritisKiri, proyeksi,
} from "./iso";

const JALAN = "#E7E5E1";
const PLOT = "#FDE9D6";
const AIR = "#EEF1F1";
const KACA = "#F7F6F3";
const KACA_JINGGA = "#FFE2C8";

// The visible band of the town, in projected SVG units.
export const KOTAK_PANDANG = { x: -470, y: 30, w: 1090, h: 560 };

function persen(x: number, y: number, z: number) {
  const [px, py] = proyeksi(x, y, z);
  return { kiri: ((px - KOTAK_PANDANG.x) / KOTAK_PANDANG.w) * 100, atas: ((py - KOTAK_PANDANG.y) / KOTAK_PANDANG.h) * 100 };
}

/** Where each highlighted workplace sits on the illustration, as percentages, for HTML pins. */
export const LOKASI_KERJA = {
  warung: persen(23, 13.5, 7.4),
  bengkel: persen(41, 13.5, 7.4),
  laundry: persen(24.5, 30, 7.6),
  bangunan: persen(42, 29.5, 7.6),
} as const;

type Objek = { kunci: number; isi: ReactNode };

function Rumah({ x, y, w, d, h = 3, arah = "x" as "x" | "y", jendela = 2 }: { x: number; y: number; w: number; d: number; h?: number; arah?: "x" | "y"; jendela?: number }) {
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} />
      <JendelaKiri y={y + d} x0={x + 0.6} x1={x + w - 0.6} z0={1} z1={2.2} jumlah={jendela} isi={KACA} />
      <JendelaKanan x={x + w} y0={y + 0.6} y1={y + d - 0.6} z0={1} z1={2.2} jumlah={Math.max(1, jendela - 1)} isi={KACA} />
      <AtapPelana x={x} y={y} w={w} d={d} h={h} arah={arah} />
    </g>
  );
}

function Ruko({ x, y, w, d, h = 6 }: { x: number; y: number; w: number; d: number; h?: number }) {
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} />
      <JendelaKiri y={y + d} x0={x + 0.5} x1={x + w - 0.5} z0={3.6} z1={5} jumlah={3} isi={KACA} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 0.8} z0={0} z1={2.4} isi={KACA} />
      <JendelaKanan x={x + w} y0={y + 0.6} y1={y + d - 0.6} z0={3.6} z1={5} jumlah={2} isi={KACA} />
      <Kotak x={x} y={y} z={h} w={w} d={0.4} h={0.6} />
      <Kotak x={x} y={y} z={h} w={0.4} d={d} h={0.6} />
    </g>
  );
}

function Masjid({ x, y }: { x: number; y: number }) {
  const [cx, cy] = proyeksi(x + 4, y + 3.5, 4.6);
  return (
    <g>
      <Kotak x={x} y={y} w={8} d={7} h={4.4} />
      <JendelaKiri y={y + 7} x0={x + 0.8} x1={x + 7.2} z0={1} z1={3} jumlah={3} isi={KACA} />
      <JendelaKanan x={x + 8} y0={y + 0.8} y1={y + 6.2} z0={1} z1={3} jumlah={2} isi={KACA} />
      <path d={`M${cx - 30} ${cy}a30 26 0 0 1 60 0Z`} fill="#FFFFFF" stroke={GARIS} strokeWidth={1.1} />
      <path d={`M${cx - 30} ${cy}a30 7 0 0 0 60 0`} fill="none" stroke={GARIS} strokeWidth={1.1} />
      <line x1={cx} y1={cy - 26} x2={cx} y2={cy - 38} stroke={GARIS} strokeWidth={1.2} />
      <circle cx={cx} cy={cy - 40} r={2.4} fill="#FFFFFF" stroke={GARIS} strokeWidth={1} />
      <Kotak x={x + 9} y={y} w={1.4} d={1.4} h={11} />
      <Kotak x={x + 8.8} y={y - 0.2} z={8} w={1.8} d={1.8} h={0.5} />
    </g>
  );
}

function Warung() {
  const x = 19, y = 10, w = 8, d = 7, h = 3.4;
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} warna={JINGGA} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 0.8} z0={0} z1={2.5} isi="#FFF3E8" />
      <Kotak x={x + 1.2} y={y + d - 1.4} w={w - 2.4} d={1} h={1.1} warna={JINGGA} />
      <JendelaKanan x={x + w} y0={y + 1} y1={y + d - 1} z0={1.2} z1={2.4} jumlah={2} isi={KACA_JINGGA} />
      <TeritisKiri y={y + d} x0={x + 0.3} x1={x + w - 0.3} z={3} dalam={1.8} garis={7} />
      <AtapPelana x={x} y={y} w={w} d={d} h={h} arah="x" warna={ATAP_JINGGA} dinding={JINGGA} />
      {[20.5, 22.5, 24.5].map((bx) => <Kotak key={bx} x={bx} y={18.1} w={0.8} d={0.8} h={0.9} warna={ATAP_JINGGA} />)}
    </g>
  );
}

function Bengkel() {
  const x = 37, y = 10, w = 8, d = 7, h = 3.6;
  const [sx, sy] = proyeksi(42.5, 17.6, 1.4);
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} warna={JINGGA} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 2.6} z0={0} z1={2.8} isi="#6A625A" />
      <PanelKiri y={y + d} x0={x + w - 2.2} x1={x + w - 0.8} z0={1.2} z1={2.4} isi={KACA_JINGGA} />
      <JendelaKanan x={x + w} y0={y + 1} y1={y + d - 1} z0={1.2} z1={2.4} jumlah={2} isi={KACA_JINGGA} />
      <AtapPelana x={x} y={y} w={w} d={d} h={h} arah="x" warna={ATAP_JINGGA} dinding={JINGGA} />
      <g stroke="#F26A1B" strokeWidth={1.4} strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <line key={a} x1={sx + Math.cos((a * Math.PI) / 180) * 3} y1={sy + Math.sin((a * Math.PI) / 180) * 3} x2={sx + Math.cos((a * Math.PI) / 180) * 8} y2={sy + Math.sin((a * Math.PI) / 180) * 8} />)}
      </g>
      <circle cx={sx} cy={sy} r={2.2} fill="#FFD9B5" stroke="#F26A1B" strokeWidth={1} />
    </g>
  );
}

function Laundry() {
  const x = 21, y = 26, w = 7, d = 8, h = 5.6;
  const tiang1 = proyeksi(22, 27, h + 2.2);
  const tiang2 = proyeksi(22, 33, h + 2.2);
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} warna={JINGGA} />
      <JendelaKiri y={y + d} x0={x + 0.5} x1={x + w - 0.5} z0={3.4} z1={4.8} jumlah={2} isi={KACA_JINGGA} />
      <JendelaKiri y={y + d} x0={x + 0.5} x1={x + w - 0.5} z0={1} z1={2.2} jumlah={2} isi={KACA_JINGGA} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 0.8} z0={2.6} z1={2.9} isi={ATAP_JINGGA.kiri} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 0.8} z0={2.6} z1={2.9} isi={ATAP_JINGGA.kiri} />
      <PanelKiri y={y + d} x0={x + 0.8} x1={x + w - 0.8} z0={0} z1={0.1} isi={JINGGA.kiri} />
      <TeritisKanan x={x + w} y0={y + 0.6} y1={y + d - 0.6} z={2.8} dalam={1.5} garis={7} />
      <JendelaKanan x={x + w} y0={y + 0.8} y1={y + d - 0.8} z0={3.4} z1={4.8} jumlah={3} isi={KACA_JINGGA} />
      <Kotak x={x} y={y} z={h} w={w} d={0.4} h={0.5} warna={JINGGA} />
      <Kotak x={x} y={y} z={h} w={0.4} d={d} h={0.5} warna={JINGGA} />
      <Garis dari={[22, 27, h]} ke={[22, 27, h + 2.2]} />
      <Garis dari={[22, 33, h]} ke={[22, 33, h + 2.2]} />
      <line x1={tiang1[0]} y1={tiang1[1]} x2={tiang2[0]} y2={tiang2[1]} stroke={GARIS} strokeWidth={0.8} />
      {[0.2, 0.42, 0.64, 0.84].map((t, i) => {
        const bx = tiang1[0] + (tiang2[0] - tiang1[0]) * t;
        const by = tiang1[1] + (tiang2[1] - tiang1[1]) * t;
        return <path key={t} d={`M${bx - 4} ${by}h8l1 3-2 1v6h-6v-6l-2-1Z`} fill={i % 2 ? "#FFFFFF" : "#F9A15A"} stroke={GARIS} strokeWidth={0.8} strokeLinejoin="round" />;
      })}
    </g>
  );
}

function TokoBangunan() {
  const x = 38, y = 26, w = 8, d = 7, h = 3.8;
  return (
    <g>
      <Kotak x={x} y={y} w={w} d={d} h={h} warna={JINGGA} />
      <PanelKiri y={y + d} x0={x + 1} x1={x + w - 1} z0={0} z1={2.6} isi="#FFF3E8" />
      <JendelaKanan x={x + w} y0={y + 1} y1={y + d - 1} z0={1.2} z1={2.6} jumlah={2} isi={KACA_JINGGA} />
      <AtapPelana x={x} y={y} w={w} d={d} h={h} arah="y" tinggi={2.2} warna={ATAP_JINGGA} dinding={JINGGA} />
    </g>
  );
}

function TumpukanBata({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Kotak x={x} y={y} w={2} d={1.4} h={0.8} warna={ATAP_JINGGA} />
      <Kotak x={x} y={y} z={0.8} w={2} d={1.4} h={0.8} warna={ATAP_JINGGA} />
      <Kotak x={x + 0.3} y={y + 0.2} z={1.6} w={1.4} d={1} h={0.7} warna={ATAP_JINGGA} />
    </g>
  );
}

function Jalan() {
  const zebra = Array.from({ length: 5 }, (_, i) => 25.4 + i * 0.9);
  return (
    <g>
      <Lantai x={-2} y={19} w={64} d={5} isi={JALAN} />
      <Lantai x={30} y={-2} w={5} d={50} isi={JALAN} />
      <Lantai x={30} y={19} w={5} d={5} isi={JALAN} garis={JALAN} />
      {Array.from({ length: 9 }, (_, i) => <Garis key={`a${i}`} dari={[-1 + i * 3.4, 21.5, 0]} ke={[0.6 + i * 3.4, 21.5, 0]} warna="#FFFFFF" tebal={1.6} />)}
      {Array.from({ length: 8 }, (_, i) => <Garis key={`b${i}`} dari={[36 + i * 3.4, 21.5, 0]} ke={[37.6 + i * 3.4, 21.5, 0]} warna="#FFFFFF" tebal={1.6} />)}
      {Array.from({ length: 5 }, (_, i) => <Garis key={`c${i}`} dari={[32.5, -1 + i * 3.4, 0]} ke={[32.5, 0.6 + i * 3.4, 0]} warna="#FFFFFF" tebal={1.6} />)}
      {Array.from({ length: 6 }, (_, i) => <Garis key={`d${i}`} dari={[32.5, 25 + i * 3.4, 0]} ke={[32.5, 26.6 + i * 3.4, 0]} warna="#FFFFFF" tebal={1.6} />)}
      {zebra.map((zx) => <Bidang key={zx} isi="#FFFFFF" garis={JALAN} tebal={0.5} titik={[[zx, 19.6, 0], [zx + 0.5, 19.6, 0], [zx + 0.5, 23.4, 0], [zx, 23.4, 0]]} />)}
      <Lantai x={-2} y={37} w={32} d={3} isi={AIR} />
      <Lantai x={35} y={37} w={27} d={3} isi={AIR} />
      {[4, 12, 20, 40, 50].map((ax) => <Garis key={ax} dari={[ax, 38.5, 0]} ke={[ax + 2, 38.5, 0]} warna="#C9CDCD" tebal={1} />)}
      <Kotak x={30} y={36.6} w={0.5} d={3.8} h={1} />
      <Kotak x={34.5} y={36.6} w={0.5} d={3.8} h={1} />
    </g>
  );
}

export function KotaIsometrik({ className = "", judul = "Ilustrasi kota kecil di Banyumas. Warung, bengkel, laundry, dan toko bangunan yang membuka lowongan ditandai jingga." }: { className?: string; judul?: string }) {
  const objek: Objek[] = [
    { kunci: 7, isi: <Masjid x={3} y={2} /> },
    { kunci: 15, isi: <Rumah x={14} y={2} w={6} d={6} /> },
    { kunci: 22, isi: <Rumah x={21} y={1.5} w={7} d={6} jendela={3} /> },
    { kunci: 20, isi: <Rumah x={3} y={11} w={6} d={6} arah="y" /> },
    { kunci: 24, isi: <Ruko x={10} y={11} w={7} d={6} /> },
    { kunci: 32, isi: <Warung /> },
    { kunci: 44, isi: <Rumah x={38} y={2} w={7} d={6} jendela={3} /> },
    { kunci: 53, isi: <Rumah x={47} y={2} w={8} d={6} jendela={3} /> },
    { kunci: 50, isi: <Bengkel /> },
    { kunci: 61, isi: <Rumah x={47} y={11} w={6} d={6} arah="y" /> },
    { kunci: 67, isi: <Ruko x={54} y={11} w={5} d={6} /> },
    { kunci: 33, isi: <Rumah x={2} y={26} w={6} d={6} /> },
    { kunci: 41, isi: <Rumah x={10} y={26} w={7} d={6} arah="y" /> },
    { kunci: 54, isi: <Laundry /> },
    { kunci: 68, isi: <TokoBangunan /> },
    { kunci: 79, isi: <TumpukanBata x={47.5} y={30.5} /> },
    { kunci: 81, isi: <Rumah x={52} y={26} w={6} d={6} /> },
    { kunci: 50.1, isi: <Rumah x={4} y={41} w={6} d={4} /> },
    { kunci: 86, isi: <Rumah x={40} y={41} w={7} d={4} /> },
    ...[[1.5, 10], [17.5, 9.4], [28.5, 8.6], [12.5, 0.4], [36.5, 9.5], [46, 9.2], [57.5, 9], [45.8, 1.5], [9, 34.5], [18.5, 34.5], [2.5, 35], [51.5, 27.5], [58, 34.5], [36.5, 34.5], [14, 42.5], [22, 42], [27, 44], [50, 42.5], [56, 43], [37, 43]].map(([x, y]) => ({ kunci: x + y, isi: <Pohon x={x} y={y} besar={0.9 + ((x * 7 + y) % 4) * 0.08} /> })),
    { kunci: 30.5, isi: <Pohon x={18.6} y={11} isi="#F9C08F" besar={0.85} /> },
    { kunci: 47.6, isi: <Pohon x={36.4} y={11.6} isi="#F9C08F" besar={0.85} /> },
    { kunci: 45.6, isi: <Pohon x={20.5} y={25.4} isi="#F9C08F" besar={0.8} /> },
    { kunci: 64.4, isi: <Pohon x={37.6} y={26.6} isi="#F9C08F" besar={0.8} /> },
    { kunci: 45.5, isi: <Motor x={27.2} y={18.4} warna="#F9A15A" /> },
    { kunci: 63.5, isi: <Motor x={45.6} y={18} /> },
    { kunci: 12.5, isi: <Motor x={12} y={18.4} /> },
  ];
  objek.sort((a, b) => a.kunci - b.kunci);
  const { x, y, w, h } = KOTAK_PANDANG;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} className={className} role="img" aria-label={judul} preserveAspectRatio="xMidYMid slice">
      <rect x={x} y={y} width={w} height={h} fill="#FFFFFF" />
      <Jalan />
      <Lantai x={18} y={9} w={10} d={9.6} isi={PLOT} garis="#F7C9A0" />
      <Lantai x={36} y={9} w={10} d={9.6} isi={PLOT} garis="#F7C9A0" />
      <Lantai x={20} y={25} w={9} d={10} isi={PLOT} garis="#F7C9A0" />
      <Lantai x={37} y={25} w={14} d={10} isi={PLOT} garis="#F7C9A0" />
      <Pagar dari={[1, 18.4]} ke={[17, 18.4]} jumlah={9} />
      <Pagar dari={[47, 18.4]} ke={[59, 18.4]} jumlah={7} />
      <Pagar dari={[29.2, 1]} ke={[29.2, 8]} jumlah={5} />
      <Pagar dari={[1, 36.2]} ke={[18, 36.2]} jumlah={9} />
      <Pagar dari={[36, 24.7]} ke={[36, 34]} jumlah={6} isi="#F9C08F" />
      <Pagar dari={[52, 36.2]} ke={[59, 36.2]} jumlah={5} />
      {objek.map((o, i) => <g key={i}>{o.isi}</g>)}
      <g aria-hidden="true" fill="none" stroke={ABU.kanan} strokeWidth={1}>
        <path d={`M${x} ${y + h - 0.5}h${w}`} />
      </g>
    </svg>
  );
}
