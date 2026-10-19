"use client";

/*
 * The CV Khusus as it prints. Same structure and CSS as lokerin-backend src/cv/template.ts, so the
 * preview, the employer's view and the downloaded PDF all look the same (ADR 0009).
 */

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import type { BagianCv, EntriCv, IsiCv, JenisBagianCv } from "@/lib/api/tipe";
import "./cv.css";

const URUTAN: JenisBagianCv[] = ["pengalaman", "proyek", "pendidikan", "prestasi", "lainnya"];
export const LEBAR_KERTAS = 794;

/** `**tebal**` in CV text becomes bold, the same rule the PDF uses. */
export function Kaya({ teks }: { teks: string | undefined }) {
  if (!teks) return null;
  return (
    <>
      {teks.split(/(\*\*.+?\*\*)/g).map((bagian, i) =>
        bagian.startsWith("**") && bagian.endsWith("**") && bagian.length > 4 ? <strong key={i}>{bagian.slice(2, -2)}</strong> : <Fragment key={i}>{bagian}</Fragment>,
      )}
    </>
  );
}

export function bagianTerurut(isi: IsiCv) {
  return [...isi.bagian].sort((a, b) => URUTAN.indexOf(a.jenis) - URUTAN.indexOf(b.jenis));
}

/** Section titles follow the language the CV is written in. */
export function bahasaCv(isi: IsiCv, cadangan: "id" | "en" = "id") {
  const judul = isi.bagian.map((b) => b.judul.toLowerCase()).join(" ");
  if (/pengalaman|pendidikan|proyek|prestasi|penghargaan/.test(judul)) return "id";
  if (/experience|education|projects?|awards?/.test(judul)) return "en";
  return cadangan;
}

function Entri({ e }: { e: EntriCv }) {
  return (
    <div className="entri">
      {(e.judul || e.tempat || e.periode) && (
        <div className="baris">
          <span>
            {e.judul && <strong><Kaya teks={e.judul} /></strong>}
            {e.tempat && <>{e.judul ? ", " : ""}<Kaya teks={e.tempat} /></>}
            {e.keterangan && <> <span className="keterangan">(<Kaya teks={e.keterangan} />)</span></>}
          </span>
          {e.periode && <span className="periode">{e.periode}</span>}
        </div>
      )}
      {e.lokasi && <div className="baris"><span /><span className="lokasi">{e.lokasi}</span></div>}
      {e.poin.length > 0 && <ul>{e.poin.map((p) => <li key={p.id}><Kaya teks={p.text} /></li>)}</ul>}
    </div>
  );
}

function Bagian({ b }: { b: BagianCv }) {
  return (
    <section>
      <h2>{b.judul}</h2>
      {b.entri.map((e) => <Entri key={e.id} e={e} />)}
    </section>
  );
}

function tautanUrl(t: string) {
  return /^https?:/.test(t) ? t : `https://${t}`;
}

export function KertasCv({ isi, template = "satu_kolom", bahasa = "id", kontakTersembunyi = false, statis = false }: { isi: IsiCv; template?: "satu_kolom" | "dua_kolom"; bahasa?: "id" | "en"; kontakTersembunyi?: boolean; /** No links inside, for a paper shown within a link or button. */ statis?: boolean }) {
  const lang = bahasaCv(isi, bahasa);
  const label = lang === "en" ? { ringkasan: "Summary", keahlian: "Skills" } : { ringkasan: "Ringkasan", keahlian: "Keahlian" };
  const terurut = bagianTerurut(isi);
  const pengalaman = terurut.filter((b) => b.jenis === "pengalaman" || b.jenis === "proyek");
  const lain = terurut.filter((b) => b.jenis !== "pengalaman" && b.jenis !== "proyek");
  const baris1 = [isi.kontak.kota, kontakTersembunyi ? null : isi.kontak.telepon].filter(Boolean) as string[];
  const baris2: ReactNode[] = kontakTersembunyi
    ? [<span key="s" className="sembunyi">Kontak terlihat setelah Lamaran Lolos</span>]
    : [
        ...(isi.kontak.email ? [statis ? <span key="e" className="text-[#1a35c4]">{isi.kontak.email}</span> : <a key="e" href={`mailto:${isi.kontak.email}`}>{isi.kontak.email}</a>] : []),
        ...(isi.kontak.tautan ?? []).map((t) =>
          statis ? <span key={t} className="text-[#1a35c4]">{t.replace(/^https?:\/\//, "")}</span> : <a key={t} href={tautanUrl(t)} target="_blank" rel="noopener noreferrer">{t.replace(/^https?:\/\//, "")}</a>,
        ),
      ];
  const pisah = (daftar: ReactNode[]) => daftar.map((x, i) => <Fragment key={i}>{i > 0 && " ◇ "}{x}</Fragment>);

  const ringkasan = isi.ringkasan ? <section className="ringkasan"><h2>{label.ringkasan}</h2><p><Kaya teks={isi.ringkasan} /></p></section> : null;
  const keahlian = isi.keahlian.length ? (
    <section>
      <h2>{label.keahlian}</h2>
      <dl className="keahlian">
        {isi.keahlian.map((k) => (
          <Fragment key={k.id}><dt>{k.label}</dt><dd>{k.isi.map((x, i) => <Fragment key={i}>{i > 0 && ", "}<Kaya teks={x} /></Fragment>)}</dd></Fragment>
        ))}
      </dl>
    </section>
  ) : null;

  return (
    <article className="kertas-cv" lang={lang} aria-label={`CV ${isi.nama}`}>
      <header>
        <h1>{isi.nama}</h1>
        {isi.judul && <div className="posisi">{isi.judul}</div>}
        {baris1.length > 0 && <div className="kontak">{pisah(baris1)}</div>}
        {baris2.length > 0 && <div className="kontak">{pisah(baris2)}</div>}
      </header>
      {template === "dua_kolom" ? (
        <div className="dua-kolom">
          <main>{ringkasan}{pengalaman.map((b) => <Bagian key={b.id} b={b} />)}{lain.map((b) => <Bagian key={b.id} b={b} />)}</main>
          <aside className="samping">{keahlian}</aside>
        </div>
      ) : (
        <>
          {ringkasan}
          {pengalaman.map((b) => <Bagian key={b.id} b={b} />)}
          {keahlian}
          {lain.map((b) => <Bagian key={b.id} b={b} />)}
        </>
      )}
    </article>
  );
}

/** Fits the A4 paper to its container. `penuh` shows it at real size, scrolling sideways on a phone. */
export function SkalaKertas({ children, penuh = false }: { children: ReactNode; penuh?: boolean }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [skala, setSkala] = useState(1);
  useEffect(() => {
    const el = wadah.current;
    if (!el) return;
    // ResizeObserver also reports the first size right after observe().
    const ro = new ResizeObserver(() => setSkala(Math.min(1, el.clientWidth / LEBAR_KERTAS)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={wadah} className="kertas-skala" style={penuh ? { overflowX: "auto" } : undefined}>
      <div style={{ zoom: penuh ? 1 : skala, width: LEBAR_KERTAS }}>{children}</div>
    </div>
  );
}
