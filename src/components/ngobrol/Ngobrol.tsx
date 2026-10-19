"use client";

/*
 * Ngobrol (ADR 0009): one conversation, two ways to have it.
 * - Suara: Alice's night town with the lentera in the middle, for talking.
 * - Teks: a light, readable thread with a composer, for reading and tapping.
 * The lentera is the same element in both (Motion layoutId): in text mode it shrinks into the mic
 * button of the composer, and tapping that grows it back. Spoken and typed turns land in the same
 * saved conversation, and past conversations open from the history drawer.
 */

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LayoutGroup } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { IconHistory, IconMicrophone, IconPencilPlus, IconX } from "../icons/tabler";
import { LOKASI_KERJA } from "../kota/KotaIsometrik";
import { aturArah } from "../app/Halaman";
import { keluarNgobrol, ngobrolSiap } from "../app/transisiNgobrol";
import { Dialog } from "../lapis/Dialog";
import { DaftarObrolan } from "./DaftarObrolan";
import { PanggungSuara } from "./PanggungSuara";
import { Penyusun, Utas } from "./Utas";
import { BATAS_DETIK, useSuara } from "./useSuara";
import { kategoriDari } from "@/lib/api/adaptor";
import { kirimPesan, muatObrolan, type BagianPesan, type HasilAlat, type Pesan } from "@/lib/api/obrolan";
import { useSesi } from "@/lib/api/sesi";
import { ambilTitipan, PERISTIWA_TITIPAN } from "@/lib/titipNgobrol";
import { bacaPertanyaan, type LowonganApi, type PertanyaanAgen } from "@/lib/api/tipe";
import "./ngobrol.css";
import "./obrolan.css";
import { PenyediaLaci } from "./LaciNgobrol";

type Mode = "suara" | "teks";
type Tempat = keyof typeof LOKASI_KERJA;

const TEMPAT_KATEGORI: Partial<Record<string, Tempat>> = { dapur: "warung", toko: "warung", las: "bengkel", bengkel: "bengkel", laundry: "laundry", bersih: "laundry", bangunan: "bangunan", angkut: "bangunan" };
const SARAN = {
  pencari: ["Cari kerja dekat rumahku", "Aku mau cerita pengalaman kerjaku", "Bagaimana lamaranku?", "Bagikan Kartu Kerjaku"],
  pemberi: ["Aku butuh orang untuk usahaku", "Siapa saja yang melamar?", "Butuh orang hari ini", "Lihat lowonganku"],
};

const KUNCI_OBROLAN = "lokerin-obrolan";
const baca = (kunci: string) => {
  try {
    return localStorage.getItem(kunci);
  } catch {
    return null;
  }
};
const simpan = (kunci: string, nilai: string) => {
  try {
    localStorage.setItem(kunci, nilai);
  } catch {}
};
const tanpaLangganan = () => () => {};

/** The question tanya_pengguna is waiting on: the last thing the agent did, not yet answered. */
function pertanyaanTerbuka(pesan: Pesan[]): PertanyaanAgen | null {
  const akhir = pesan.at(-1);
  if (akhir?.peran !== "ai") return null;
  const alat = [...akhir.bagian].reverse().find((b) => b.jenis === "alat");
  return alat?.jenis === "alat" && alat.hasil ? bacaPertanyaan(alat.hasil) : null;
}

/**
 * The cards of the agent's latest answer that had any, newest version of each (a CV revised twice
 * shows once). On the voice stage these sit under the caption, so the buttons the voice talks about
 * (Kirim Lamaran, Simpan, Terbitkan) are there to tap during the call.
 */
