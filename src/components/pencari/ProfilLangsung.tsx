"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { IconBriefcase, IconBuildingStore, IconCheck, IconChevronRight, IconDownload, IconIdBadge2, IconLogout, IconMapPin, IconMicrophone, IconPencil, IconPlus, IconShieldCheck, IconX } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { Laci } from "../lapis/Laci";
import { ProfilCv } from "../app/ProfilCv";
import { PengaturanPush } from "../app/PengaturanPush";
import { KertasCv, SkalaKertas } from "../cv/KertasCv";
import { api, apiAktif, GalatApi } from "@/lib/api/klien";
import { waktuLalu } from "@/lib/api/adaptor";
import { useApi } from "@/lib/api/hooks";
import { keluar, useSesi } from "@/lib/api/sesi";
import { unduhCv } from "@/lib/cv";
import type { CvRingkasApi, FaktaApi, LamaranApi, LowonganApi, MeApi, PersonaApi, ProfilApi } from "@/lib/api/tipe";
import { UbahPersona } from "./UbahPersona";
import "../cv/cv.css";
import "./profil.css";

const JENIS: Record<FaktaApi["jenis"], string> = { pengalaman: "Pengalaman", keahlian: "Keahlian", pendidikan: "Pendidikan", prestasi: "Prestasi", lainnya: "Lainnya" };
const URUTAN_JENIS: FaktaApi["jenis"][] = ["pengalaman", "keahlian", "pendidikan", "prestasi", "lainnya"];

function inisial(nama: string) {
  return nama.split(/\s+/).filter(Boolean).slice(0, 2).map((k) => k[0]!.toUpperCase()).join("") || "·";
}

function BarisKeluar() {
  const router = useRouter();
  const [tanya, setTanya] = useState(false);
  return (
    <>
      <button type="button" className="baris-atur" data-bahaya onClick={() => setTanya(true)}>
        <span className="baris-atur-ikon"><IconLogout size={20} /></span>
        <span className="flex-1 font-bold">Keluar</span>
      </button>
      <Dialog buka={tanya} onTutup={() => setTanya(false)} judul="Keluar dari Lokerin?" labelYa="Keluar" onYa={() => { keluar(); router.push("/masuk"); }}>
        Data akunmu tetap tersimpan. Kamu bisa masuk lagi kapan saja.
      </Dialog>
    </>
  );
}

