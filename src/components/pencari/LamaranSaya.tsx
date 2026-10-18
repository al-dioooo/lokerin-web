"use client";

import Link from "next/link";
import { useState } from "react";
import { IconBrandWhatsapp, IconChevronRight, IconCircleCheck, IconMapPin, IconMessageCircle } from "../icons/tabler";
import { RatingKontak } from "../app/RatingKontak";
import { Laci } from "../lapis/Laci";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { apiAktif } from "@/lib/api/klien";
import { waktuLalu } from "@/lib/api/adaptor";
import type { LamaranApi, TahapApi } from "@/lib/api/tipe";

const STATUS: Record<LamaranApi["status"], { teks: string; kelas: string; arti: string }> = {
  terkirim: { teks: "Terkirim", kelas: "bg-kabut text-abu", arti: "Lamaranmu sudah sampai. Tunggu pemberi kerja membukanya." },
  dilihat: { teks: "Dilihat", kelas: "bg-jingga-muda text-jingga-tua", arti: "Pemberi kerja sudah membaca lamaranmu." },
  lolos: { teks: "Lolos", kelas: "bg-daun-muda text-daun", arti: "Selamat, kamu lolos. Ikuti tahap berikutnya di bawah." },
  tidak_lolos: { teks: "Tidak lolos", kelas: "bg-kabut text-abu", arti: "Kali ini belum cocok. Masih banyak lowongan lain di sekitarmu." },
};

function TautanTahap({ tahap }: { tahap: TahapApi }) {
  const nomor = tahap.detail.replace(/[^\d+]/g, "").replace(/^0/, "62").replace(/^\+/, "");
  if (tahap.jenis === "whatsapp" && nomor.length >= 9) {
    return <a href={`https://wa.me/${nomor}`} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama"><IconBrandWhatsapp size={20} />Chat lewat WhatsApp</a>;
  }
  const url = tahap.detail.match(/https?:\/\/\S+/)?.[0];
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama">Buka tautan wawancara</a>;
  if (tahap.jenis === "alamat") {
    return <a href={`https://www.google.com/maps/search/${encodeURIComponent(tahap.detail)}`} target="_blank" rel="noopener noreferrer" className="tombol tombol-utama"><IconMapPin size={20} />Buka di peta</a>;
  }
  return null;
}

export function LamaranSaya() {
  const daftar = useApi<{ lamaran: LamaranApi[] }>("/pencari/lamaran");
  const [dipilihId, setDipilihId] = useState<string | null>(null);
  useLangsung(null, (p) => {
    if (p.type === "lamaran.status") daftar.muatUlang();
  });

  if (!apiAktif) return <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-abu">Daftar lamaran butuh sambungan ke server.</p>;

  const lamaran = daftar.data?.lamaran ?? [];
  const l = lamaran.find((x) => x.id === dipilihId) ?? null;
  const tahapTerakhir = l?.tahap_berikutnya.at(-1);

  return (
    <div className="grid grid-cols-1 gap-5">
      <h1 className="text-[1.9rem] leading-tight">Lamaranku</h1>
      {daftar.memuat && !lamaran.length && <p className="text-abu">Memuat...</p>}
      {!daftar.memuat && !lamaran.length && (
        <div className="grid gap-3 rounded-3xl border border-dashed border-garis p-6 text-center">
          <p className="text-[17px] text-abu">Belum ada lamaran.</p>
          <Link href="/app" className="tombol tombol-utama">Cari lowongan</Link>
        </div>
      )}
      <ul className="grid grid-cols-1 gap-2">
        {lamaran.map((x) => (
          <li key={x.id}>
            <button type="button" className="baris-lowongan w-full text-left" onClick={() => setDipilihId(x.id)}>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-tight">{x.lowongan.judul}</span>
                <span className="block truncate text-[15px] text-abu">{x.pemberi_kerja.nama_usaha} · CV {x.persona.judul}</span>
                <span className="mt-1 block text-sm text-abu">Dikirim {waktuLalu(x.dikirim_pada).toLowerCase()}</span>
              </span>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${STATUS[x.status].kelas}`}>{STATUS[x.status].teks}</span>
              <IconChevronRight size={18} className="shrink-0 text-abu" />
            </button>
          </li>
        ))}
      </ul>

      <Laci buka={l !== null} onTutup={() => setDipilihId(null)} label={l?.pemberi_kerja.nama_usaha} judul={l?.lowongan.judul ?? ""} aksi={tahapTerakhir ? <TautanTahap tahap={tahapTerakhir} /> : undefined}>
        {l && (
          <div className="grid gap-4">
            <p className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${STATUS[l.status].kelas}`}>{STATUS[l.status].teks}</p>
            <p className="text-[17px]">{STATUS[l.status].arti}</p>
            <ol className="grid gap-2 border-l-2 border-garis pl-4 text-[15px]">
              <li><span className="font-bold">Terkirim</span> · {waktuLalu(l.dikirim_pada)}</li>
              {l.dilihat_pada && <li><span className="font-bold">Dilihat</span> · {waktuLalu(l.dilihat_pada)}</li>}
              {l.diputuskan_pada && <li><span className="font-bold">{STATUS[l.status].teks}</span> · {waktuLalu(l.diputuskan_pada)}</li>}
            </ol>
            {l.tahap_berikutnya.map((t) => (
              <section key={t.id} className="rounded-2xl border border-[#BFE3CF] bg-daun-muda p-4">
                <p className="flex items-center gap-2 font-bold text-daun"><IconCircleCheck size={20} />Tahap berikutnya</p>
                <p className="mt-2 flex items-start gap-2 text-[17px]"><IconMessageCircle size={20} className="mt-0.5 shrink-0" />{t.detail}</p>
                {t.catatan && <p className="mt-1 text-[15px] text-abu">{t.catatan}</p>}
              </section>
            ))}
            {l.status === "lolos" && <RatingKontak lamaranId={l.id} sisi="pelamar" untuk={l.pemberi_kerja.nama_usaha} />}
          </div>
        )}
      </Laci>
    </div>
  );
}
