"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getKategori } from "../icons/categories";
import { IconChevronRight, IconPlus, IconShieldCheck, IconUserCheck } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { KartuDraf } from "./KartuDraf";
import { kategoriDari } from "@/lib/api/adaptor";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { useSesi } from "@/lib/api/sesi";
import type { LowonganApi, MeApi } from "@/lib/api/tipe";

const STATUS: Record<LowonganApi["status"], string> = { draf: "Draf", terbit: "Tampil", terisi: "Sudah terisi", disembunyikan: "Disembunyikan" };

export function BerandaPemberi() {
  const router = useRouter();
  const { pengguna } = useSesi();
  const me = useApi<MeApi>("/me");
  const daftar = useApi<{ lowongan: LowonganApi[] }>("/pemberi/lowongan");
  const [dipilih, setDipilih] = useState<LowonganApi | null>(null);
  useLangsung(null, (p) => {
    if (p.type === "lamaran.masuk") daftar.muatUlang();
  });

  const usaha = me.data?.pemberi_kerja;
  const lowongan = daftar.data?.lowongan ?? [];
  const pelamarBaru = lowongan.reduce((n, l) => n + (l.jumlah_lamaran ?? 0), 0);

  return (
    <div className="grid grid-cols-1 gap-7">
      <section>
        <p className="text-[15px] text-abu">Halo, {pengguna?.nama?.split(" ")[0] ?? "kamu"}</p>
        <h1 className="text-[1.9rem] leading-tight">{usaha?.nama_usaha ?? "Usahamu"}</h1>
        {usaha && (
          <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${usaha.terverifikasi ? "bg-daun-muda text-daun" : "bg-[#FFF6DB] text-[#8A5A00]"}`}>
            <IconShieldCheck size={16} />
            {usaha.terverifikasi ? `Terverifikasi · ${usaha.yang_dicek.join(" · ")}` : usaha.status_verifikasi === "menunggu" ? "Sedang dicek Lokerin" : "Belum terverifikasi"}
          </p>
        )}
      </section>

      <Link href="/app/pasang" className="tombol tombol-utama min-h-16 text-lg"><IconPlus size={22} />Pasang lowongan</Link>

      {pelamarBaru > 0 && (
        <Link href="/app/pelamar" className="flex items-center gap-3 rounded-3xl border border-[#F7C9A0] bg-jingga-muda p-4">
          <span className="grid size-12 place-items-center rounded-full bg-white text-jingga-tua"><IconUserCheck size={24} /></span>
          <span className="flex-1"><span className="block text-lg font-extrabold">{pelamarBaru} pelamar</span><span className="text-[15px] text-jingga-tua">Lihat dan pilih yang cocok</span></span>
          <IconChevronRight size={22} className="text-jingga-tua" />
        </Link>
      )}

      <section aria-labelledby="judul-lowonganku">
        <h2 id="judul-lowonganku" className="mb-3 text-lg">Lowonganmu</h2>
        {daftar.memuat && <p className="text-abu">Memuat...</p>}
        {!daftar.memuat && !lowongan.length && <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-[15px] text-abu">Belum ada lowongan. Pasang yang pertama, cukup beberapa ketukan.</p>}
        <ul className="grid grid-cols-1 gap-2">
          {lowongan.map((l) => {
            const { Icon } = getKategori(kategoriDari(l));
            return (
              <li key={l.id}>
                <button type="button" className="baris-lowongan w-full text-left" onClick={() => setDipilih(l)}>
                  <span className="ubin-ikon"><Icon size={32} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight">{l.judul || "Tanpa judul"}</span>
                    <span className="mt-1 flex flex-wrap gap-x-3 text-sm text-abu">
                      <span className="font-bold text-tinta">{STATUS[l.status]}</span>
                      <span>{l.upah.label}</span>
                      <span>{l.jumlah_lamaran ?? 0} pelamar</span>
                    </span>
                  </span>
                  <IconChevronRight size={18} className="text-abu" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Laci buka={dipilih !== null} onTutup={() => setDipilih(null)} label="Lowonganmu" judul={dipilih?.judul ?? ""}>
        {dipilih && (
          <KartuDraf
            lowongan={dipilih}
            onBerubah={() => daftar.muatUlang()}
            onUbah={() => router.push("/app/pasang")}
          />
        )}
      </Laci>
    </div>
  );
}
