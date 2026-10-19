"use client";

// A gpt-live-1 voice call for one conversation: audio goes straight between the browser and OpenAI
// over WebRTC, and the backend joins the call to run the same agent as the text chat. Transcripts,
// task progress and result cards come back as live events (suara.*).

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { api, GalatApi } from "@/lib/api/klien";
import { useLangsung } from "@/lib/api/hooks";
import type { HasilAlat } from "@/lib/api/obrolan";

export const BATAS_DETIK = 300;

type Panggilan = { pc: RTCPeerConnection; mic: MediaStream; id: string; audio: HTMLAudioElement; dc: RTCDataChannel };
export type StatusSuara = "mati" | "menyambung" | "hidup";

export function useSuara({
  obrolanId,
  aktif,
  onTranskrip,
  onHasil,
}: {
  obrolanId: string;
  aktif: boolean;
  onTranskrip: (siapa: "kamu" | "ai", potongan: string) => void;
  onHasil: (alat: string, hasil: HasilAlat) => void;
}) {
  const panggilan = useRef<Panggilan | null>(null);
  const [status, setStatus] = useState<StatusSuara>("mati");
  const [detik, setDetik] = useState(0);
  const [tugas, setTugas] = useState("");
  const [galat, setGalat] = useState("");

  async function akhiri(kabari = true) {
    const p = panggilan.current;
    panggilan.current = null;
    if (!p) return;
    p.mic.getTracks().forEach((t) => t.stop());
    p.pc.close();
    p.audio.srcObject = null;
    setStatus("mati");
    setTugas("");
    if (kabari) await api(`/suara/sesi/${encodeURIComponent(p.id)}`, { method: "DELETE" }).catch(() => {});
  }

  async function mulai() {
    setGalat("");
    setStatus("menyambung");
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const pc = new RTCPeerConnection();
      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0] ?? null;
      };
      mic.getTracks().forEach((t) => pc.addTrack(t, mic));
      const dc = pc.createDataChannel("oai-events");
      await pc.setLocalDescription(await pc.createOffer());
      const jawab = await api<{ session_id: string; sdp: string }>("/suara/sesi", { method: "POST", body: { sdp: pc.localDescription!.sdp, thread_id: obrolanId } });
      await pc.setRemoteDescription({ type: "answer", sdp: jawab.sdp });
      panggilan.current = { pc, mic, id: jawab.session_id, audio, dc };
      setDetik(0);
      setStatus("hidup");
      return true;
    } catch (e) {
      setStatus("mati");
      setGalat(e instanceof GalatApi ? e.message : "Mikrofon belum bisa dipakai. Kamu tetap bisa mengetik.");
      return false;
    }
  }

  /** Sends typed or tapped words into the running call. Returns false when there is no call. */
  function kirimTeks(teks: string) {
    const dc = panggilan.current?.dc;
    if (dc?.readyState !== "open") return false;
    dc.send(JSON.stringify({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text: teks }] } }));
    dc.send(JSON.stringify({ type: "response.create" }));
    return true;
  }

  useEffect(() => {
    if (status !== "hidup") return;
    const t = window.setInterval(() => setDetik((d) => d + 1), 1000);
    return () => window.clearInterval(t);
  }, [status]);

  const selesai = useEffectEvent(() => void akhiri());
  useEffect(() => {
    if (detik >= BATAS_DETIK) selesai();
  }, [detik]);

  // Hang up when the screen goes away.
  const tutup = useEffectEvent(() => void akhiri());
  useEffect(() => () => tutup(), []);

  // useLangsung keeps the latest callback, so these always see the current conversation.
  useLangsung(null, (p) => {
    const data = p.data as Record<string, unknown>;
    if (p.type === "suara.transkrip") onTranskrip(data.peran === "pengguna" ? "kamu" : "ai", String(data.teks ?? ""));
    else if (p.type === "suara.widget" && data.hasil) onHasil(String(data.alat ?? ""), data.hasil as HasilAlat);
    else if (p.type === "suara.tugas") setTugas(data.status === "berjalan" ? String(data.pesan ?? "Lokerin sedang bekerja") : "");
    else if (p.type === "suara.selesai") void akhiri(false);
    else if (p.type === "suara.peringatan") setGalat(String(data.pesan ?? ""));
  }, { aktif });

  return { status, detik, tugas, galat, setGalat, mulai, akhiri, kirimTeks };
}
