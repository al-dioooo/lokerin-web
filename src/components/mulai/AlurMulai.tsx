"use client";

/*
 * Onboarding with one question per screen. Single-choice screens move on as soon as the person
 * taps an answer; screens with typing or several picks have one big "Lanjut" button. Every
 * question can be read aloud, and the back arrow always works, so nobody gets stuck.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Logo } from "../brand/Logo";
import { BangunanIcon, DapurIcon, KATEGORI, LasIcon, OjekIcon, TokoIcon, type KategoriSlug } from "../icons/categories";
import { IconArrowLeft, IconCamera, IconCheck, IconId, IconShieldCheck } from "../icons/tabler";
import { Bacakan } from "../ui/Bacakan";
import { KartuKerja } from "../ui/KartuKerja";
import { bacaAkun, simpanAkun } from "@/lib/auth";
import { api, apiAktif, GalatApi } from "@/lib/api/klien";
import { masukGoogle, masukTamu } from "@/lib/api/sesi";
import type { FaktaApi } from "@/lib/api/tipe";
import "../lapis/lapis.css";
import "./alur.css";

type Peran = "pencari" | "pemberi";

const AREA = ["Purwokerto Utara", "Purwokerto Selatan", "Purwokerto Timur", "Purwokerto Barat", "Sokaraja", "Kembaran", "Ajibarang", "Baturraden"];
/** Category labels are not all job titles ("Warung & Dapur"), so each gets its own phrasing. */
const KERJA_SELAMA: Record<KategoriSlug, string> = {
  las: "jadi tukang las",
  ojek: "ngojek atau nyopir",
  dapur: "kerja di warung atau dapur",
  bangunan: "jadi tukang bangunan",
  bengkel: "kerja di bengkel",
  bersih: "kerja bersih-bersih",
  toko: "jaga toko",
  angkut: "kerja angkut barang",
  kebun: "kerja di kebun atau sawah",
  jahit: "menjahit",
  laundry: "kerja cuci dan setrika",
  kurir: "jadi kurir",
  acara: "bantu acara",
  asuh: "jaga anak atau lansia",
  magang: "belajar di bidang ini",
};

const PENGALAMAN = [
  { id: "baru", label: "Baru mulai", periode: "kurang dari 1 tahun" },
  { id: "1-3", label: "1 sampai 3 tahun", periode: "1–3 tahun" },
  { id: "3+", label: "Lebih dari 3 tahun", periode: "lebih dari 3 tahun" },
] as const;
const WAKTU = ["Pagi", "Siang", "Malam", "Akhir pekan"] as const;
const JARAK = [2, 5, 10, 20] as const;
const JENIS_USAHA: { label: string; jenis: "umkm" | "rumah_tangga" | "perusahaan" }[] = [
  { label: "Warung makan", jenis: "umkm" },
  { label: "Bengkel", jenis: "umkm" },
  { label: "Toko", jenis: "umkm" },
  { label: "Laundry", jenis: "umkm" },
  { label: "Bangunan", jenis: "umkm" },
  { label: "Rumah tangga", jenis: "rumah_tangga" },
  { label: "Kantor atau studio", jenis: "perusahaan" },
];

const kotaDari = (kecamatan: string) => (kecamatan.startsWith("Purwokerto") ? "Purwokerto" : "Banyumas");
const tanpaLangganan = () => () => {};

