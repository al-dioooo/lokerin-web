"use client";

import { m, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { IconBriefcase, IconCircleCheck, IconEye, IconMicrophone, IconSend, type TablerProps } from "../icons/tabler";
import { Muncul } from "../gerak/Muncul";
import { useKemajuan } from "./gulir";

type Langkah = { judul: string; isi: string; Icon: ComponentType<TablerProps>; x: number; y: number };

// x and y are stops on the road, in the 1000 x 380 drawing.
const LANGKAH: Langkah[] = [
  { judul: "Ngobrol", isi: "Sebut pekerjaan, area, dan jam kerjamu. Bisa juga diketik.", Icon: IconMicrophone, x: 110, y: 250 },
  { judul: "Lowongan muncul", isi: "Kartu lowongan di dekatmu tampil selagi kamu bicara.", Icon: IconBriefcase, x: 305, y: 120 },
  { judul: "Kirim lamaran", isi: "Pilih persona, lalu ketuk Kirim. CV Khusus bisa disusun dari obrolan tadi.", Icon: IconSend, x: 500, y: 250 },
  { judul: "Dilihat", isi: "Statusnya berubah di layarmu begitu pemilik usaha membuka lamaranmu.", Icon: IconEye, x: 695, y: 120 },
  { judul: "Lolos", isi: "Pemilik usaha menulis tahap berikutnya: nomor WhatsApp, tautan Meet, atau alamat.", Icon: IconCircleCheck, x: 890, y: 250 },
];

function ruas(a: Langkah, b: Langkah) {
  const t = (b.x - a.x) * 0.45;
  return `C${a.x + t} ${a.y} ${b.x - t} ${b.y} ${b.x} ${b.y}`;
}

const JALAN = `M${LANGKAH[0].x} ${LANGKAH[0].y} ` + LANGKAH.slice(1).map((b, i) => ruas(LANGKAH[i], b)).join(" ");

// The road is symmetric, so the stops sit at equal shares of its length.
const BATAS = LANGKAH.map((_, i) => i / (LANGKAH.length - 1));

/** Index of the last stop the traveller has reached, updated only when it changes. */
function useSampai(p: MotionValue<number>) {
  const hitung = (v: number) => BATAS.findLastIndex((b) => v >= b - 0.001);
  const [sampai, setSampai] = useState(() => hitung(p.get()));
  useMotionValueEvent(p, "change", (v) => {
    const i = hitung(v);
    setSampai((s) => (s === i ? s : i));
  });
  return sampai;
}

function JalanLebar({ p }: { p: MotionValue<number> }) {
  const jalan = useRef<SVGPathElement>(null);
  const pengendara = useRef<SVGGElement>(null);
  const sampai = useSampai(p);

  const letakkan = (v: number) => {
    const path = jalan.current;
    if (!path || !pengendara.current) return;
    const titik = path.getPointAtLength(v * path.getTotalLength());
    pengendara.current.setAttribute("transform", `translate(${titik.x} ${titik.y})`);
  };
  useMotionValueEvent(p, "change", letakkan);
  useEffect(() => letakkan(p.get()));

  return (
    <div className="relative">
      <svg viewBox="0 0 1000 380" className="h-auto w-full" aria-hidden="true">
        <path d={JALAN} fill="none" stroke="#F3F3EF" strokeWidth="34" strokeLinecap="round" />
        <path d={JALAN} fill="none" stroke="#D9D9D4" strokeWidth="2" strokeDasharray="10 12" strokeLinecap="round" />
        <path ref={jalan} d={JALAN} fill="none" stroke="none" />
        <m.path d={JALAN} fill="none" stroke="#EA5A0C" strokeWidth="5" strokeLinecap="round" style={{ pathLength: p }} />
        <g ref={pengendara}>
          <circle r="13" fill="#FFFFFF" stroke="#EA5A0C" strokeWidth="3" />
          <circle r="5" fill="#EA5A0C" />
        </g>
      </svg>
      <ol className="jalan-titik">
        {LANGKAH.map(({ judul, isi, Icon, x, y }, i) => (
          <li key={judul} data-sampai={i <= sampai || undefined} data-atas={y < 200 || undefined} style={{ left: `${x / 10}%`, top: `${(y / 380) * 100}%` }}>
            <span className="jalan-ikon"><Icon size={22} /></span>
            <div className="jalan-keterangan"><p className="piksel text-[11px] text-jingga-tua">0{i + 1}</p><h3 className="text-base">{judul}</h3><p className="mt-1 text-sm text-abu">{isi}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function JalanSempit({ p }: { p: MotionValue<number> }) {
  const sampai = useSampai(p);
  const scaleY = useTransform(p, [0, 1], [0, 1]);
  return (
    <div className="relative">
      <span className="jalan-sempit-garis" aria-hidden="true"><m.span style={{ scaleY }} /></span>
      <ol className="jalan-sempit">
        {LANGKAH.map(({ judul, isi, Icon }, i) => (
          <li key={judul} data-sampai={i <= sampai || undefined}>
            <span className="jalan-ikon"><Icon size={22} /></span>
            <div><p className="piksel text-[11px] text-jingga-tua">0{i + 1}</p><h3 className="text-base">{judul}</h3><p className="mt-1 text-sm text-abu">{isi}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The path of one application, drawn along a road as you scroll. Wide screens pin it in place. */
export function JalanLamaran() {
  const lebar = useRef<HTMLDivElement>(null);
  const sempit = useRef<HTMLDivElement>(null);
  const diam = useReducedMotion();
  const pLebar = useKemajuan(lebar, ["start start", "end end"]);
  const jalanLebar = useTransform(pLebar, [0.04, 0.86], [0, 1]);
  const pSempit = useKemajuan(sempit, ["start 75%", "end 55%"]);
  return (
    <section id="jalan" aria-labelledby="judul-jalan" className="border-y border-garis bg-kertas">
      <div ref={lebar} className="jalan-gulir hidden lg:block" data-diam={diam || undefined}>
        <div className="jalan-lekat">
          <div className="shell">
            <Muncul className="mb-6 max-w-2xl"><p className="pil-piksel mb-4">Jalannya lamaran</p><h2 id="judul-jalan" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Dari ngobrol sampai <span className="text-jingga">dapat kabar.</span></h2></Muncul>
            <JalanLebar p={jalanLebar} />
          </div>
        </div>
      </div>
      <div ref={sempit} className="shell py-16 lg:hidden">
        <Muncul className="mb-8"><p className="pil-piksel mb-4">Jalannya lamaran</p><h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Dari ngobrol sampai <span className="text-jingga">dapat kabar.</span></h2></Muncul>
        <JalanSempit p={pSempit} />
      </div>
    </section>
  );
}
