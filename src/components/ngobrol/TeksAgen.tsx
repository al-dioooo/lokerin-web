"use client";

/*
 * A reply from the agent, readable for anyone: short paragraphs, short lists and **bold**, nothing
 * else of markdown (no headings, tables or code). "Bacakan" reads it aloud in Indonesian.
 */

import { Fragment, useSyncExternalStore } from "react";
import { IconPlayerStop, IconVolume } from "../icons/tabler";

const BUTIR = /^\s*([-*•]|\d+[.)])\s+/;

function Sebaris({ teks }: { teks: string }) {
  return (
    <>
      {teks.split(/(\*\*.+?\*\*)/g).map((b, i) =>
        b.startsWith("**") && b.endsWith("**") && b.length > 4 ? <strong key={i}>{b.slice(2, -2)}</strong> : <Fragment key={i}>{b}</Fragment>,
      )}
    </>
  );
}

export function TeksAgen({ teks }: { teks: string }) {
  const blok = teks.replace(/\r/g, "").trim().split(/\n{2,}/);
  return (
    <div className="teks-agen">
      {blok.map((b, i) => {
        const baris = b.split("\n").filter((l) => l.trim());
        if (baris.length && baris.every((l) => BUTIR.test(l))) {
          const Daftar = /^\s*\d/.test(baris[0]) ? "ol" : "ul";
          return <Daftar key={i}>{baris.map((l, j) => <li key={j}><Sebaris teks={l.replace(BUTIR, "")} /></li>)}</Daftar>;
        }
        return (
          <p key={i}>
            {baris.map((l, j) => (
              <Fragment key={j}>{j > 0 && <br />}<Sebaris teks={l.replace(/^#+\s*/, "")} /></Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Text as it should be spoken: no markdown symbols. */
export function untukDibaca(teks: string) {
  return teks.replace(/\*\*|__|`|#+\s/g, "").replace(BUTIR, "").trim();
}

// One voice at a time across the whole thread.
let sedangDibaca: string | null = null;
const pendengar = new Set<() => void>();
const umumkan = () => pendengar.forEach((fn) => fn());

export function Bacakan({ id, teks }: { id: string; teks: string }) {
  const aktif = useSyncExternalStore(
    (fn) => {
      pendengar.add(fn);
      return () => pendengar.delete(fn);
    },
    () => sedangDibaca === id,
    () => false,
  );
  if (typeof window !== "undefined" && !("speechSynthesis" in window)) return null;
  function tekan() {
    speechSynthesis.cancel();
    if (aktif) {
      sedangDibaca = null;
      umumkan();
      return;
    }
    const ucapan = new SpeechSynthesisUtterance(untukDibaca(teks));
    ucapan.lang = "id-ID";
    ucapan.rate = 0.95;
    ucapan.onend = ucapan.onerror = () => {
      if (sedangDibaca === id) sedangDibaca = null;
      umumkan();
    };
    sedangDibaca = id;
    umumkan();
    speechSynthesis.speak(ucapan);
  }
  return (
    <button type="button" onClick={tekan} className="tombol-bacakan" aria-pressed={aktif}>
      {aktif ? <IconPlayerStop size={18} /> : <IconVolume size={18} />}
      {aktif ? "Berhenti" : "Bacakan"}
    </button>
  );
}
