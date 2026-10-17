export type VerifikasiProps = { ktp?: boolean; npwp?: boolean; fotoUsaha?: boolean; tanggal?: string };

export function LencanaTerverifikasi({ ktp = false, npwp = false, fotoUsaha = false, tanggal }: VerifikasiProps) {
  const checks = [ktp && "KTP", npwp && "NPWP", fotoUsaha && "FOTO USAHA"].filter(Boolean);
  if (!checks.length) return <span className="text-sm font-bold text-abu">Belum terverifikasi</span>;
  return <span className="stamp"><span>✓ TERVERIFIKASI · {checks.join(" · ")}</span>{tanggal && <span className="text-[11px] font-medium tracking-normal">Diperiksa {tanggal}</span>}</span>;
}
