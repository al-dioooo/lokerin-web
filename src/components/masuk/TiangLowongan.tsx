import type { CSSProperties, ReactNode } from "react";

// A concrete electricity pole on a Purwokerto sidewalk, covered in job flyers with tear-off phone
// numbers, the way informal work is still advertised. The four real openings carry a green
// verified stamp; the old "gaji 10 juta" flyer behind them is faded and torn. Gunung Slamet sits on
// the horizon. Drawn on an 800 x 760 grid; wires, mountain and pavement run past the edges so the
// picture can be cropped to any panel shape (the svg has overflow: visible).

const GARIS = "#4A4743";
const TINTA = "#16181D";
const PUTIH = "#FFFFFF";
const ABU_1 = "#F2F1EE";
const ABU_2 = "#DEDCD7";
const ABU_3 = "#B9B6B0";
const JINGGA = "#F26A1B";
const JINGGA_TUA = "#C2410C";
const KREM = "#FFF6EE";
const PEACH = "#FDE6D2";
const HIJAU = "#18794E";
const HIJAU_MUDA = "#E8F5EE";

export const KOTAK_TIANG = { w: 800, h: 760 };

type Titik = [number, number];

function titikKurva(a: Titik, k: Titik, b: Titik, t: number): Titik {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * k[0] + t * t * b[0], u * u * a[1] + 2 * u * t * k[1] + t * t * b[1]];
}

const KABEL: { a: Titik; k: Titik; b: Titik; tebal: number }[] = [
  { a: [312, 80], k: [-80, 210], b: [-600, 120], tebal: 1.6 },
  { a: [352, 80], k: [-40, 270], b: [-600, 210], tebal: 1.6 },
  { a: [448, 80], k: [860, 240], b: [1400, 130], tebal: 1.6 },
  { a: [488, 80], k: [900, 190], b: [1400, 70], tebal: 1.6 },
  { a: [394, 152], k: [80, 320], b: [-600, 300], tebal: 3 },
  { a: [406, 158], k: [720, 330], b: [1400, 300], tebal: 3 },
];

function Burung({ di, balik = false }: { di: Titik; balik?: boolean }) {
  return (
    <g transform={`translate(${di[0].toFixed(1)} ${di[1].toFixed(1)}) scale(${balik ? -1 : 1} 1)`} stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M-11-7q2-9 11-8l5-6q5 1 4 6l4 1-4 2q-1 9-11 11l-11 4 4-6Z" fill={PUTIH} />
      <path d="M-4-8q5 3 10 0" fill="none" />
      <circle cx="5" cy="-16" r="1" fill={GARIS} stroke="none" />
      <path d="M-2 0v5m4-5v5" fill="none" />
    </g>
  );
}

function Awan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const bulat: [number, number, number][] = [[-22, 4, 16], [0, -6, 20], [22, 2, 15], [8, 8, 14]];
  return (
    <g>
      {bulat.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={x + cx * s} cy={y + cy * s} r={r * s} fill={PUTIH} stroke={GARIS} strokeWidth="2" />)}
      {bulat.map(([cx, cy, r], i) => <circle key={`i${i}`} cx={x + cx * s} cy={y + cy * s} r={r * s} fill={PUTIH} />)}
    </g>
  );
}

function Slamet() {
  return (
    <g fill="none" stroke={ABU_3} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="translate(110 0)">
      <path d="M-600 346C-200 340 120 318 300 262 390 234 470 182 528 158l12-4h28l14 6c56 26 120 74 208 108 170 64 380 74 610 76" />
      <path d="M548 156l-14 30 10 18-8 26m48-72 6 34-12 22 8 30M500 176l-16 34m110-38 22 40" opacity=".7" />
      <path d="M940 346c120-26 260-30 460-22" opacity=".8" />
    </g>
  );
}

