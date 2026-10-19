"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { IconCamera, IconCheck, IconCircleDashed, IconId, IconShieldCheck, IconUpload } from "../icons/tabler";
import { useApi } from "@/lib/api/hooks";
import { apiAktif } from "@/lib/api/klien";
import type { MeApi } from "@/lib/api/tipe";

// Alur verifikasi (PRD, 7 Nov): upload mock KTP + NPWP or a shop photo, watch the review status
// change live, receive the badge. The backend has no upload or review route yet, so this keeps
// the state in the browser and simulates the review. Real documents are never accepted.

type Dokumen = "ktp" | "npwp" | "foto";
type Status = "belum" | "menunggu" | "terverifikasi";
type Keadaan = { status: Status; dokumen: Dokumen[]; dikirim?: number };

const KUNCI = "lokerin-verifikasi";
const LAMA_TINJAU = 7000;
const DOKUMEN: { id: Dokumen; judul: string; ket: string; Icon: typeof IconId; wajib?: boolean }[] = [
  { id: "ktp", judul: "KTP pemilik", ket: "Wajib. Nomornya disamarkan, misalnya 3302 •••• •••• 0001.", Icon: IconId, wajib: true },
  { id: "npwp", judul: "NPWP", ket: "Boleh dilewati untuk UMKM dan rumah tangga.", Icon: IconShieldCheck },
  { id: "foto", judul: "Foto tempat usaha", ket: "Bagian depan warung, bengkel, atau tokomu.", Icon: IconCamera },
];

const pendengar = new Set<() => void>();
let cache: string | null = null;
const baca = () => {
  try { cache = localStorage.getItem(KUNCI) ?? '{"status":"belum","dokumen":[]}'; } catch { cache = '{"status":"belum","dokumen":[]}'; }
  return cache;
};
function tulis(k: Keadaan) {
  cache = JSON.stringify(k);
  try { localStorage.setItem(KUNCI, cache); } catch {}
  pendengar.forEach((f) => f());
}
function langganan(f: () => void) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}

export function AlurVerifikasi() {
  const me = useApi<MeApi>(apiAktif ? "/me" : null);
  const mentah = useSyncExternalStore(langganan, () => cache ?? baca(), () => '{"status":"belum","dokumen":[]}');
  const lokal = JSON.parse(mentah) as Keadaan;
  const dariServer = me.data?.pemberi_kerja?.terverifikasi;
  const status: Status = dariServer ? "terverifikasi" : lokal.status;
  const [setuju, setSetuju] = useState(false);

  // The mock review: "menunggu" turns into "terverifikasi" after a few seconds, even across reloads.
  useEffect(() => {
    if (lokal.status !== "menunggu" || !lokal.dikirim) return;
    const sisa = Math.max(0, lokal.dikirim + LAMA_TINJAU - Date.now());
    const t = window.setTimeout(() => tulis({ ...lokal, status: "terverifikasi" }), sisa);
    return () => window.clearTimeout(t);
  }, [lokal]);

  function ubahDokumen(d: Dokumen) {
    tulis({ ...lokal, dokumen: lokal.dokumen.includes(d) ? lokal.dokumen.filter((x) => x !== d) : [...lokal.dokumen, d] });
  }

  const tahap = status === "belum" ? 0 : status === "menunggu" ? 1 : 2;

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <div>
        <p className="pil-piksel">Supaya pekerja percaya</p>
        <h1 className="mt-3 text-[1.9rem] leading-tight" data-ringkas="Verifikasi usaha">Verifikasi usahamu. <span className="text-jingga">Lencananya muncul di setiap lowongan.</span></h1>
        <p className="mt-2 text-[15px] text-abu">Pekerja melihat apa saja yang sudah dicek dan kapan. Versi lomba hanya menerima dokumen tiruan, dan foto dihapus setelah dicek.</p>
      </div>

      <ol className="tangga-verifikasi" aria-label="Status verifikasi">
        {["Unggah dokumen", "Sedang dicek", "Terverifikasi"].map((t, i) => <li key={t} data-selesai={i <= tahap || undefined} data-aktif={(i === tahap && status !== "terverifikasi") || undefined}><span>{i < tahap || status === "terverifikasi" ? <IconCheck size={14} stroke={2.6} /> : i + 1}</span>{t}</li>)}
      </ol>

      {status === "terverifikasi" ? (
        <section className="kartu-terverifikasi">
          <span className="cap-terverifikasi">Terverifikasi</span>
          <p className="text-lg font-extrabold">Usahamu sudah terverifikasi</p>
          <p className="mt-1 text-sm text-abu">Yang dicek: {(dariServer ? me.data?.pemberi_kerja?.yang_dicek : lokal.dokumen.map((d) => DOKUMEN.find((x) => x.id === d)!.judul))?.join(" · ")}</p>
          <Link href="/app/pasang" className="tombol tombol-utama mt-4">Pasang lowongan</Link>
        </section>
      ) : status === "menunggu" ? (
        <section className="kartu-menunggu" role="status">
          <span className="putar-kecil" aria-hidden="true" />
          <div>
            <p className="font-bold">Tim Lokerin sedang mengecek dokumenmu</p>
            <p className="text-sm text-abu">Biasanya selesai di hari yang sama. Halaman ini berubah sendiri begitu selesai.</p>
          </div>
        </section>
      ) : (
        <>
          <ul className="grid gap-2">
            {DOKUMEN.map(({ id, judul, ket, Icon, wajib }) => {
              const siap = lokal.dokumen.includes(id);
              return (
                <li key={id} className="kartu-dokumen" data-siap={siap || undefined}>
                  <span className="ubin-ikon size-10"><Icon size={22} /></span>
                  <span className="min-w-0 flex-1"><span className="block font-bold">{judul}{wajib && <span className="ml-1 text-xs font-semibold text-merah">wajib</span>}</span><span className="block text-xs text-abu">{ket}</span></span>
                  <button type="button" className={`tombol ${siap ? "tombol-halus" : "tombol-garis"} min-h-9 px-3 text-sm`} onClick={() => ubahDokumen(id)}>
                    {siap ? <><IconCheck size={16} />Terunggah</> : <><IconUpload size={16} />Unggah tiruan</>}
                  </button>
                </li>
              );
            })}
          </ul>
          <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm">
            <input type="checkbox" checked={setuju} onChange={(e) => setSetuju(e.target.checked)} className="mt-1 size-4 accent-[#EA5A0C]" />
            <span>Saya setuju dokumen ini dipakai hanya untuk verifikasi. Sesuai UU Pelindungan Data Pribadi, Lokerin menyimpan hasil dan tanggal pengecekan saja, lalu menghapus gambarnya.</span>
          </label>
          <button type="button" className="tombol tombol-utama min-h-12 text-base" disabled={!lokal.dokumen.includes("ktp") || !setuju} onClick={() => tulis({ ...lokal, status: "menunggu", dikirim: Date.now() })}>
            Kirim untuk dicek
          </button>
          {!lokal.dokumen.includes("ktp") && <p className="-mt-3 flex items-center gap-1.5 text-xs text-abu"><IconCircleDashed size={14} />Unggah KTP pemilik dulu.</p>}
        </>
      )}
    </div>
  );
}
