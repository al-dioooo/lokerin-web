"use client";

/*
 * Past conversations, in a drawer: newest first, grouped by day like most chat apps, with "Obrolan
 * baru" on top. Deleting asks first, because it cannot be undone.
 */

import { useState } from "react";
import { IconMessageCircle, IconPencilPlus, IconTrash } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { Laci } from "../lapis/Laci";
import { useApi } from "@/lib/api/hooks";
import { hapusObrolan, kelompokWaktu, type RingkasObrolan } from "@/lib/api/obrolan";

export function DaftarObrolan({ buka, onTutup, aktifId, onPilih, onBaru }: { buka: boolean; onTutup: () => void; aktifId: string; onPilih: (o: RingkasObrolan) => void; onBaru: () => void }) {
  const daftar = useApi<{ obrolan: RingkasObrolan[] }>(buka ? "/chat/obrolan" : null);
  const [hapus, setHapus] = useState<RingkasObrolan | null>(null);
  const obrolan = daftar.data?.obrolan ?? [];
  const kelompok = new Map<string, RingkasObrolan[]>();
  for (const o of obrolan) {
    const k = kelompokWaktu(o.diperbarui_pada);
    kelompok.set(k, [...(kelompok.get(k) ?? []), o]);
  }
  return (
    <>
      <Laci buka={buka} onTutup={onTutup} label="Ngobrol" judul="Obrolanmu">
        <div className="grid gap-5">
          <button type="button" className="tombol tombol-utama min-h-14 text-lg" onClick={onBaru}><IconPencilPlus size={20} />Obrolan baru</button>
          {daftar.memuat && !daftar.data && <p className="text-center text-abu" role="status">Memuat obrolan...</p>}
          {daftar.data && !obrolan.length && <p className="rounded-2xl border border-dashed border-garis p-5 text-center text-[15px] text-abu">Belum ada obrolan tersimpan.</p>}
          {[...kelompok.entries()].map(([judul, isi]) => (
            <section key={judul} className="grid gap-1.5" aria-label={judul}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-abu">{judul}</h3>
              <ul className="grid gap-1.5">
                {isi.map((o) => (
                  <li key={o.id} className="flex items-stretch gap-1.5">
                    <button type="button" onClick={() => onPilih(o)} aria-current={o.id === aktifId || undefined} className="baris-obrolan">
                      <IconMessageCircle size={20} className="shrink-0 text-abu" />
                      <span className="min-w-0 flex-1 truncate">{o.judul}</span>
                    </button>
                    <button type="button" className="icon-button size-14 shrink-0 border border-garis bg-white text-abu" aria-label={`Hapus obrolan ${o.judul}`} onClick={() => setHapus(o)}><IconTrash size={18} /></button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Laci>
      <Dialog
        buka={hapus !== null}
        onTutup={() => setHapus(null)}
        bahaya
        judul="Hapus obrolan ini?"
        labelYa="Ya, hapus"
        onYa={async () => {
          if (!hapus) return;
          await hapusObrolan(hapus.id);
          if (hapus.id === aktifId) onBaru();
          setHapus(null);
          daftar.muatUlang();
        }}
      >
        &ldquo;{hapus?.judul}&rdquo; hilang dari daftar. Lamaran, CV, dan bahan CV yang sudah tersimpan tidak ikut terhapus.
      </Dialog>
    </>
  );
}
