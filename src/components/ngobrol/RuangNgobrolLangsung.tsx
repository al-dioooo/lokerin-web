"use client";

/*
 * Live Ngobrol on top of Alice's night-town call screen: the lentera starts a real gpt-live-1 call,
 * the keyboard talks to the same agent over /chat, and every result lands as a card in the panel.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { IconKeyboard, IconMicrophone, IconPlayerStop, IconSend, IconX } from "../icons/tabler";
import { KOTAK_PANDANG, KotaIsometrik, LOKASI_KERJA } from "../kota/KotaIsometrik";
import { aturArah } from "../app/Halaman";
import { keluarNgobrol, ngobrolSiap } from "../app/transisiNgobrol";
import { Dialog } from "../lapis/Dialog";
import { JUDUL_WIDGET, WidgetAgen } from "./WidgetAgen";
import { kategoriDari } from "@/lib/api/adaptor";
import { api, API_URL, bacaToken, GalatApi } from "@/lib/api/klien";
import { useLangsung } from "@/lib/api/hooks";
import { useSesi } from "@/lib/api/sesi";
import type { LowonganApi } from "@/lib/api/tipe";
import "./ngobrol.css";

type Tempat = keyof typeof LOKASI_KERJA;
type Kalimat = { siapa: "ai" | "kamu"; teks: string; kunci: string };
type Kartu = { kunci: string; hasil: { widget?: string } & Record<string, unknown> };
type PesanRiwayat = { id: string; role: "user" | "assistant" | "system"; parts: { type: string; text?: string; state?: string; output?: unknown }[] };

const TEMPAT_KATEGORI: Partial<Record<string, Tempat>> = { dapur: "warung", toko: "warung", las: "bengkel", bengkel: "bengkel", laundry: "laundry", bersih: "laundry", bangunan: "bangunan", angkut: "bangunan" };
const BATAS_DETIK = 300;

/** The stage reads like speech, so drop the markdown the model sometimes adds. */
function polos(teks: string) {
  return teks.replace(/\*\*|__|`/g, "").replace(/^#+\s*/gm, "").replace(/^\s*[-*]\s+/gm, "• ");
}

export function RuangNgobrolLangsung() {
  const router = useRouter();
  const { pengguna, siap } = useSesi();
  const layar = useRef<HTMLDivElement>(null);
  const teksRef = useRef<HTMLDivElement>(null);
  const [kalimat, setKalimat] = useState<Kalimat[]>([]);
  const [kartu, setKartu] = useState<Kartu[]>([]);
  const [nyala, setNyala] = useState<Tempat[]>([]);
  const [ketik, setKetik] = useState(false);
  const [teks, setTeks] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [panelBuka, setPanelBuka] = useState(false);
  const [belumDilihat, setBelumDilihat] = useState(0);
  const [tanyaMic, setTanyaMic] = useState(false);
  const [suara, setSuara] = useState<"mati" | "menyambung" | "hidup">("mati");
  const [detik, setDetik] = useState(0);
  const [galat, setGalat] = useState("");
  const panggilan = useRef<{ pc: RTCPeerConnection; mic: MediaStream; id: string; audio: HTMLAudioElement } | null>(null);

  useLayoutEffect(() => {
    ngobrolSiap();
  }, []);

  useEffect(() => {
    if (suara !== "hidup") return;
    const t = window.setInterval(() => setDetik((d) => d + 1), 1000);
    return () => window.clearInterval(t);
  }, [suara]);

  useEffect(() => () => void akhiriSuara(), []);

  function nyalakan(hasil: Kartu["hasil"]) {
    if (hasil.widget !== "daftar_lowongan") return;
    const tempat = ((hasil.hasil as LowonganApi[]) ?? [])
      .map((l) => TEMPAT_KATEGORI[kategoriDari(l)])
      .filter((t): t is Tempat => Boolean(t));
    setNyala([...new Set(tempat)]);
  }

  function tambahKartu(hasil: Kartu["hasil"]) {
    if (!hasil?.widget) return;
    setKartu((k) => [{ kunci: `${Date.now()}-${k.length}`, hasil }, ...k].slice(0, 12));
    // On a phone the open panel would cover the conversation, so new results only announce themselves.
    setBelumDilihat((n) => n + 1);
    nyalakan(hasil);
  }

  // The server keeps the conversation, so a reload picks up where it left off instead of starting blank.
  const akun = pengguna?.id;
  useEffect(() => {
    if (!akun) return;
    const kendali = new AbortController();
    api<{ messages: PesanRiwayat[] }>("/chat/riwayat?id=utama", { signal: kendali.signal })
      .then(({ messages }) => {
        const lama: Kalimat[] = [];
        const hasilLama: Kartu[] = [];
        for (const m of messages) {
          if (m.role === "system") continue;
          const teks = m.parts.filter((p) => p.type === "text" && p.text).map((p) => p.text).join("\n\n").trim();
          if (teks) lama.push({ siapa: m.role === "user" ? "kamu" : "ai", teks, kunci: `riwayat-${m.id}` });
          m.parts.forEach((p, i) => {
            const hasil = p.output as Kartu["hasil"] | undefined;
            if (p.type.startsWith("tool-") && p.state === "output-available" && hasil?.widget) hasilLama.push({ kunci: `riwayat-${m.id}-${i}`, hasil });
          });
        }
        if (!lama.length && !hasilLama.length) return;
        // Anything said since the page opened stays after the history.
        setKalimat((k) => [...lama, ...k].slice(-30));
        setKartu((k) => [...k, ...hasilLama.reverse()].slice(0, 12));
        const terakhir = hasilLama.find((k) => k.hasil.widget === "daftar_lowongan");
        if (terakhir) nyalakan(terakhir.hasil);
      })
      .catch(() => {});
    return () => kendali.abort();
  }, [akun]);

  function tambahKalimat(siapa: Kalimat["siapa"], potongan: string, baru = false) {
    setKalimat((k) => {
      const akhir = k.at(-1);
      if (!baru && akhir && akhir.siapa === siapa) return [...k.slice(0, -1), { ...akhir, teks: akhir.teks + potongan }];
      return [...k, { siapa, teks: potongan, kunci: `${siapa}-${k.length}` }].slice(-30);
    });
  }

  useLangsung(null, (p) => {
    const data = p.data as Record<string, unknown>;
    if (p.type === "suara.transkrip") tambahKalimat(data.peran === "pengguna" ? "kamu" : "ai", String(data.teks ?? ""));
    if (p.type === "suara.widget") tambahKartu(data.hasil as Kartu["hasil"]);
    if (p.type === "suara.selesai") void akhiriSuara(false);
    if (p.type === "suara.peringatan") setGalat(String(data.pesan ?? ""));
  }, { aktif: Boolean(pengguna) });

  async function mulaiSuara() {
    setGalat("");
    setSuara("menyambung");
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const pc = new RTCPeerConnection();
      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0] ?? null;
      };
      mic.getTracks().forEach((t) => pc.addTrack(t, mic));
      pc.createDataChannel("oai-events");
      await pc.setLocalDescription(await pc.createOffer());
      const jawab = await api<{ session_id: string; sdp: string }>("/suara/sesi", { method: "POST", body: { sdp: pc.localDescription!.sdp, thread_id: "utama" } });
      await pc.setRemoteDescription({ type: "answer", sdp: jawab.sdp });
      panggilan.current = { pc, mic, id: jawab.session_id, audio };
      setDetik(0);
      setSuara("hidup");
    } catch (e) {
      setSuara("mati");
      setGalat(e instanceof GalatApi ? e.message : "Mikrofon belum bisa dipakai. Kamu tetap bisa mengetik.");
      setKetik(true);
    }
  }

  async function akhiriSuara(kabari = true) {
    const p = panggilan.current;
    panggilan.current = null;
    if (!p) return;
    p.mic.getTracks().forEach((t) => t.stop());
    p.pc.close();
    p.audio.srcObject = null;
    setSuara("mati");
    if (kabari) await api(`/suara/sesi/${encodeURIComponent(p.id)}`, { method: "DELETE" }).catch(() => {});
  }

  useEffect(() => {
    if (detik >= BATAS_DETIK) void akhiriSuara();
  }, [detik]);

  async function kirimTeks(e: React.FormEvent) {
    e.preventDefault();
    const isi = teks.trim();
    if (!isi || sibuk) return;
    setTeks("");
    setGalat("");
    setSibuk(true);
    tambahKalimat("kamu", isi, true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${bacaToken() ?? ""}` },
        body: JSON.stringify({ id: "utama", messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: isi }] }] }),
      });
      if (!res.ok || !res.body) throw new Error("chat");
      const pembaca = res.body.getReader();
      const dekoder = new TextDecoder();
      let sisa = "";
      let mulaiAi = true;
      for (;;) {
        const { value, done } = await pembaca.read();
        if (done) break;
        sisa += dekoder.decode(value, { stream: true });
        const baris = sisa.split("\n");
        sisa = baris.pop() ?? "";
        for (const b of baris) {
          if (!b.startsWith("data: ") || b === "data: [DONE]") continue;
          const c = JSON.parse(b.slice(6)) as { type: string; delta?: string; output?: Kartu["hasil"]; errorText?: string };
          if (c.type === "text-delta" && c.delta) {
            tambahKalimat("ai", c.delta, mulaiAi);
            mulaiAi = false;
          } else if (c.type === "tool-output-available" && c.output) {
            tambahKartu(c.output);
          } else if (c.type === "error") {
            setGalat(c.errorText ?? "Asisten sedang bermasalah.");
          }
        }
      }
    } catch {
      setGalat("Belum tersambung ke asisten. Coba lagi sebentar.");
    } finally {
      setSibuk(false);
    }
  }

  // A new line starts reading from its top; the block scrolls only within itself.
  const kunciSekarang = kalimat.at(-1)?.kunci;
  useEffect(() => {
    teksRef.current?.scrollTo({ top: 0 });
  }, [kunciSekarang]);

  function tutup() {
    void akhiriSuara();
    aturArah("kiri");
    keluarNgobrol(layar.current, () => router.push("/app"));
  }

  const sekarang = kalimat.at(-1);
  const sebelumnya = kalimat.at(-2);
  const jam = `${String(Math.floor(detik / 60)).padStart(2, "0")}:${String(detik % 60).padStart(2, "0")}`;
  const status = suara === "hidup" ? "jalan" : "siap";
  const sapaan = pengguna?.peran === "pemberi" ? "Ceritakan siapa yang kamu cari, misalnya “butuh tukang masak, 90 ribu sehari”." : "Ketuk lentera, lalu ceritakan kerjamu atau kerja yang kamu cari.";

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
    <div ref={layar} className="ngobrol-layar" data-status={status} data-langsung="">
      <div className="ngobrol-kota" aria-hidden="true">
        <div className="ngobrol-kota-isi" style={{ aspectRatio: `${KOTAK_PANDANG.w} / ${KOTAK_PANDANG.h}` }}>
          <KotaIsometrik className="kota-malam absolute inset-0 h-full w-full" nyala={nyala} judul="" />
        </div>
      </div>

      <header className="ngobrol-atas">
        <button type="button" onClick={tutup} className="ngobrol-tombol-bulat" aria-label="Tutup dan kembali ke beranda"><IconX size={20} /></button>
        <span className="piksel text-[11px] uppercase tracking-wide text-[#F9C08F]">{suara === "hidup" ? "Sedang ngobrol" : "Ngobrol"}</span>
        <span className="font-mono text-xs tabular-nums text-white/70" aria-label={`Durasi ${jam}, batas 5 menit`}>{jam} / 05:00</span>
      </header>

      <main className="ngobrol-panggung">
        <button
          type="button"
          onClick={() => (suara === "hidup" ? void akhiriSuara() : setTanyaMic(true))}
          disabled={suara === "menyambung"}
          className="lentera"
          aria-label={suara === "hidup" ? "Akhiri panggilan suara" : "Mulai ngobrol dengan suara"}
        >
          <span className="lentera-cincin" aria-hidden="true" />
          <span className="lentera-cincin lentera-cincin-2" aria-hidden="true" />
          <span className="lentera-inti">{suara === "hidup" ? <IconPlayerStop size={34} /> : <IconMicrophone size={38} stroke={2} />}</span>
        </button>
        <span className="gelombang-malam" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</span>

        <div ref={teksRef} className="teks-berjalan" data-langsung="" aria-hidden="true">
          {sebelumnya && <p key={`s-${sebelumnya.kunci}`} className="teks-lama">{polos(sebelumnya.teks)}</p>}
          {sekarang ? (
            <p key={sekarang.kunci} className="teks-baru" data-siapa={sekarang.siapa} data-panjang={sekarang.teks.length > 140 || undefined}><span className="piksel">{sekarang.siapa === "ai" ? "Lokerin" : "Kamu"}</span>{polos(sekarang.teks)}</p>
          ) : (
            <p className="teks-baru"><span className="piksel">Lokerin</span>{suara === "menyambung" ? "Menyambungkan..." : sapaan}</p>
          )}
        </div>
        <ol className="sr-only" aria-live="polite" aria-label="Isi obrolan">
          {kalimat.map((p) => <li key={p.kunci}>{p.siapa === "ai" ? "Lokerin" : "Kamu"}: {polos(p.teks)}</li>)}
        </ol>

        {galat && <p role="alert" className="mx-auto max-w-sm rounded-2xl bg-white/10 px-4 py-2 text-center text-sm text-white">{galat}</p>}

        <div className="ngobrol-kendali">
          <button type="button" className="ngobrol-tombol-bulat" onClick={() => { setKetik((v) => !v); setPanelBuka(false); }} aria-pressed={ketik} aria-label="Ketik pesan"><IconKeyboard size={20} /></button>
          <span className="text-xs text-white/70">{sibuk ? "Lokerin sedang menyiapkan..." : suara === "hidup" ? "Lokerin mendengarkan" : "Bicara atau ketik"}</span>
          <button type="button" className="ngobrol-tombol-bulat ngobrol-tombol-akhiri" onClick={tutup} aria-label="Akhiri dan tutup"><IconX size={20} /></button>
        </div>
        {ketik && (
          <form onSubmit={kirimTeks} className="ngobrol-ketik">
            <label htmlFor="ketik-langsung" className="sr-only">Ketik pesanmu</label>
            <input id="ketik-langsung" autoFocus value={teks} onChange={(e) => setTeks(e.target.value)} placeholder="Ketik di sini" disabled={sibuk} />
            <button type="submit" aria-label="Kirim" disabled={sibuk || !teks.trim()}><IconSend size={18} /></button>
          </form>
        )}
      </main>

      <aside className="kartu-tumbuh" data-terbuka={panelBuka || undefined} aria-label="Hasil dari obrolan">
        <button
          type="button"
          className="kartu-tumbuh-kepala"
          onClick={() => {
            setPanelBuka((v) => !v);
            setBelumDilihat(0);
          }}
          aria-expanded={panelBuka}
        >
          <span><span className="piksel block text-[10px] uppercase text-jingga-tua">Dari obrolan</span><span className="font-bold">{kartu.length ? `${kartu.length} hasil` : "Hasil muncul di sini"}</span></span>
          {kartu.length > 0 && (
            <span className="kartu-tumbuh-lihat">
              {!panelBuka && belumDilihat > 0 && <span className="titik-baru" aria-label={`${belumDilihat} baru`} />}
              {panelBuka ? "Tutup" : "Lihat"}
            </span>
          )}
        </button>
        <div className="kartu-tumbuh-isi gap-4">
          {kartu.map((k) => (
            <section key={k.kunci} className="grid gap-2">
              <h3 className="text-sm uppercase tracking-wide text-abu">{JUDUL_WIDGET[k.hasil.widget ?? ""] ?? "Hasil"}</h3>
              <WidgetAgen hasil={k.hasil} />
            </section>
          ))}
        </div>
      </aside>

      <Dialog
        buka={tanyaMic}
        onTutup={() => setTanyaMic(false)}
        judul="Ngobrol pakai suara?"
        labelYa="Izinkan mikrofon"
        labelBatal="Ketik saja"
        onYa={() => {
          void mulaiSuara();
        }}
        ikon={<span className="grid size-12 place-items-center rounded-full bg-jingga-muda text-jingga-tua"><IconMicrophone size={24} /></span>}
      >
        Browser akan meminta izin mikrofon. Suaramu tidak disimpan; yang tersimpan hanya hasilnya, misalnya Fakta yang kamu setujui. Panggilan berhenti sendiri setelah 5 menit.
      </Dialog>
    </div>
  );
}
