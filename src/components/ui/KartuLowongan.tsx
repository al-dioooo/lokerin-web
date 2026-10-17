import { getKategori, type KategoriSlug } from "../icons/categories";
import { Bacakan } from "./Bacakan";
import { CekUpah, type StatusUpah } from "./CekUpah";
import { LencanaTerverifikasi, type VerifikasiProps } from "./LencanaTerverifikasi";
import { HitungMundur } from "./PapanLed";

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
    <article className={`paper taped flex min-w-0 flex-col ${className}`}>
      {mendesak && <div className="rounded-t-[2px] border-b-3 border-arang bg-cabai px-5 py-3 font-papan text-sm text-white">Butuh hari ini!</div>}
      <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start gap-3"><Icon size={52} /><div className="min-w-0"><h3 className="font-papan text-xl leading-snug">{judul}</h3><p className="mt-1 text-abu">{pemberiKerja}</p></div></div>
        <div><p className="text-2xl font-extrabold tracking-tight">{upah}</p><div className="mt-2"><CekUpah status={statusUpah} /></div></div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-base"><dt className="text-abu">Lokasi</dt><dd className="font-bold">{lokasi} · {jarak}</dd><dt className="text-abu">Jadwal</dt><dd>{jadwal}</dd></dl>
        <div><LencanaTerverifikasi {...verifikasi} /></div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-kardus pt-4">{mendesak ? <HitungMundur until={mendesak.until} /> : <span className="text-sm text-abu">Kerja dekat rumah.</span>}<Bacakan teks={ucapan} label={`Bacakan lowongan ${judul}`} /></div>
      </div>
    </article>
  );
}
