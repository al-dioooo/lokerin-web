"use client";

// Conversations with the agent (ADR 0009): the list, history, and streaming one turn. A turn is kept
// as ordered parts, text and tool calls, so cards show up in the thread where the agent made them.

import { api, API_URL, bacaToken } from "./klien";

export type HasilAlat = { widget?: string } & Record<string, unknown>;
export type BagianPesan =
  | { jenis: "teks"; teks: string }
  | { jenis: "alat"; id: string; nama: string; status: "jalan" | "selesai" | "galat"; hasil?: HasilAlat };
export type Pesan = { id: string; peran: "kamu" | "ai"; bagian: BagianPesan[]; suara?: boolean };
export type RingkasObrolan = { id: string; judul: string; diperbarui_pada: string };

/** What a running tool is doing, in words a first-time user understands. */
export const LABEL_ALAT: Record<string, string> = {
  cari_lowongan: "Mencari lowongan",
  detail_lowongan: "Membuka lowongan",
  lihat_profil: "Membaca profilmu",
  usulkan_fakta: "Mencatat pengalamanmu",
  simpan_persona: "Mencatat kerja yang kamu bisa",
  siapkan_cv_khusus: "Menyusun CV lamaran",
  ubah_cv_khusus: "Mengubah CV lamaran",
  siapkan_lamaran: "Menyiapkan lamaran",
  status_lamaran: "Melihat lamaranmu",
  kartu_kerja: "Membuat Kartu Kerja",
  siapkan_laporan: "Menyiapkan laporan",
  lihat_kabar: "Membuka kabar",
  tanya_pengguna: "Menyiapkan pilihan",
  buat_draf_lowongan: "Menyusun draf lowongan",
  ubah_draf_lowongan: "Mengubah draf lowongan",
  lowongan_saya: "Membuka lowonganmu",
  lamaran_masuk: "Melihat pelamar",
  lihat_pelamar: "Membuka pelamar",
  siapkan_tahap: "Menyiapkan tahap berikutnya",
};

export const daftarObrolan = () => api<{ obrolan: RingkasObrolan[] }>("/chat/obrolan");
export const hapusObrolan = (id: string) => api(`/chat/obrolan/${encodeURIComponent(id)}`, { method: "DELETE" });

type BagianUi = { type: string; text?: string; toolCallId?: string; toolName?: string; state?: string; output?: unknown; errorText?: string };
type PesanUi = { id: string; role: "user" | "assistant" | "system"; parts: BagianUi[] };

function bagianDariUi(parts: BagianUi[]): BagianPesan[] {
  const hasil: BagianPesan[] = [];
  parts.forEach((p, i) => {
    if (p.type === "text" && p.text?.trim()) {
      const akhir = hasil.at(-1);
      if (akhir?.jenis === "teks") akhir.teks += p.text;
      else hasil.push({ jenis: "teks", teks: p.text });
      return;
    }
    const nama = p.type.startsWith("tool-") ? p.type.slice(5) : p.type === "dynamic-tool" ? p.toolName : null;
    if (!nama) return;
    const status = p.state === "output-available" ? "selesai" : p.state === "output-error" ? "galat" : "jalan";
    hasil.push({ jenis: "alat", id: p.toolCallId ?? `alat-${i}`, nama, status, hasil: p.output as HasilAlat | undefined });
  });
  return hasil;
}

/**
 * One conversation from the server: its messages, its title, and whether it exists in this account
 * at all (a link to someone else's conversation opens an empty one of your own instead).
 */
export async function muatObrolan(id: string, signal?: AbortSignal): Promise<{ pesan: Pesan[]; ada: boolean; judul: string | null }> {
  const hasil = await api<{ messages: PesanUi[]; ada?: boolean; judul?: string | null }>(`/chat/riwayat?id=${encodeURIComponent(id)}`, { signal });
  return { pesan: susunPesan(hasil.messages), ada: hasil.ada ?? hasil.messages.length > 0, judul: hasil.judul ?? null };
}

/** History from the server. Saved turns can repeat a message id, so ids here get their position added. */
export async function muatRiwayat(id: string, signal?: AbortSignal): Promise<Pesan[]> {
  return (await muatObrolan(id, signal)).pesan;
}