function BarisTautan({ href, ikon, judul, keterangan }: { href: string; ikon: ReactNode; judul: string; keterangan?: string }) {
  return (
    <Link href={href} className="baris-atur">
      <span className="baris-atur-ikon">{ikon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{judul}</span>
        {keterangan && <span className="block text-sm text-abu">{keterangan}</span>}
      </span>
      <IconChevronRight size={18} className="shrink-0 text-abu" />
    </Link>
  );
}

function Angka({ nilai, label, href }: { nilai: number | null; label: string; href: string }) {
  return (
    <a href={href}>
      <b>{nilai ?? "–"}</b>
      <span>{label}</span>
    </a>
  );
}

const STATUS_CV: Record<string, string> = { terkirim: "Terkirim", dilihat: "Sudah dilihat", lolos: "Lolos", tidak_lolos: "Belum lolos" };

function UnduhKecil({ id }: { id: string }) {
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState(false);
  async function unduh() {
    setProses(true);
    setGalat(false);
    try {
      await unduhCv(id);
    } catch {
      setGalat(true);
    } finally {
      setProses(false);
    }
  }
  return (
    <button type="button" className="tombol tombol-garis min-h-11 px-4 text-sm" disabled={proses} onClick={() => void unduh()} aria-label="Unduh PDF">
      <IconDownload size={18} />{proses ? "…" : galat ? "Ulangi" : "PDF"}
    </button>
  );
}

/** The CV Khusus Lokerin made for each job you applied to (or are about to). */
function RakCvKhusus({ daftar }: { daftar: CvRingkasApi[] | null }) {
  if (!daftar) return <div className="h-64 animate-pulse rounded-3xl bg-kabut" role="status" aria-label="Memuat CV Khusus" />;
  if (!daftar.length) {
    return (
      <p className="rounded-2xl border border-dashed border-garis px-4 py-3 text-[15px] text-abu">
        Belum ada. Saat kamu melamar, Lokerin menyusun CV khusus untuk lowongan itu dari fakta yang sudah kamu simpan, dengan tata letak yang mudah dibaca rekruter dan sistem ATS.
      </p>
    );
  }
  return (
    <ul className="rak-cv gulir-tepi">
      {daftar.map((cv) => (
        <li key={cv.id}>
          <article className="kartu-cv-khusus">
            <Link href={`/app/cv/${cv.id}`} className="kertas-intip block" aria-hidden="true" tabIndex={-1}>
              <SkalaKertas><KertasCv isi={cv.isi} template={cv.template} bahasa={cv.bahasa} kontakTersembunyi={false} statis /></SkalaKertas>
            </Link>
            <div className="kartu-cv-isi">
              <span className="status-cv" data-status={cv.lamaran?.status ?? "draf"}>{cv.lamaran ? STATUS_CV[cv.lamaran.status] : "Belum dikirim"}</span>
              <h3 className="text-[16px] leading-snug">{cv.lowongan?.judul ?? cv.isi.judul}</h3>
              <p className="truncate text-sm text-abu">{[cv.lowongan?.usaha, `diubah ${waktuLalu(cv.diperbarui).toLowerCase()}`].filter(Boolean).join(" · ")}</p>
              <div className="mt-1 flex gap-2">
                <Link href={`/app/cv/${cv.id}`} className="tombol tombol-utama min-h-11 flex-1 px-4 text-sm"><IconPencil size={16} />Buka</Link>
                <UnduhKecil id={cv.id} />
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

function ProfilPencari() {
  const { pengguna } = useSesi();
  const profil = useApi<ProfilApi>("/profil");
  const cvKhusus = useApi<{ cv: CvRingkasApi[] }>("/cv");
  const lamaran = useApi<{ lamaran: LamaranApi[] }>("/pencari/lamaran");
  const [tambah, setTambah] = useState(false);
  const [ubah, setUbah] = useState<PersonaApi | null>(null);
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
  const nama = p?.pencari.nama ?? pengguna?.nama ?? "";
  const usulan = p?.fakta.filter((f) => f.status === "usulan") ?? [];
  const fakta = p?.fakta.filter((f) => f.status === "terkonfirmasi") ?? [];
  const tempatTinggal = [p?.pencari.kecamatan, p?.pencari.kota].filter(Boolean).join(", ");

  return (
    <div className="grid gap-7">
      <section className="profil-hero" aria-labelledby="nama-profil">
        <div className="flex items-center gap-4">
          <span className="profil-avatar" aria-hidden="true">{inisial(nama)}</span>
          <div className="min-w-0">
            <h1 id="nama-profil" className="text-[1.6rem] leading-tight" data-ringkas="Profil">{nama || <span className="inline-block h-7 w-40 animate-pulse rounded-lg bg-kabut align-middle" />}</h1>
            {tempatTinggal && <p className="mt-1 flex items-center gap-1 text-[15px] text-abu"><IconMapPin size={16} className="shrink-0" />{tempatTinggal}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="tombol tombol-utama min-h-12 px-3 text-[15px]" onClick={() => setTambah(true)}><IconPlus size={18} />Pengalaman</button>
          <Link href="/app/kartu" className="tombol tombol-garis min-h-12 px-3 text-[15px]"><IconIdBadge2 size={18} />Kartu Kerja</Link>
        </div>
        <nav className="profil-angka" aria-label="Ringkasan">
          <Angka nilai={p ? p.persona.length : null} label="CV" href="#cv-mu" />
          <Angka nilai={cvKhusus.data ? cvKhusus.data.cv.length : null} label="CV Khusus" href="#cv-khusus" />
          <Angka nilai={lamaran.data ? lamaran.data.lamaran.length : null} label="Lamaran" href="/app/lamaran" />
        </nav>
      </section>

      {usulan.length > 0 && (
        <section className="grid gap-2 rounded-3xl border border-[#F7C9A0] bg-jingga-muda p-4" aria-labelledby="judul-usulan">
          <h2 id="judul-usulan" className="text-lg">Dari obrolan, benar begini?</h2>
          <p className="-mt-1 text-sm text-jingga-tua">Yang kamu simpan dipakai untuk CV. Yang bukan, dibuang.</p>
          {usulan.map((f) => (
            <div key={f.id} className="rounded-2xl bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-abu">{JENIS[f.jenis]}</p>
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

      <section id="cv-khusus" className="scroll-mt-20" aria-labelledby="judul-cv-khusus">
        <div className="profil-bagian-kepala">
          <div>
            <h2 id="judul-cv-khusus" className="text-lg">CV Khusus</h2>
            <p className="text-sm text-abu">Satu untuk tiap lamaran, rapi dan ramah ATS.</p>
          </div>
        </div>
        <RakCvKhusus daftar={cvKhusus.data?.cv ?? (cvKhusus.galat ? [] : null)} />
      </section>

      <section id="cv-mu" className="scroll-mt-20" aria-labelledby="judul-cv-mu">
        <div className="profil-bagian-kepala">
          <div>
            <h2 id="judul-cv-mu" className="text-lg">CV-mu</h2>
            <p className="text-sm text-abu">Satu untuk tiap jenis kerja. Lowongan dicocokkan dengan ini.</p>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {p?.persona.map((x) => (
            <li key={x.id} className="kartu-cv-persona">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] leading-snug">CV {x.judul}</h3>
                <button type="button" className="tombol tombol-garis min-h-11 shrink-0 px-4 text-[15px]" onClick={() => setUbah(x)}><IconPencil size={16} />Ubah</button>
              </div>
              {x.ringkasan && <p className="line-clamp-3 text-[15px] text-abu">{x.ringkasan}</p>}
              {x.keahlian.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {x.keahlian.slice(0, 6).map((k) => <li key={k} className="chip-kategori py-1 pl-3 text-[13px]">{k}</li>)}
                  {x.keahlian.length > 6 && <li className="chip-kategori py-1 pl-3 text-[13px] text-abu">+{x.keahlian.length - 6}</li>}
                </ul>
              )}
            </li>
          ))}
          {p && !p.persona.length && <li className="rounded-2xl border border-dashed border-garis px-4 py-3 text-[15px] text-abu">Belum ada CV. Ceritakan kerjamu di Ngobrol, Lokerin menyusunnya.</li>}
        </ul>
      </section>

      <section aria-labelledby="judul-fakta">
        <div className="profil-bagian-kepala">
          <div>
            <h2 id="judul-fakta" className="text-lg">Fakta tentang kamu</h2>
            <p className="text-sm text-abu">Setiap poin di CV harus berasal dari sini.</p>
          </div>
          <button type="button" className="tombol tombol-halus min-h-11 shrink-0 px-4 text-[15px]" onClick={() => setTambah(true)}><IconPlus size={16} />Tambah</button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {URUTAN_JENIS.map((jenis) => {
            const isi = fakta.filter((f) => f.jenis === jenis);
            if (!isi.length) return null;
            return (
              <section key={jenis} className="grup-fakta">
                <h3>{JENIS[jenis]}<span className="font-semibold normal-case tracking-normal">{isi.length}</span></h3>
                <ul>
                  {isi.map((f) => (
                    <li key={f.id}>
                      <p className="font-bold leading-snug">{f.judul}</p>
                      {(f.tempat || f.periode) && <p className="text-sm text-abu">{[f.tempat, f.periode].filter(Boolean).join(" · ")}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {p && !fakta.length && <p className="rounded-2xl border border-dashed border-garis px-4 py-3 text-[15px] text-abu">Belum ada fakta yang kamu simpan.</p>}
        </div>
      </section>

      <section aria-labelledby="judul-atur">
        <h2 id="judul-atur" className="mb-2 text-lg">Lainnya</h2>
        <div className="atur-grup">
          <BarisTautan href="/app/ngobrol" ikon={<IconMicrophone size={20} />} judul="Ceritakan lewat Ngobrol" keterangan="Tambah pengalaman dengan bicara" />
          <BarisTautan href="/app/lamaran" ikon={<IconBriefcase size={20} />} judul="Lamaranku" keterangan="Status tiap lamaran" />
          <PengaturanPush baris />
          <BarisKeluar />
        </div>
      </section>

      <UbahPersona persona={ubah} onTutup={() => setUbah(null)} onTersimpan={() => { setUbah(null); profil.muatUlang(); }} />

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

function ProfilUsaha() {
  const me = useApi<MeApi>("/me");
  const lowongan = useApi<{ lowongan: LowonganApi[] }>("/pemberi/lowongan");
  const pelamar = useApi<{ lamaran: LamaranApi[] }>("/pemberi/lamaran");
  const u = me.data?.pemberi_kerja;
  const aktif = lowongan.data?.lowongan.filter((l) => l.status === "terbit").length ?? null;
  const baru = pelamar.data?.lamaran.filter((l) => l.status === "terkirim").length ?? null;
  return (
    <div className="grid gap-7">
      <section className="profil-hero" aria-labelledby="nama-usaha">
        <div className="flex items-center gap-4">
          <span className="profil-avatar" aria-hidden="true"><IconBuildingStore size={30} /></span>
          <div className="min-w-0">
            <h1 id="nama-usaha" className="text-[1.6rem] leading-tight" data-ringkas="Usaha">{u?.nama_usaha ?? me.data?.nama ?? "Usahamu"}</h1>
            {u && <p className="mt-1 flex items-center gap-1 text-[15px] text-abu"><IconMapPin size={16} className="shrink-0" />{[u.kecamatan, u.kota].filter(Boolean).join(", ")}</p>}
          </div>
        </div>
        {u && (
          <p className={`flex items-start gap-2 rounded-2xl px-3 py-2.5 text-[15px] ${u.terverifikasi ? "bg-daun-muda text-daun" : "bg-[#FFF6DB] text-[#8A5A00]"}`}>
            <IconShieldCheck size={20} className="mt-px shrink-0" />
            <span>{u.terverifikasi ? `Terverifikasi. Yang dicek: ${u.yang_dicek.join(", ")}.` : u.status_verifikasi === "menunggu" ? "Sedang dicek. Lowonganmu tetap tayang dengan label belum terverifikasi." : "Belum terverifikasi. Lowonganmu tetap tayang, tapi pelamar lebih percaya pada usaha yang sudah dicek."}</span>
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/app/pasang" className="tombol tombol-utama min-h-12 whitespace-nowrap px-3 text-[15px]"><IconPlus size={18} />Pasang lowongan</Link>
          {u && !u.terverifikasi ? <Link href="/app/verifikasi" className="tombol tombol-garis min-h-12 px-3 text-[15px]"><IconShieldCheck size={18} />Verifikasi</Link> : <Link href="/app/pelamar" className="tombol tombol-garis min-h-12 px-3 text-[15px]">Lihat pelamar</Link>}
        </div>
        <nav className="profil-angka" aria-label="Ringkasan">
          <Angka nilai={aktif} label="Tayang" href="/app" />
          <Angka nilai={baru} label="Pelamar baru" href="/app/pelamar" />
          <Angka nilai={pelamar.data ? pelamar.data.lamaran.length : null} label="Pelamar" href="/app/pelamar" />
        </nav>
      </section>

      <section aria-labelledby="judul-atur">
        <h2 id="judul-atur" className="mb-2 text-lg">Lainnya</h2>
        <div className="atur-grup">
          <BarisTautan href="/app/ngobrol" ikon={<IconMicrophone size={20} />} judul="Pasang lewat Ngobrol" keterangan="Bilang butuh siapa, lowongannya disusun" />
          <PengaturanPush baris />
          <BarisKeluar />
        </div>
      </section>
    </div>
  );
}

/** Live profile for signed-in users; Alice's sample CV otherwise. */
export function ProfilLangsung() {
  const { pengguna } = useSesi();
  if (!apiAktif || !pengguna) return <ProfilCv />;
  return pengguna.peran === "pemberi" ? <ProfilUsaha /> : <ProfilPencari />;
}
