"use client";

/*
 * Cards for what the agent prepared. The agent never publishes, applies, or saves Fakta itself
 * (ADR 0004): those happen here, when the person taps the button on the card.
 */

import { useState } from "react";
import { IconCheck, IconCircleCheck, IconFileCv, IconX } from "../icons/tabler";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { KartuDraf } from "../pemberi/KartuDraf";
import { keLowongan } from "@/lib/api/adaptor";
import { api, GalatApi } from "@/lib/api/klien";
import type { DaftarKabarApi, FaktaApi, KartuKerjaApi, LamaranApi, LowonganApi, PersonaApi, ProfilApi } from "@/lib/api/tipe";
import { IntipCv } from "../cv/PratinjauCv";
import { DaftarKabarWidget, KartuKerjaWidget, LaporanSiap, PelamarWidget, TahapSiap } from "./WidgetBaru";
import { TautanLaci, useKlikLaci } from "../lapis/konteksLaci";
import { PoinFakta } from "../pencari/UbahFakta";

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
      <p className="text-[15px] text-abu">Benar begitu? Yang kamu simpan jadi bahan CV-mu.</p>
      {usulan.map((f) => (
        <div key={f.id} className="rounded-2xl border border-garis bg-white p-3">
          <p className="font-bold">{f.judul}</p>
          {(f.tempat || f.periode) && <p className="text-sm text-abu">{[f.tempat, f.periode].filter(Boolean).join(" · ")}</p>}
          <PoinFakta f={f} />
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

/** What lihat_profil read: the Profil Induk, with any proposed Fakta still waiting for a tap. */
function ProfilInduk({ profil }: { profil: ProfilApi }) {
  const fakta = profil.fakta ?? [];
  const tersimpan = fakta.filter((f) => f.status === "terkonfirmasi");
  const usulan = fakta.filter((f) => f.status === "usulan");
  const persona = profil.persona ?? [];
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-garis bg-white p-3">
        <p className="font-bold">{profil.pencari.nama}</p>
        <p className="text-sm text-abu">{[profil.pencari.kecamatan, profil.pencari.kota].filter(Boolean).join(", ")}</p>
        {tersimpan.length ? (
          <ul className="mt-3 grid gap-1.5 text-[15px]">
            {tersimpan.slice(0, 4).map((f) => (
              <li key={f.id} className="flex items-start gap-2"><IconCheck size={18} className="mt-0.5 shrink-0 text-daun" /><span>{f.judul}{f.periode ? <span className="text-abu"> · {f.periode}</span> : null}</span></li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[15px] text-abu">Belum ada bahan CV. Ceritakan kerja yang pernah kamu lakukan.</p>
        )}
        {tersimpan.length > 4 && <p className="mt-1.5 text-sm text-abu">dan {tersimpan.length - 4} bahan CV lain</p>}
        {persona.length > 0 && <ul className="mt-3 flex flex-wrap gap-1.5">{persona.map((p) => <li key={p.id} className="rounded-full bg-kabut px-3 py-1 text-xs font-bold">{p.judul}</li>)}</ul>}
      </div>
      {usulan.length > 0 && <FaktaUsulan usulan={usulan} />}
      <TautanLaci isi={{ jenis: "profil" }} href="/app/profil" className="tombol tombol-garis min-h-14">Buka profil</TautanLaci>
    </div>
  );
}

function LamaranSiap({ hasil }: { hasil: Hasil }) {
  const lowongan = hasil.lowongan as LowonganApi;
  const persona = hasil.persona as { id: string; judul: string };
  const [status, setStatus] = useState<"siap" | "kirim" | "beres">(hasil.sudah_melamar ? "beres" : "siap");
  const [galat, setGalat] = useState("");
  const klik = useKlikLaci();
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
      <BarisLowongan lowongan={keLowongan(lowongan)} onClick={klik({ jenis: "lowongan", id: lowongan.id })} />
      <p className="text-[15px]">Sebagai <strong>{persona.judul}</strong>{hasil.cv_khusus_id ? ", dengan CV lamaran" : ""}.</p>
      {typeof hasil.peringatan === "string" && <p className="rounded-2xl bg-[#FFF6DB] p-3 text-sm text-[#8A5A00]">{hasil.peringatan}</p>}
      {status === "beres" ? (
        <TautanLaci isi={{ jenis: "lamaran" }} href="/app/lamaran" className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 font-bold text-daun"><IconCircleCheck size={18} />Lamaran terkirim. Lihat statusnya</TautanLaci>
      ) : (
        <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={status === "kirim"} onClick={() => void kirim()}>{status === "kirim" ? "Mengirim..." : "Kirim Lamaran"}</button>
      )}
      {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
    </div>
  );
}

export function WidgetAgen({ hasil }: { hasil: Hasil }) {
  return <Isi hasil={hasil} />;
}

/** A result as a titled card, the same in the thread and on the voice stage. */
export function KartuHasil({ hasil }: { hasil: Hasil }) {
  const judul = JUDUL_WIDGET[String(hasil.widget)] ?? "Hasil";
  return (
    <section className="kartu-alat" aria-label={judul}>
      <h3>{judul}</h3>
      <WidgetAgen hasil={hasil} />
    </section>
  );
}

function Isi({ hasil }: { hasil: Hasil }) {
  const klik = useKlikLaci();
  switch (hasil.widget) {
    case "daftar_lowongan": {
      const daftar = (hasil.hasil as LowonganApi[]) ?? [];
      const luar = (hasil.di_luar_preferensi as LowonganApi[]) ?? [];
      if (!daftar.length) return <p className="text-[15px] text-abu">Belum ada lowongan yang cocok. {luar.length ? `${luar.length} lowongan di luar pilihanmu.` : ""}</p>;
      return (
        <ul className="grid gap-2">
          {daftar.slice(0, 4).map((l) => (
            <li key={l.id}><BarisLowongan lowongan={keLowongan(l)} skor={l.kemiripan ?? undefined} onClick={klik({ jenis: "lowongan", id: l.id })} /></li>
          ))}
        </ul>
      );
    }
    case "detail_lowongan": {
      const l = hasil.lowongan as LowonganApi;
      return <BarisLowongan lowongan={keLowongan(l)} onClick={klik({ jenis: "lowongan", id: l.id })} />;
    }
    case "konfirmasi_fakta":
      return <FaktaUsulan usulan={(hasil.usulan as FaktaApi[]) ?? []} />;
    case "profil_induk":
      return hasil.pencari ? <ProfilInduk profil={hasil as unknown as ProfilApi} /> : null;
    case "persona": {
      const p = hasil.persona as PersonaApi;
      return (
        <div className="rounded-2xl border border-garis bg-white p-3">
          <p className="piksel text-[10px] uppercase text-jingga-tua">Kerja baru tersimpan</p>
          <p className="font-bold">{p.judul}</p>
          <p className="text-sm text-abu">{p.ringkasan}</p>
        </div>
      );
    }
    case "cv_khusus":
      return (
        <div className="grid gap-2">
          <p className="text-[15px]">CV lamaran <strong>{(hasil.isi as { judul: string }).judul}</strong> sudah jadi{Number(hasil.fakta_dipakai) > 0 ? `, dari ${Number(hasil.fakta_dipakai)} bahan CV-mu` : ""}.</p>
          <TautanLaci isi={{ jenis: "cv", id: String(hasil.id) }} href={`/app/cv/${String(hasil.id)}`} className="grid gap-2" label="Lihat dan ubah CV lamaran">
            <IntipCv id={String(hasil.id)} />
            <span className="tombol tombol-utama min-h-12"><IconFileCv size={18} />Lihat dan ubah CV</span>
          </TautanLaci>
        </div>
      );
    case "lamaran_siap":
      return <LamaranSiap hasil={hasil} />;
    case "daftar_lamaran": {
      const daftar = (hasil.lamaran as LamaranApi[]) ?? [];
      return (
        <TautanLaci isi={{ jenis: "lamaran" }} href="/app/lamaran" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">
          {daftar.length ? `${daftar.length} lamaran · ${daftar.filter((l) => l.status === "lolos").length} lolos` : "Belum ada lamaran."} <span className="font-bold text-jingga-tua">Lihat</span>
        </TautanLaci>
      );
    }
    case "draf_lowongan":
      return <KartuDraf lowongan={hasil.lowongan as LowonganApi} />;
    case "lowongan_saya": {
      const daftar = (hasil.lowongan as LowonganApi[]) ?? [];
      return <TautanLaci isi={{ jenis: "lowongan_saya" }} href="/app" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">{daftar.length} lowongan · {daftar.reduce((n, l) => n + (l.jumlah_lamaran ?? 0), 0)} pelamar <span className="font-bold text-jingga-tua">Lihat</span></TautanLaci>;
    }
    case "lamaran_masuk": {
      const daftar = (hasil.lamaran as LamaranApi[]) ?? [];
      return <TautanLaci isi={{ jenis: "pelamar" }} href="/app/pelamar" className="block rounded-2xl border border-garis bg-white p-3 text-[15px]">{daftar.length} pelamar masuk <span className="font-bold text-jingga-tua">Buka daftar pelamar</span></TautanLaci>;
    }
    case "kartu_kerja":
      return <KartuKerjaWidget kartu={hasil.kartu as KartuKerjaApi} />;
    case "laporan_siap":
      return <LaporanSiap lowongan={hasil.lowongan as { id: string; judul: string; nama_usaha: string }} alasan={String(hasil.alasan ?? "")} />;
    case "daftar_kabar":
      return <DaftarKabarWidget daftar={hasil as unknown as DaftarKabarApi} />;
    case "pelamar":
      return <PelamarWidget lamaran={hasil.lamaran as LamaranApi} />;
    case "tahap_siap":
      return <TahapSiap mode={hasil.mode === "tambah" ? "tambah" : "lolos"} lamaran={hasil.lamaran as LamaranApi} tahap={hasil.tahap as Parameters<typeof TahapSiap>[0]["tahap"]} />;
    case "galat":
      return <p className="text-[15px] text-merah">{String(hasil.pesan ?? "Ada yang belum berhasil.")}</p>;
    default:
      return null;
  }
}

export const JUDUL_WIDGET: Record<string, string> = {
  daftar_lowongan: "Lowongan yang cocok",
  detail_lowongan: "Lowongan",
  konfirmasi_fakta: "Bahan CV baru",
  profil_induk: "Profilmu",
  persona: "Kerja yang kamu bisa",
  cv_khusus: "CV lamaran",
  lamaran_siap: "Lamaran siap dikirim",
  daftar_lamaran: "Lamaranmu",
  draf_lowongan: "Draf lowongan",
  lowongan_saya: "Lowonganmu",
  lamaran_masuk: "Pelamar",
  kartu_kerja: "Kartu Kerja",
  laporan_siap: "Laporan siap dikirim",
  daftar_kabar: "Kabar terbaru",
  pelamar: "Pelamar",
  tahap_siap: "Tahap berikutnya siap",
  galat: "Belum berhasil",
};
