import type { ReactNode } from "react";

export type IconProps = { size?: number; className?: string };
function Gambar({ size = 48, className = "", children }: IconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="var(--color-tinta, #16181D)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{children}</svg>;
}
const accent = "var(--color-jingga-terang, #F26A1B)";

export function LasIcon(props: IconProps) {
  return <Gambar {...props}><path d="m17 4 13 3-3 17-13-3-2-9Z" /><path d="m17 9 9 2-1 6-9-2ZM13 19c-5 1-7 7-8 15l13 4 5-7-8-3m-8 7-2 8m14-6 9 2 6-7m-8-4 7 4m-4 8h13" /><path d="m34 17 2 7 4-6-1 8 6-2-5 6" fill={accent} stroke="none" /></Gambar>;
}
export function OjekIcon(props: IconProps) {
  return <Gambar {...props}><circle cx="11" cy="37" r="6" /><circle cx="37" cy="37" r="6" /><path d="M17 37h14M5 33c0-5 4-8 9-8h11l4 6M31 37l-5-17h-4m4 0h5M33 30c4 0 7 3 8 7M21 16l-2 9h6l3 6M21 18l6 3" /><path d="M16 13a6 6 0 0 1 12 0v2H16Z" fill={accent} /></Gambar>;
}
export function DapurIcon(props: IconProps) {
  return <Gambar {...props}><path d="M10 25h28v13a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5Zm0 4H4v-5h6m28 5h6v-5h-6M8 22h32m-26 0c0-8 20-8 20 0m-12-6v-2h4v2M16 13c-5-5 4-6 1-11m15 11c-5-5 4-6 1-11" /><path d="M24 12c-7-5 4-7 0-12 8 5-3 7 0 12Z" fill={accent} stroke="none" /></Gambar>;
}
export function BangunanIcon(props: IconProps) {
  return <Gambar {...props}><path d="M3 31h42v13H3Zm0 6h42M13 31v6m14-6v6m11-6v6M20 37v7m12-7v7M8 27v-5c0-4 5-7 9-7s10 4 10 8v4M12 17l5 9 8-6M10 24l7 5 8-2" /><path d="M10 12a7 7 0 0 1 14 0Zm-2 0h18" /><path d="M16 4h3v8h-3Z" fill={accent} /><path d="m32 24 10-6 2 8-12-2Zm3 0-4 5" /></Gambar>;
}
export function BengkelIcon(props: IconProps) {
  return <Gambar {...props}><path d="m33 4-7 8 9 9 8-7c2 10-7 17-16 13L12 43l-7-7 16-15C17 12 23 3 33 4Z" /><path d="m8 36 4 4 8-9-4-3Z" fill={accent} stroke="none" /><circle cx="12" cy="36" r="1" /></Gambar>;
}
export function BersihIcon(props: IconProps) {
  return <Gambar {...props}><path d="m20 22 11 5 6 15H7Zm6 2L35 5M17 32l-4 10m11-9-1 9m6-9 3 9M6 12v8m-4-4h8" /><path d="m37 13 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill={accent} stroke="none" /><path d="m18 26 15 6" /></Gambar>;
}
export function TokoIcon(props: IconProps) {
  return <Gambar {...props}><path d="M8 8h32l4 13c-2 5-7 5-10 0-3 5-7 5-10 0-3 5-7 5-10 0-3 5-8 5-10 0ZM8 26v16h32V26M18 42V30h12v12M17 8l-3 13m17-13 3 13M24 8v13" /><path d="M17 8h7v13c-3 5-7 5-10 0Z" fill={accent} /></Gambar>;
}
export function AngkutIcon(props: IconProps) {
  return <Gambar {...props}><path d="m17 12 20-3 3 21-20 3ZM5 6h7l5 31h25" /><path d="m24 11 6-1 1 8-6 1Z" fill={accent} /><circle cx="22" cy="42" r="3" /><circle cx="37" cy="42" r="3" /></Gambar>;
}
export function KebunIcon(props: IconProps) {
  return <Gambar {...props}><path d="M24 30C7 30 6 12 7 9c13 0 19 7 17 21Zm0-7C23 10 32 4 42 6c0 12-5 18-18 17ZM24 40V23m0 7-9-11m9 5 10-10M8 42c10-5 21-5 32 0" /><path d="M27 18c1-6 5-9 11-9-1 6-4 9-11 9Z" fill={accent} stroke="none" /></Gambar>;
}
export function JahitIcon(props: IconProps) {
  return <Gambar {...props}><path d="M7 18h26V9h9v27H7V26h9v-8M4 41h40M12 20v10m14-18h7m-4-4v4" /><circle cx="27" cy="25" r="4" fill={accent} /><path d="M37 18v10" /></Gambar>;
}
export function LaundryIcon(props: IconProps) {
  return <Gambar {...props}><rect x="8" y="5" width="32" height="38" rx="3" /><path d="M8 15h32m-26-5h4" /><circle cx="33" cy="10" r="2" fill={accent} stroke="none" /><circle cx="24" cy="28" r="10" /><path d="M15 28c6-5 12 5 18 0" /></Gambar>;
}
export function KurirIcon(props: IconProps) {
  return <Gambar {...props}><path d="m15 10 17-4 11 8v24l-18 5-10-8Zm0 0 10 9 18-5M25 19v24M4 17h6m-8 9h8m-4 9h4m22-8 5-1" /><path d="m22 8 5-1 11 8v8l-5 1v-8Z" fill={accent} /></Gambar>;
}
export function AcaraIcon(props: IconProps) {
  return <Gambar {...props}><path d="M3 10c13 5 28 5 42 0M7 12l7 14 8-11m5 0 8 11 8-14M7 40l4-3m23 5 2-5M23 5V2m-10 1 2 3M16 34h13v10H16Z" /><path d="M22 34h3v10h-3Z" fill={accent} stroke="none" /><path d="M22 34c-10-7 0-10 1 0 1-10 11-7 0 0" /></Gambar>;
}
export function AsuhIcon(props: IconProps) {
  return <Gambar {...props}><path d="M6 42V28c0-6 17-6 17 0v14m3 0V31c0-5 15-5 15 0v11" /><circle cx="14" cy="13" r="7" /><circle cx="34" cy="18" r="5" /><path d="M13 32v10m21-9v9m-11-6h3" /><path d="M32 4c-4-5-8 2 0 6 8-4 4-11 0-6Z" fill={accent} stroke="none" /></Gambar>;
}

