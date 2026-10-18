"use client";

import { useId, useRef, useState } from "react";
import { IconBrandWhatsapp, IconCircleCheck, IconFlag } from "../icons/tabler";
import { Bacakan } from "../ui/Bacakan";
import { PEKERJA, type PersonaId } from "@/lib/data";

export function AksiLowongan({ judul, usaha, wa, bacaan }: { judul: string; usaha: string; wa: string; bacaan: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [persona, setPersona] = useState<PersonaId>("las");
  const [terkirim, setTerkirim] = useState<PersonaId | null>(null);
  const pesan = encodeURIComponent(`Halo, saya ${PEKERJA.nama} dari Lokerin. Saya tertarik dengan lowongan ${judul} di ${usaha}. Apakah masih dibuka?`);
  return (
    <>
      <div className="aksi-lengket">
        <Bacakan teks={bacaan} label={`Bacakan lowongan ${judul}`} ringkas className="border border-garis bg-white" />
        {terkirim ? (
          <a href={`https://wa.me/${wa}?text=${pesan}`} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama flex-1"><IconBrandWhatsapp size={18} />Lanjut di WhatsApp</a>
        ) : (
          <button type="button" className="tombol tombol-utama flex-1" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">Saya bisa</button>
        )}
      </div>
      {terkirim && <p role="status" className="mt-3 flex items-center gap-2 rounded-2xl bg-daun-muda p-3 text-sm text-daun"><IconCircleCheck size={18} />Minatmu dengan CV {PEKERJA.persona[terkirim].judul} terkirim ke {usaha}.</p>}
      <button type="button" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-abu underline underline-offset-4"><IconFlag size={14} />Laporkan lowongan ini</button>
      <dialog ref={dialog} className="demo-dialog" aria-labelledby={`${id}-judul`}>
        <p className="piksel text-[11px] uppercase text-jingga-tua">Saya bisa</p>
        <h2 id={`${id}-judul`} className="mt-1 text-xl">Kirim dengan CV yang mana?</h2>
        <p className="mt-1 text-sm text-abu">{usaha} akan melihat CV yang kamu pilih. Nomor HP-mu baru terlihat setelah kamu lanjut di WhatsApp.</p>
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Pilih CV">
          {(Object.keys(PEKERJA.persona) as PersonaId[]).map((p) => (
            <button key={p} type="button" role="radio" aria-checked={persona === p} onClick={() => setPersona(p)} className="pilih-cv">
              <span className="font-bold">CV {PEKERJA.persona[p].judul}</span>
              <span className="text-xs text-abu">{PEKERJA.persona[p].ringkas}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="tombol tombol-garis" onClick={() => dialog.current?.close()}>Batal</button>
          <button type="button" className="tombol tombol-utama" onClick={() => { setTerkirim(persona); dialog.current?.close(); }}>Kirim minat</button>
        </div>
      </dialog>
    </>
  );
}
