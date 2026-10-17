import { getKategori, type KategoriSlug } from "../icons/categories";
import { Bacakan } from "./Bacakan";

export function UbinKategori({ kategori }: { kategori: KategoriSlug }) {
  const { Icon, label, ucapan } = getKategori(kategori);
  return <Bacakan teks={ucapan} label={`Bacakan kategori ${label}`} className="min-h-52 flex-col gap-4 bg-kertas-terang p-5 hover:bg-kunyit"><Icon size={64} /><span className="font-papan text-base leading-snug">{label}</span></Bacakan>;
}
