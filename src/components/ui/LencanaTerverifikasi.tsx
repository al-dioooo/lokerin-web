import { CheckIcon } from "../icons/interface";

export type VerifikasiProps = { ktp?: boolean; npwp?: boolean; fotoUsaha?: boolean; tanggal?: string };

export function LencanaTerverifikasi({ ktp = false, npwp = false, fotoUsaha = false, tanggal }: VerifikasiProps) {
  const checks = [ktp && "KTP", npwp && "NPWP", fotoUsaha && "Foto usaha"].filter(Boolean);
  if (!checks.length) return <span className="text-sm text-abu">Belum terverifikasi</span>;
  return <div><span className="inline-flex items-center gap-1.5 rounded-full bg-daun-muda px-3 py-1 text-sm font-bold text-daun"><CheckIcon size={18} />Terverifikasi</span><p className="mt-1 text-xs leading-relaxed text-abu">{checks.join(" · ")}{tanggal && <span className="block">Diperiksa {tanggal}</span>}</p></div>;
}
