"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SpeakerIcon } from "../icons/interface";

export function Bacakan({ teks, label = "Bacakan", children, className = "" }: { teks: string; label?: string; children?: ReactNode; className?: string }) {
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const current = useRef<SpeechSynthesisUtterance | null>(null);
  const id = useId();

  useEffect(() => () => {
    if (current.current) {
      current.current.onend = null;
      current.current.onerror = null;
      window.speechSynthesis?.cancel();
    }
  }, []);

  function speak() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setError("Peramban ini belum mendukung baca-dengar. Silakan baca teks yang tersedia.");
      return;
    }
    if (reading) {
      window.speechSynthesis.cancel();
      current.current = null;
      setReading(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(teks);
    utterance.lang = "id-ID";
    utterance.rate = .9;
    const voice = window.speechSynthesis.getVoices().find((voice) => voice.lang.replace("_", "-").startsWith("id"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => { setReading(false); current.current = null; };
    utterance.onerror = (event) => {
      setReading(false);
      current.current = null;
      if (event.error !== "canceled" && event.error !== "interrupted") setError("Suara belum dapat diputar. Coba lagi atau baca teks yang tersedia.");
    };
    current.current = utterance;
    setError("");
    setReading(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className={children ? "h-full" : ""}>
      <button type="button" onClick={speak} aria-label={reading ? "Hentikan pembacaan" : label} aria-pressed={reading} aria-describedby={error ? id : undefined} className={children ? `tombol h-full w-full ${className}` : `tombol bg-kertas-terang text-base ${className}`}>
        {children || <><SpeakerIcon /><span>{reading ? "Hentikan" : "Bacakan"}</span></>}
        {children && <span className="mt-auto flex items-center gap-2 text-sm font-bold"><SpeakerIcon size={20} />{reading ? "Hentikan" : "Ketuk & dengarkan"}</span>}
      </button>
      {error && <p id={id} role="status" className="mt-3 text-sm text-cabai">{error}</p>}
    </div>
  );
}
