import type { MouseEvent } from "react";
import { getKategori } from "../icons/categories";
import { IconChevronRight, IconMapPin, IconShieldCheck, IconSparkles } from "../icons/tabler";
import { CekUpah } from "../ui/CekUpah";
import { upahTeks, type Lowongan, type PersonaId } from "@/lib/data";
import { TautanArah } from "./TautanArah";
import { SisaWaktu } from "./SisaWaktu";

/** Compact job row for lists. `alasan` is the short "why it fits" line from matching, shown inside the card. */
export function BarisLowongan({ lowongan: l, persona, skor: skorServer, baru, alasan, onClick }: { lowongan: Lowongan; persona?: PersonaId; skor?: number; baru?: boolean; alasan?: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const { Icon } = getKategori(l.kategori);
  const skor = skorServer ?? (persona ? l.cocok?.[persona] : undefined);
  return (
    <TautanArah arah="maju" href={`/app/lowongan/${l.id}`} className="baris-lowongan" data-baru={baru || undefined} onClick={onClick}>
      <span className="ubin-ikon"><Icon size={32} /></span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold leading-tight">{l.judul}</span>
          {baru && <span className="lencana-baru">Baru</span>}
          {l.mendesakMenit && <span className="urgent-tag">Butuh hari ini</span>}
          {l.segmen === "magang" && <span className="lencana-magang">Magang</span>}
        </span>
        <span className="mt-0.5 block truncate text-sm text-abu">{l.usaha}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-abu">
          <span className="text-sm font-bold text-tinta tabular-nums">{upahTeks(l)}</span>
          <span className="inline-flex items-center gap-1"><IconMapPin size={14} />{l.area}{l.kota && l.kota !== "Banyumas" ? `, ${l.kota}` : ""} · {String(l.jarakKm).replace(".", ",")} km</span>
          {l.verifikasi.ktp && <span className="inline-flex items-center gap-1 font-bold text-daun"><IconShieldCheck size={14} />Terverifikasi</span>}
          {l.cekUpah !== "wajar" && <CekUpah status={l.cekUpah} />}
        </span>
        {alasan && <span className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-daun"><IconSparkles size={15} className="mt-px shrink-0" />{alasan}</span>}
      </span>
      <span className="flex flex-col items-end gap-2 self-stretch justify-between">
        {skor !== undefined ? <span className="skor-cocok">Cocok {skor}%</span> : <span />}
        <IconChevronRight size={18} className="text-abu" />
      </span>
    </TautanArah>
  );
}

/** Card for the horizontal Butuh Hari Ini strip. `baru` marks one that just arrived over the live feed. */
export function KartuMendesak({ lowongan: l, baru }: { lowongan: Lowongan; baru?: boolean }) {
  const { Icon } = getKategori(l.kategori);
  return (
    <TautanArah arah="maju" href={`/app/lowongan/${l.id}`} className="kartu-mendesak" data-baru={baru || undefined}>
      <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="urgent-tag">Butuh hari ini</span>{baru && <span className="lencana-baru">Baru</span>}</span>{l.mendesakMenit && <SisaWaktu menit={l.mendesakMenit} />}</span>
      <span className="mt-3 flex items-center gap-3">
        <span className="ubin-ikon bg-white"><Icon size={30} /></span>
        <span className="min-w-0"><span className="block font-bold leading-tight">{l.judul}</span><span className="block truncate text-sm text-abu">{l.usaha}</span></span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-2 text-sm"><span className="font-bold tabular-nums">{upahTeks(l)}</span><span className="text-xs text-abu">{String(l.jarakKm).replace(".", ",")} km · {l.jadwal.replace("Hari ini, ", "")}</span></span>
    </TautanArah>
  );
}
