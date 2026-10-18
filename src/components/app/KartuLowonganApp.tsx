import { getKategori } from "../icons/categories";
import { IconChevronRight, IconMapPin, IconShieldCheck } from "../icons/tabler";
import { CekUpah } from "../ui/CekUpah";
import { upahTeks, type Lowongan, type PersonaId } from "@/lib/data";
import { TautanArah } from "./TautanArah";
import { SisaWaktu } from "./SisaWaktu";

/** Compact job row for lists. */
export function BarisLowongan({ lowongan: l, persona, skor: skorServer }: { lowongan: Lowongan; persona?: PersonaId; skor?: number }) {
  const { Icon } = getKategori(l.kategori);
  const skor = skorServer ?? (persona ? l.cocok?.[persona] : undefined);
  return (
    <TautanArah arah="maju" href={`/app/lowongan/${l.id}`} className="baris-lowongan">
      <span className="ubin-ikon"><Icon size={32} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold leading-tight">{l.judul}</span>
          {l.mendesakMenit && <span className="urgent-tag">Butuh hari ini</span>}
        </span>
        <span className="mt-0.5 block truncate text-sm text-abu">{l.usaha}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-abu">
          <span className="text-sm font-bold text-tinta tabular-nums">{upahTeks(l)}</span>
          <span className="inline-flex items-center gap-1"><IconMapPin size={14} />{l.area} · {String(l.jarakKm).replace(".", ",")} km</span>
          {l.verifikasi.ktp && <span className="inline-flex items-center gap-1 font-bold text-daun"><IconShieldCheck size={14} />Terverifikasi</span>}
          {l.cekUpah !== "wajar" && <CekUpah status={l.cekUpah} />}
        </span>
      </span>
      <span className="flex flex-col items-end gap-2 self-stretch justify-between">
        {skor !== undefined ? <span className="skor-cocok">Cocok {skor}%</span> : <span />}
        <IconChevronRight size={18} className="text-abu" />
      </span>
    </TautanArah>
  );
}

/** Card for the horizontal Butuh Hari Ini strip. */
export function KartuMendesak({ lowongan: l }: { lowongan: Lowongan }) {
  const { Icon } = getKategori(l.kategori);
  return (
    <TautanArah arah="maju" href={`/app/lowongan/${l.id}`} className="kartu-mendesak">
      <span className="flex items-center justify-between gap-2"><span className="urgent-tag">Butuh hari ini</span>{l.mendesakMenit && <SisaWaktu menit={l.mendesakMenit} />}</span>
      <span className="mt-3 flex items-center gap-3">
        <span className="ubin-ikon bg-white"><Icon size={30} /></span>
        <span className="min-w-0"><span className="block font-bold leading-tight">{l.judul}</span><span className="block truncate text-sm text-abu">{l.usaha}</span></span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-2 text-sm"><span className="font-bold tabular-nums">{upahTeks(l)}</span><span className="text-xs text-abu">{String(l.jarakKm).replace(".", ",")} km · {l.jadwal.replace("Hari ini, ", "")}</span></span>
    </TautanArah>
  );
}
