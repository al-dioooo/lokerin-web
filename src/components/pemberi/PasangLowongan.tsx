"use client";

/*
 * Posting a job by form, one question per screen. The same draft can also come from Ngobrol;
 * both end at the same KartuDraf with its Pemeriksaan and the Terbitkan decision.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type CSSProperties, type ReactNode } from "react";
import { KATEGORI } from "../icons/categories";
import { IconArrowLeft, IconCheck, IconMicrophone } from "../icons/tabler";
import { Bacakan } from "../ui/Bacakan";
import { TautanNgobrol } from "../app/TautanNgobrol";
import { KartuDraf } from "./KartuDraf";
import { kategoriDari } from "@/lib/api/adaptor";
import { useApi } from "@/lib/api/hooks";
import { api, apiAktif, GalatApi } from "@/lib/api/klien";
import type { LowonganApi } from "@/lib/api/tipe";
import "../lapis/lapis.css";
import "../mulai/alur.css";

const KATEGORI_KE_BACKEND: Record<string, string> = {
  las: "konstruksi", ojek: "pengantaran", dapur: "kuliner", bangunan: "konstruksi", bengkel: "bengkel", bersih: "kebersihan",
  toko: "toko_ritel", angkut: "produksi", kebun: "pertanian", jahit: "produksi", laundry: "kebersihan", kurir: "pengantaran",
  acara: "lainnya", asuh: "perawatan", magang: "admin",
};
const JENIS_UPAH = [
  { id: "harian", label: "Per hari" },
  { id: "mingguan", label: "Per minggu" },
  { id: "bulanan", label: "Per bulan" },
  { id: "borongan", label: "Borongan" },
] as const;
const JENIS_KERJA = [
  { id: "harian", label: "Harian, sesekali" },
  { id: "paruh_waktu", label: "Paruh waktu" },
  { id: "kontrak", label: "Kontrak" },
  { id: "tetap", label: "Tetap" },
  { id: "magang", label: "Magang" },
] as const;
const HARI = [5, 6, 7] as const;

function besok(n = 1) {
  const d = new Date(Date.now() + n * 86_400_000);
  return d.toISOString().slice(0, 10);
}

const URUTAN = ["kategori", "judul", "jenis-upah", "upah", "jam", "hari", "jenis-kerja", "mulai", "deskripsi", "draf"];

/** The screen that asks for the field a Pemeriksaan problem points at (holds first, then warnings). */
function langkahMasalah(draf: LowonganApi) {
  const masalah = draf.pemeriksaan?.masalah ?? [];
  const kode = (masalah.find((m) => m.tingkat === "tahan") ?? masalah[0])?.field;
  const peta: Record<string, string> = { title: "judul", payMin: "upah", hoursText: "jam", employmentType: "jenis-kerja", description: "deskripsi", city: "judul" };
  return URUTAN.indexOf(peta[kode ?? ""] ?? "judul");
}

/**
 * New job, or an existing draft opened from the employer home with `?draf=<id>`. A draft comes back
 * with its answers filled in and starts at the question its Pemeriksaan flagged; saving updates it.
 */
export function PasangLowongan() {
  const idDraf = useSearchParams().get("draf");
  const lama = useApi<LowonganApi>(apiAktif && idDraf ? `/lowongan/${encodeURIComponent(idDraf)}` : null);
  if (idDraf && apiAktif) {
    if (lama.data?.status === "draf") return <AlurPasang key={lama.data.id} awal={lama.data} />;
    if (lama.galat || lama.data) {
      return (
        <div className="mx-auto grid max-w-md gap-4">
          <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-[15px] text-abu">{lama.data ? "Lowongan ini sudah terbit, jadi tidak bisa diubah lagi." : lama.galat?.message}</p>
          <Link href="/app" className="tombol tombol-garis min-h-14 text-lg">Kembali ke beranda</Link>
        </div>
      );
    }
    return <p className="py-10 text-center text-abu" role="status">Membuka draf...</p>;
  }
  return <AlurPasang />;
}

