// In-memory store behind useApi: one entry per account and path, shared by every screen that asks
// for the same thing. It lives only in this tab's memory and is emptied on sign-out, so nothing
// personal is left behind on a shared phone.

import type { GalatApi } from "./klien";

export type Entri = { data: unknown; galat: GalatApi | null; waktu: number; janji: Promise<void> | null };

const KOSONG: Entri = { data: null, galat: null, waktu: 0, janji: null };
const BATAS = 120;
const entri = new Map<string, Entri>();
const pendengar = new Map<string, Set<() => void>>();

export function baca(kunci: string): Entri {
  return entri.get(kunci) ?? KOSONG;
}

export function tulis(kunci: string, isi: Entri) {
  // Re-inserting keeps the Map in least-recently-written order, so the oldest goes first.
  entri.delete(kunci);
  entri.set(kunci, isi);
  if (entri.size > BATAS) {
    for (const k of entri.keys()) {
      if (entri.size <= BATAS) break;
      if (!pendengar.get(k)?.size) entri.delete(k);
    }
  }
  pendengar.get(kunci)?.forEach((fn) => fn());
}

export function langgan(kunci: string, fn: () => void) {
  let set = pendengar.get(kunci);
  if (!set) pendengar.set(kunci, (set = new Set()));
  set.add(fn);
  return () => {
    set.delete(fn);
    if (!set.size) pendengar.delete(kunci);
  };
}

/** Marks everything old so the next look fetches again; returns the keys someone is showing now. */
export function basikan() {
  for (const [k, e] of entri) entri.set(k, { ...e, waktu: 0 });
  return [...pendengar.keys()];
}

export function kosongkan() {
  entri.clear();
  pendengar.forEach((set) => set.forEach((fn) => fn()));
}