function Tiang() {
  const anak = [168, 222, 276, 330, 384, 438, 492, 546, 600];
  return (
    <g strokeLinejoin="round">
      <path d="M383 40h34l13 650h-60Z" fill={ABU_1} />
      <path d="M406 40h11l13 650h-17Z" fill={ABU_2} />
      <path d="M383 40h34l13 650h-60Z" fill="none" stroke={GARIS} strokeWidth="2.2" />
      <path d="M381 40h38v-8h-38Z" fill={PUTIH} stroke={GARIS} strokeWidth="2" />
      {anak.map((y, i) => <path key={y} d={i % 2 ? `M${417 + y / 50} ${y}h9` : `M${374 - y / 70} ${y}h-9`} stroke={GARIS} strokeWidth="2.4" strokeLinecap="round" />)}
      <rect x="294" y="90" width="212" height="12" rx="2" fill={PUTIH} stroke={GARIS} strokeWidth="2" />
      <path d="M332 102l58 42m78-42-58 42" stroke={GARIS} strokeWidth="2" />
      {[312, 352, 448, 488].map((x) => (
        <g key={x} stroke={GARIS} strokeWidth="1.6">
          <rect x={x - 5} y="78" width="10" height="12" rx="2" fill={PUTIH} />
          <ellipse cx={x} cy="80" rx="7" ry="2.6" fill={PUTIH} />
        </g>
      ))}
      <g fill="none" stroke={GARIS} strokeWidth="2.4">
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M380 ${150 + i * 9}q22 6 44-2`} />)}
      </g>
      <rect x="387" y="186" width="27" height="34" rx="2" fill={PUTIH} stroke={GARIS} strokeWidth="1.6" />
      <text x="400.5" y="200" className="tiang-mono" fontSize="8" fill={GARIS} textAnchor="middle">TR</text>
      <text x="400.5" y="213" className="tiang-mono" fontSize="8" fill={GARIS} textAnchor="middle">217</text>
      <text x="0" y="0" className="tiang-mono" fontSize="11" fontWeight="700" fill={ABU_3} textAnchor="middle" transform="translate(405 640) rotate(-90)" letterSpacing="1">SEDOT WC 0813</text>
    </g>
  );
}

type Baris = { teks: string; ukuran?: number; tebal?: number; warna?: string };

type Selebaran = {
  x: number; y: number; w: number; h: number; putar: number;
  isi: string; kepala: string; baris: Baris[];
  tab?: number; hilang?: number[]; pudar?: boolean; robek?: boolean; mendesak?: string; cap?: boolean;
};

const SELEBARAN: Selebaran[] = [
  { x: 414, y: 238, w: 172, h: 198, putar: 4, isi: "#F5F4F1", kepala: "GAJI 10 JT", baris: [{ teks: "kerja dari HP" }, { teks: "tanpa pengalaman" }, { teks: "transfer dulu 200rb" }], pudar: true, robek: true },
  { x: 494, y: 336, w: 162, h: 208, putar: 5, isi: PUTIH, kepala: "DICARI", baris: [{ teks: "Tukang las", ukuran: 18, tebal: 800 }, { teks: "Bengkel Jaya" }, { teks: "Rp150.000/hari", warna: JINGGA_TUA, tebal: 800 }], hilang: [0, 3], cap: true },
  { x: 316, y: 346, w: 162, h: 218, putar: -6, isi: KREM, kepala: "DICARI", baris: [{ teks: "Cuci piring", ukuran: 18, tebal: 800 }, { teks: "Warung Bu Sri" }], mendesak: "Butuh hari ini", hilang: [1, 2, 4], cap: true },
  { x: 462, y: 520, w: 144, h: 160, putar: 3, isi: PEACH, kepala: "DICARI", baris: [{ teks: "Tukang setrika", ukuran: 16, tebal: 800 }, { teks: "Purwokerto", ukuran: 12 }], tab: 5, hilang: [1], cap: true },
  { x: 338, y: 548, w: 140, h: 156, putar: -4, isi: PUTIH, kepala: "DICARI", baris: [{ teks: "Sopir pikap", ukuran: 16, tebal: 800 }, { teks: "Sokaraja", ukuran: 12 }], tab: 5, hilang: [3], cap: true },
];

function Cap({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="tiang-cap">
      <g transform={`rotate(-14 ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r="20" fill={HIJAU_MUDA} stroke={HIJAU} strokeWidth="2.2" />
        <circle cx={cx} cy={cy} r="15" fill="none" stroke={HIJAU} strokeWidth="1" strokeDasharray="2 2.4" />
        <path d={`M${cx - 7} ${cy}l5 5 9-10`} fill="none" stroke={HIJAU} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

function Lembar({ s, i }: { s: Selebaran; i: number }) {
  const { w, h, isi, kepala, baris, tab = 6, hilang = [], pudar, robek, mendesak, cap } = s;
  const kiri = -w / 2;
  const atas = -h / 2;
  const tinggiTab = 40;
  const badan = h - tinggiTab;
  const garis = pudar ? ABU_3 : GARIS;
  const teksWarna = pudar ? ABU_3 : TINTA;
  const tepi = robek
    ? `M${kiri} ${atas}H${kiri + w * 0.6}l10 14-6 12 12 10-4 14L${kiri + w} ${atas + 66}V${atas + badan}H${kiri}Z`
    : `M${kiri} ${atas}H${kiri + w}V${atas + badan}H${kiri}Z`;
  const lebarTab = w / tab;
  return (
    <g className="tiang-kertas" style={{ "--i": i } as CSSProperties}>
      <g transform={`translate(${s.x} ${s.y}) rotate(${s.putar})`}>
        <path d={tepi} transform="translate(3 4)" fill="#000" opacity=".06" />
        <path d={tepi} fill={isi} stroke={garis} strokeWidth="1.8" strokeLinejoin="round" />
        <rect x={kiri + 10} y={atas + 12} width={w - 20} height="30" rx="3" fill={pudar ? "#ECEAE6" : JINGGA} stroke={garis} strokeWidth="1.4" />
        <text x="0" y={atas + 33} fontSize="17" fontWeight="800" letterSpacing="1.6" fill={pudar ? ABU_3 : PUTIH} textAnchor="middle">{kepala}</text>
        {baris.map((b, n) => (
          <text key={b.teks} x="0" y={atas + 68 + n * 21} fontSize={b.ukuran ?? 13} fontWeight={b.tebal ?? 600} fill={pudar ? ABU_3 : (b.warna ?? teksWarna)} textAnchor="middle">{b.teks}</text>
        ))}
        {mendesak && (
          <g>
            <rect x={-48} y={atas + 104} width="96" height="22" rx="11" fill={JINGGA} stroke="#CF5C08" />
            <text x="0" y={atas + 119} fontSize="11" fontWeight="800" fill={PUTIH} textAnchor="middle">{mendesak}</text>
          </g>
        )}
        {Array.from({ length: tab }, (_, n) => {
          const tx = kiri + n * lebarTab;
          if (hilang.includes(n)) {
            return <path key={n} d={`M${tx} ${atas + badan}l${lebarTab * 0.25} 4 ${lebarTab * 0.25}-3 ${lebarTab * 0.25} 4 ${lebarTab * 0.25}-3`} fill="none" stroke={garis} strokeWidth="1.2" />;
          }
          return (
            <g key={n}>
              <rect x={tx} y={atas + badan} width={lebarTab} height={tinggiTab} fill={isi} stroke={garis} strokeWidth="1.2" />
              <text x="0" y="0" className="tiang-mono" fontSize="7.5" fill={pudar ? ABU_3 : GARIS} transform={`translate(${tx + lebarTab / 2 + 3} ${atas + badan + tinggiTab - 4}) rotate(-90)`}>0812 77</text>
            </g>
          );
        })}
        <rect x={kiri - 9} y={atas - 7} width="30" height="13" fill={PUTIH} opacity=".8" stroke="#CFCBC4" transform={`rotate(-32 ${kiri + 6} ${atas})`} />
        <rect x={kiri + w - 21} y={atas - 7} width="30" height="13" fill={PUTIH} opacity=".8" stroke="#CFCBC4" transform={`rotate(30 ${kiri + w - 6} ${atas})`} />
        {cap && <Cap cx={kiri + w - 24} cy={atas + badan + 2} />}
      </g>
    </g>
  );
}

function Sobekan({ x, y, putar }: { x: number; y: number; putar: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${putar})`} stroke={ABU_3} strokeWidth="1.2" strokeLinejoin="round">
      <path d="M-14-10h26l-4 9 6 8-8 5H-12l3-9Z" fill={PUTIH} />
      <path d="M-8-6h6m4 0h6" stroke={GARIS} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Kucing() {
  return (
    <g stroke={GARIS} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="478" cy="704" rx="36" ry="5" fill="#000" opacity=".06" stroke="none" />
      <path d="M446 702c-2-22 18-32 40-30 18 2 26 14 24 30Z" fill={PUTIH} />
      <path d="M432 702c-6-4-6-16 0-22l-1-12 9 7c4-1 8-1 12 0l8-7 1 12c5 7 4 18-2 22Z" fill={PUTIH} />
      <path d="M438 690q3 3 6 0m6 0q3 3 6 0M446 696l1 1 1-1" fill="none" strokeWidth="1.4" />
      <path d="M510 700c10 4 4 12-12 10-14-2-28-2-40-6" fill="none" />
      <path d="M470 676q8 4 14 0m6 4q6 4 10 0" fill="none" stroke={ABU_3} strokeWidth="1.4" />
    </g>
  );
}

function Trotoar() {
  const garis: ReactNode[] = [];
  for (let x = -600; x < 1400; x += 72) garis.push(<path key={`p${x}`} d={`M${x} 668l-10 44`} stroke={GARIS} strokeWidth="1" opacity=".3" />);
  const kerb: ReactNode[] = [];
  for (let x = -600; x < 1400; x += 48) kerb.push(<path key={`k${x}`} d={`M${x} 712h24v18h-24Z`} fill={TINTA} />);
  return (
    <g>
      <rect x="-600" y="668" width="2000" height="44" fill="#ECEAE6" />
      {garis}
      <path d="M-600 668H1400" stroke={GARIS} strokeWidth="1.6" />
      <rect x="-600" y="712" width="2000" height="18" fill={PUTIH} />
      {kerb}
      <path d="M-600 712H1400M-600 730H1400" stroke={GARIS} strokeWidth="1.8" />
      <rect x="-600" y="730" width="2000" height="300" fill="#E7E5E1" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${-560 + i * 150} 770h70`} stroke={PUTIH} strokeWidth="5" strokeLinecap="round" />)}
    </g>
  );
}

