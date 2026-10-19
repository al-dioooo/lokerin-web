import type { ReactNode } from "react";

// Hand-drawn tools of informal work, in the same line style as the isometric town, coloured for
// the night Ngobrol screen: light ink, dark panels, orange where the work glows. Each sits on a
// 120 x 100 grid with a soft ground shadow so they read as objects standing on the town.

const TINTA = "#E9DCCD";
const PANEL = "#232731";
const PANEL_GELAP = "#1A1D24";
const JINGGA = "#F26A1B";
const JINGGA_MUDA = "#F9A15A";

type Props = { className?: string; size?: number };

function Kanvas({ className, size = 96, children }: Props & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 100" width={size} height={(size * 100) / 120} className={className} fill="none" stroke={TINTA} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="60" cy="90" rx="40" ry="6" fill="#000" opacity=".35" stroke="none" />
      {children}
    </svg>
  );
}

/** Welding mask with a lit torch: Tukang Las. */
export function TopengLas(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M30 22c0-9 10-15 22-15s22 6 22 15v32c0 13-10 24-22 24S30 67 30 54Z" fill={PANEL} />
      <path d="M38 34h28v12H38Z" fill={PANEL_GELAP} />
      <path d="M40 36h24v8H40Z" fill={JINGGA} opacity=".35" stroke="none" />
      <path d="M30 30c-6 0-8 4-8 9m52-9c6 0 8 4 8 9M44 62h16M46 68h12" />
      <path d="M78 74 98 56" strokeWidth="3" />
      <path d="M96 52l6 6-4 4-6-6Z" fill={PANEL} />
      <g stroke={JINGGA} strokeWidth="2.4">
        <path d="M104 50l6-4M103 60l7 2M98 46l1-7M107 55h7" />
      </g>
      <circle cx="102" cy="53" r="3" fill={JINGGA_MUDA} stroke="none" />
    </Kanvas>
  );
}

/** Ojol helmet with a phone showing a pickup pin: Ojek & Driver. */
export function HelmOjol(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M18 62c0-22 15-38 36-38 18 0 30 12 32 30l2 10H18Z" fill={PANEL} />
      <path d="M48 40c10-2 26 2 34 14l2 10H54c-6 0-8-4-8-10Z" fill={PANEL_GELAP} />
      <path d="M26 46c6-10 14-15 24-16" stroke={JINGGA} strokeWidth="4" />
      <path d="M16 64h74v8H16Z" fill={PANEL} />
      <path d="M86 30h22v40H86Z" fill={PANEL_GELAP} />
      <path d="M90 36h14v24H90Z" fill={PANEL} />
      <path d="M97 54s-5-5-5-8a5 5 0 0 1 10 0c0 3-5 8-5 8Z" fill={JINGGA} stroke="none" />
      <path d="M95 65h4" />
    </Kanvas>
  );
}

/** Warung counter with a steaming pot and a stack of plates: Warung & Dapur. */
export function MejaWarung(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M14 32h92l-6-12H20Z" fill={JINGGA} opacity=".9" stroke="none" />
      <path d="M14 32h92l-6-12H20ZM34 20l-3 12m21-12-1 12m19-12 1 12m19-12 3 12" />
      <path d="M20 54h80v32H20Z" fill={PANEL} />
      <path d="M16 50h88v6H16Z" fill={PANEL_GELAP} />
      <path d="M28 64h20M28 72h14" opacity=".6" />
      <path d="M58 36h28v14H58Z" fill={PANEL_GELAP} />
      <path d="M56 36h32M64 36v-3h16v3" />
      <g stroke={JINGGA_MUDA}>
        <path d="M66 28c-3-3 3-5 0-9m8 9c-3-3 3-5 0-9m8 9c-3-3 3-5 0-9" />
      </g>
      <path d="M24 46h22M26 42h18M28 38h14" />
    </Kanvas>
  );
}

/** Laundry basket with folded shirts and an iron: Cuci & Setrika. */
export function KeranjangCucian(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M14 46h56l-6 38H20Z" fill={PANEL} />
      <path d="M20 54h44M21 62h42M22 70h40M23 78h38M30 46l2 38M42 46v38m12-38-2 38" opacity=".55" />
      <path d="M12 42h60v6H12Z" fill={PANEL_GELAP} />
      <path d="M20 42c2-8 8-12 16-12h12c8 0 14 4 16 12" fill={JINGGA} opacity=".85" stroke="none" />
      <path d="M20 42c2-8 8-12 16-12h12c8 0 14 4 16 12M36 30l6 8 6-8" />
      <path d="M78 76c0-14 8-24 22-24h8v24Z" fill={PANEL} />
      <path d="M86 52c0-8 6-12 12-12h6" stroke={JINGGA} strokeWidth="4" />
      <path d="M78 76h30" />
      <g stroke={TINTA} opacity=".5"><path d="M92 46c-2-3 2-5 0-8m6 8c-2-3 2-5 0-8" /></g>
    </Kanvas>
  );
}

/** Stacked bricks with a trowel: Tukang Bangunan. */
export function BataSendok(props: Props) {
  return (
    <Kanvas {...props}>
      <g fill={JINGGA} fillOpacity=".75">
        <path d="M16 70h28v12H16Zm30 0h28v12H46ZM30 56h28v12H30Z" />
      </g>
      <path d="M16 70h28v12H16Zm30 0h28v12H46ZM30 56h28v12H30Z" />
      <path d="M16 70l6-5h22m30 5 6-5H52m6-9 6-5H36" opacity=".6" />
      <path d="M72 50 94 28l14 14-22 22Z" fill={PANEL} />
      <path d="M78 56 66 68" strokeWidth="4" />
      <path d="M84 40l10 10" opacity=".5" />
      <path d="M58 82h30" stroke={TINTA} opacity=".4" />
    </Kanvas>
  );
}

