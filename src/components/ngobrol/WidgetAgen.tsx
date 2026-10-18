"use client";

/*
 * Cards for what the agent prepared. The agent never publishes, applies, or saves Fakta itself
 * (ADR 0004): those happen here, when the person taps the button on the card.
 */

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconCircleCheck, IconFileCv, IconX } from "../icons/tabler";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { KartuDraf } from "../pemberi/KartuDraf";
import { keLowongan } from "@/lib/api/adaptor";
import { api, GalatApi } from "@/lib/api/klien";
import type { FaktaApi, LamaranApi, LowonganApi, PersonaApi } from "@/lib/api/tipe";

type Hasil = { widget?: string } & Record<string, unknown>;

function FaktaUsulan({ usulan }: { usulan: FaktaApi[] }) {
  const [keputusan, setKeputusan] = useState<Record<string, "simpan" | "bukan">>({});
  const [galat, setGalat] = useState("");
  async function putuskan(f: FaktaApi, terima: boolean) {
    setGalat("");
    try {
      await api("/fakta/putuskan", { method: "POST", body: { ids: [f.id], terima } });
      setKeputusan((k) => ({ ...k, [f.id]: terima ? "simpan" : "bukan" }));
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan.");
    }
  }
  return (
    <div className="grid gap-2">
      <p className="text-[15px] text-abu">Benar begitu? Simpan yang tepat supaya masuk CV-mu.</p>
      {usulan.map((f) => (
        <div key={f.id} className="rounded-2xl border border-garis bg-white p-3">
          <p className="font-bold">{f.judul}</p>
          <p className="text-sm text-abu">{[f.tempat, f.periode, f.detail].filter(Boolean).join(" · ")}</p>
          {keputusan[f.id] ? (
            <p className={`mt-2 flex items-center gap-1.5 text-sm font-bold ${keputusan[f.id] === "simpan" ? "text-daun" : "text-abu"}`}>
              {keputusan[f.id] === "simpan" ? <><IconCircleCheck size={16} />Tersimpan di profilmu</> : "Tidak disimpan"}
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" className="tombol tombol-utama min-h-12" onClick={() => void putuskan(f, true)}><IconCheck size={18} />Simpan</button>
              <button type="button" className="tombol tombol-garis min-h-12" onClick={() => void putuskan(f, false)}><IconX size={18} />Bukan</button>
            </div>
          )}
        </div>
      ))}
      {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
    </div>
  );
}

function LamaranSiap({ hasil }: { hasil: Hasil }) {
  const lowongan = hasil.lowongan as LowonganApi;
  const persona = hasil.persona as { id: string; judul: string };
  const [status, setStatus] = useState<"siap" | "kirim" | "beres">(hasil.sudah_melamar ? "beres" : "siap");
  const [galat, setGalat] = useState("");
  async function kirim() {
    setStatus("kirim");
    setGalat("");
    try {
      await api<LamaranApi>("/lamaran", {
        method: "POST",
        body: { lowongan_id: lowongan.id, persona_id: persona.id, cv_khusus_id: hasil.cv_khusus_id ?? null, pesan: hasil.pesan ?? null },
      });
      setStatus("beres");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum terkirim.");
      setStatus("siap");
    }
  }
  return (
    <div className="grid gap-2">
      <BarisLowongan lowongan={keLowongan(lowongan)} />
      <p className="text-[15px]">Dengan CV <strong>{persona.judul}</strong>{hasil.cv_khusus_id ? " dan CV Khusus" : ""}.</p>
      {typeof hasil.peringatan === "string" && <p className="rounded-2xl bg-[#FFF6DB] p-3 text-sm text-[#8A5A00]">{hasil.peringatan}</p>}
      {status === "beres" ? (
        <Link href="/app/lamaran" className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 font-bold text-daun"><IconCircleCheck size={18} />Lamaran terkirim. Lihat statusnya</Link>
      ) : (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={status === "kirim"} onClick={() => void kirim()}>{status === "kirim" ? "Mengirim..." : "Kirim Lamaran"}</button>
      )}
      {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
    </div>
  );
}

export function WidgetAgen({ hasil }: { hasil: Hasil }) {
  switch (hasil.widget) {
    case "daftar_lowongan": {
      const daftar = (hasil.hasil as LowonganApi[]) ?? [];
      const luar = (hasil.di_luar_preferensi as LowonganApi[]) ?? [];
      if (!daftar.length) return <p className="text-[15px] text-abu">Belum ada lowongan yang cocok. {luar.length ? `${luar.length} lowongan di luar pilihanmu.` : ""}</p>;
      return (
        <ul className="grid gap-2">
          {daftar.slice(0, 4).map((l) => (
            <li key={l.id}><BarisLowongan lowongan={keLowongan(l)} skor={l.kemiripan ?? undefined} /></li>
          ))}
        </ul>
      );
    }
    case "detail_lowongan":
      return <BarisLowongan lowongan={keLowongan(hasil.lowongan as LowonganApi)} />;
    case "konfirmasi_fakta":
      return <FaktaUsulan usulan={(hasil.usulan as FaktaApi[]) ?? []} />;
    case "persona": {
      const p = hasil.persona as PersonaApi;
      return (
        <div className="rounded-2xl border border-garis bg-white p-3">
          <p className="piksel text-[10px] uppercase text-jingga-tua">CV baru</p>
          <p className="font-bold">CV {p.judul}</p>
          <p className="text-sm text-abu">{p.ringkasan}</p>
        </div>
      );
    }
    case "cv_khusus":
      return (
        <div className="grid gap-2">
          <p className="text-[15px]">CV Khusus <strong>{(hasil.isi as { judul: string }).judul}</strong> sudah jadi dari {String(hasil.fakta_dipakai)} Fakta-mu.</p>
          <Link href={`/app/cv/${String(hasil.id)}`} className="tombol tombol-utama min-h-12"><IconFileCv size={18} />Lihat dan edit CV</Link>
        </div>
      );
    case "lamaran_siap":
      return <LamaranSiap hasil={hasil} />;
    case "daftar_lamaran": {
      const daftar = (hasil.lamaran as LamaranApi[]) ?? [];
      return (
        <Link href="/app/lamaran" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">
          {daftar.length ? `${daftar.length} lamaran · ${daftar.filter((l) => l.status === "lolos").length} lolos` : "Belum ada lamaran."} <span className="font-bold text-jingga-tua">Lihat</span>
        </Link>
      );
    }
    case "draf_lowongan":
      return <KartuDraf lowongan={hasil.lowongan as LowonganApi} />;
    case "lowongan_saya": {
      const daftar = (hasil.lowongan as LowonganApi[]) ?? [];
      return <Link href="/app" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">{daftar.length} lowongan · {daftar.reduce((n, l) => n + (l.jumlah_lamaran ?? 0), 0)} pelamar <span className="font-bold text-jingga-tua">Lihat</span></Link>;
    }
    case "lamaran_masuk": {
      const daftar = (hasil.lamaran as LamaranApi[]) ?? [];
      return <Link href="/app/pelamar" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">{daftar.length} pelamar masuk <span className="font-bold text-jingga-tua">Buka daftar pelamar</span></Link>;
    }
    case "galat":
      return <p className="text-[15px] text-merah">{String(hasil.pesan ?? "Ada yang belum berhasil.")}</p>;
    default:
      return null;
  }
}

export const JUDUL_WIDGET: Record<string, string> = {
  daftar_lowongan: "Lowongan yang cocok",
  detail_lowongan: "Lowongan",
  konfirmasi_fakta: "Fakta baru untuk profilmu",
  persona: "CV",
  cv_khusus: "CV Khusus",
  lamaran_siap: "Lamaran siap dikirim",
  daftar_lamaran: "Lamaranmu",
  draf_lowongan: "Draf lowongan",
  lowongan_saya: "Lowonganmu",
  lamaran_masuk: "Pelamar",
  galat: "Belum berhasil",
};
