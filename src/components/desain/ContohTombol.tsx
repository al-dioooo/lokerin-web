"use client";

import { useState } from "react";
import { Tombol } from "../ui/Tombol";

export function ContohTombol() {
  const [message, setMessage] = useState("Ketuk tombol untuk mencoba keadaan ditekan.");
  return <div><div className="flex flex-wrap items-center gap-5"><Tombol size="besar" onClick={() => setMessage("Tombol utama ditekan. Ini contoh, belum mengirim lamaran.")}>Saya bisa!</Tombol><Tombol variant="sorot" onClick={() => setMessage("Tombol sorot ditekan.")}>Cari di dekatku</Tombol><Tombol variant="garis" size="kecil" onClick={() => setMessage("Tombol garis ditekan.")}>Kembali</Tombol><Tombol variant="garis" disabled>Belum tersedia</Tombol></div><p role="status" className="mt-6 text-base text-abu">{message}</p></div>;
}
