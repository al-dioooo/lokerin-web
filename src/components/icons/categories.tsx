import type { ReactNode } from "react";

export type IconProps = { size?: number; className?: string };
function Gambar({ size = 48, className = "", children }: IconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="#1B1712" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{children}</svg>;
}

export function LasIcon(props: IconProps) {
  return <Gambar {...props}><path d="m10 9 23-2 3 26-12 8-13-7Z" fill="#F5B400" /><path d="m15 15 15-1 1 10-15 1Zm4 17 8-1M39 9l3-3m-2 12h4m-6 9 4 3" /></Gambar>;
}
export function OjekIcon(props: IconProps) {
  return <Gambar {...props}><path d="M10 27h22l-4-12h7l4 13-7 5H13Z" fill="#C8261B" /><circle cx="11" cy="34" r="7" /><circle cx="37" cy="34" r="7" /><path d="M12 22h10m7-7-2-6h7M11 34l6-11" /></Gambar>;
}
export function DapurIcon(props: IconProps) {
  return <Gambar {...props}><path d="M8 23h32l-3 16H12Z" fill="#F5B400" /><path d="M5 23h38M8 29H4m36 0h4M13 17c-6-5 5-6 0-11m11 11c-6-5 5-6 0-11m11 11c-6-5 5-6 0-11M17 43h14" /></Gambar>;
}
export function BangunanIcon(props: IconProps) {
  return <Gambar {...props}><path d="M8 30C7 8 40 7 40 30Z" fill="#F5B400" /><path d="M5 30h38v8H5Zm15-15V9h8v6m-4 0v12M13 23v5m22-5v5" /></Gambar>;
}
export function BengkelIcon(props: IconProps) {
  return <Gambar {...props}><path d="m34 5-8 8 9 9 8-8c3 11-8 18-17 13L12 42l-7-7 15-14C15 12 23 2 34 5Z" fill="#1F5AA6" /><path d="m11 35 2-2" /></Gambar>;
}
export function BersihIcon(props: IconProps) {
  return <Gambar {...props}><path d="m19 22 12 5 6 15-29-1Z" fill="#1E6E3A" /><path d="m26 24 9-18M17 34l-3 7m10-9-1 9m7-7 2 7M8 9v8m-4-4h8m30 10v6m-3-3h6" /></Gambar>;
}
export function TokoIcon(props: IconProps) {
  return <Gambar {...props}><path d="M8 8h32l4 13c-2 5-7 5-10 0-3 5-7 5-10 0-3 5-7 5-10 0-3 5-8 5-10 0Z" fill="#C8261B" /><path d="M8 26v16h32V26M18 42V30h12v12M17 8l-3 13M31 8l3 13M24 8v13" /></Gambar>;
}
export function AngkutIcon(props: IconProps) {
  return <Gambar {...props}><path d="m17 12 20-3 3 21-20 3Z" fill="#C9A36B" /><path d="m26 11 2 9M5 7h7l5 31h25M23 38v4m13-4v4" /><circle cx="23" cy="42" r="2" /><circle cx="36" cy="42" r="2" /></Gambar>;
}
export function KebunIcon(props: IconProps) {
  return <Gambar {...props}><path d="M24 30C7 30 6 12 7 9c13 0 19 7 17 21Zm0-7C23 10 32 4 42 6c0 12-5 18-18 17Z" fill="#1E6E3A" /><path d="M24 40V23m0 7-9-11m9 5 10-10M8 42c10-5 21-5 32 0" /></Gambar>;
}
export function JahitIcon(props: IconProps) {
  return <Gambar {...props}><path d="M7 18h26V9h9v27H7V26h9v-8" fill="#C8261B" /><path d="M4 41h40M12 20v10m14-18h7m-4-4v4M7 36V18m29 9h2" /><circle cx="27" cy="25" r="3" /></Gambar>;
}
export function LaundryIcon(props: IconProps) {
  return <Gambar {...props}><path d="M8 6h32v36H8Z" fill="#1F5AA6" /><path d="M8 15h32m-26-4h2m6 0h2" /><circle cx="24" cy="28" r="9" fill="#FBF6EC" /><path d="M16 29c5-5 11 5 16 0" /></Gambar>;
}
export function KurirIcon(props: IconProps) {
  return <Gambar {...props}><path d="m15 9 17-3 11 8v24l-18 5-10-8Z" fill="#C9A36B" /><path d="m15 9 10 10 18-5M25 19v24m-4-30 17-4M4 17h6m-8 9h8m-4 9h4m22-8 5-1" /></Gambar>;
}
export function AcaraIcon(props: IconProps) {
  return <Gambar {...props}><path d="m7 13 12 22 12-22Zm24 0 10 18 4-18Z" fill="#F5B400" /><path d="M3 10c13 5 28 5 42 0M7 40l4-3m23 5 2-5M23 5V2m-10 1 2 3" /></Gambar>;
}
export function AsuhIcon(props: IconProps) {
  return <Gambar {...props}><path d="M6 40V28c0-6 17-6 17 0v12m3 0V29c0-5 15-5 15 0v11" fill="#F5B400" /><circle cx="14" cy="13" r="7" /><circle cx="34" cy="17" r="5" /><path d="M14 31v9m20-9v9M4 43h40m-21-8h3" /></Gambar>;
}

