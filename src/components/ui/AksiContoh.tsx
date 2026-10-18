"use client";

import { useId, useRef, type ReactNode } from "react";
import { Tombol, type TombolProps } from "./Tombol";

const pesan = {
  ngobrol: { judul: "Mulai ngobrol", isi: "Nantinya kamu bisa bercerita tentang pengalaman kerja dan lokasi yang kamu cari. Fitur ngobrol masih disiapkan. Mikrofon belum diaktifkan." },
  pasang: { judul: "Pasang lowongan", isi: "Siapkan jenis pekerjaan, upah, lokasi, dan jadwalnya. Fitur pasang lowongan masih disiapkan. Belum ada lowongan yang diterbitkan." },
  lamar: { judul: "Tertarik pekerjaan ini?", isi: "Ini contoh lowongan. Fitur melamar masih disiapkan. Belum ada lamaran yang dikirim." },
};

export function AksiContoh({ aksi = "ngobrol", children, ...props }: Omit<TombolProps, "onClick"> & { aksi?: keyof typeof pesan; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  return <><Tombol {...props} onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">{children}</Tombol><dialog ref={dialog} className="demo-dialog" aria-labelledby={`${id}-judul`} aria-describedby={`${id}-isi`}><p className="eyebrow mb-5 text-abu">Pratinjau Lokerin</p><h2 id={`${id}-judul`} className="text-2xl">{pesan[aksi].judul}</h2><p id={`${id}-isi`} className="mb-7 mt-4 text-base text-abu">{pesan[aksi].isi}</p><Tombol variant="garis" onClick={() => dialog.current?.close()}>Tutup</Tombol></dialog></>;
}
