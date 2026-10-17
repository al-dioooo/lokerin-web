"use client";

import { useId, useState } from "react";
import { MicIcon } from "../icons/interface";

export function Mic({ className = "" }: { className?: string }) {
  const [notice, setNotice] = useState(false);
  const id = useId();
  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <button type="button" className="tombol relative size-40 flex-col rounded-full bg-kunyit p-5 text-arang" onClick={() => setNotice(true)} aria-describedby={id}>
        <span className="mic-ring" aria-hidden="true" />
        <MicIcon size={52} /><span className="text-lg">Mulai ngobrol</span>
      </button>
      <p id={id} role="status" className="max-w-72 text-center text-sm text-abu">
        {notice ? "Fitur ngobrol segera hadir. Ini pratinjau tampilan; mikrofon belum diaktifkan." : "Contoh tampilan · Fitur suara segera hadir"}
      </p>
    </div>
  );
}
