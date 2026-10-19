"use client";

import Link from "next/link";
import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { Logo } from "../brand/Logo";
import { BangunanIcon, DapurIcon, KATEGORI, LasIcon, OjekIcon, TokoIcon, type KategoriSlug } from "../icons/categories";
import { IconArrowLeft, IconArrowRight, IconCamera, IconCheck, IconCircleDashed, IconId, IconMicrophone, IconShieldCheck, IconUpload } from "../icons/tabler";
import { TautanNgobrol } from "../app/TautanNgobrol";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { bacaAkun } from "@/lib/auth";
import { LOWONGAN_TAYANG } from "@/lib/data";

type Peran = "pekerja" | "usaha";
type Pengalaman = "baru" | "1-3" | "3+";
type Waktu = "pagi" | "siang" | "malam" | "akhir-pekan";
type Persona = { kategori: KategoriSlug; pengalaman?: Pengalaman; waktu: Waktu[] };
type Dokumen = "ktp" | "npwp" | "foto";

const AREA = ["Purwokerto Utara", "Purwokerto Selatan", "Purwokerto Timur", "Sokaraja", "Kembaran", "Ajibarang", "Baturraden", "Cilongok"];
const PENGALAMAN: { id: Pengalaman; label: string }[] = [{ id: "baru", label: "Baru mulai" }, { id: "1-3", label: "1–3 tahun" }, { id: "3+", label: "Lebih dari 3 tahun" }];
const WAKTU: { id: Waktu; label: string }[] = [{ id: "pagi", label: "Pagi" }, { id: "siang", label: "Siang" }, { id: "malam", label: "Malam" }, { id: "akhir-pekan", label: "Akhir pekan" }];
const JENIS_USAHA = ["Warung makan", "Bengkel", "Toko", "Laundry", "Bangunan", "Rumah tangga", "Lainnya"];
const DOKUMEN: { id: Dokumen; judul: string; ket: string; Icon: typeof IconId }[] = [
  { id: "ktp", judul: "KTP pemilik", ket: "Wajib. Nomornya disamarkan, misalnya 3302 •••• •••• 0001.", Icon: IconId },
  { id: "npwp", judul: "NPWP", ket: "Boleh dilewati untuk UMKM dan rumah tangga.", Icon: IconShieldCheck },
  { id: "foto", judul: "Foto tempat usaha", ket: "Depan warung, bengkel, atau tokomu.", Icon: IconCamera },
];

const tidakBerlangganan = () => () => {};

