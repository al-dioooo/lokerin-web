"use client";

import { useState } from "react";
import { KATEGORI } from "../icons/categories";
import { SpeakerIcon } from "../icons/interface";
import { Bacakan } from "../ui/Bacakan";

export function RakKategori() {
  const [bacaDengar, setBacaDengar] = useState(false);
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-sm text-abu">Tidak lancar membaca? Nyalakan mode baca-dengar: ikon jadi besar dan setiap pekerjaan bisa dibacakan.</p>
        <button type="button" role="switch" aria-checked={bacaDengar} onClick={() => setBacaDengar((v) => !v)} className="sakelar">
          <SpeakerIcon size={16} />Mode baca-dengar<span className="sakelar-jalur" aria-hidden="true"><span /></span>
        </button>
      </div>
      {bacaDengar ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {KATEGORI.map(({ slug, label, Icon, ucapan }) => (
            <li key={slug} className="ubin-besar"><Icon size={56} /><span className="font-bold">{label}</span><Bacakan teks={ucapan} label={`Bacakan ${label}`} ringkas /></li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {KATEGORI.map(({ slug, label, Icon }) => <li key={slug} className="chip-kategori"><Icon size={24} />{label}</li>)}
        </ul>
      )}
    </div>
  );
}