export function AlurMulai() {
  const router = useRouter();
  const namaGoogle = useSyncExternalStore(tanpaLangganan, () => bacaAkun()?.nama ?? "", () => "");
  const [peran, setPeran] = useState<Peran | null>(null);
  const [namaKetik, setNama] = useState<string | null>(null);
  const [kerja, setKerja] = useState<KategoriSlug[]>([]);
  const [pengalaman, setPengalaman] = useState<Record<string, (typeof PENGALAMAN)[number]["id"]>>({});
  const [waktu, setWaktu] = useState<string[]>([]);
  const [area, setArea] = useState<string | null>(null);
  const [jarak, setJarak] = useState<number | null>(null);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState<(typeof JENIS_USAHA)[number] | null>(null);
  const [dokumen, setDokumen] = useState({ ktp: false, npwp: false, foto_usaha: false });
  const [langkah, setLangkah] = useState(0);
  const [arah, setArah] = useState<"maju" | "mundur">("maju");
  const [simpan, setSimpan] = useState<"belum" | "proses" | "beres" | "gagal">("belum");
  // A retry after a failed save must not create a second account.
  const akunDibuat = useRef(false);
  const [pesanGagal, setPesanGagal] = useState("");
  const nama = namaKetik ?? namaGoogle;

  const urutan: string[] =
    peran === "pemberi"
      ? ["peran", "nama-usaha", "jenis-usaha", "area", "nama", "dokumen", "selesai"]
      : ["peran", "nama", "kerja", ...kerja.map((k) => `pengalaman:${k}`), "waktu", "area", "jarak", "selesai"];
  const ini = urutan[langkah] ?? "peran";

  function maju() {
    setArah("maju");
    setLangkah((n) => Math.min(n + 1, urutan.length - 1));
    window.scrollTo({ top: 0 });
  }
  function mundur() {
    if (langkah === 0) return router.push("/masuk");
    setArah("mundur");
    setLangkah((n) => Math.max(0, n - 1));
    if (simpan === "gagal") setSimpan("belum");
  }
  /** Single-choice answers move on after a beat, so the tap is visibly confirmed first. */
  function pilihLaluMaju(fn: () => void) {
    fn();
    window.setTimeout(maju, 220);
  }

  async function simpanSemua() {
    if (!apiAktif) {
      try {
        sessionStorage.setItem("lokerin-mulai", JSON.stringify({ peran, nama, kerja, area, namaUsaha }));
      } catch {}
      setSimpan("beres");
      return;
    }
    setSimpan("proses");
    try {
      const kecamatan = area ?? "Purwokerto Utara";
      const daftar = { peran: peran!, nama: nama.trim() || "Tamu", kota: kotaDari(kecamatan), kecamatan };
      // Signed in with Google: the account is created now, tied to that Google account.
      if (!akunDibuat.current) {
        const akun = bacaAkun();
        if (akun?.aksesGoogle) {
          await masukGoogle(akun.aksesGoogle, daftar);
          // The token has done its job; keep only the name this screen still shows.
          simpanAkun({ ...akun, aksesGoogle: undefined });
        } else {
          await masukTamu(daftar.peran, daftar.nama, { kota: daftar.kota, kecamatan });
        }
        akunDibuat.current = true;
      }
      if (peran === "pemberi") {
        await api("/pemberi/daftar", {
          method: "POST",
          body: { nama_usaha: namaUsaha.trim(), jenis: jenisUsaha?.jenis ?? "umkm", kota: kotaDari(kecamatan), kecamatan, dokumen },
        });
      } else {
        for (const slug of kerja) {
          const { label } = KATEGORI.find((k) => k.slug === slug)!;
          const lama = PENGALAMAN.find((p) => p.id === pengalaman[slug]) ?? PENGALAMAN[0];
          const fakta = await api<FaktaApi>("/fakta", {
            method: "POST",
            body: { jenis: "pengalaman", judul: label, periode: lama.periode, ...(waktu.length ? { detail: `Bisa kerja ${waktu.join(", ").toLowerCase()}` } : {}) },
          });
          await api("/persona", {
            method: "POST",
            body: {
              judul: label,
              ringkasan: `${label}, pengalaman ${lama.periode}.${waktu.length ? ` Bisa kerja ${waktu.join(", ").toLowerCase()}.` : ""}`,
              keahlian: [label],
              fakta_ids: [fakta.id],
              preferensi: { kota: [kecamatan], mau_pindah: (jarak ?? 5) >= 20 },
            },
          });
        }
      }
      setSimpan("beres");
    } catch (e) {
      setPesanGagal(e instanceof GalatApi ? e.message : "Belum berhasil menyimpan. Coba lagi.");
      setSimpan("gagal");
    }
  }

  // Save once the last screen opens, after the final answer has rendered.
  useEffect(() => {
    if (ini !== "selesai" || simpan !== "belum") return;
    const t = window.setTimeout(() => void simpanSemua(), 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ini, simpan]);

  const maju1 = (urutan.length > 1 ? langkah / (urutan.length - 1) : 0) as number;
  const labelKerja = kerja.map((k) => KATEGORI.find((x) => x.slug === k)!.label);

  return (
    <div className="mulai-layar alur">
      <header className="mulai-atas">
        <button type="button" onClick={mundur} className="icon-button size-12 bg-white" aria-label={langkah === 0 ? "Kembali ke halaman masuk" : "Kembali ke pertanyaan sebelumnya"}>
          <IconArrowLeft size={22} />
        </button>
        <div className="jalan-kemajuan" role="progressbar" aria-label="Kemajuan" aria-valuemin={1} aria-valuemax={urutan.length} aria-valuenow={langkah + 1} style={{ "--maju": maju1 } as CSSProperties}>
          <span className="jalan-garis" />
          <span className="jalan-motor"><OjekIcon size={30} /></span>
        </div>
        <Link href="/" aria-label="Lokerin, halaman utama"><Logo size={22} /></Link>
      </header>

      <main id="utama" className="alur-isi">
        <section key={ini} className="mulai-langkah" data-arah={arah} aria-live="polite">
          {ini === "peran" && (
            <Pertanyaan atas={namaGoogle ? `Halo, ${namaGoogle.split(" ")[0]}` : "Selamat datang"} judul="Kamu ke Lokerin untuk apa?">
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" className="kartu-peran alur-peran" aria-pressed={peran === "pencari"} onClick={() => pilihLaluMaju(() => setPeran("pencari"))}>
                  <span className="kartu-peran-ikon"><LasIcon size={46} /><DapurIcon size={40} /><OjekIcon size={44} /></span>
                  <span className="text-xl font-extrabold">Saya cari kerja</span>
                  <span className="text-[15px] text-abu">Lowongan dekat rumah, CV tersusun sendiri.</span>
                </button>
                <button type="button" className="kartu-peran alur-peran" aria-pressed={peran === "pemberi"} onClick={() => pilihLaluMaju(() => setPeran("pemberi"))}>
                  <span className="kartu-peran-ikon"><TokoIcon size={44} /><BangunanIcon size={46} /></span>
                  <span className="text-xl font-extrabold">Saya cari pekerja</span>
                  <span className="text-[15px] text-abu">Pasang lowongan untuk warung, bengkel, toko, atau rumah.</span>
                </button>
              </div>
            </Pertanyaan>
          )}

          {ini === "nama" && (
            <Pertanyaan atas={peran === "pemberi" ? "Pemilik usaha" : "Kenalan dulu"} judul={peran === "pemberi" ? "Siapa nama pemiliknya?" : "Siapa namamu?"} bantu={peran === "pemberi" ? "Pekerja akan melihat nama ini di lowongan." : "Nama ini muncul di CV dan Kartu Kerja-mu."}>
              <label htmlFor="alur-nama" className="sr-only">Nama</label>
              <input id="alur-nama" autoFocus autoComplete="name" value={nama} onChange={(e) => setNama(e.target.value)} onKeyDown={(e) => e.key === "Enter" && nama.trim().length > 1 && maju()} placeholder={peran === "pemberi" ? "Misalnya Bu Wati" : "Misalnya Darto"} className="input-mulai alur-input" />
              <Lanjut aktif={nama.trim().length > 1} onClick={maju} />
            </Pertanyaan>
          )}

          {ini === "kerja" && (
            <Pertanyaan atas="CV pertamamu" judul="Kamu bisa kerja apa?" bantu="Pilih satu sampai tiga. Tiap pilihan jadi satu CV.">
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {KATEGORI.map(({ slug, label, Icon }) => {
                  const urut = kerja.indexOf(slug);
                  const penuh = urut < 0 && kerja.length >= 3;
                  return (
                    <li key={slug}>
                      <button type="button" className="ubin-pilih alur-ubin" aria-pressed={urut >= 0} disabled={penuh} onClick={() => setKerja((k) => (urut >= 0 ? k.filter((x) => x !== slug) : [...k, slug]))}>
                        {urut >= 0 && <span className="ubin-nomor">{urut + 1}</span>}
                        <Icon size={44} />
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Lanjut aktif={kerja.length > 0} onClick={maju} label={kerja.length > 1 ? `Lanjut dengan ${kerja.length} pekerjaan` : "Lanjut"} />
            </Pertanyaan>
          )}

          {ini.startsWith("pengalaman:") && (() => {
            const slug = ini.split(":")[1] as KategoriSlug;
            const { label, Icon } = KATEGORI.find((k) => k.slug === slug)!;
            return (
              <Pertanyaan atas={label} judul={`Sudah berapa lama ${KERJA_SELAMA[slug]}?`} ikon={<span className="ubin-ikon size-16"><Icon size={44} /></span>}>
                <div className="grid gap-2.5">
                  {PENGALAMAN.map((p) => (
                    <button key={p.id} type="button" className="alur-pilihan" aria-pressed={pengalaman[slug] === p.id} onClick={() => pilihLaluMaju(() => setPengalaman((x) => ({ ...x, [slug]: p.id })))}>
                      {p.label}
                      {pengalaman[slug] === p.id && <IconCheck size={22} />}
                    </button>
                  ))}
                </div>
              </Pertanyaan>
            );
          })()}

          {ini === "waktu" && (
            <Pertanyaan atas="Waktu kerja" judul="Kapan kamu bisa kerja?" bantu="Boleh pilih lebih dari satu.">
              <div className="grid grid-cols-2 gap-2.5">
                {WAKTU.map((w) => (
                  <button key={w} type="button" className="alur-pilihan" aria-pressed={waktu.includes(w)} onClick={() => setWaktu((x) => (x.includes(w) ? x.filter((y) => y !== w) : [...x, w]))}>
                    {w}
                    {waktu.includes(w) && <IconCheck size={22} />}
                  </button>
                ))}
              </div>
              <Lanjut aktif={waktu.length > 0} onClick={maju} />
            </Pertanyaan>
          )}

          {ini === "area" && (
            <Pertanyaan atas={peran === "pemberi" ? "Lokasi usaha" : "Dekat rumah"} judul={peran === "pemberi" ? "Usahamu di kecamatan mana?" : "Kamu tinggal di mana?"}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {AREA.map((a) => (
                  <button key={a} type="button" className="alur-pilihan" aria-pressed={area === a} onClick={() => pilihLaluMaju(() => setArea(a))}>
                    {a}
                    {area === a && <IconCheck size={22} />}
                  </button>
                ))}
              </div>
            </Pertanyaan>
          )}

          {ini === "jarak" && (
            <Pertanyaan atas="Perjalanan" judul="Seberapa jauh kamu mau berangkat kerja?">
              <div className="grid grid-cols-2 gap-2.5">
                {JARAK.map((km) => (
                  <button key={km} type="button" className="alur-pilihan flex-col items-start" aria-pressed={jarak === km} onClick={() => pilihLaluMaju(() => setJarak(km))}>
                    <span className="text-2xl font-extrabold tabular-nums">{km} km</span>
                    <span className="text-sm font-semibold text-abu">{km <= 2 ? "Jalan kaki" : km <= 5 ? "Sepeda atau motor" : km <= 10 ? "Naik motor" : "Ke mana saja"}</span>
                  </button>
                ))}
              </div>
            </Pertanyaan>
          )}

          {ini === "nama-usaha" && (
            <Pertanyaan atas="Usahamu" judul="Apa nama usahamu?" bantu="Untuk rumah tangga, tulis saja nama keluargamu.">
              <label htmlFor="alur-usaha" className="sr-only">Nama usaha</label>
              <input id="alur-usaha" autoFocus value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} onKeyDown={(e) => e.key === "Enter" && namaUsaha.trim().length > 1 && maju()} placeholder="Misalnya Warung Bu Wati" className="input-mulai alur-input" />
              <Lanjut aktif={namaUsaha.trim().length > 1} onClick={maju} />
            </Pertanyaan>
          )}

          {ini === "jenis-usaha" && (
            <Pertanyaan atas="Usahamu" judul={`${namaUsaha || "Usahamu"} itu usaha apa?`}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {JENIS_USAHA.map((j) => (
                  <button key={j.label} type="button" className="alur-pilihan" aria-pressed={jenisUsaha?.label === j.label} onClick={() => pilihLaluMaju(() => setJenisUsaha(j))}>
                    {j.label}
                    {jenisUsaha?.label === j.label && <IconCheck size={22} />}
                  </button>
                ))}
              </div>
            </Pertanyaan>
          )}

          {ini === "dokumen" && (
            <Pertanyaan atas="Supaya pekerja percaya" judul="Dokumen apa yang sudah siap?" bantu="Pekerja melihat apa saja yang sudah dicek. Versi lomba hanya memakai dokumen tiruan.">
              <div className="grid gap-2.5">
                {([
                  ["ktp", "KTP pemilik", "Wajib. Nomornya disamarkan.", IconId],
                  ["npwp", "NPWP", "Boleh dilewati untuk UMKM dan rumah tangga.", IconShieldCheck],
                  ["foto_usaha", "Foto tempat usaha", "Depan warung, bengkel, atau tokomu.", IconCamera],
                ] as const).map(([kunci, judul, ket, Icon]) => (
                  <button key={kunci} type="button" className="alur-pilihan justify-start gap-3 text-left" aria-pressed={dokumen[kunci]} onClick={() => setDokumen((d) => ({ ...d, [kunci]: !d[kunci] }))}>
                    <span className="ubin-ikon size-11 shrink-0"><Icon size={24} /></span>
                    <span className="min-w-0 flex-1"><span className="block">{judul}</span><span className="block text-sm font-semibold text-abu">{ket}</span></span>
                    {dokumen[kunci] && <IconCheck size={22} />}
                  </button>
                ))}
              </div>
              <Lanjut aktif={dokumen.ktp} onClick={maju} label="Kirim untuk dicek" />
            </Pertanyaan>
          )}

          {ini === "selesai" && (
            <Pertanyaan
              atas={simpan === "beres" ? "Selesai" : "Sebentar"}
              judul={simpan === "gagal" ? "Belum berhasil disimpan." : peran === "pemberi" ? "Usahamu sedang dicek." : `Siap kerja, ${nama.split(" ")[0] || "kamu"}.`}
              bantu={simpan === "gagal" ? pesanGagal : simpan === "proses" ? "Menyimpan jawabanmu..." : peran === "pemberi" ? "Sambil menunggu, kamu sudah bisa menyiapkan lowongan pertama." : "CV-mu sudah jadi dari jawaban tadi. Lowongan yang cocok sudah menunggu."}
            >
              {peran === "pencari" && simpan !== "gagal" && <KartuKerja nama={nama || "Kamu"} personas={labelKerja} kota={area ?? "Banyumas"} className="alur-kartu" />}
              {simpan === "gagal" ? (
                <Lanjut aktif onClick={() => void simpanSemua()} label="Coba lagi" />
              ) : (
                <Lanjut
                  aktif={simpan === "beres"}
                  onClick={() => router.push(peran === "pemberi" ? "/app/pasang" : "/app")}
                  label={simpan === "proses" ? "Menyimpan..." : peran === "pemberi" ? "Pasang lowongan pertama" : "Lihat lowongan untukku"}
                />
              )}
            </Pertanyaan>
          )}
        </section>
      </main>
    </div>
  );
}

function Pertanyaan({ atas, judul, bantu, ikon, children }: { atas: string; judul: string; bantu?: string; ikon?: ReactNode; children: ReactNode }) {
  return (
    <>
      {ikon && <div className="mb-3">{ikon}</div>}
      <p className="pil-piksel">{atas}</p>
      <div className="mt-3 flex items-start gap-3">
        <h1 className="judul-mulai alur-judul m-0 flex-1">{judul}</h1>
        <Bacakan teks={`${judul} ${bantu ?? ""}`} label="Bacakan pertanyaan" ringkas className="mt-1 shrink-0 border border-garis bg-white" />
      </div>
      {bantu && <p className="mt-2 text-[17px] text-abu">{bantu}</p>}
      <div className="mt-6">{children}</div>
    </>
  );
}

function Lanjut({ aktif, onClick, label = "Lanjut" }: { aktif: boolean; onClick: () => void; label?: string }) {
  return (
    <div className="alur-lanjut">
      <button type="button" className="tombol tombol-utama w-full" disabled={!aktif} onClick={onClick}>{label}</button>
    </div>
  );
}
