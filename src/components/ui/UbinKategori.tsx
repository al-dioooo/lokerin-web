import Link from "next/link";
import { KATEGORI, getKategori, type KategoriSlug } from "../icons/categories";
import { ArrowIcon } from "../icons/interface";
import { Bacakan } from "./Bacakan";

export function UbinKategori({ kategori, label: displayLabel, href }: { kategori: KategoriSlug; label?: string; href?: string }) {
  const { Icon, label, ucapan } = getKategori(kategori);
  const nomor = String(KATEGORI.findIndex((item) => item.slug === kategori) + 1).padStart(2, "0");
  return <article className="category-tile" id={`kategori-${kategori}`}><Icon size={64} /><div><h3>{displayLabel ?? label}</h3><p className="mt-3 font-mono text-xs text-abu">{nomor} / 14</p></div><Link href={href ?? `/desain#kategori-${kategori}`} className="icon-button border border-garis" aria-label={`Lihat kategori ${label}`}><ArrowIcon size={21} /></Link><div className="category-audio"><Bacakan teks={ucapan} label={`Bacakan kategori ${label}`} /></div></article>;
}