export function MagangIcon(props: IconProps) {
  return <Gambar {...props}><path d="M9 11h30v20H9ZM4 37h40l-3 5H7ZM20 37l1 2h6l1-2M15 17h10m-10 5h14m-14 5h7" /><path d="M31 15h4v4h-4Z" fill={accent} stroke="none" /></Gambar>;
}
export function DesainIcon(props: IconProps) {
  return <Gambar {...props}><rect x="5" y="7" width="38" height="30" rx="4" /><path d="M5 31h38M18 44h12m-6-7v7" /><path d="m14 26 12-12 4 4-12 12h-4Z" /><path d="m26 14 4-4 4 4-4 4" fill={accent} /></Gambar>;
}
export function TeknologiIcon(props: IconProps) {
  return <Gambar {...props}><rect x="8" y="8" width="32" height="22" rx="3" /><path d="M3 38h42l-4-8H7Z" /><path d="m19 15-4 4 4 4m10-8 4 4-4 4" /><path d="m26 13-4 12" stroke={accent} strokeWidth="2.6" /></Gambar>;
}
export function KantorIcon(props: IconProps) {
  return <Gambar {...props}><path d="M11 6h18l8 8v28H11Z" /><path d="M29 6v8h8M17 22h14m-14 6h14m-14 6h8" /><circle cx="33" cy="36" r="6" fill={accent} /><path d="m30.5 36 2 2 3.5-4" /></Gambar>;
}

