"use client";

import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";
import { Tombol, type TombolProps } from "./Tombol";

// Buttons on sample cards (landing page, /desain). The real action lives in the app, so the dialog
// says what this is a sample of and points to sign-in.
const pesan = {
  ngobrol: { judul: "Mulai ngobrol", isi: "Ngobrol ada di aplikasi Lokerin. Masuk dulu, lalu ceritakan kerja yang kamu cari lewat suara atau ketikan." },
  lamar: { judul: "Mau melamar?", isi: "Ini lowongan contoh, jadi belum bisa dilamar. Masuk untuk melihat lowongan sungguhan di dekatmu dan mengirim lamaran." },
  cv: { judul: "CV dan Kartu Kerja", isi: "Ini CV contoh milik Pak Darto. Masuk untuk menyusun CV dan Kartu Kerja dari pengalamanmu sendiri, lalu unduh PDF-nya atau bagikan ke WhatsApp." },
};

export function AksiContoh({ aksi = "ngobrol", children, ...props }: Omit<TombolProps, "onClick"> & { aksi?: keyof typeof pesan; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  return (
    <>
      <Tombol {...props} onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">{children}</Tombol>
      <dialog ref={dialog} className="demo-dialog" aria-labelledby={`${id}-judul`} aria-describedby={`${id}-isi`}>
        <p className="eyebrow mb-5 text-abu">Contoh</p>
        <h2 id={`${id}-judul`} className="text-2xl">{pesan[aksi].judul}</h2>
        <p id={`${id}-isi`} className="mb-7 mt-4 text-base text-abu">{pesan[aksi].isi}</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/masuk" className="tombol tombol-utama">Masuk</Link>
          <Tombol variant="garis" onClick={() => dialog.current?.close()}>Tutup</Tombol>
        </div>
      </dialog>
    </>
  );
}