function susunPesan(messages: PesanUi[]): Pesan[] {
  const pesan: Pesan[] = [];
  messages.forEach((m, i) => {
    if (m.role === "system") return;
    const peran = m.role === "user" ? "kamu" : "ai";
    const bagian = bagianDariUi(m.parts ?? []);
    if (!bagian.length) return;
    const akhir = pesan.at(-1);
    // One reply can be saved as several assistant messages (one per step); show it as one.
    if (akhir && akhir.peran === "ai" && peran === "ai") akhir.bagian.push(...bagian);
    else pesan.push({ id: `${m.id}-${i}`, peran, bagian });
  });
  return pesan;
}

/**
 * Sends one message and streams the reply (AI SDK v7 UI message stream). `onBagian` receives the
 * reply's parts so far, in order, every time something arrives.
 */
export async function kirimPesan(id: string, teks: string, { signal, onBagian }: { signal?: AbortSignal; onBagian: (bagian: BagianPesan[]) => void }) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", authorization: `Bearer ${bacaToken() ?? ""}` },
    body: JSON.stringify({ id, messages: [{ id: crypto.randomUUID(), role: "user", parts: [{ type: "text", text: teks }] }] }),
  });
  if (!res.ok || !res.body) throw new Error("Asisten belum tersambung.");
  let bagian: BagianPesan[] = [];
  let galat = "";
  const ubahAlat = (alatId: string, ubah: (b: Extract<BagianPesan, { jenis: "alat" }>) => BagianPesan) => {
    bagian = bagian.map((b) => (b.jenis === "alat" && b.id === alatId ? ubah(b) : b));
  };
  const pembaca = res.body.getReader();
  const dekoder = new TextDecoder();
  let sisa = "";
  for (;;) {
    const { value, done } = await pembaca.read();
    if (done) break;
    sisa += dekoder.decode(value, { stream: true });
    const baris = sisa.split("\n");
    sisa = baris.pop() ?? "";
    let berubah = false;
    for (const b of baris) {
      if (!b.startsWith("data: ") || b === "data: [DONE]") continue;
      let c: { type: string; delta?: string; toolCallId?: string; toolName?: string; output?: unknown; errorText?: string };
      try {
        c = JSON.parse(b.slice(6));
      } catch {
        continue;
      }
      if (c.type === "text-delta" && c.delta) {
        const akhir = bagian.at(-1);
        bagian = akhir?.jenis === "teks" ? [...bagian.slice(0, -1), { jenis: "teks", teks: akhir.teks + c.delta }] : [...bagian, { jenis: "teks", teks: c.delta }];
        berubah = true;
      } else if ((c.type === "tool-input-start" || c.type === "tool-input-available") && c.toolCallId && c.toolName) {
        if (!bagian.some((x) => x.jenis === "alat" && x.id === c.toolCallId)) {
          bagian = [...bagian, { jenis: "alat", id: c.toolCallId, nama: c.toolName, status: "jalan" }];
          berubah = true;
        }
      } else if (c.type === "tool-output-available" && c.toolCallId) {
        ubahAlat(c.toolCallId, (x) => ({ ...x, status: "selesai", hasil: c.output as HasilAlat }));
        berubah = true;
      } else if (c.type === "tool-output-error" && c.toolCallId) {
        ubahAlat(c.toolCallId, (x) => ({ ...x, status: "galat" }));
        berubah = true;
      } else if (c.type === "error") {
        galat = c.errorText ?? "Asisten sedang bermasalah.";
      }
    }
    if (berubah) onBagian(bagian);
  }
  if (galat && !bagian.length) throw new Error(galat);
  return bagian;
}

/** "Hari ini", "Kemarin", "7 hari terakhir", or the month, for grouping the conversation list. */
export function kelompokWaktu(iso: string, sekarang = new Date()) {
  const d = new Date(iso);
  const awal = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const hari = Math.round((awal(sekarang) - awal(d)) / 86_400_000);
  if (hari <= 0) return "Hari ini";
  if (hari === 1) return "Kemarin";
  if (hari < 7) return "7 hari terakhir";
  return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(d);
}
