"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconChevronRight, IconShieldCheck } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { useApi } from "@/lib/api/hooks";
import { apiAktif, GalatApi } from "@/lib/api/klien";
import { masukDemo } from "@/lib/api/sesi";
import type { AkunDemo } from "@/lib/api/tipe";

/** For judges: try Lokerin as a ready-made worker or employer without signing up. */
export function PilihAkunContoh() {
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [proses, setProses] = useState<string | null>(null);
  const [galat, setGalat] = useState("");
  const { data, memuat } = useApi<{ utama: AkunDemo[] }>(buka ? "/auth/akun-demo" : null);

  if (!apiAktif) return null;

  async function pilih(akun: AkunDemo) {
    setProses(akun.key);
    setGalat("");
    try {
      await masukDemo(akun.key);
      router.push("/app");
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum bisa masuk. Coba lagi.");
      setProses(null);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setBuka(true)} className="mt-4 inline-flex min-h-12 items-center gap-1.5 text-[15px] font-semibold text-jingga-tua underline-offset-4 hover:underline">
        Coba pakai akun contoh <IconChevronRight size={16} />
      </button>
      <Laci buka={buka} onTutup={() => setBuka(false)} label="Untuk juri dan tamu" judul="Pilih akun contoh" keterangan="Semua data di akun ini fiktif. Kamu bisa mencoba melamar, memasang lowongan, dan ngobrol.">
        {memuat && <p className="py-6 text-center text-abu">Memuat akun...</p>}
        <ul className="grid gap-2.5">
          {data?.utama.map((akun) => (
            <li key={akun.key}>
              <button type="button" className="alur-pilihan" disabled={proses !== null} aria-busy={proses === akun.key} onClick={() => void pilih(akun)}>
                <span className="min-w-0 text-left">
                  <span className="block">{akun.pemberi_kerja?.nama_usaha ?? akun.nama}</span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-abu">
                    {akun.peran === "pemberi" ? "Pemberi Kerja" : "Pencari Kerja"} · {akun.kota}
                    {akun.pemberi_kerja?.terverifikasi && <span className="inline-flex items-center gap-1 text-daun"><IconShieldCheck size={14} />Terverifikasi</span>}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-abu">{proses === akun.key ? "Masuk..." : <IconChevronRight size={20} />}</span>
              </button>
            </li>
          ))}
        </ul>
        {galat && <p role="alert" className="mt-3 rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
      </Laci>
    </>
  );
}
