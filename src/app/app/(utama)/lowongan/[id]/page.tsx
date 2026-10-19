import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AksiLowongan } from "@/components/app/AksiLowongan";
import { AksiLamar } from "@/components/pencari/AksiLamar";
import { apiAktif } from "@/lib/api/klien";
import { satuLowongan } from "@/lib/api/sumber";
import { Halaman } from "@/components/app/Halaman";
import { TautanArah } from "@/components/app/TautanArah";
import { RincianLowongan, bacaanLowongan } from "@/components/app/RincianLowongan";
import { IconArrowLeft } from "@/components/icons/tabler";
import { GagalMuat } from "@/components/ui/GagalMuat";
import { LOWONGAN } from "@/lib/data";

export function generateStaticParams() {
  return LOWONGAN.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/app/lowongan/[id]">) {
  const l = (await satuLowongan((await params).id)).data?.lowongan;
  return { title: l ? `${l.judul} · ${l.usaha}` : "Lowongan" };
}

export default function DetailLowongan({ params }: PageProps<"/app/lowongan/[id]">) {
  return <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-kabut" role="status" aria-label="Memuat lowongan" />}><IsiLowongan params={params} /></Suspense>;
}

async function IsiLowongan({ params }: Pick<PageProps<"/app/lowongan/[id]">, "params">) {
  const sumber = await satuLowongan((await params).id);
  if (sumber.putus) return <GagalMuat judul="Lowongan belum bisa dibuka" />;
  const hasil = sumber.data;
  if (!hasil) notFound();
  const l = hasil.lowongan;
  const bacaan = bacaanLowongan(l);
  return (
    <Halaman>
    <article className="mx-auto grid max-w-2xl gap-5">
      <TautanArah arah="mundur" href="/app" className="inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold text-abu"><IconArrowLeft size={18} />Kembali</TautanArah>
      <RincianLowongan l={l} />
      {l.cekUpah === "curiga" ? <p className="rounded-2xl bg-merah-muda p-4 text-sm text-merah">Lowongan ini tidak bisa dilamar. Jangan pernah membayar biaya apa pun untuk mendapat pekerjaan.</p> : hasil.api && apiAktif ? <AksiLamar lowonganId={l.id} judul={l.judul} usaha={l.usaha} magang={hasil.api.segmen === "magang"} bacaan={bacaan} /> : <AksiLowongan judul={l.judul} usaha={l.usaha} wa={l.wa} bacaan={bacaan} />}
    </article>
    </Halaman>
  );
}
