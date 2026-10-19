// Isometric projection: world x runs to the lower right, y to the lower left,
// z straight up. One world unit is roughly one metre.
export const SKALA = 12;
const COS = Math.cos(Math.PI / 6);

export type Titik = [number, number, number];

export function proyeksi(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * COS * SKALA, (x + y) * 0.5 * SKALA - z * SKALA];
}

function poin(...titik: Titik[]) {
  return titik.map(([x, y, z]) => proyeksi(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");
}

export const GARIS = "#4A4743";

export type Warna = { atas: string; kiri: string; kanan: string };

export const ABU: Warna = { atas: "#FFFFFF", kiri: "#F2F1EE", kanan: "#DEDCD7" };
export const ATAP_ABU: Warna = { atas: "#EEEDEA", kiri: "#E4E2DE", kanan: "#D2CFC9" };
export const JINGGA: Warna = { atas: "#FFF6EE", kiri: "#FDE6D2", kanan: "#F7CDA8" };
export const ATAP_JINGGA: Warna = { atas: "#F9A15A", kiri: "#F59A4D", kanan: "#E7742A" };

type Poligon = { titik: Titik[]; isi: string; garis?: string; tebal?: number };

export function Bidang({ titik, isi, garis = GARIS, tebal = 1.1 }: Poligon) {
  return <polygon points={poin(...titik)} fill={isi} stroke={garis} strokeWidth={tebal} strokeLinejoin="round" />;
}

export function Garis({ dari, ke, warna = GARIS, tebal = 1.1 }: { dari: Titik; ke: Titik; warna?: string; tebal?: number }) {
  const [x1, y1] = proyeksi(...dari);
  const [x2, y2] = proyeksi(...ke);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={warna} strokeWidth={tebal} strokeLinecap="round" />;
}

export type Balok = { x: number; y: number; z?: number; w: number; d: number; h: number; warna?: Warna };

/** A box with its top, left (y + d) and right (x + w) faces. */
export function Kotak({ x, y, z = 0, w, d, h, warna = ABU }: Balok) {
  const t = z + h;
  return (
    <g>
      <Bidang isi={warna.kiri} titik={[[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]} />
      <Bidang isi={warna.kanan} titik={[[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]} />
      <Bidang isi={warna.atas} titik={[[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]} />
    </g>
  );
}

/** Gable roof sitting on a box. `arah` is the direction of the ridge. */
export function AtapPelana({ x, y, z = 0, w, d, h, tinggi = 2.4, arah = "x", warna = ATAP_ABU, dinding = ABU }: Balok & { tinggi?: number; arah?: "x" | "y"; dinding?: Warna }) {
  const t = z + h;
  const o = 0.5;
  if (arah === "x") {
    const m = y + d / 2;
    return (
      <g>
        <Bidang isi={dinding.kanan} titik={[[x + w, y, t], [x + w, y + d, t], [x + w, m, t + tinggi]]} />
        <Bidang isi={warna.kanan} titik={[[x - o, y - o, t], [x + w + o, y - o, t], [x + w + o, m, t + tinggi], [x - o, m, t + tinggi]]} />
        <Bidang isi={warna.kiri} titik={[[x - o, m, t + tinggi], [x + w + o, m, t + tinggi], [x + w + o, y + d + o, t], [x - o, y + d + o, t]]} />
      </g>
    );
  }
  const m = x + w / 2;
  return (
    <g>
      <Bidang isi={dinding.kiri} titik={[[x, y + d, t], [x + w, y + d, t], [m, y + d, t + tinggi]]} />
      <Bidang isi={warna.kiri} titik={[[x - o, y - o, t], [m, y - o, t + tinggi], [m, y + d + o, t + tinggi], [x - o, y + d + o, t]]} />
      <Bidang isi={warna.kanan} titik={[[m, y - o, t + tinggi], [x + w + o, y - o, t], [x + w + o, y + d + o, t], [m, y + d + o, t + tinggi]]} />
    </g>
  );
}

/** A rectangle drawn on the left face plane (y fixed). */
export function PanelKiri({ y, x0, x1, z0, z1, isi = "#FFFFFF" }: { y: number; x0: number; x1: number; z0: number; z1: number; isi?: string }) {
  return <Bidang isi={isi} tebal={0.9} titik={[[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]} />;
}

/** A rectangle drawn on the right face plane (x fixed). */
export function PanelKanan({ x, y0, y1, z0, z1, isi = "#FFFFFF" }: { x: number; y0: number; y1: number; z0: number; z1: number; isi?: string }) {
  return <Bidang isi={isi} tebal={0.9} titik={[[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]]} />;
}

/** A row of windows along the left face. */
export function JendelaKiri({ y, x0, x1, z0, z1, jumlah, isi }: { y: number; x0: number; x1: number; z0: number; z1: number; jumlah: number; isi?: string }) {
  const lebar = (x1 - x0) / jumlah;
  return <g>{Array.from({ length: jumlah }, (_, i) => <PanelKiri key={i} y={y} x0={x0 + i * lebar + lebar * 0.22} x1={x0 + (i + 1) * lebar - lebar * 0.22} z0={z0} z1={z1} isi={isi} />)}</g>;
}

/** A row of windows along the right face. */
export function JendelaKanan({ x, y0, y1, z0, z1, jumlah, isi }: { x: number; y0: number; y1: number; z0: number; z1: number; jumlah: number; isi?: string }) {
  const lebar = (y1 - y0) / jumlah;
  return <g>{Array.from({ length: jumlah }, (_, i) => <PanelKanan key={i} x={x} y0={y0 + i * lebar + lebar * 0.22} y1={y0 + (i + 1) * lebar - lebar * 0.22} z0={z0} z1={z1} isi={isi} />)}</g>;
}

/** Striped awning sticking out of the left face. */
export function TeritisKiri({ y, x0, x1, z, dalam = 1.6, garis = 6, warna = "#F26A1B" }: { y: number; x0: number; x1: number; z: number; dalam?: number; garis?: number; warna?: string }) {
  const lebar = (x1 - x0) / garis;
  return (
    <g>
      {Array.from({ length: garis }, (_, i) => (
        <Bidang key={i} isi={i % 2 ? "#FFFFFF" : warna} tebal={0.9} titik={[[x0 + i * lebar, y, z], [x0 + (i + 1) * lebar, y, z], [x0 + (i + 1) * lebar, y + dalam, z - 0.9], [x0 + i * lebar, y + dalam, z - 0.9]]} />
      ))}
    </g>
  );
}

/** Striped awning sticking out of the right face. */
export function TeritisKanan({ x, y0, y1, z, dalam = 1.6, garis = 6, warna = "#F26A1B" }: { x: number; y0: number; y1: number; z: number; dalam?: number; garis?: number; warna?: string }) {
  const lebar = (y1 - y0) / garis;
  return (
    <g>
      {Array.from({ length: garis }, (_, i) => (
        <Bidang key={i} isi={i % 2 ? "#FFFFFF" : warna} tebal={0.9} titik={[[x, y0 + i * lebar, z], [x, y0 + (i + 1) * lebar, z], [x + dalam, y0 + (i + 1) * lebar, z - 0.9], [x + dalam, y0 + i * lebar, z - 0.9]]} />
      ))}
    </g>
  );
}

/** Flat ground patch (road, yard, plot). */
export function Lantai({ x, y, w, d, isi, garis = GARIS, tebal = 1 }: { x: number; y: number; w: number; d: number; isi: string; garis?: string; tebal?: number }) {
  return <Bidang isi={isi} garis={garis} tebal={tebal} titik={[[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]]} />;
}

/** Round "cloud" tree in i7's style: an outlined union of circles on a short trunk. */
export function Pohon({ x, y, besar = 1, isi = "#FFFFFF" }: { x: number; y: number; besar?: number; isi?: string }) {
  const [bx, by] = proyeksi(x, y, 0);
  const [cx, cy] = proyeksi(x, y, 2.4 * besar);
  const r = 1.25 * besar * SKALA;
  const lingkaran: [number, number, number][] = [[cx - r * 0.55, cy + r * 0.1, r * 0.78], [cx + r * 0.55, cy + r * 0.12, r * 0.74], [cx, cy - r * 0.38, r * 0.82], [cx + r * 0.05, cy + r * 0.3, r * 0.7]];
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={r * 0.7} ry={r * 0.32} fill="#000" opacity={0.05} />
      <line x1={bx} y1={by} x2={bx} y2={cy + r * 0.4} stroke={GARIS} strokeWidth={1.4} strokeLinecap="round" />
      {lingkaran.map(([lx, ly, lr], i) => <circle key={`o${i}`} cx={lx} cy={ly} r={lr} fill={isi} stroke={GARIS} strokeWidth={2.2} />)}
      {lingkaran.map(([lx, ly, lr], i) => <circle key={`i${i}`} cx={lx} cy={ly} r={lr} fill={isi} />)}
      <path d={`M${cx - r * 0.35} ${cy - r * 0.1}q${r * 0.2} ${-r * 0.3} ${r * 0.5} ${-r * 0.2}`} fill="none" stroke={GARIS} strokeWidth={0.8} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

/** A row of small hedge dots, like the bollards along i7's paths. */
export function Pagar({ dari, ke, jumlah, isi = "#FFFFFF" }: { dari: [number, number]; ke: [number, number]; jumlah: number; isi?: string }) {
  return (
    <g>
      {Array.from({ length: jumlah }, (_, i) => {
        const t = jumlah === 1 ? 0 : i / (jumlah - 1);
        const [px, py] = proyeksi(dari[0] + (ke[0] - dari[0]) * t, dari[1] + (ke[1] - dari[1]) * t, 0.35);
        return <ellipse key={i} cx={px} cy={py} rx={4.2} ry={3} fill={isi} stroke={GARIS} strokeWidth={0.9} />;
      })}
    </g>
  );
}

/** A tiny parked motorbike in screen space. */
export function Motor({ x, y, warna = "#FFFFFF" }: { x: number; y: number; warna?: string }) {
  const [px, py] = proyeksi(x, y, 0);
  return (
    <g transform={`translate(${px} ${py})`} stroke={GARIS} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={-7} cy={-3} r={3.2} fill="#FFFFFF" />
      <circle cx={7} cy={-3} r={3.2} fill="#FFFFFF" />
      <path d="M-7 -3l5-6h7l2 6m-1-10 3-1" fill="none" />
      <path d="M-5 -10h7l1 2h-9Z" fill={warna} />
    </g>
  );
}
