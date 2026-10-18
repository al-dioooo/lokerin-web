"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCheck, IconIdBadge2, IconMicrophone, IconPlus, IconShieldCheck, IconX } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { Laci } from "../lapis/Laci";
import { ProfilCv } from "../app/ProfilCv";
import { api, apiAktif, GalatApi } from "@/lib/api/klien";
import { useApi } from "@/lib/api/hooks";
import { keluar, useSesi } from "@/lib/api/sesi";
import type { FaktaApi, MeApi, ProfilApi } from "@/lib/api/tipe";

const JENIS: Record<FaktaApi["jenis"], string> = { pengalaman: "Pengalaman", keahlian: "Keahlian", pendidikan: "Pendidikan", prestasi: "Prestasi", lainnya: "Lainnya" };

function TombolKeluar() {
  const router = useRouter();
  const [tanya, setTanya] = useState(false);
  return (
    <>
      <button type="button" className="tombol tombol-garis" onClick={() => setTanya(true)}>Keluar</button>
      <Dialog buka={tanya} onTutup={() => setTanya(false)} judul="Keluar dari Lokerin?" labelYa="Keluar" onYa={() => { keluar(); router.push("/masuk"); }}>
        Data akunmu tetap tersimpan. Kamu bisa masuk lagi kapan saja.
      </Dialog>
    </>
  );
}

function ProfilUsaha() {
  const me = useApi<MeApi>("/me");
  const u = me.data?.pemberi_kerja;
  return (
    <div className="grid gap-5">
      <h1 className="text-[1.9rem] leading-tight">{u?.nama_usaha ?? "Usahamu"}</h1>
      {u && (
        <section className="rounded-3xl border border-garis bg-white p-5">
          <p className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${u.terverifikasi ? "bg-daun-muda text-daun" : "bg-[#FFF6DB] text-[#8A5A00]"}`}><IconShieldCheck size={16} />{u.terverifikasi ? "Terverifikasi" : u.status_verifikasi === "menunggu" ? "Sedang dicek" : "Belum terverifikasi"}</p>
          <p className="mt-3 text-[17px]">{u.kecamatan ?? u.kota}</p>
          <p className="mt-1 text-[15px] text-abu">{u.terverifikasi ? `Yang dicek: ${u.yang_dicek.join(", ")}.` : "Lowonganmu tetap bisa tayang, dengan label belum terverifikasi sampai Lokerin selesai mengecek."}</p>
        </section>
      )}
      <TombolKeluar />
    </div>
  );
}

function ProfilPencari() {
  const profil = useApi<ProfilApi>("/profil");
  const [tambah, setTambah] = useState(false);
  const [judul, setJudul] = useState("");
  const [tempat, setTempat] = useState("");
  const [lama, setLama] = useState("");
  const [galat, setGalat] = useState("");

  async function putuskan(id: string, terima: boolean) {
    await api("/fakta/putuskan", { method: "POST", body: { ids: [id], terima } });
    profil.muatUlang();
  }
  async function simpanFakta() {
    setGalat("");
    try {
      await api("/fakta", { method: "POST", body: { jenis: "pengalaman", judul: judul.trim(), ...(tempat.trim() ? { tempat: tempat.trim() } : {}), ...(lama.trim() ? { periode: lama.trim() } : {}) } });
      setTambah(false);
      setJudul("");
      setTempat("");
      setLama("");
      profil.muatUlang();
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan.");
    }
  }

  const p = profil.data;
  const usulan = p?.fakta.filter((f) => f.status === "usulan") ?? [];
  const fakta = p?.fakta.filter((f) => f.status === "terkonfirmasi") ?? [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-[1.9rem] leading-tight">{p?.pencari.nama ?? "Profilmu"}</h1>
        <p className="text-[17px] text-abu">{p?.pencari.kecamatan ?? p?.pencari.kota}</p>
      </div>

      {usulan.length > 0 && (
        <section className="grid gap-2 rounded-3xl border border-[#F7C9A0] bg-jingga-muda p-4">
          <h2 className="text-lg">Dari obrolan, benar begini?</h2>
          {usulan.map((f) => (
            <div key={f.id} className="rounded-2xl bg-white p-3">
              <p className="font-bold">{f.judul}</p>
              <p className="text-sm text-abu">{[f.tempat, f.periode, f.detail].filter(Boolean).join(" · ")}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button type="button" className="tombol tombol-utama min-h-12" onClick={() => void putuskan(f.id, true)}><IconCheck size={18} />Simpan</button>
                <button type="button" className="tombol tombol-garis min-h-12" onClick={() => void putuskan(f.id, false)}><IconX size={18} />Bukan</button>
              </div>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="mb-2 text-lg">CV-mu</h2>
        <ul className="grid gap-2">
          {p?.persona.map((x) => (
            <li key={x.id} className="rounded-2xl border border-garis bg-white p-4">
              <p className="font-bold">CV {x.judul}</p>
              <p className="text-[15px] text-abu">{x.ringkasan}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">{x.keahlian.map((k) => <li key={k} className="chip-kategori py-1 pl-3 text-[13px]">{k}</li>)}</ul>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg">Fakta tentang kamu</h2>
        <ul className="grid gap-2">
          {fakta.map((f) => (
            <li key={f.id} className="rounded-2xl bg-kertas p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-abu">{JENIS[f.jenis]}</p>
              <p className="font-bold">{f.judul}</p>
              <p className="text-sm text-abu">{[f.tempat, f.periode].filter(Boolean).join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" className="tombol tombol-utama min-h-14" onClick={() => setTambah(true)}><IconPlus size={20} />Tambah pengalaman</button>
        <Link href="/app/ngobrol" className="tombol tombol-garis min-h-14"><IconMicrophone size={20} />Ceritakan lewat ngobrol</Link>
        <Link href="/app/kartu" className="tombol tombol-halus min-h-14"><IconIdBadge2 size={20} />Kartu Kerja</Link>
        <TombolKeluar />
      </div>

      <Laci buka={tambah} onTutup={() => setTambah(false)} label="Profil" judul="Tambah pengalaman" aksi={<button type="button" className="tombol tombol-utama" disabled={judul.trim().length < 2} onClick={() => void simpanFakta()}>Simpan</button>}>
        <div className="grid gap-3">
          <label className="grid gap-1.5 text-[15px] font-semibold text-abu">Kerja apa?<input autoFocus value={judul} onChange={(e) => setJudul(e.target.value)} className="input-mulai min-h-14 text-lg text-tinta" placeholder="Misalnya Tukang las pagar" /></label>
          <label className="grid gap-1.5 text-[15px] font-semibold text-abu">Di mana? (boleh kosong)<input value={tempat} onChange={(e) => setTempat(e.target.value)} className="input-mulai min-h-14 text-lg text-tinta" placeholder="Misalnya Bengkel di Sokaraja" /></label>
          <label className="grid gap-1.5 text-[15px] font-semibold text-abu">Berapa lama? (boleh kosong)<input value={lama} onChange={(e) => setLama(e.target.value)} className="input-mulai min-h-14 text-lg text-tinta" placeholder="Misalnya 3 tahun" /></label>
          {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
        </div>
      </Laci>
    </div>
  );
}

/** Live profile for signed-in users; Alice's sample CV otherwise. */
export function ProfilLangsung() {
  const { pengguna } = useSesi();
  if (!apiAktif || !pengguna) return <ProfilCv />;
  return pengguna.peran === "pemberi" ? <ProfilUsaha /> : <ProfilPencari />;
}
