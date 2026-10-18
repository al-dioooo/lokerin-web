import { getKategori, type KategoriSlug } from "../icons/categories";

export function PinPeta({ kategori, mendesak = false, className = "", left, top }: { kategori: KategoriSlug; mendesak?: boolean; className?: string; left?: number; top?: number }) {
  const { Icon, label } = getKategori(kategori);
  const positioned = left !== undefined || top !== undefined;
  return <span role="img" aria-label={`${label}${mendesak ? ", butuh hari ini" : ""}`} className={`inline-flex h-20 w-16 items-start justify-center ${className}`} style={{ position: positioned ? "absolute" : "relative", left: left !== undefined ? `${left}%` : undefined, top: top !== undefined ? `${top}%` : undefined, transform: positioned ? "translate(-50%, -100%)" : undefined }}>{mendesak && <><span aria-hidden="true" className="mic-ring top-0! bottom-4!" /><span className="urgent-tag absolute -top-11 left-1/2 -translate-x-1/2">BUTUH HARI INI</span></>}<svg viewBox="0 0 64 80" width="64" height="80" aria-hidden="true"><path d="M32 77 9 48A29 29 0 1 1 55 48Z" fill="var(--color-jingga)" /><circle cx="32" cy="30" r="23" fill="white" /></svg><span className="absolute top-3"><Icon size={36} /></span></span>;
}
