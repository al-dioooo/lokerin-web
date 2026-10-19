"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { getKategori } from "../icons/categories";
import { IconChevronRight, IconKeyboard, IconMicrophone, IconPlayerStop, IconSend, IconX } from "../icons/tabler";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "../kota/KotaIsometrik";
import { RakBenda } from "../ngobrol/RakBenda";
import { aturArah } from "./Halaman";
import { keluarNgobrol, ngobrolSiap } from "./transisiNgobrol";
import { cariLowongan, upahTeks } from "@/lib/data";

type Tempat = keyof typeof LOKASI_KERJA;
type Isian = Partial<Record<"ada" | "pengalaman" | "waktu", string>>;
type Efek = { las?: Isian; ojek?: Isian; nyala?: Tempat[]; temuan?: { id: string; di: Tempat }[] };
type Langkah = { siapa: "ai" | "kamu"; teks: string; efek?: Efek };

const NASKAH: Langkah[] = [
  { siapa: "ai", teks: "Halo, Pak Darto. Ceritakan saja, biasanya kerja apa?" },
  { siapa: "kamu", teks: "Siang saya ngelas pagar di bengkel, malamnya ngojek.", efek: { las: { ada: "Tukang Las" }, ojek: { ada: "Driver Ojol" }, nyala: ["bengkel", "warung"] } },
  { siapa: "ai", teks: "Ngelasnya sudah berapa lama, dan di mana?" },
  { siapa: "kamu", teks: "Lima tahun, di bengkel Sokaraja. Bisa kanopi juga.", efek: { las: { pengalaman: "Pagar dan kanopi, 5 tahun di Sokaraja" }, nyala: ["bangunan"] } },
  { siapa: "ai", teks: "Kalau ngojek, biasanya jam berapa?" },
  { siapa: "kamu", teks: "Jam enam sore sampai sepuluh malam.", efek: { ojek: { pengalaman: "Antar penumpang dan makanan", waktu: "Setiap hari, 18.00–22.00" }, las: { waktu: "Senin–Sabtu, siang" } } },
  { siapa: "ai", teks: "Sudah jadi dua CV. Ada dua lowongan las dekat sini, saya tandai di peta.", efek: { temuan: [{ id: "las-pagar-pak-jaya", di: "bengkel" }, { id: "las-teralis-borongan", di: "bangunan" }] } },
];

type Cv = { las: Isian; ojek: Isian; nyala: Tempat[]; temuan: { id: string; di: Tempat }[] };
const KOSONG: Cv = { las: {}, ojek: {}, nyala: [], temuan: [] };

function terapkan(cv: Cv, e?: Efek): Cv {
  if (!e) return cv;
  return { las: { ...cv.las, ...e.las }, ojek: { ...cv.ojek, ...e.ojek }, nyala: [...cv.nyala, ...(e.nyala ?? [])], temuan: e.temuan ?? cv.temuan };
}

const ISIAN_TOTAL = 6;

