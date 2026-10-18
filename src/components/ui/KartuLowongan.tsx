import { getKategori, type KategoriSlug } from "../icons/categories";
import { ClockIcon, CoinIcon, LocationIcon, MicIcon } from "../icons/interface";
import { AksiContoh } from "./AksiContoh";
import { Bacakan } from "./Bacakan";
import { CekUpah, type StatusUpah } from "./CekUpah";
import { LencanaTerverifikasi, type VerifikasiProps } from "./LencanaTerverifikasi";
import { HitungMundur } from "./HitungMundur";

export type KartuLowonganProps = {
  kategori: KategoriSlug;
  judul: string;
  pemberiKerja: string;
  upah: string;
  lokasi: string;
  jarak: string;
  jadwal: string;
  verifikasi: VerifikasiProps;
  statusUpah?: StatusUpah;
  mendesak?: { until: number };
  className?: string;
};

export function KartuLowongan({ kategori, judul, pemberiKerja, upah, lokasi, jarak, jadwal, verifikasi, statusUpah = "wajar", mendesak, className = "" }: KartuLowonganProps) {
  const { Icon } = getKategori(kategori);
  const checks = [verifikasi.ktp && "KTP", verifikasi.npwp && "NPWP", verifikasi.fotoUsaha && "foto usaha"].filter(Boolean).join(", ");
  const ucapan = `${mendesak ? "Butuh hari ini. " : ""}${judul}. ${pemberiKerja}. Upah ${upah}. Lokasi ${lokasi}, jarak ${jarak}. Jadwal ${jadwal}. ${checks ? `Terverifikasi: ${checks}.` : "Belum terverifikasi."}`;
  return (
    <article className={`job-card card flex min-w-0 flex-col ${className}`} aria-label={`Lowongan ${judul}, ${pemberiKerja}`}>
      <div className="job-content flex flex-1 flex-col gap-5 p-5 sm:p-6">
        {mendesak && <HitungMundur until={mendesak.until} />}
        <div className="job-heading flex items-start gap-3"><span className="rounded-xl bg-kabut p-2"><Icon size={40} /></span><div className="min-w-0"><h3 className="text-2xl leading-snug">{judul}</h3><p className="mt-1 text-base">{pemberiKerja}</p></div></div>
        <dl className="job-details grid gap-3 text-base"><div className="flex items-center gap-3"><dt><CoinIcon size={19} /><span className="sr-only">Upah</span></dt><dd>{upah}</dd></div><div className="flex items-center gap-3"><dt><LocationIcon size={19} /><span className="sr-only">Lokasi</span></dt><dd>{lokasi} · {jarak}</dd></div><div className="flex items-center gap-3"><dt><ClockIcon size={19} /><span className="sr-only">Jadwal</span></dt><dd>{jadwal}</dd></div></dl>
        <div className="flex flex-wrap items-start justify-between gap-3"><LencanaTerverifikasi {...verifikasi} /><CekUpah status={statusUpah} /></div>
        <div className="job-actions mt-auto flex flex-wrap items-center gap-3"><AksiContoh aksi="lamar" className="grow"><MicIcon size={24} />Saya bisa</AksiContoh><Bacakan teks={ucapan} label={`Bacakan lowongan ${judul}`} /></div>
      </div>
    </article>
  );
}
