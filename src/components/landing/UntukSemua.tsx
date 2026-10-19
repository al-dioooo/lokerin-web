import type { ReactNode } from "react";
import { GARIS } from "../kota/iso";
import { Muncul } from "../gerak/Muncul";

function Ketik() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <rect x="48" y="6" width="64" height="92" rx="11" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
      <rect x="56" y="18" width="40" height="16" rx="8" fill="#FFF1E8" />
      <g className="ketik-titik" fill="#EA5A0C"><circle cx="66" cy="26" r="2.4" /><circle cx="74" cy="26" r="2.4" /><circle cx="82" cy="26" r="2.4" /></g>
      <g fill="#F3F3EF" stroke="#D9D9D4">{[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={56 + c * 12.5} y={52 + r * 12} width="10" height="9" rx="2.5" />))}</g>
      <circle className="ketik-riak" cx="80" cy="69" r="7" fill="none" stroke="#EA5A0C" strokeWidth="2" />
    </svg>
  );
}

function Dengar() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <path d="M44 40h12l18-15v50L56 60H44a4 4 0 0 1-4-4V44a4 4 0 0 1 4-4Z" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" strokeLinejoin="round" />
      <g className="dengar-gelombang" fill="none" stroke="#EA5A0C" strokeWidth="2.6" strokeLinecap="round"><path d="M86 40a14 14 0 0 1 0 20" /><path d="M94 32a26 26 0 0 1 0 36" /><path d="M102 24a38 38 0 0 1 0 52" /></g>
    </svg>
  );
}

function Sinyal() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <g className="sinyal-batang">{[0, 1, 2, 3].map((i) => <rect key={i} x={34 + i * 13} y={70 - i * 13} width="9" height={14 + i * 13} rx="2.5" fill={i === 0 ? "#16181D" : "#FFFFFF"} stroke={i === 0 ? "#16181D" : "#D9D9D4"} strokeWidth="1.4" strokeDasharray={i === 0 ? undefined : "3 3"} />)}</g>
      <rect x="92" y="18" width="44" height="66" rx="6" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
      <path d="M100 32h28M100 41h22M100 50h26M100 59h16" stroke="#BDBAB4" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="130" cy="76" r="11" fill="#18794E" /><path d="m125 76 3.5 3.5 6.5-7" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kartu() {
  return (
    <svg viewBox="0 0 160 100" aria-hidden="true">
      <circle cx="80" cy="50" r="44" fill="none" stroke="#18794E" strokeWidth="2.4" strokeDasharray="20 6" opacity=".55" />
      <g className="kartu-ayun">
        <rect x="58" y="12" width="44" height="76" rx="7" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
        <rect x="64" y="20" width="18" height="5" rx="2.5" fill="#EA5A0C" />
        <path d="M64 33h30M64 40h22" stroke="#BDBAB4" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="70" y="52" width="20" height="20" rx="2" fill="#FFFFFF" stroke="#16181D" strokeWidth="1.4" />
        <path d="M74 56h4v4h-4zM82 56h4v4h-4zM74 64h4v4h-4zM83 65h3v3h-3z" fill="#16181D" />
      </g>
    </svg>
  );
}

const CARA: { judul: string; isi: string; gambar: ReactNode }[] = [
  { judul: "Bisa diketik", isi: "Setiap langkah suara punya tombol dan kolom ketik, jadi tetap bisa dipakai di tempat ramai.", gambar: <Ketik /> },
  { judul: "Bisa dibacakan", isi: "Tekan Bacakan di kartu lowongan, Lokerin membacanya dalam Bahasa Indonesia.", gambar: <Dengar /> },
  { judul: "Kuat di sinyal lemah", isi: "Teks muncul lebih dulu. Halaman yang pernah dibuka tetap bisa dibaca saat sinyal hilang.", gambar: <Sinyal /> },
  { judul: "Kartu Kerja", isi: "Ringkasan keahlianmu dengan kode QR, pas untuk dipasang di status WhatsApp.", gambar: <Kartu /> },
];

export function UntukSemua() {
  return (
    <section id="untuk-semua" className="border-y border-garis bg-kertas py-16 sm:py-20" aria-labelledby="judul-semua">
      <div className="shell">
        <Muncul className="mb-8 max-w-2xl"><p className="pil-piksel mb-4">Untuk semua orang</p><h2 id="judul-semua" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Pakai suara, ketik, atau <span className="text-jingga">dengarkan saja.</span></h2></Muncul>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CARA.map(({ judul, isi, gambar }, i) => (
            <li key={judul}><Muncul jeda={i * 0.08} className="h-full"><div className="cara-kartu"><div className="cara-gambar">{gambar}</div><h3 className="text-base">{judul}</h3><p className="mt-1 text-sm text-abu">{isi}</p></div></Muncul></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