export const KATEGORI = [
  { slug: "las", label: "Tukang Las", Icon: LasIcon, warna: "kunyit", ucapan: "Tukang las. Kerja mengelas besi dan pagar." },
  { slug: "ojek", label: "Ojek & Driver", Icon: OjekIcon, warna: "cabai", ucapan: "Ojek dan driver. Kerja mengantar penumpang atau menyetir kendaraan." },
  { slug: "dapur", label: "Warung & Dapur", Icon: DapurIcon, warna: "kunyit", ucapan: "Warung dan dapur. Kerja memasak, mencuci piring, atau membantu di warung." },
  { slug: "bangunan", label: "Tukang Bangunan", Icon: BangunanIcon, warna: "kunyit", ucapan: "Tukang bangunan. Kerja membangun dan memperbaiki rumah." },
  { slug: "bengkel", label: "Bengkel", Icon: BengkelIcon, warna: "langit", ucapan: "Bengkel. Kerja merawat dan memperbaiki kendaraan." },
  { slug: "bersih", label: "Bersih-bersih", Icon: BersihIcon, warna: "daun", ucapan: "Bersih-bersih. Kerja membersihkan rumah, toko, atau tempat usaha." },
  { slug: "toko", label: "Jaga Toko", Icon: TokoIcon, warna: "cabai", ucapan: "Jaga toko. Kerja melayani pembeli dan merapikan barang dagangan." },
  { slug: "angkut", label: "Angkut Barang", Icon: AngkutIcon, warna: "kardus", ucapan: "Angkut barang. Kerja memindahkan dan mengangkat barang." },
  { slug: "kebun", label: "Kebun & Tani", Icon: KebunIcon, warna: "daun", ucapan: "Kebun dan tani. Kerja menanam, merawat tanaman, dan membantu panen." },
  { slug: "jahit", label: "Jahit", Icon: JahitIcon, warna: "cabai", ucapan: "Jahit. Kerja menjahit dan memperbaiki pakaian." },
  { slug: "laundry", label: "Cuci & Setrika", Icon: LaundryIcon, warna: "langit", ucapan: "Cuci dan setrika. Kerja mencuci, menyetrika, dan melipat pakaian." },
  { slug: "kurir", label: "Kurir & Antar", Icon: KurirIcon, warna: "kardus", ucapan: "Kurir dan antar. Kerja mengantar paket, makanan, atau belanjaan." },
  { slug: "acara", label: "Bantu Acara", Icon: AcaraIcon, warna: "kunyit", ucapan: "Bantu acara. Kerja menyiapkan tempat dan membantu jalannya acara." },
  { slug: "asuh", label: "Jaga Anak & Lansia", Icon: AsuhIcon, warna: "kunyit", ucapan: "Jaga anak dan lansia. Kerja mendampingi anak atau orang lanjut usia." },
] as const;

export type KategoriSlug = (typeof KATEGORI)[number]["slug"];
export function getKategori(slug: KategoriSlug) {
  return KATEGORI.find((kategori) => kategori.slug === slug)!;
}