export function RuangNgobrol() {
  const router = useRouter();
  const layar = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"siap" | "jalan" | "selesai">("siap");
  const [langkah, setLangkah] = useState(0);
  const [detik, setDetik] = useState(0);
  const [ketik, setKetik] = useState(false);
  const [teks, setTeks] = useState("");
  const [ketikan, setKetikan] = useState<{ posisi: number; teks: string }[]>([]);
  const [cvTerbuka, setCvTerbuka] = useState(false);

  useLayoutEffect(() => {
    ngobrolSiap(layar.current);
  }, []);

  useEffect(() => {
    if (status !== "jalan") return;
    const t = window.setTimeout(() => {
      if (langkah >= NASKAH.length) setStatus("selesai");
      else setLangkah((n) => n + 1);
    }, langkah === 0 ? 500 : 2100);
    return () => window.clearTimeout(t);
  }, [status, langkah]);

  useEffect(() => {
    if (status !== "jalan") return;
    const t = window.setInterval(() => setDetik((d) => d + 1), 1000);
    return () => window.clearInterval(t);
  }, [status]);

  const tampil = NASKAH.slice(0, langkah);
  const cv = tampil.reduce((acc, l) => terapkan(acc, l.efek), KOSONG);
  const terisi = [cv.las.ada, cv.las.pengalaman, cv.las.waktu, cv.ojek.ada, cv.ojek.pengalaman, cv.ojek.waktu].filter(Boolean).length;
  const jam = `${String(Math.floor(detik / 60)).padStart(2, "0")}:${String(detik % 60).padStart(2, "0")}`;

  const pesan: { siapa: "ai" | "kamu"; teks: string; kunci: string }[] = [];
  tampil.forEach((l, i) => {
    pesan.push({ ...l, kunci: `n${i}` });
    ketikan.filter((k) => k.posisi === i + 1).forEach((k, j) => pesan.push({ siapa: "kamu", teks: k.teks, kunci: `k${i}-${j}` }));
  });
  const sekarang = pesan.at(-1);
  const sebelumnya = pesan.at(-2);

  function tutup() {
    aturArah("kiri");
    keluarNgobrol(layar.current, () => router.push("/app"));
  }

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (!teks.trim()) return;
    setKetikan((k) => [...k, { posisi: langkah, teks: teks.trim() }]);
    setTeks("");
    if (status === "siap") setStatus("jalan");
  }

  return (
    <div ref={layar} className="ngobrol-layar" data-status={status}>
      <div className="ngobrol-kota" aria-hidden="true">
        <div className="ngobrol-kota-isi" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
          <KotaIsometrik className="kota-malam absolute inset-0 h-full w-full" nyala={cv.nyala} judul="" />
          {cv.temuan.map(({ id, di }, i) => {
            const l = cariLowongan(id);
            const { kiri, atas } = LOKASI_KERJA[di];
            return l && (
              <Link key={id} href={`/app/lowongan/${id}`} onClick={() => aturArah("maju")} className="pin-malam" style={{ left: `${kiri}%`, top: `${atas}%`, "--i": i } as CSSProperties} tabIndex={-1}>
                <span className="font-bold">{l.judul}</span><span className="tabular-nums">{upahTeks(l)}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <header className="ngobrol-atas">
        <button type="button" onClick={tutup} className="ngobrol-tombol-bulat" aria-label="Tutup dan kembali ke beranda"><IconX size={20} /></button>
        <span className="piksel text-[11px] uppercase tracking-wide text-[#F9C08F]">Ngobrol malam · demo</span>
        <span className="font-mono text-xs tabular-nums text-white/70" aria-label={`Durasi ${jam}, batas 3 menit`}>{jam} / 03:00</span>
      </header>

      <main className="ngobrol-panggung">
        <button type="button" onClick={() => setStatus(status === "jalan" ? "selesai" : "jalan")} disabled={status === "selesai"} className="lentera" aria-label={status === "jalan" ? "Akhiri obrolan" : "Mulai ngobrol"}>
          <span className="lentera-cincin" aria-hidden="true" />
          <span className="lentera-cincin lentera-cincin-2" aria-hidden="true" />
          <span className="lentera-inti">{status === "jalan" ? <IconPlayerStop size={34} /> : <IconMicrophone size={38} stroke={2} />}</span>
        </button>
        <span className="gelombang-malam" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</span>

        <div className="teks-berjalan" aria-hidden="true">
          {sebelumnya && <p key={`s-${sebelumnya.kunci}`} className="teks-lama">{sebelumnya.teks}</p>}
          {sekarang ? (
            <p key={sekarang.kunci} className="teks-baru" data-siapa={sekarang.siapa}><span className="piksel">{sekarang.siapa === "ai" ? "Lokerin" : "Kamu"}</span>{sekarang.teks}</p>
          ) : (
            <p className="teks-baru"><span className="piksel">Lokerin</span>Ketuk lentera, lalu ceritakan kerjamu. Tempat yang kamu sebut akan menyala di kota.</p>
          )}
        </div>
        <ol className="sr-only" aria-live="polite" aria-label="Isi obrolan">
          {pesan.map((p) => <li key={p.kunci}>{p.siapa === "ai" ? "Lokerin" : "Kamu"}: {p.teks}</li>)}
        </ol>

        <RakBenda teks={pesan.map((p) => p.teks)} onMulai={(k) => { setKetikan((x) => [...x, { posisi: langkah, teks: k }]); if (status === "siap") setStatus("jalan"); }} />

        <div className="ngobrol-kendali">
          <button type="button" className="ngobrol-tombol-bulat" onClick={() => setKetik((v) => !v)} aria-pressed={ketik} aria-label="Ketik jawaban"><IconKeyboard size={20} /></button>
          {status === "selesai" ? (
            <Link href="/app/profil" onClick={() => aturArah("kanan")} className="tombol tombol-utama">Lihat CV lengkap <IconChevronRight size={16} /></Link>
          ) : (
            <span className="text-xs text-white/60">{status === "jalan" ? "Lokerin mendengarkan…" : "Demo: mikrofon belum dipakai"}</span>
          )}
          <button type="button" className="ngobrol-tombol-bulat ngobrol-tombol-akhiri" onClick={tutup} aria-label="Akhiri dan tutup"><IconX size={20} /></button>
        </div>
        {ketik && (
          <form onSubmit={kirim} className="ngobrol-ketik">
            <label htmlFor="ketik-malam" className="sr-only">Ketik jawabanmu</label>
            <input id="ketik-malam" autoFocus value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Ketik jawabanmu di sini" />
            <button type="submit" aria-label="Kirim"><IconSend size={18} /></button>
          </form>
        )}
      </main>

      <aside className="kartu-tumbuh" data-terbuka={cvTerbuka || undefined} aria-label="CV yang tersusun">
        <button type="button" className="kartu-tumbuh-kepala" onClick={() => setCvTerbuka((v) => !v)} aria-expanded={cvTerbuka}>
          <span><span className="piksel block text-[10px] uppercase text-jingga-tua">Tersusun dari obrolan</span><span className="font-bold">CV Pak Darto</span></span>
          <span className="meter" style={{ "--isi": terisi / ISIAN_TOTAL } as CSSProperties} aria-label={`${terisi} dari ${ISIAN_TOTAL} isian terisi`}><span>{terisi}/{ISIAN_TOTAL}</span></span>
        </button>
        <div className="kartu-tumbuh-isi">
          {(["las", "ojek"] as const).map((p) => {
            const d = cv[p];
            const { Icon } = getKategori(p);
            return (
              <div key={p} className="persona-malam" data-kosong={!d.ada || undefined}>
                <div className="flex items-center gap-2"><span className="ubin-ikon size-9"><Icon size={24} /></span>{d.ada ? <span key={d.ada} className="stempel font-bold">CV {d.ada}</span> : <span className="text-abu">{p === "las" ? "Persona pertama" : "Persona kedua"}</span>}</div>
                <dl className="mt-2 grid gap-1 text-sm">
                  <div className="baris-cv"><dt className="text-abu">Pengalaman</dt><dd>{d.pengalaman ? <span key={d.pengalaman} className="stempel">{d.pengalaman}</span> : <span className="titik-tunggu" />}</dd></div>
                  <div className="baris-cv"><dt className="text-abu">Waktu</dt><dd>{d.waktu ? <span key={d.waktu} className="stempel">{d.waktu}</span> : <span className="titik-tunggu" />}</dd></div>
                </dl>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
