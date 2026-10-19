// Server-side reads of public data. Falls back to the sample data when the API is not configured or unreachable.

import { connection } from "next/server";
import { BUTUH_HARI_INI, LOWONGAN, LOWONGAN_TAYANG, cariLowongan, type Lowongan } from "@/lib/data";
import { API_URL, apiAktif } from "./klien";
import { keLowongan } from "./adaptor";
import type { LowonganApi } from "./tipe";

export type Sumber<T> = { data: T; dariServer: boolean; putus?: boolean };

type Hasil<T> = { ok: true; data: T } | { ok: false; tidakAda: boolean };

async function ambilHasil<T>(path: string): Promise<Hasil<T>> {
  if (!apiAktif) return { ok: false, tidakAda: false };
  // Live listings and their "x minutes ago" labels belong to the request, not the build.
  await connection();
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { ok: false, tidakAda: res.status === 404 };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, tidakAda: false };
  }
}

async function ambil<T>(path: string): Promise<T | null> {
  const hasil = await ambilHasil<T>(path);
  return hasil.ok ? hasil.data : null;
}

export async function daftarLowongan(): Promise<Sumber<Lowongan[]>> {
  const hasil = await ambil<{ lowongan: LowonganApi[] }>("/lowongan?batas=100");
  if (!hasil) return { data: LOWONGAN_TAYANG, dariServer: false };
  return { data: hasil.lowongan.map((l) => keLowongan(l)).filter((l) => l.cekUpah !== "curiga"), dariServer: true };
}

export async function lowonganMendesak(): Promise<Sumber<Lowongan[]>> {
  const hasil = await ambil<{ lowongan: LowonganApi[] }>("/lowongan?butuh_hari_ini=true");
  if (!hasil) return { data: BUTUH_HARI_INI, dariServer: false };
  return { data: hasil.lowongan.map((l) => keLowongan(l)), dariServer: true };
}

export async function satuLowongan(id: string): Promise<Sumber<{ lowongan: Lowongan; api: LowonganApi | null } | null>> {
  const contoh = cariLowongan(id);
  if (contoh || !apiAktif) return { data: contoh ? { lowongan: contoh, api: null } : null, dariServer: false };
  const hasil = await ambilHasil<LowonganApi>(`/lowongan/${encodeURIComponent(id)}`);
  if (!hasil.ok) return { data: null, dariServer: true, putus: !hasil.tidakAda };
  return { data: { lowongan: keLowongan(hasil.data), api: hasil.data }, dariServer: true };
}

export const RADIUS_PETA_KM = 5;
export type Titik = { lat: number; lng: number };

/** Peta Kerja Sekitar: published jobs within a few km of the centre, nearest first. */
export async function lowonganSekitar(): Promise<Sumber<{ pusat: Titik; lowongan: Lowongan[] } | null>> {
  const hasil = await ambil<{ pusat: Titik; lowongan: LowonganApi[] }>(`/lowongan/peta?radius_km=${RADIUS_PETA_KM}`);
  if (!hasil) return { data: null, dariServer: false };
  return { data: { pusat: hasil.pusat, lowongan: hasil.lowongan.map((l) => keLowongan(l)).filter((l) => l.cekUpah !== "curiga") }, dariServer: true };
}

export async function jumlahDitahan(): Promise<number> {
  return LOWONGAN.filter((l) => l.cekUpah === "curiga").length;
}