function Pilihan({ aktif, onClick, children, className = "" }: { aktif: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return <button type="button" aria-pressed={aktif} onClick={onClick} className={`chip-pilih ${className}`}>{aktif && <IconCheck size={14} stroke={2.4} />}{children}</button>;
}

export function Onboarding() {
  const nama = useSyncExternalStore(tidakBerlangganan, () => bacaAkun()?.nama ?? "", () => "");
  const namaDepan = nama.split(" ")[0] || "kamu";
  const [peran, setPeran] = useState<Peran | null>(null);
  const [langkah, setLangkah] = useState(0);
  const [arah, setArah] = useState<"maju" | "mundur">("maju");
  const [persona, setPersona] = useState<Persona[]>([]);
  const [area, setArea] = useState<string | null>(null);
  const [radius, setRadius] = useState(5);
  const [jenisUsaha, setJenisUsaha] = useState<string | null>(null);
  const [namaUsaha, setNamaUsaha] = useState("");
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);

  const urutan = peran === "usaha" ? ["peran", "usaha", "cek", "selesai"] : ["peran", "kerja", "detail", "area", "selesai"];
  const ini = urutan[langkah];
  const terakhir = ini === "selesai";

  const bisaLanjut =
    ini === "peran" ? !!peran :
    ini === "kerja" ? persona.length > 0 :
    ini === "detail" ? persona.every((p) => p.pengalaman) :
    ini === "area" ? !!area :
    ini === "usaha" ? !!jenisUsaha && namaUsaha.trim().length > 1 && !!area :
    ini === "cek" ? dokumen.includes("ktp") : true;

  function pindah(ke: number) {
    setArah(ke > langkah ? "maju" : "mundur");
    setLangkah(ke);
    window.scrollTo({ top: 0 });
  }

  function togglePersona(k: KategoriSlug) {
    setPersona((ps) => ps.some((p) => p.kategori === k) ? ps.filter((p) => p.kategori !== k) : ps.length >= 3 ? ps : [...ps, { kategori: k, waktu: [] }]);
  }

  function ubahPersona(k: KategoriSlug, ubah: (p: Persona) => Persona) {
    setPersona((ps) => ps.map((p) => (p.kategori === k ? ubah(p) : p)));
  }

  return (
    <div className="mulai-layar">
      <header className="mulai-atas">
        <Link href="/" aria-label="Lokerin, halaman utama"><Logo size={24} /></Link>
        <div className="jalan-kemajuan" role="progressbar" aria-label="Langkah pengisian" aria-valuemin={1} aria-valuemax={urutan.length} aria-valuenow={langkah + 1} style={{ "--maju": langkah / (urutan.length - 1) } as CSSProperties}>
          <span className="jalan-garis" />
          <span className="jalan-motor"><OjekIcon size={30} /></span>
        </div>
        <Link href="/app" className="text-sm font-semibold text-abu hover:text-tinta">Lewati</Link>
      </header>

      <div className="mulai-grid">
        <section key={ini} className="mulai-langkah" data-arah={arah} aria-live="polite">
          {ini === "peran" && (
            <>
              <p className="pil-piksel">Halo, {namaDepan}</p>
              <h1 className="judul-mulai">Kamu datang ke Lokerin <span className="text-jingga">untuk apa?</span></h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" className="kartu-peran" aria-pressed={peran === "pekerja"} onClick={() => setPeran("pekerja")}>
                  <span className="kartu-peran-ikon"><LasIcon size={46} /><DapurIcon size={40} /><OjekIcon size={44} /></span>
                  <span className="text-lg font-extrabold">Cari kerja</span>
                  <span className="text-sm text-abu">Pilih pekerjaanmu, CV tersusun sendiri dan lowongan dekat rumah langsung muncul.</span>
                </button>
                <button type="button" className="kartu-peran" aria-pressed={peran === "usaha"} onClick={() => setPeran("usaha")}>
                  <span className="kartu-peran-ikon"><TokoIcon size={44} /><BangunanIcon size={46} /></span>
                  <span className="text-lg font-extrabold">Cari orang</span>
                  <span className="text-sm text-abu">Pasang lowongan untuk warung, bengkel, toko, atau rumah. Usahamu kami cek dulu.</span>
                </button>
              </div>
            </>
          )}

          {ini === "kerja" && (
            <>
              <p className="pil-piksel">Kerjamu</p>
              <h1 className="judul-mulai">Biasanya kerja apa? <span className="text-jingga">Pilih sampai tiga.</span></h1>
              <p className="mt-2 text-sm text-abu">Lowongan dicocokkan untuk tiap kerja yang kamu pilih.</p>
              <ul className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                {KATEGORI.map(({ slug, label, Icon }) => {
                  const urut = persona.findIndex((p) => p.kategori === slug);
                  const penuh = urut < 0 && persona.length >= 3;
                  return (
                    <li key={slug}>
                      <button type="button" className="ubin-pilih" aria-pressed={urut >= 0} disabled={penuh} onClick={() => togglePersona(slug)}>
                        {urut >= 0 && <span className="ubin-nomor">{urut + 1}</span>}
                        <Icon size={40} />
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <TautanNgobrol className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-jingga-tua"><IconMicrophone size={18} />Lebih suka cerita? Ngobrol saja, Lokerin yang memilihkan</TautanNgobrol>
            </>
          )}

          {ini === "detail" && (
            <>
              <p className="pil-piksel">Sedikit lagi</p>
              <h1 className="judul-mulai">Berapa lama, <span className="text-jingga">dan kapan bisa kerja?</span></h1>
              <div className="mt-5 grid gap-3">
                {persona.map((p) => {
                  const { Icon, label } = KATEGORI.find((k) => k.slug === p.kategori)!;
                  return (
                    <div key={p.kategori} className="kartu-detail">
                      <div className="flex items-center gap-2"><span className="ubin-ikon size-10"><Icon size={28} /></span><span className="font-bold">{label}</span></div>
                      <p className="mt-3 text-xs font-semibold text-abu">Pengalaman</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">{PENGALAMAN.map((x) => <Pilihan key={x.id} aktif={p.pengalaman === x.id} onClick={() => ubahPersona(p.kategori, (q) => ({ ...q, pengalaman: x.id }))}>{x.label}</Pilihan>)}</div>
                      <p className="mt-3 text-xs font-semibold text-abu">Bisa kerja</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">{WAKTU.map((x) => <Pilihan key={x.id} aktif={p.waktu.includes(x.id)} onClick={() => ubahPersona(p.kategori, (q) => ({ ...q, waktu: q.waktu.includes(x.id) ? q.waktu.filter((w) => w !== x.id) : [...q.waktu, x.id] }))}>{x.label}</Pilihan>)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {(ini === "area" || ini === "usaha") && (
            <>
              <p className="pil-piksel">{ini === "usaha" ? "Usahamu" : "Dekat rumah"}</p>
              <h1 className="judul-mulai">{ini === "usaha" ? <>Usaha apa, <span className="text-jingga">dan di mana?</span></> : <>Cari kerja <span className="text-jingga">di sekitar mana?</span></>}</h1>
              {ini === "usaha" && (
                <>
                  <label htmlFor="nama-usaha" className="mt-5 block text-xs font-semibold text-abu">Nama usaha</label>
                  <input id="nama-usaha" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} placeholder="Misalnya Warung Bu Wati" className="input-mulai mt-1.5" />
                  <p className="mt-4 text-xs font-semibold text-abu">Jenis usaha</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">{JENIS_USAHA.map((j) => <Pilihan key={j} aktif={jenisUsaha === j} onClick={() => setJenisUsaha(j)}>{j}</Pilihan>)}</div>
                </>
              )}
              <p className="mt-5 text-xs font-semibold text-abu">Kecamatan</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">{AREA.map((a) => <Pilihan key={a} aktif={area === a} onClick={() => setArea(a)}>{a}</Pilihan>)}</div>
              {ini === "area" && (
                <div className="mt-6">
                  <label htmlFor="radius" className="flex items-baseline justify-between text-xs font-semibold text-abu">Jarak paling jauh <span className="text-base font-extrabold text-tinta tabular-nums">{radius} km</span></label>
                  <input id="radius" type="range" min={1} max={15} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="geser-radius mt-2" style={{ "--isi": `${((radius - 1) / 14) * 100}%` } as CSSProperties} />
                  <div className="mt-1 flex justify-between text-[11px] text-abu"><span>Jalan kaki</span><span>Naik motor</span></div>
                </div>
              )}
            </>
          )}

          {ini === "cek" && (
            <>
              <p className="pil-piksel">Supaya pekerja percaya</p>
              <h1 className="judul-mulai">Kami cek dulu <span className="text-jingga">usahamu.</span></h1>
              <p className="mt-2 text-sm text-abu">Pekerja melihat apa saja yang sudah dicek. Versi lomba hanya menerima dokumen tiruan, dan foto dihapus setelah dicek.</p>
              <ul className="mt-5 grid gap-2">
                {DOKUMEN.map(({ id, judul, ket, Icon }) => {
                  const siap = dokumen.includes(id);
                  return (
                    <li key={id} className="kartu-dokumen" data-siap={siap || undefined}>
                      <span className="ubin-ikon size-10"><Icon size={22} /></span>
                      <span className="min-w-0 flex-1"><span className="block font-bold">{judul}</span><span className="block text-xs text-abu">{ket}</span></span>
                      <button type="button" className={`tombol ${siap ? "tombol-halus" : "tombol-garis"} min-h-9 px-3 text-sm`} onClick={() => setDokumen((d) => (siap ? d.filter((x) => x !== id) : [...d, id]))}>
                        {siap ? <><IconCheck size={16} />Siap dicek</> : <><IconUpload size={16} />Unggah</>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {terakhir && (
            <>
              <p className="pil-piksel">Selesai</p>
              <h1 className="judul-mulai">{peran === "usaha" ? <>Usahamu <span className="text-jingga">sedang dicek.</span></> : <>Kartu Kerja-mu <span className="text-jingga">sudah jadi.</span></>}</h1>
              <p className="mt-2 text-sm text-abu">{peran === "usaha" ? "Biasanya selesai di hari yang sama. Sambil menunggu, siapkan lowongan pertamamu." : `${persona.length} jenis kerja tersimpan. Lowongan di sekitar ${area} sudah diurutkan dari yang paling cocok.`}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {peran === "usaha" ? (
                  <Link href="/app" className="tombol tombol-utama min-h-12 px-6 text-base">Lihat contoh lowongan <IconArrowRight size={18} /></Link>
                ) : (
                  <>
                    <Link href="/app" className="tombol tombol-utama min-h-12 px-6 text-base">Lihat lowongan yang cocok <IconArrowRight size={18} /></Link>
                    <TautanNgobrol className="tombol tombol-garis min-h-12 px-6 text-base"><IconMicrophone size={18} />Lengkapi lewat ngobrol</TautanNgobrol>
                  </>
                )}
              </div>
              {peran === "pekerja" && (() => {
                const pilihan = persona.map((p) => p.kategori);
                const cocok = LOWONGAN_TAYANG.filter((l) => pilihan.includes(l.kategori) || (pilihan.includes("las") && (l.cocok?.las ?? 0) > 60) || (pilihan.includes("ojek") && (l.cocok?.ojek ?? 0) > 60)).slice(0, 3);
                return cocok.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-2 text-sm font-bold">Sudah ada yang cocok sekarang</p>
                    <ul className="urut grid gap-2">{cocok.map((l, i) => <li key={l.id} style={{ "--i": i } as CSSProperties}><BarisLowongan lowongan={l} /></li>)}</ul>
                  </div>
                );
              })()}
            </>
          )}

          {!terakhir && (
            <div className="mulai-kendali">
              {langkah > 0 ? <button type="button" className="tombol tombol-garis" onClick={() => pindah(langkah - 1)}><IconArrowLeft size={18} />Kembali</button> : <span />}
              <button type="button" className="tombol tombol-utama min-w-36" disabled={!bisaLanjut} onClick={() => pindah(langkah + 1)}>Lanjut <IconArrowRight size={18} /></button>
            </div>
          )}
        </section>

        <aside className="mulai-pratinjau" aria-label="Pratinjau">
          {peran === "usaha" ? (
            <div className="kartu-usaha">
              <p className="piksel text-[10px] uppercase text-jingga-tua">Profil usaha</p>
              <p className="mt-1 text-xl font-extrabold">{namaUsaha || "Nama usahamu"}</p>
              <p className="text-sm text-abu">{[jenisUsaha, area].filter(Boolean).join(" · ") || "Jenis dan lokasi usaha"}</p>
              <ul className="mt-4 grid gap-2 text-sm">
                {DOKUMEN.map(({ id, judul }) => <li key={id} className="flex items-center justify-between gap-2"><span>{judul}</span>{dokumen.includes(id) ? <span key="s" className="stempel inline-flex items-center gap-1 text-xs font-bold text-daun"><IconCheck size={14} />Siap dicek</span> : <span className="inline-flex items-center gap-1 text-xs text-abu"><IconCircleDashed size={14} />Belum</span>}</li>)}
              </ul>
              {terakhir && <span className="cap-selesai stempel">Sedang dicek</span>}
            </div>
          ) : (
            <div className="kartu-kerja-hidup" data-kosong={persona.length === 0 || undefined}>
              <div className="kartu-kerja-hidup-atas"><Logo size={18} /><span className="piksel text-[9px] uppercase text-white/70">Kartu Kerja</span></div>
              <div className="p-5">
                <p className="text-2xl font-extrabold leading-tight">{nama || "Namamu"}</p>
                <p className="text-sm text-abu">{area ? `${area} · sampai ${radius} km` : "Banyumas"}</p>
                <ul className="mt-4 grid gap-2">
                  {persona.length === 0 && <li className="rounded-xl border border-dashed border-garis p-3 text-sm text-abu">Pekerjaan yang kamu pilih muncul di sini.</li>}
                  {persona.map((p) => {
                    const { Icon, label } = KATEGORI.find((k) => k.slug === p.kategori)!;
                    const peng = PENGALAMAN.find((x) => x.id === p.pengalaman)?.label;
                    const wkt = p.waktu.map((w) => WAKTU.find((x) => x.id === w)!.label.toLowerCase()).join(", ");
                    return (
                      <li key={p.kategori} className="baris-persona stempel">
                        <span className="ubin-ikon size-9 bg-white"><Icon size={24} /></span>
                        <span className="min-w-0"><span className="block font-bold">{label}</span><span className="block truncate text-xs text-abu">{[peng, wkt].filter(Boolean).join(" · ") || "Pengalaman dan waktu kerja"}</span></span>
                      </li>
                    );
                  })}
                </ul>
                <div className="qr-semu" aria-hidden="true" />
              </div>
              {terakhir && <span className="cap-selesai stempel">Siap kerja</span>}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
