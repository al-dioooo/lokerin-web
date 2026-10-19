import { getKategori } from "../icons/categories";
import { IconCalendar, IconCash, IconCheck, IconClock, IconMapPin, IconShieldCheck, IconX } from "../icons/tabler";
import { CekUpah } from "../ui/CekUpah";
import { SisaWaktu } from "./SisaWaktu";
import { upahTeks, type Lowongan } from "@/lib/data";

const PENJELASAN_UPAH = {
  wajar: "Upah ini setara atau di atas UMK Banyumas 2026 (Rp2.474.599 per bulan) untuk jam kerjanya.",
  rendah: "Peringatan upah: untuk jam kerjanya, upah ini di bawah UMK Banyumas 2026 (Rp2.474.599 per bulan). Tanyakan dulu soal makan, transport, atau bonus sebelum sepakat.",
  curiga: "Upah ini jauh di atas kisaran wajar dan lowongan meminta biaya di depan. Lokerin menahannya.",
};

/** What a person reads before applying, aloud as well as on screen. */
export function bacaanLowongan(l: Lowongan) {
  const jarak = String(l.jarakKm).replace(".", ",");
  return `${l.mendesakMenit ? "Butuh hari ini. " : ""}${l.judul} di ${l.usaha}, ${l.area}, ${jarak} kilometer dari kamu. Upah ${upahTeks(l).replace("/", " per ")}. Jadwal ${l.jadwal}. ${l.deskripsi}`;
}

/**
 * The body of a job: who, pay, place, schedule, what the work is and what Lokerin checked.
 * Shared by the job page and the drawer that opens from Ngobrol; the page wraps it in an h1.
 */
export function RincianLowongan({ l, Judul = "h1" }: { l: Lowongan; Judul?: "h1" | "h2" | "h3" }) {
  const { Icon, label } = getKategori(l.kategori);
  const jarak = String(l.jarakKm).replace(".", ",");
  const cek = [["KTP pemilik", l.verifikasi.ktp], ["NPWP", l.verifikasi.npwp], ["Foto tempat usaha", l.verifikasi.fotoUsaha]] as const;
  return (
    <>
      <header className="flex items-start gap-3">
        <span className="ubin-ikon size-14"><Icon size={40} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-abu">{label} · dipasang {l.dipasang.toLowerCase()}</p>
          <Judul className="text-2xl leading-tight">{l.judul}</Judul>
          <p className="text-sm text-abu">{l.usaha} · {l.pemilik}</p>
        </div>
      </header>
      {l.mendesakMenit && <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F7C9A0] bg-jingga-muda p-3"><span className="urgent-tag">Butuh hari ini</span><span className="text-sm text-jingga-tua">Lowongan tutup dalam <SisaWaktu menit={l.mendesakMenit} className="bg-white" /></span></div>}
      <div className="@container">
      <dl className="grid grid-cols-2 gap-2">
        <div className="fakta col-span-2 @md:col-span-1"><dt><IconCash size={16} />Upah</dt><dd className="text-lg tabular-nums">{upahTeks(l)}</dd><CekUpah status={l.cekUpah} /></div>
        <div className="fakta col-span-2 @md:col-span-1"><dt><IconMapPin size={16} />Lokasi</dt><dd>{l.area}</dd><span className="text-xs text-abu">{jarak} km dari kamu</span></div>
        <div className="fakta col-span-2"><dt><IconClock size={16} />Jadwal</dt><dd>{l.jadwal}</dd></div>
      </dl>
      </div>
      <p className="text-sm text-abu">{PENJELASAN_UPAH[l.cekUpah]}</p>
      <section><h2 className="mb-1 text-base">Tentang pekerjaan</h2><p className="text-[15px]">{l.deskripsi}</p></section>
      {l.syarat.length > 0 && <section><h2 className="mb-2 text-base">Syarat</h2><ul className="grid gap-1.5 text-[15px]">{l.syarat.map((s) => <li key={s} className="flex items-start gap-2"><IconCheck size={18} className="mt-0.5 shrink-0 text-daun" />{s}</li>)}</ul></section>}
      <section className="rounded-2xl border border-garis bg-white p-4">
        <h2 className="flex items-center gap-2 text-base"><IconShieldCheck size={20} className="text-daun" />Yang sudah dicek Lokerin</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {cek.map(([nama, ok]) => <li key={nama} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2">{ok ? <IconCheck size={16} className="text-daun" /> : <IconX size={16} className="text-abu" />}{nama}</span><span className="text-xs text-abu">{ok ? "Sudah dicek" : "Belum ada"}</span></li>)}
        </ul>
        {l.verifikasi.ktpSamaran && <p className="mt-3 flex items-center gap-2 border-t border-dashed border-garis pt-3 text-xs text-abu"><IconCalendar size={14} />Dicek {l.verifikasi.tanggal} · KTP {l.verifikasi.ktpSamaran}</p>}
      </section>
    </>
  );
}
