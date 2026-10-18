"use client";

import { useSyncExternalStore } from "react";
import { IconStar } from "../icons/tabler";

// Rating after contact (PRD: "Rating dan Laporkan"). The backend has no rating route yet, so the
// score is kept in this browser per lamaran and side. Swap `simpan` for a POST when it exists.

type Sisi = "pelamar" | "pemberi";
const KUNCI = "lokerin-rating";
const pendengar = new Set<() => void>();
let cache: string | null = null;

function baca(): string {
  try {
    cache = localStorage.getItem(KUNCI) ?? "{}";
  } catch {
    cache = "{}";
  }
  return cache;
}

function langganan(f: () => void) {
  pendengar.add(f);
  const dariTabLain = (e: StorageEvent) => { if (e.key === KUNCI) { baca(); f(); } };
  window.addEventListener("storage", dariTabLain);
  return () => { pendengar.delete(f); window.removeEventListener("storage", dariTabLain); };
}

function simpan(lamaranId: string, sisi: Sisi, nilai: number) {
  const semua = JSON.parse(cache ?? baca()) as Record<string, Partial<Record<Sisi, number>>>;
  semua[lamaranId] = { ...semua[lamaranId], [sisi]: nilai };
  try {
    localStorage.setItem(KUNCI, JSON.stringify(semua));
  } catch {}
  cache = JSON.stringify(semua);
  pendengar.forEach((f) => f());
}

export function RatingKontak({ lamaranId, sisi, untuk }: { lamaranId: string; sisi: Sisi; untuk: string }) {
  const mentah = useSyncExternalStore(langganan, () => cache ?? baca(), () => "{}");
  const nilai = (JSON.parse(mentah) as Record<string, Partial<Record<Sisi, number>>>)[lamaranId]?.[sisi] ?? 0;
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-garis p-3">
      <p className="text-sm font-bold">{nilai ? `Terima kasih, rating untuk ${untuk} tersimpan` : `Sudah saling menghubungi? Beri rating untuk ${untuk}`}</p>
      <p className="text-xs text-abu">Rating membantu pekerja dan pemberi kerja lain memilih dengan tenang.</p>
      <div className="mt-1 flex gap-1" role="radiogroup" aria-label={`Rating untuk ${untuk}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={nilai === n} aria-label={`${n} bintang`} className="bintang" data-nyala={nilai >= n || undefined} onClick={() => simpan(lamaranId, sisi, n)}><IconStar size={24} /></button>
        ))}
      </div>
    </div>
  );
}
