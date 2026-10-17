import { getKategori, type KategoriSlug } from "../icons/categories";

export function PinPeta({ kategori, mendesak = false, className = "" }: { kategori: KategoriSlug; mendesak?: boolean; className?: string }) {
  const { Icon, label } = getKategori(kategori);
  return <span role="img" aria-label={`${label}${mendesak ? ", butuh hari ini" : ""}`} className={`relative inline-flex h-24 w-20 items-start justify-center ${className}`}><svg viewBox="0 0 80 96" width="80" height="96" aria-hidden="true"><path d="M40 91 13 56C-8 26 13 5 40 5s48 21 27 51Z" fill="#FBF6EC" stroke={mendesak ? "#C8261B" : "#1B1712"} strokeWidth={mendesak ? 6 : 3} strokeLinejoin="round" /></svg><span className="absolute top-4"><Icon size={44} /></span></span>;
}
