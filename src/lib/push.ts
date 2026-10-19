"use client";

// Web Push for Kabar (ADR 0008). The server holds the VAPID key; this asks the browser for
// permission, subscribes through the service worker, and hands the subscription to the API.

import { api } from "./api/klien";

export type StatusPush = "aktif" | "mati" | "ditolak" | "perlu_dipasang" | "tidak_didukung" | "server_mati";

function ios() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function terpasang() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** iPhone only allows push once Lokerin is added to the Home Screen (iOS 16.4 and later). */
export function dukunganPush(): "didukung" | "perlu_dipasang" | "tidak_didukung" {
  if (typeof window === "undefined") return "tidak_didukung";
  const ada = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (ada) return "didukung";
  return ios() && !terpasang() ? "perlu_dipasang" : "tidak_didukung";
}

async function registrasi() {
  const ada = await navigator.serviceWorker.getRegistration("/");
  if (!ada) await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  return navigator.serviceWorker.ready;
}

function kunciKeByte(kunci: string) {
  const isi = atob((kunci + "=".repeat((4 - (kunci.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(isi, (c) => c.charCodeAt(0));
}

export async function statusPush(): Promise<StatusPush> {
  const dukungan = dukunganPush();
  if (dukungan !== "didukung") return dukungan;
  if (Notification.permission === "denied") return "ditolak";
  const reg = await navigator.serviceWorker.getRegistration("/");
  const langganan = await reg?.pushManager.getSubscription();
  return langganan && Notification.permission === "granted" ? "aktif" : "mati";
}

type KunciServer = { aktif: boolean; kunci_publik: string | null };
let kunciServer: Promise<KunciServer> | null = null;

/** Whether the server sends push at all. Screens that offer push load it early, before the tap. */
export function cekServerPush() {
  kunciServer ??= api<KunciServer>("/push/kunci", { token: null }).catch(() => {
    kunciServer = null;
    return { aktif: false, kunci_publik: null };
  });
  return kunciServer;
}

/**
 * Must run from a tap. Safari only shows the permission prompt straight from one, so the prompt
 * comes first and the server key (usually already loaded by cekServerPush) after it.
 */
export async function nyalakanPush(): Promise<StatusPush> {
  const dukungan = dukunganPush();
  if (dukungan !== "didukung") return dukungan;
  const izin = await Notification.requestPermission();
  if (izin !== "granted") return izin === "denied" ? "ditolak" : "mati";
  const { aktif, kunci_publik } = await cekServerPush();
  if (!aktif || !kunci_publik) return "server_mati";
  const reg = await registrasi();
  const langganan = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: kunciKeByte(kunci_publik) }));
  await api("/push/langganan", { method: "POST", body: langganan.toJSON() });
  return "aktif";
}

export async function matikanPush(): Promise<StatusPush> {
  const reg = await navigator.serviceWorker.getRegistration("/");
  const langganan = await reg?.pushManager.getSubscription();
  if (langganan) {
    await api("/push/langganan", { method: "DELETE", body: { endpoint: langganan.endpoint } }).catch(() => {});
    await langganan.unsubscribe();
  }
  return "mati";
}