export const KATEGORI = [
  { slug: "las", label: "Tukang Las", Icon: LasIcon, warna: "jingga-terang", ucapan: "Tukang las. Kerja mengelas besi dan pagar." },
  { slug: "ojek", label: "Ojek & Driver", Icon: OjekIcon, warna: "jingga-terang", ucapan: "Ojek dan driver. Kerja mengantar penumpang atau menyetir kendaraan." },
  { slug: "dapur", label: "Warung & Dapur", Icon: DapurIcon, warna: "jingga-terang", ucapan: "Warung dan dapur. Kerja memasak, mencuci piring, atau membantu di warung." },
  { slug: "bangunan", label: "Tukang Bangunan", Icon: BangunanIcon, warna: "jingga-terang", ucapan: "Tukang bangunan. Kerja membangun dan memperbaiki rumah." },
  { slug: "bengkel", label: "Bengkel", Icon: BengkelIcon, warna: "jingga-terang", ucapan: "Bengkel. Kerja merawat dan memperbaiki kendaraan." },
  { slug: "bersih", label: "Bersih-bersih", Icon: BersihIcon, warna: "jingga-terang", ucapan: "Bersih-bersih. Kerja membersihkan rumah, toko, atau tempat usaha." },
  { slug: "toko", label: "Jaga Toko", Icon: TokoIcon, warna: "jingga-terang", ucapan: "Jaga toko. Kerja melayani pembeli dan merapikan barang dagangan." },
  { slug: "angkut", label: "Angkut Barang", Icon: AngkutIcon, warna: "jingga-terang", ucapan: "Angkut barang. Kerja memindahkan dan mengangkat barang." },
  { slug: "kebun", label: "Kebun & Tani", Icon: KebunIcon, warna: "jingga-terang", ucapan: "Kebun dan tani. Kerja menanam, merawat tanaman, dan membantu panen." },
  { slug: "jahit", label: "Jahit", Icon: JahitIcon, warna: "jingga-terang", ucapan: "Jahit. Kerja menjahit dan memperbaiki pakaian." },
  { slug: "laundry", label: "Cuci & Setrika", Icon: LaundryIcon, warna: "jingga-terang", ucapan: "Cuci dan setrika. Kerja mencuci, menyetrika, dan melipat pakaian." },
  { slug: "kurir", label: "Kurir & Antar", Icon: KurirIcon, warna: "jingga-terang", ucapan: "Kurir dan antar. Kerja mengantar paket, makanan, atau belanjaan." },
  { slug: "acara", label: "Bantu Acara", Icon: AcaraIcon, warna: "jingga-terang", ucapan: "Bantu acara. Kerja menyiapkan tempat dan membantu jalannya acara." },
  { slug: "asuh", label: "Jaga Anak & Lansia", Icon: AsuhIcon, warna: "jingga-terang", ucapan: "Jaga anak dan lansia. Kerja mendampingi anak atau orang lanjut usia." },
  { slug: "magang", label: "Magang", Icon: MagangIcon, warna: "jingga-terang", ucapan: "Magang. Belajar kerja di kantor, studio, atau usaha digital sambil dibayar." },
] as const;

/** Internship categories (the second segment). Kept apart so the 14 informal categories stay as they are. */
export const KATEGORI_MAGANG = [
  { slug: "desain", label: "Desain & Kreatif", Icon: DesainIcon, warna: "jingga-terang", ucapan: "Desain dan kreatif. Magang mendesain tampilan, poster, atau konten." },
  { slug: "teknologi", label: "Teknologi", Icon: TeknologiIcon, warna: "jingga-terang", ucapan: "Teknologi. Magang membuat situs, aplikasi, atau mengelola data." },
  { slug: "kantor", label: "Administrasi", Icon: KantorIcon, warna: "jingga-terang", ucapan: "Administrasi. Magang mengurus dokumen, data, dan pelayanan kantor." },
] as const;

export type KategoriSlug = (typeof KATEGORI)[number]["slug"] | (typeof KATEGORI_MAGANG)[number]["slug"];
export function getKategori(slug: KategoriSlug) {
  return [...KATEGORI, ...KATEGORI_MAGANG].find((kategori) => kategori.slug === slug)!;
}