export function TiangLowongan({ className = "" }: { className?: string }) {
  const [k1, k2, , k4] = KABEL;
  return (
    <svg viewBox={`0 0 ${KOTAK_TIANG.w} ${KOTAK_TIANG.h}`} className={`tiang ${className}`} aria-hidden="true" overflow="visible">
      <Slamet />
      <Awan x={120} y={110} />
      <Awan x={690} y={70} s={0.8} />
      <Trotoar />
      <g fill="none" stroke={GARIS} strokeLinecap="round">
        {KABEL.map(({ a, k, b, tebal }, i) => <path key={i} d={`M${a[0]} ${a[1]}Q${k[0]} ${k[1]} ${b[0]} ${b[1]}`} strokeWidth={tebal} />)}
      </g>
      <Burung di={titikKurva(k1.a, k1.k, k1.b, 0.32)} />
      <Burung di={titikKurva(k2.a, k2.k, k2.b, 0.24)} balik />
      <Burung di={titikKurva(k4.a, k4.k, k4.b, 0.3)} balik />
      <Tiang />
      <Sobekan x={404} y={430} putar={8} />
      {SELEBARAN.map((s, i) => <Lembar key={s.kepala + s.baris[0].teks} s={s} i={i} />)}
      <path d="M362 690q4-16 8-2 3-14 7 0 4-12 6 2m46-1q3-12 6 0 4-16 8-2" fill="none" stroke={GARIS} strokeWidth="1.8" strokeLinecap="round" />
      <Kucing />
      <g transform="translate(600 690) rotate(24)">
        <rect x="-11" y="-19" width="22" height="38" fill={KREM} stroke={GARIS} strokeWidth="1.2" />
        <text x="0" y="0" className="tiang-mono" fontSize="7.5" fill={GARIS} transform="translate(3 15) rotate(-90)">0812 77</text>
      </g>
    </svg>
  );
}