/** Tyre and wrench: Bengkel. */
export function BanKunci(props: Props) {
  return (
    <Kanvas {...props}>
      <circle cx="48" cy="56" r="28" fill={PANEL} />
      <circle cx="48" cy="56" r="14" fill={PANEL_GELAP} />
      <circle cx="48" cy="56" r="5" fill={JINGGA} stroke="none" />
      <path d="M48 28v6m0 44v6M20 56h6m44 0h6M28 36l4 4m32 32 4 4M28 76l4-4m32-32 4-4" opacity=".55" />
      <path d="M70 72 100 30" strokeWidth="6" stroke={JINGGA_MUDA} />
      <path d="M96 24c6-4 14 2 12 9l-6-2-3 4 3 5c-7 3-13-3-11-9" fill={PANEL} />
    </Kanvas>
  );
}

/** Taped box with a delivery arrow: Angkut & Kurir. */
export function KardusAntar(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M24 44 60 30l36 14v34L60 92 24 78Z" fill={PANEL} />
      <path d="M24 44l36 14 36-14M60 58v34" />
      <path d="M42 37l36 14v10" stroke={JINGGA} strokeWidth="5" />
      <path d="M30 60l12 5m-12 3 8 3" opacity=".55" />
      <path d="M8 26h28m-8-7 8 7-8 7" stroke={JINGGA_MUDA} strokeWidth="2.4" />
    </Kanvas>
  );
}

/** Laptop with code on screen: Teknologi (internships). */
export function LaptopKode(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M26 20h68v46H26Z" fill={PANEL} />
      <path d="M32 26h56v34H32Z" fill={PANEL_GELAP} />
      <path d="m48 36-7 7 7 7m24-14 7 7-7 7" stroke={JINGGA_MUDA} strokeWidth="2.4" />
      <path d="m62 34-6 18" stroke={JINGGA} strokeWidth="2.4" />
      <path d="M14 72h92l-8-6H22Z" fill={PANEL} />
      <path d="M52 69h16" />
    </Kanvas>
  );
}

/** Drawing tablet, pen and colour swatches: Desain (internships). */
export function TabletDesain(props: Props) {
  return (
    <Kanvas {...props}>
      <path d="M18 24h70v54H18Z" fill={PANEL} />
      <path d="M24 30h58v42H24Z" fill={PANEL_GELAP} />
      <path d="M30 62c8-16 18-20 26-10s16 6 20-6" stroke={JINGGA_MUDA} strokeWidth="2.6" />
      <circle cx="36" cy="40" r="5" fill={JINGGA} stroke="none" />
      <path d="M94 20l10 10-30 30-12 3 3-12Z" fill={PANEL} />
      <path d="m88 26 10 10" opacity=".55" />
      <g stroke="none"><circle cx="98" cy="70" r="5" fill={JINGGA} /><circle cx="108" cy="78" r="4" fill={JINGGA_MUDA} /><circle cx="94" cy="82" r="3.5" fill={TINTA} /></g>
    </Kanvas>
  );
}

export const BENDA = {
  las: { label: "Las", Gambar: TopengLas, cocok: /\b(las|ngelas|mengelas|kanopi|teralis|pagar besi)\b/i, mulai: "Saya biasa ngelas pagar" },
  ojek: { label: "Ojek", Gambar: HelmOjol, cocok: /\b(ojek|ngojek|ojol|driver|sopir|nyetir)\b/i, mulai: "Saya ngojek tiap malam" },
  dapur: { label: "Dapur", Gambar: MejaWarung, cocok: /\b(masak|memasak|warung|dapur|cuci piring|nasi|katering)\b/i, mulai: "Saya bisa masak di warung" },
  laundry: { label: "Cuci & setrika", Gambar: KeranjangCucian, cocok: /\b(setrika|laundry|cuci baju|cucian|melipat)\b/i, mulai: "Saya biasa setrika baju" },
  bangunan: { label: "Bangunan", Gambar: BataSendok, cocok: /\b(bangunan|tukang batu|bata|semen|ngecor|kuli)\b/i, mulai: "Saya pernah jadi tukang bangunan" },
  bengkel: { label: "Bengkel", Gambar: BanKunci, cocok: /\b(bengkel motor|bengkel mobil|montir|ganti oli|servis motor|tambal ban)\b/i, mulai: "Saya bisa servis motor" },
  angkut: { label: "Antar barang", Gambar: KardusAntar, cocok: /\b(angkut|kurir|paket|galon|pindahan|antar barang)\b/i, mulai: "Saya biasa antar paket" },
  teknologi: { label: "Coding", Gambar: LaptopKode, cocok: /\b(frontend|coding|ngoding|web|react|programmer|aplikasi)\b/i, mulai: "Saya bisa bikin website" },
  desain: { label: "Desain", Gambar: TabletDesain, cocok: /\b(desain|figma|ui|ux|poster|ilustrasi)\b/i, mulai: "Saya suka desain UI" },
} as const;

export type BendaId = keyof typeof BENDA;

/** Which tools a stretch of conversation mentions, in the order they first come up. */
export function bendaDariTeks(teks: string[]): BendaId[] {
  const hasil: BendaId[] = [];
  for (const t of teks) {
    for (const id of Object.keys(BENDA) as BendaId[]) {
      if (!hasil.includes(id) && BENDA[id].cocok.test(t)) hasil.push(id);
    }
  }
  return hasil;
}