function jamDari(teks: string | null) {
  const [a, b] = (teks ?? "").split(/\s*[–-]\s*/);
  const ok = (x?: string) => (x && /^\d{1,2}[.:]\d{2}$/.test(x) ? x.replace(":", ".").padStart(5, "0") : null);
  return { mulai: ok(a) ?? "08.00", selesai: ok(b) ?? "16.00" };
}

function AlurPasang({ awal }: { awal?: LowonganApi }) {
  const [langkah, setLangkah] = useState(() => (awal ? langkahMasalah(awal) : 0));
  const [arah, setArah] = useState<"maju" | "mundur">("maju");
  const [kategori, setKategori] = useState<string | null>(awal ? kategoriDari(awal) : null);
  const [judul, setJudul] = useState(awal?.judul ?? "");
  const [jenisUpah, setJenisUpah] = useState<string | null>(awal?.upah.jenis ?? null);
  const [upah, setUpah] = useState(awal?.upah.min ? String(awal.upah.min) : "");
  const [jamMulai, setJamMulai] = useState(() => jamDari(awal?.jam_kerja ?? null).mulai);
  const [jamSelesai, setJamSelesai] = useState(() => jamDari(awal?.jam_kerja ?? null).selesai);
  const [hari, setHari] = useState<number | null>(awal?.hari_per_minggu ?? null);
  const [jenisKerja, setJenisKerja] = useState<string | null>(awal?.jenis_kerja ?? null);
  const [mulai, setMulai] = useState<string | null>(awal?.mulai ?? null);
  const [mendesak, setMendesak] = useState(Boolean(awal?.butuh_hari_ini));
  const [deskripsi, setDeskripsi] = useState(awal?.deskripsi ?? "");
  const [draf, setDraf] = useState<LowonganApi | null>(awal ?? null);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");

  const urutan = URUTAN;
  const ini = urutan[langkah]!;

  function ke(n: number) {
    setArah(n > langkah ? "maju" : "mundur");
    setLangkah(Math.max(0, Math.min(n, urutan.length - 1)));
    window.scrollTo({ top: 0 });
  }
  const maju = () => ke(langkah + 1);
  const pilihLaluMaju = (fn: () => void) => {
    fn();
    window.setTimeout(maju, 220);
  };

  const jam = (a: string, b: string) => {
    const [h1, m1] = a.split(".").map(Number);
    const [h2, m2] = b.split(".").map(Number);
    const menit = (h2! * 60 + (m2 ?? 0)) - (h1! * 60 + (m1 ?? 0));
    return menit > 0 ? Math.round((menit / 60) * 10) / 10 : null;
  };

  async function buatDraf() {
    setProses(true);
    setGalat("");
    const isi = {
      title: judul.trim(),
      category: KATEGORI_KE_BACKEND[kategori ?? ""] ?? "lainnya",
      segment: jenisKerja === "magang" ? "magang" : "informal",
      description: deskripsi.trim(),
      payType: jenisUpah,
      payMin: Number(upah.replace(/\D/g, "")) || undefined,
      hoursPerDay: jam(jamMulai, jamSelesai) ?? undefined,
      daysPerWeek: hari ?? undefined,
      hoursText: `${jamMulai}–${jamSelesai}`,
      employmentType: jenisKerja,
      startDate: mulai,
      urgentHours: mendesak ? 8 : null,
    };
    try {
      const hasil = draf
        ? await api<LowonganApi>(`/pemberi/lowongan/${draf.id}`, { method: "PATCH", body: isi })
        : await api<LowonganApi>("/pemberi/lowongan", { method: "POST", body: isi });
      setDraf(hasil);
      ke(urutan.indexOf("draf"));
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Draf belum tersimpan. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  /** From a Pemeriksaan problem, jump back to the screen that asks for that field. */
  function lengkapi() {
    if (draf) ke(langkahMasalah(draf));
  }

  if (!apiAktif) {
    return <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-abu">Pasang lowongan butuh sambungan ke server. Versi contoh ini belum tersambung.</p>;
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-5 pb-36">
      <div className="flex items-center gap-3">
        {langkah > 0 && ini !== "draf" && (
          <button type="button" className="icon-button size-12 border border-garis bg-white" onClick={() => ke(langkah - 1)} aria-label="Pertanyaan sebelumnya"><IconArrowLeft size={22} /></button>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-kabut" role="progressbar" aria-label="Kemajuan" aria-valuemin={1} aria-valuemax={urutan.length} aria-valuenow={langkah + 1}>
          <span className="block h-full rounded-full bg-jingga transition-[width] duration-500" style={{ width: `${((langkah + 1) / urutan.length) * 100}%` } as CSSProperties} />
        </div>
      </div>

      <section key={ini} className="mulai-langkah" data-arah={arah}>
        {ini === "kategori" && (
          <Soal judul="Kamu cari orang untuk kerja apa?" bantu="Lebih suka bicara? Ceritakan saja di Ngobrol.">
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {KATEGORI.map(({ slug, label, Icon }) => (
                <li key={slug}>
                  <button type="button" className="ubin-pilih alur-ubin min-h-28" aria-pressed={kategori === slug} onClick={() => pilihLaluMaju(() => { setKategori(slug); if (!judul) setJudul(label); })}>
                    <Icon size={44} /><span className="text-[15px]">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <TautanNgobrol className="mt-4 inline-flex min-h-12 items-center gap-2 text-[15px] font-semibold text-jingga-tua"><IconMicrophone size={18} />Pasang lewat ngobrol</TautanNgobrol>
          </Soal>
        )}

        {ini === "judul" && (
          <Soal judul="Apa nama posisinya?" bantu="Misalnya Juru masak, Tukang las pagar, Jaga toko pagi.">
            <input autoFocus value={judul} onChange={(e) => setJudul(e.target.value)} onKeyDown={(e) => e.key === "Enter" && judul.trim().length > 2 && maju()} className="input-mulai alur-input" aria-label="Nama posisi" />
            <Lanjut aktif={judul.trim().length > 2} onClick={maju} />
          </Soal>
        )}

        {ini === "jenis-upah" && (
          <Soal judul="Upahnya dibayar per apa?">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {JENIS_UPAH.map((j) => <Pilih key={j.id} aktif={jenisUpah === j.id} onClick={() => pilihLaluMaju(() => setJenisUpah(j.id))}>{j.label}</Pilih>)}
            </div>
          </Soal>
        )}

        {ini === "upah" && (
          <Soal judul={`Berapa upahnya ${JENIS_UPAH.find((j) => j.id === jenisUpah)?.label.toLowerCase() ?? ""}?`} bantu="Tulis angkanya saja, misalnya 100000. Lokerin akan memeriksa apakah wajar.">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-abu">Rp</span>
              <input autoFocus inputMode="numeric" value={upah} onChange={(e) => setUpah(e.target.value.replace(/[^\d.]/g, ""))} onKeyDown={(e) => e.key === "Enter" && Number(upah.replace(/\D/g, "")) > 0 && maju()} className="input-mulai alur-input tabular-nums" aria-label="Besar upah dalam rupiah" />
            </div>
            <Lanjut aktif={Number(upah.replace(/\D/g, "")) > 0} onClick={maju} />
          </Soal>
        )}

        {ini === "jam" && (
          <Soal judul="Kerjanya jam berapa sampai jam berapa?">
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-[15px] font-semibold text-abu">Mulai<input type="time" value={jamMulai.replace(".", ":")} onChange={(e) => setJamMulai(e.target.value.replace(":", "."))} className="input-mulai alur-input" /></label>
              <label className="grid gap-1.5 text-[15px] font-semibold text-abu">Selesai<input type="time" value={jamSelesai.replace(".", ":")} onChange={(e) => setJamSelesai(e.target.value.replace(":", "."))} className="input-mulai alur-input" /></label>
            </div>
            <Lanjut aktif={jam(jamMulai, jamSelesai) !== null} onClick={maju} />
          </Soal>
        )}

        {ini === "hari" && (
          <Soal judul="Berapa hari kerja dalam seminggu?">
            <div className="grid gap-2.5">
              {HARI.map((h) => <Pilih key={h} aktif={hari === h} onClick={() => pilihLaluMaju(() => setHari(h))}>{h === 7 ? "Setiap hari" : h === 6 ? "6 hari, Senin–Sabtu" : "5 hari, Senin–Jumat"}</Pilih>)}
            </div>
          </Soal>
        )}

        {ini === "jenis-kerja" && (
          <Soal judul="Kerjanya seperti apa?">
            <div className="grid gap-2.5">
              {JENIS_KERJA.map((j) => <Pilih key={j.id} aktif={jenisKerja === j.id} onClick={() => pilihLaluMaju(() => setJenisKerja(j.id))}>{j.label}</Pilih>)}
            </div>
          </Soal>
        )}

        {ini === "mulai" && (
          <Soal judul="Kapan pekerjanya harus mulai?">
            <div className="grid gap-2.5">
              <Pilih aktif={mendesak} onClick={() => pilihLaluMaju(() => { setMendesak(true); setMulai(besok(0)); })}>Hari ini juga (Butuh Hari Ini)</Pilih>
              <Pilih aktif={!mendesak && mulai === besok(1)} onClick={() => pilihLaluMaju(() => { setMendesak(false); setMulai(besok(1)); })}>Besok</Pilih>
              <Pilih aktif={!mendesak && mulai === besok(7)} onClick={() => pilihLaluMaju(() => { setMendesak(false); setMulai(besok(7)); })}>Minggu depan</Pilih>
            </div>
          </Soal>
        )}

        {ini === "deskripsi" && (
          <Soal judul="Apa saja yang dikerjakan?" bantu="Satu atau dua kalimat. Jangan minta biaya apa pun dari pelamar.">
            <textarea autoFocus rows={4} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="input-mulai alur-input min-h-36 py-3 text-lg" aria-label="Pekerjaan yang dikerjakan" />
            {galat && <p role="alert" className="mt-3 rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
            <Lanjut aktif={deskripsi.trim().length > 5 && !proses} onClick={() => void buatDraf()} label={proses ? "Memeriksa..." : "Periksa lowongan"} />
          </Soal>
        )}

        {ini === "draf" && draf && (
          <div className="grid gap-4">
            <h1 className="text-[1.75rem] leading-tight" data-ringkas="Cek lowongan">Ini lowonganmu. <span className="text-jingga">Sudah benar?</span></h1>
            <KartuDraf lowongan={draf} onBerubah={setDraf} onUbah={lengkapi} />
            {draf.status === "terbit" && <Link href="/app" className="tombol tombol-garis min-h-14 text-lg">Kembali ke beranda</Link>}
          </div>
        )}
      </section>
    </div>
  );
}

function Soal({ judul, bantu, children }: { judul: string; bantu?: string; children: ReactNode }) {
  return (
    <>
      <div className="flex items-start gap-3">
        <h1 className="judul-mulai alur-judul m-0 flex-1 text-[clamp(1.6rem,1.3rem+1.4vw,2.2rem)]">{judul}</h1>
        <Bacakan teks={`${judul} ${bantu ?? ""}`} label="Bacakan pertanyaan" ringkas className="mt-1 shrink-0 border border-garis bg-white" />
      </div>
      {bantu && <p className="mt-2 text-[17px] text-abu">{bantu}</p>}
      <div className="mt-6">{children}</div>
    </>
  );
}

function Pilih({ aktif, onClick, children }: { aktif: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="alur-pilihan" aria-pressed={aktif} onClick={onClick}>
      {children}
      {aktif && <IconCheck size={22} />}
    </button>
  );
}

function Lanjut({ aktif, onClick, label = "Lanjut" }: { aktif: boolean; onClick: () => void; label?: string }) {
  return (
    <div className="alur-lanjut">
      <button type="button" className="tombol tombol-utama w-full" disabled={!aktif} onClick={onClick}>{label}</button>
    </div>
  );
}
