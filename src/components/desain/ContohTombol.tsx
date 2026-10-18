"use client";

import { useState } from "react";
import { Tombol } from "../ui/Tombol";

export function ContohTombol() {
  const [message, setMessage] = useState("Ketuk tombol untuk mencobanya.");
  return <div><div className="flex flex-wrap items-center gap-4"><Tombol size="besar" onClick={() => setMessage("Tombol utama ditekan. Belum ada lamaran yang dikirim.")}>Saya bisa</Tombol><Tombol variant="halus" onClick={() => setMessage("Tombol halus ditekan.")}>Cari di dekatku</Tombol><Tombol variant="garis" size="kecil" onClick={() => setMessage("Tombol garis ditekan.")}>Kembali</Tombol><Tombol disabled>Belum tersedia</Tombol></div><p role="status" className="mt-5 text-base text-abu">{message}</p></div>;
}
