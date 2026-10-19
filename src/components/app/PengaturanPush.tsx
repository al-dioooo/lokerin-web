"use client";

import { useEffect, useState } from "react";
import { IconBell } from "../icons/tabler";
import { cekServerPush, matikanPush, nyalakanPush, statusPush, type StatusPush } from "@/lib/push";

export const PESAN_PUSH: Record<Exclude<StatusPush, "aktif" | "mati">, string> = {
  ditolak: "Izin pemberitahuan diblokir. Buka pengaturan browser, lalu izinkan pemberitahuan untuk Lokerin.",
  perlu_dipasang: "Di iPhone, tambahkan Lokerin ke Layar Utama dulu: ketuk tombol Bagikan, lalu Tambah ke Layar Utama. Setelah itu buka Lokerin dari Layar Utama.",
  tidak_didukung: "Browser ini belum bisa menerima pemberitahuan. Kabar tetap muncul di sini.",
  server_mati: "Pemberitahuan ke HP belum aktif. Kabar tetap muncul di sini.",
};

/** The push switch at the bottom of the Kabar drawer. */
export function PengaturanPush() {
  const [status, setStatus] = useState<StatusPush | null>(null);
  const [proses, setProses] = useState(false);

  useEffect(() => {
    let hidup = true;
    void cekServerPush();
    statusPush().then((s) => hidup && setStatus(s)).catch(() => hidup && setStatus("tidak_didukung"));
    return () => {
      hidup = false;
    };
  }, []);

  async function ubah() {
    setProses(true);
    try {
      setStatus(status === "aktif" ? await matikanPush() : await nyalakanPush());
    } catch {
      setStatus("tidak_didukung");
    } finally {
      setProses(false);
    }
  }

  if (!status) return null;
  return (
    <section className="mt-5 grid gap-2 rounded-2xl bg-kabut p-4" aria-labelledby="judul-push">
      <h3 id="judul-push" className="flex items-center gap-2 text-[17px]"><IconBell size={20} />Kabar ke HP</h3>
      {status === "aktif" || status === "mati" ? (
        <>
          <p className="text-[15px] text-abu">{status === "aktif" ? "Kabar penting juga muncul di HP-mu walau Lokerin tertutup." : "Mau dikabari walau Lokerin tertutup? Misalnya saat kamu lolos atau ada pelamar baru."}</p>
          <button type="button" className={`tombol min-h-14 text-lg ${status === "aktif" ? "tombol-garis" : "tombol-utama"}`} disabled={proses} onClick={() => void ubah()}>
            {proses ? "Sebentar..." : status === "aktif" ? "Matikan kabar ke HP" : "Nyalakan kabar ke HP"}
          </button>
        </>
      ) : (
        <p className="text-[15px] text-abu">{PESAN_PUSH[status]}</p>
      )}
    </section>
  );
}
