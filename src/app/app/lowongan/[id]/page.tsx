import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AksiLowongan } from "@/components/app/AksiLowongan";
import { Bersama, Halaman } from "@/components/app/Halaman";
import { SisaWaktu } from "@/components/app/SisaWaktu";
import { getKategori } from "@/components/icons/categories";
import { IconArrowLeft, IconCalendar, IconCash, IconCheck, IconClock, IconMapPin, IconShieldCheck, IconX } from "@/components/icons/tabler";
import { CekUpah } from "@/components/ui/CekUpah";
import { LOWONGAN, cariLowongan, upahTeks } from "@/lib/data";

export function generateStaticParams() {
  return LOWONGAN.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/lowongan/[id]">) {
  const l = cariLowongan((await params).id);
  return { title: l ? `${l.judul} · ${l.usaha}` : "Lowongan" };
}

const PENJELASAN_UPAH = {
  wajar: "Upah ini sesuai dengan kisaran UMK Banyumas untuk pekerjaan sejenis.",
  rendah: "Upah ini di bawah UMK Banyumas. Tanyakan dulu soal makan, transport, atau bonus sebelum sepakat.",
  curiga: "Upah ini jauh di atas kisaran wajar dan lowongan meminta biaya di depan. Lokerin menahannya.",
};

export default function DetailLowongan({ params }: PageProps<"/app/lowongan/[id]">) {
  return <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-kabut" role="status" aria-label="Memuat lowongan" />}><IsiLowongan params={params} /></Suspense>;
}

async function IsiLowongan({ params }: Pick<PageProps<"/app/lowongan/[id]">, "params">) {
  const l = cariLowongan((await params).id);
  if (!l) notFound();
  const { Icon, label } = getKategori(l.kategori);
  const jarak = String(l.jarakKm).replace(".", ",");
  const bacaan = `${l.mendesakMenit ? "Butuh hari ini. " : ""}${l.judul} di ${l.usaha}, ${l.area}, ${jarak} kilometer dari kamu. Upah ${upahTeks(l).replace("/", " per ")}. Jadwal ${l.jadwal}. ${l.deskripsi}`;
  const cek = [["KTP pemilik", l.verifikasi.ktp], ["NPWP", l.verifikasi.npwp], ["Foto tempat usaha", l.verifikasi.fotoUsaha]] as const;
  return (
    <Halaman>
    <article className="mx-auto grid max-w-2xl gap-5">
      <Link href="/app" transitionTypes={["nav-mundur"]} className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold text-abu"><IconArrowLeft size={18} />Kembali</Link>
      <header className="flex items-start gap-3">
        <Bersama nama={`ikon-${l.id}`}><span className="ubin-ikon size-14"><Icon size={40} /></span></Bersama>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-abu">{label} · dipasang {l.dipasang.toLowerCase()}</p>
          <h1 className="text-2xl leading-tight">{l.judul}</h1>
          <p className="text-sm text-abu">{l.usaha} · {l.pemilik}</p>
        </div>
      </header>
      {l.mendesakMenit && <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#F7C9A0] bg-jingga-muda p-3"><span className="urgent-tag">Butuh hari ini</span><span className="text-sm text-jingga-tua">Lowongan tutup dalam <SisaWaktu menit={l.mendesakMenit} className="bg-white" /></span></div>}
      <dl className="grid grid-cols-2 gap-2">
        <div className="fakta col-span-2 sm:col-span-1"><dt><IconCash size={16} />Upah</dt><dd className="text-lg tabular-nums">{upahTeks(l)}</dd><CekUpah status={l.cekUpah} /></div>
        <div className="fakta col-span-2 sm:col-span-1"><dt><IconMapPin size={16} />Lokasi</dt><dd>{l.area}</dd><span className="text-xs text-abu">{jarak} km dari kamu</span></div>
        <div className="fakta col-span-2"><dt><IconClock size={16} />Jadwal</dt><dd>{l.jadwal}</dd></div>
      </dl>
      <p className="text-sm text-abu">{PENJELASAN_UPAH[l.cekUpah]}</p>
      <section><h2 className="mb-1 text-base">Tentang pekerjaan</h2><p className="text-[15px]">{l.deskripsi}</p></section>
      <section><h2 className="mb-2 text-base">Syarat</h2><ul className="grid gap-1.5 text-[15px]">{l.syarat.map((s) => <li key={s} className="flex items-start gap-2"><IconCheck size={18} className="mt-0.5 shrink-0 text-daun" />{s}</li>)}</ul></section>
      <section className="rounded-2xl border border-garis bg-white p-4">
        <h2 className="flex items-center gap-2 text-base"><IconShieldCheck size={20} className="text-daun" />Yang sudah dicek Lokerin</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {cek.map(([nama, ok]) => <li key={nama} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2">{ok ? <IconCheck size={16} className="text-daun" /> : <IconX size={16} className="text-abu" />}{nama}</span><span className="text-xs text-abu">{ok ? "Sudah dicek" : "Belum ada"}</span></li>)}
        </ul>
        {l.verifikasi.ktpSamaran && <p className="mt-3 flex items-center gap-2 border-t border-dashed border-garis pt-3 text-xs text-abu"><IconCalendar size={14} />Dicek {l.verifikasi.tanggal} · KTP {l.verifikasi.ktpSamaran}</p>}
      </section>
      {l.cekUpah === "curiga" ? <p className="rounded-2xl bg-merah-muda p-4 text-sm text-merah">Lowongan ini tidak bisa dilamar. Jangan pernah membayar biaya apa pun untuk mendapat pekerjaan.</p> : <AksiLowongan judul={l.judul} usaha={l.usaha} wa={l.wa} bacaan={bacaan} />}
    </article>
    </Halaman>
  );
}
