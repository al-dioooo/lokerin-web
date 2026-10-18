// Server-side reads of public data. Falls back to the sample data when the API is not configured or unreachable.

import { connection } from "next/server";
import { BUTUH_HARI_INI, LOWONGAN, LOWONGAN_TAYANG, cariLowongan, type Lowongan } from "@/lib/data";
import { API_URL, apiAktif } from "./klien";
import { keLowongan } from "./adaptor";
import type { LowonganApi } from "./tipe";

export type Sumber<T> = { data: T; dariServer: boolean };

async function ambil<T>(path: string): Promise<T | null> {
  if (!apiAktif) return null;
  // Live listings and their "x minutes ago" labels belong to the request, not the build.
  await connection();
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
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
  const api = await ambil<LowonganApi>(`/lowongan/${encodeURIComponent(id)}`);
  return { data: api ? { lowongan: keLowongan(api), api } : null, dariServer: true };
}

export async function jumlahDitahan(): Promise<number> {
  return LOWONGAN.filter((l) => l.cekUpah === "curiga").length;
}
