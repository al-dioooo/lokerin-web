"use client";

// Session store shared by every client component: who is signed in, and how to sign in or out.

import { useSyncExternalStore } from "react";
import { api, apiAktif, bacaToken, GalatApi, simpanToken } from "./klien";
import { kosongkan } from "./simpanan";
import type { MeApi, Peran, Pengguna } from "./tipe";

const KUNCI_PENGGUNA = "lokerin-pengguna";

type Keadaan = { pengguna: Pengguna | null; siap: boolean };

let keadaan: Keadaan = { pengguna: null, siap: false };
const pendengar = new Set<() => void>();

function umumkan(baru: Keadaan) {
  keadaan = baru;
  pendengar.forEach((fn) => fn());
}

function muatAwal() {
  if (keadaan.siap || typeof window === "undefined") return;
  let pengguna: Pengguna | null = null;
  try {
    const s = localStorage.getItem(KUNCI_PENGGUNA);
    pengguna = s && bacaToken() ? (JSON.parse(s) as Pengguna) : null;
  } catch {}
  keadaan = { pengguna, siap: true };
}

function berlangganan(fn: () => void) {
  pendengar.add(fn);
  return () => pendengar.delete(fn);
}

const kosong: Keadaan = { pengguna: null, siap: false };

export function useSesi() {
  return useSyncExternalStore(
    berlangganan,
    () => {
      muatAwal();
      return keadaan;
    },
    () => kosong,
  );
}

function simpan(token: string, pengguna: Pengguna) {
  // Switching accounts drops what the previous one loaded.
  if (keadaan.pengguna && keadaan.pengguna.id !== pengguna.id) kosongkan();
  simpanToken(token);
  try {
    localStorage.setItem(KUNCI_PENGGUNA, JSON.stringify(pengguna));
  } catch {}
  umumkan({ pengguna, siap: true });
}

type HasilMasuk = { token: string; pengguna: Pengguna };

/** One-tap demo account for judges (Pak Darto, Raka, Bu Wati, ...). */
export async function masukDemo(key: string) {
  const hasil = await api<HasilMasuk>("/auth/demo", { method: "POST", body: { key }, token: null });
  simpan(hasil.token, hasil.pengguna);
  return hasil.pengguna;
}

/** A fresh account made during onboarding, so demo accounts stay untouched. */
export async function masukTamu(peran: Peran, nama: string, lokasi?: { kota?: string; kecamatan?: string }) {
  const hasil = await api<HasilMasuk>("/auth/tamu", { method: "POST", body: { peran, nama, ...lokasi }, token: null });
  simpan(hasil.token, hasil.pengguna);
  return hasil.pengguna;
}

export type IsiDaftar = { peran: Peran; nama: string; kota?: string; kecamatan?: string };
type HasilGoogle = (HasilMasuk & { baru: boolean }) | { baru: true; google: { nama: string | null; email: string | null } };

/**
 * Google sign-in, checked by the backend. A returning person gets a session right away; a new one
 * gets `google` back (name, email) and no account yet, until onboarding sends `daftar`.
 */
export async function masukGoogle(aksesGoogle: string, daftar?: IsiDaftar) {
  const hasil = await api<HasilGoogle>("/auth/google", {
    method: "POST",
    body: { access_token: aksesGoogle, ...(daftar ? { daftar } : {}) },
    token: null,
  });
  if (!("token" in hasil)) return { pengguna: null, google: hasil.google };
  simpan(hasil.token, hasil.pengguna);
  return { pengguna: hasil.pengguna, google: null };
}

export async function segarkanSesi() {
  if (!apiAktif || !bacaToken()) return null;
  try {
    const me = await api<MeApi>("/me");
    const pengguna: Pengguna = { id: me.id, peran: me.peran, nama: me.nama, kota: me.kota };
    simpan(bacaToken()!, pengguna);
    return me;
  } catch (e) {
    // Only a rejected token ends the session. A dropped connection or a server hiccup keeps the
    // person signed in with what we already know about them.
    if (e instanceof GalatApi && e.status === 401) keluar();
    return null;
  }
}

export function keluar() {
  void api("/auth/keluar", { method: "POST" }).catch(() => {});
  simpanToken(null);
  kosongkan();
  try {
    localStorage.removeItem(KUNCI_PENGGUNA);
  } catch {}
  umumkan({ pengguna: null, siap: true });
}