function kartuTerbaru(pesan: Pesan[]): HasilAlat[] {
  for (let i = pesan.length - 1; i >= 0; i--) {
    const p = pesan[i]!;
    if (p.peran !== "ai") continue;
    const hasil = p.bagian.flatMap((b) => (b.jenis === "alat" && b.status === "selesai" && b.hasil?.widget && b.hasil.widget !== "pertanyaan" ? [b.hasil] : []));
    if (!hasil.length) continue;
    const terakhir = new Map<string, HasilAlat>();
    hasil.forEach((h, n) => terakhir.set(typeof h.id === "string" ? `${h.widget}:${h.id}` : `${h.widget}:${n}`, h));
    return [...terakhir.values()];
  }
  return [];
}

export function Ngobrol() {
  const router = useRouter();
  const { pengguna, siap } = useSesi();
  const layar = useRef<HTMLDivElement>(null);

  // Always opens on the voice stage (the orb in the nav leads here); the mode is not remembered,
  // because a remembered "teks" is only known after hydration and would flash the stage first.
  const [mode, setMode] = useState<Mode>("suara");
  const idTersimpan = useSyncExternalStore(tanpaLangganan, () => baca(KUNCI_OBROLAN) ?? "utama", () => "utama");
  const [idPilihan, setIdPilihan] = useState<string | null>(null);
  // Each conversation has its own address, /app/ngobrol/<id>. Conversations are stored per account
  // on the server, so the address only ever opens your own; /app/ngobrol opens the last one.
  const params = useParams<{ id?: string }>();
  const idUrl = typeof params?.id === "string" ? decodeURIComponent(params.id) : null;
  const obrolanId = idPilihan ?? idUrl ?? idTersimpan;
  const [asing, setAsing] = useState(false);

  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [judul, setJudul] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");
  const [riwayat, setRiwayat] = useState(false);
  const [tanyaMic, setTanyaMic] = useState(false);
  // The Dialog calls onTutup after "Izinkan mikrofon" too; only "Ketik saja" should switch to text.
  const micDiizinkan = useRef(false);
  // Where the thread stood when the current call began: the voice stage shows cards from then on.
  const [awalKartu, setAwalKartu] = useState<number | null>(null);
  const [fokus, setFokus] = useState(0);
  const kendali = useRef<AbortController | null>(null);
  // A message handed over from another screen (lib/titipNgobrol) waits here until the conversation
  // it goes to has loaded, so loading the history cannot replace the bubble it adds.
  const tertunda = useRef<{ teks: string; konteks: string } | null>(null);
  const dimuat = useRef<string | null>(null);

  useLayoutEffect(() => {
    ngobrolSiap(layar.current);
  }, []);

  // Load the conversation whenever the person or the conversation changes.
  const akun = pengguna?.id;
  useEffect(() => {
    if (!akun) return;
    const k = new AbortController();
    dimuat.current = null;
    muatObrolan(obrolanId, k.signal)
      .then((h) => {
        setPesan(h.pesan);
        dimuat.current = obrolanId;
        kirimTertunda();
        if (h.judul) setJudul((j) => j || h.judul!);
        // A link to a conversation that is not in this account says so instead of quietly showing
        // an empty chat. A new conversation of your own is the one remembered on this phone.
        const milikSendiri = h.ada || obrolanId === baca(KUNCI_OBROLAN);
        setAsing(!milikSendiri);
        if (milikSendiri) simpan(KUNCI_OBROLAN, obrolanId);
      })
      .catch(() => {});
    return () => k.abort();
  }, [akun, obrolanId]);

  // The address follows the open conversation, without reloading the screen.
  useEffect(() => {
    const tujuan = `/app/ngobrol/${encodeURIComponent(obrolanId)}`;
    if (window.location.pathname !== tujuan) window.history.replaceState(null, "", tujuan);
  }, [obrolanId]);

  function gantiMode(baru: Mode) {
    setMode(baru);
    if (baru === "teks") setFokus((f) => f + 1);
  }

  function gantiObrolan(id: string, judulBaru = "") {
    kendali.current?.abort();
    void suara.akhiri();
    setIdPilihan(id);
    simpan(KUNCI_OBROLAN, id);
    setAsing(false);
    setPesan([]);
    setAwalKartu(null);
    setJudul(judulBaru);
    setSibuk(false);
    setRiwayat(false);
  }

  // --- Text ---

  /** `konteks` goes to the agent after the text but is not shown in the bubble. */
  async function kirim(teks: string, konteks = "") {
    if (!konteks && suara.status === "hidup" && suara.kirimTeks(teks)) {
      tambahTranskrip("kamu", teks, true);
      return;
    }
    kendali.current?.abort();
    const k = new AbortController();
    kendali.current = k;
    const idAi = `ai-${crypto.randomUUID()}`;
    setAsing(false);
    simpan(KUNCI_OBROLAN, obrolanId);
    if (!pesan.length && !judul) setJudul(teks.length > 44 ? `${teks.slice(0, 44).replace(/\s+\S*$/, "")}…` : teks);
    setPesan((p) => [...p, { id: `kamu-${crypto.randomUUID()}`, peran: "kamu", bagian: [{ jenis: "teks", teks }] }]);
    setSibuk(true);
    setGalat("");
    try {
      await kirimPesan(obrolanId, konteks ? `${teks}\n\n${konteks}` : teks, {
        signal: k.signal,
        onBagian: (bagian: BagianPesan[]) =>
          setPesan((p) => (p.at(-1)?.id === idAi ? [...p.slice(0, -1), { id: idAi, peran: "ai", bagian }] : [...p, { id: idAi, peran: "ai", bagian }])),
      });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setGalat("Belum tersambung ke asisten. Coba lagi sebentar.");
    } finally {
      if (kendali.current === k) setSibuk(false);
    }
  }

  // --- Voice ---

  function tambahTranskrip(siapa: "kamu" | "ai", potongan: string, baru = false) {
    setPesan((p) => {
      const akhir = p.at(-1);
      const sambung = !baru && akhir?.peran === siapa && akhir.suara && akhir.bagian.at(-1)?.jenis === "teks";
      if (sambung) {
        const bagian = [...akhir.bagian];
        const t = bagian.at(-1) as { jenis: "teks"; teks: string };
        bagian[bagian.length - 1] = { jenis: "teks", teks: t.teks + potongan };
        return [...p.slice(0, -1), { ...akhir, bagian }];
      }
      return [...p, { id: `${siapa}-suara-${crypto.randomUUID()}`, peran: siapa, suara: true, bagian: [{ jenis: "teks", teks: potongan }] }];
    });
  }

  function tambahHasil(alat: string, hasil: HasilAlat) {
    setPesan((p) => {
      const bagian: BagianPesan = { jenis: "alat", id: `suara-${crypto.randomUUID()}`, nama: alat, status: "selesai", hasil };
      const akhir = p.at(-1);
      if (akhir?.peran === "ai") return [...p.slice(0, -1), { ...akhir, bagian: [...akhir.bagian, bagian] }];
      return [...p, { id: `ai-suara-${crypto.randomUUID()}`, peran: "ai", suara: true, bagian: [bagian] }];
    });
  }

  const suara = useSuara({ obrolanId, aktif: Boolean(pengguna), onTranskrip: (s, t) => tambahTranskrip(s, t), onHasil: tambahHasil });

  function kirimTertunda() {
    const t = tertunda.current;
    if (!t) return;
    tertunda.current = null;
    void kirimTerbaru.current(t.teks, t.konteks);
  }

  /** A handed-over message: switch to text, then send it in a new or the open conversation. */
  function terimaTitipan() {
    const t = ambilTitipan();
    if (!t) return;
    void suara.akhiri();
    gantiMode("teks");
    tertunda.current = { teks: t.teks, konteks: t.konteks };
    if (t.baru) gantiObrolan(`cv-${crypto.randomUUID().slice(0, 8)}`);
    else if (dimuat.current === obrolanId) kirimTertunda();
  }

  function tekanLentera() {
    if (suara.status === "hidup") void suara.akhiri();
    else {
      micDiizinkan.current = false;
      setTanyaMic(true);
    }
  }

  function tutup() {
    void suara.akhiri();
    aturArah("kiri");
    keluarNgobrol(layar.current, () => router.push("/app"));
  }

  // Stable handlers for the memoized thread; they always call the latest kirim.
  const kirimTerbaru = useRef(kirim);
  const terimaTitipanTerbaru = useRef(terimaTitipan);
  useLayoutEffect(() => {
    kirimTerbaru.current = kirim;
    terimaTitipanTerbaru.current = terimaTitipan;
  });
  // Each time Ngobrol comes on screen, and while it is open, take a message handed over to it.
  useEffect(() => {
    const terima = () => terimaTitipanTerbaru.current();
    const t = window.setTimeout(terima, 0);
    window.addEventListener(PERISTIWA_TITIPAN, terima);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(PERISTIWA_TITIPAN, terima);
    };
  }, []);
  const kirimStabil = useCallback((t: string) => void kirimTerbaru.current(t), []);

  // --- Derived ---

  const pertanyaan = pertanyaanTerbuka(pesan);
  const kartuPanggung = awalKartu === null ? [] : kartuTerbaru(pesan.slice(awalKartu));
  const hasilSemua = pesan.flatMap((p) => p.bagian.flatMap((b) => (b.jenis === "alat" && b.status === "selesai" && b.hasil?.widget && b.hasil.widget !== "pertanyaan" ? [b.hasil] : [])));
  const daftarTerakhir = [...hasilSemua].reverse().find((h) => h.widget === "daftar_lowongan");
  const nyala = [
    ...new Set(((daftarTerakhir?.hasil as LowonganApi[] | undefined) ?? []).map((l) => TEMPAT_KATEGORI[kategoriDari(l)]).filter((t): t is Tempat => Boolean(t))),
  ];
  // The voice stage captions only what was said in a call; a typed thread stays in text mode.
  const kalimatTerakhir = [...pesan].reverse().find((p) => p.suara && p.bagian.some((b) => b.jenis === "teks"));
  const kalimat = kalimatTerakhir ? { siapa: kalimatTerakhir.peran, teks: kalimatTerakhir.bagian.flatMap((b) => (b.jenis === "teks" ? [b.teks] : [])).join(" ") } : null;
  const peran = pengguna?.peran === "pemberi" ? "pemberi" : "pencari";
  const sapaan = peran === "pemberi" ? "Ceritakan siapa yang kamu cari, misalnya “butuh tukang masak, 90 ribu sehari”." : "Ceritakan kerjamu atau kerja yang kamu cari.";

  if (siap && !pengguna) {
    return (
      <div className="ngobrol-layar grid place-items-center p-6 text-center" data-status="siap">
        <div className="grid max-w-sm gap-4 text-white">
          <p className="text-2xl font-extrabold">Masuk dulu untuk ngobrol</p>
          <Link href="/masuk" className="tombol tombol-utama min-h-14 text-lg">Masuk</Link>
          <Link href="/app" className="text-white/70 underline">Kembali</Link>
        </div>
      </div>
    );
  }

  return (
    <PenyediaLaci>
    <div ref={layar} className="ngobrol-akar" data-mode={mode}>
      <div className="ngobrol-malam" aria-hidden="true" />
      <LayoutGroup id="ngobrol">
        <header className="ngobrol-kepala">
          <button type="button" onClick={tutup} className="ngobrol-tombol-kepala" aria-label="Tutup dan kembali ke beranda"><IconX size={22} /></button>
          <p className="ngobrol-judul">{mode === "teks" ? judul || (pesan.length ? "Obrolan" : "Obrolan baru") : "Ngobrol"}</p>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setRiwayat(true)} className="ngobrol-tombol-kepala" aria-label="Obrolanmu"><IconHistory size={22} /></button>
            <button type="button" onClick={() => gantiObrolan(crypto.randomUUID())} className="ngobrol-tombol-kepala" aria-label="Obrolan baru"><IconPencilPlus size={22} /></button>
          </div>
        </header>

        {/* Both layers stay mounted so switching is instant (the night town is a large SVG);
            only the lentera moves between them. */}
        {asing && (
          <p className="ngobrol-catatan" role="status">
            Obrolan ini tidak ada di akunmu. Yang kamu tulis di sini jadi obrolan baru milikmu.
          </p>
        )}
        <div className="ngobrol-tumpuk">
          <section className="ngobrol-lapis" data-aktif={mode === "suara" || undefined} inert={mode !== "suara"} aria-label="Ngobrol pakai suara">
            <PanggungSuara
              status={suara.status}
              detik={suara.detik}
              batas={BATAS_DETIK}
              tugas={suara.tugas}
              galat={suara.galat || galat}
              kalimat={kalimat}
              nyala={nyala}
              jumlahHasil={hasilSemua.length}
              kartu={kartuPanggung}
              pertanyaan={pertanyaan}
              sapaan={sapaan}
              onLentera={tekanLentera}
              onKetik={() => gantiMode("teks")}
              onLihatHasil={() => gantiMode("teks")}
              onJawab={(t) => void kirim(t)}
              adaLentera={mode === "suara"}
              teksObrolan={pesan.flatMap((p) => p.bagian.flatMap((b) => (b.jenis === "teks" ? [b.teks] : [])))}
              pemberi={peran === "pemberi"}
              onMulai={(k) => {
                gantiMode("teks");
                void kirim(k);
              }}
            />
          </section>
          <section className="ngobrol-lapis ngobrol-teks" data-aktif={mode === "teks" || undefined} inert={mode !== "teks"} aria-label="Ngobrol pakai teks">
            <Utas pesan={pesan} sibuk={sibuk} pertanyaan={pertanyaan} saran={SARAN[peran]} onKirim={kirimStabil} />
            {(galat || suara.galat) && <p role="alert" className="ngobrol-galat">{galat || suara.galat}</p>}
            {suara.status === "hidup" && (
              <button type="button" className="pita-suara" onClick={() => gantiMode("suara")}>
                <IconMicrophone size={18} />Panggilan suara berjalan · kembali
              </button>
            )}
            <Penyusun onKirim={(t) => void kirim(t)} onSuara={() => gantiMode("suara")} sibuk={sibuk} fokus={fokus} adaLentera={mode === "teks"} />
          </section>
        </div>
      </LayoutGroup>

      <DaftarObrolan
        buka={riwayat}
        onTutup={() => setRiwayat(false)}
        aktifId={obrolanId}
        onPilih={(o) => {
          gantiObrolan(o.id, o.judul);
          gantiMode("teks");
        }}
        onBaru={() => gantiObrolan(crypto.randomUUID())}
      />

      <Dialog
        buka={tanyaMic}
        onTutup={() => {
          setTanyaMic(false);
          if (!micDiizinkan.current) gantiMode("teks");
        }}
        judul="Ngobrol pakai suara?"
        labelYa="Izinkan mikrofon"
        labelBatal="Ketik saja"
        onYa={async () => {
          micDiizinkan.current = true;
          setTanyaMic(false);
          setAwalKartu(pesan.length);
          const ok = await suara.mulai();
          if (!ok) gantiMode("teks");
        }}
        ikon={<span className="grid size-12 place-items-center rounded-full bg-jingga-muda text-jingga-tua"><IconMicrophone size={24} /></span>}
      >
        Browser akan meminta izin mikrofon. Suaramu tidak disimpan; yang tersimpan hanya hasilnya, misalnya lowongan yang kamu cari.
      </Dialog>
    </div>
    </PenyediaLaci>
  );
}
