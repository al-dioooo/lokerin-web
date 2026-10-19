"use client";

/*
 * Applicants for the employer. Opening an applicant is a Laci (reading and choosing);
 * "Loloskan" continues in the same Laci with the Tahap Berikutnya form; "Tidak lolos"
 * is a Dialog because it is final and the applicant is told right away. After Lolos the
 * same form adds another Tahap Berikutnya, for example an interview after the first chat.
 */

import { useState } from "react";
import { IconBrandWhatsapp, IconCheck, IconFileCv, IconMapPin, IconPhone, IconUser, IconX } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { RatingKontak } from "../app/RatingKontak";
import { Laci } from "../lapis/Laci";
import { api, apiAktif, GalatApi, urlBertoken } from "@/lib/api/klien";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { useBukaDariTautan } from "@/lib/api/tautan";
import { waktuLalu } from "@/lib/api/adaptor";
import type { LamaranApi, TahapApi } from "@/lib/api/tipe";

const LABEL_STATUS: Record<LamaranApi["status"], { teks: string; kelas: string }> = {
  terkirim: { teks: "Baru", kelas: "bg-jingga-muda text-jingga-tua" },
  dilihat: { teks: "Sudah dilihat", kelas: "bg-kabut text-abu" },
  lolos: { teks: "Lolos", kelas: "bg-daun-muda text-daun" },
  tidak_lolos: { teks: "Tidak lolos", kelas: "bg-kabut text-abu" },
};

const JENIS_TAHAP: { id: TahapApi["jenis"]; label: string; contoh: string }[] = [
  { id: "whatsapp", label: "Chat WhatsApp", contoh: "Nomor WhatsApp-mu, misalnya 0812 3456 7890" },
  { id: "alamat", label: "Datang ke tempat", contoh: "Alamat dan jamnya, misalnya Jl. Kampus 12, besok jam 9" },
  { id: "meet", label: "Wawancara online", contoh: "Tautan Google Meet dan jamnya" },
];

export function DaftarPelamar() {
  const daftar = useApi<{ lamaran: LamaranApi[] }>("/pemberi/lamaran");
  const [dipilih, setDipilih] = useState<LamaranApi | null>(null);
  const [tahapan, setTahapan] = useState<"lihat" | "jenis" | "detail" | "selesai">("lihat");
  const [jenis, setJenis] = useState<TahapApi["jenis"] | null>(null);
  const [detail, setDetail] = useState("");
  const [tolak, setTolak] = useState(false);
  const [galat, setGalat] = useState("");
  const [proses, setProses] = useState(false);

  useLangsung(null, (p) => {
    if (p.type === "lamaran.masuk") daftar.muatUlang();
  });

  async function buka(l: LamaranApi) {
    setDipilih(l);
    setTahapan("lihat");
    setJenis(null);
    setDetail("");
    setGalat("");
    if (l.status === "terkirim") {
      try {
        const hasil = await api<LamaranApi>(`/lamaran/${l.id}/dilihat`, { method: "POST" });
        setDipilih(hasil);
        daftar.muatUlang();
      } catch {}
    }
  }

  useBukaDariTautan(daftar.data?.lamaran, (l) => void buka(l));

  async function loloskan() {
    if (!dipilih || !jenis) return;
    setProses(true);
    setGalat("");
    try {
      const jalur = dipilih.status === "lolos" ? "tahap" : "lolos";
      const hasil = await api<LamaranApi>(`/lamaran/${dipilih.id}/${jalur}`, { method: "POST", body: { jenis, detail: detail.trim() } });
      setDipilih(hasil);
      setTahapan("selesai");
      daftar.muatUlang();
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum terkirim. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  async function tidakLolos() {
    if (!dipilih) return;
    const hasil = await api<LamaranApi>(`/lamaran/${dipilih.id}/tidak-lolos`, { method: "POST" });
    setDipilih(hasil);
    daftar.muatUlang();
  }

  if (!apiAktif) return <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-abu">Daftar pelamar butuh sambungan ke server.</p>;

  const lamaran = daftar.data?.lamaran ?? [];
  const l = dipilih;
  const bisaPutuskan = l && (l.status === "terkirim" || l.status === "dilihat");
  const tahapTambahan = l?.status === "lolos" && l.tahap_berikutnya.length > 0;
  const mulaiTahap = () => {
    setJenis(null);
    setDetail("");
    setGalat("");
    setTahapan("jenis");
  };

  const aksi =
    l && tahapan === "lihat" && bisaPutuskan ? (
      <>
        <button type="button" className="tombol tombol-utama" onClick={() => setTahapan("jenis")}><IconCheck size={20} />Loloskan</button>
        <button type="button" className="tombol tombol-garis" onClick={() => setTolak(true)}>Tidak lolos</button>
      </>
    ) : l && (tahapan === "lihat" || tahapan === "selesai") && l.status === "lolos" ? (
      <button type="button" className="tombol tombol-garis min-h-14" onClick={mulaiTahap}>Tambah tahap berikutnya</button>
    ) : tahapan === "detail" ? (
      <button type="button" className="tombol tombol-utama" disabled={detail.trim().length < 3 || proses} onClick={() => void loloskan()}>{proses ? "Mengirim..." : "Kirim ke pelamar"}</button>
    ) : undefined;

  return (
    <div className="grid grid-cols-1 gap-5">
      <h1 className="text-[1.9rem] leading-tight">Pelamar</h1>
      {daftar.memuat && <p className="text-abu">Memuat...</p>}
      {!daftar.memuat && !lamaran.length && <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-[15px] text-abu">Belum ada pelamar. Lamaran baru muncul di sini tanpa perlu dimuat ulang.</p>}
      <ul className="grid grid-cols-1 gap-2">
        {lamaran.map((x) => (
          <li key={x.id}>
            <button type="button" className="baris-lowongan w-full text-left" onClick={() => void buka(x)}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-kabut"><IconUser size={24} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-tight">{x.pencari.nama}</span>
                <span className="block truncate text-[15px] text-abu">{x.persona.judul} · untuk {x.lowongan.judul}</span>
                <span className="mt-1 block text-sm text-abu">{waktuLalu(x.dikirim_pada)}</span>
              </span>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${LABEL_STATUS[x.status].kelas}`}>{LABEL_STATUS[x.status].teks}</span>
            </button>
          </li>
        ))}
      </ul>

      <Laci
        buka={l !== null}
        onTutup={() => setDipilih(null)}
        label={tahapan === "lihat" ? `Pelamar · ${l?.lowongan.judul ?? ""}` : "Tahap berikutnya"}
        judul={tahapan === "lihat" ? (l?.pencari.nama ?? "") : tahapan === "jenis" ? (tahapTambahan ? "Tahap apa lagi berikutnya?" : "Bagaimana pelamar menghubungimu?") : tahapan === "detail" ? JENIS_TAHAP.find((j) => j.id === jenis)?.label ?? "" : "Pelamar sudah diberi tahu"}
        aksi={aksi}
      >
        {l && tahapan === "lihat" && (
          <div className="grid gap-4">
            <p className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${LABEL_STATUS[l.status].kelas}`}>{LABEL_STATUS[l.status].teks}</p>
            <section className="rounded-2xl bg-kertas p-4">
              <p className="piksel text-[11px] uppercase text-jingga-tua">CV {l.persona.judul}</p>
              <p className="mt-1">{l.persona.ringkasan}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">{l.persona.keahlian.map((k) => <li key={k} className="chip-kategori py-1 pl-3 text-[13px]">{k}</li>)}</ul>
            </section>
            {l.pesan && <blockquote className="rounded-2xl border border-garis p-4 text-[17px]">&ldquo;{l.pesan}&rdquo;</blockquote>}
            <p className="flex items-center gap-2 text-[15px] text-abu"><IconMapPin size={18} />{l.pencari.kota}</p>
            {l.pencari.kontak_disembunyikan ? (
              <p className="flex items-start gap-2 rounded-2xl bg-kabut p-3 text-[15px] text-abu"><IconPhone size={18} className="mt-0.5 shrink-0" />Kontak pelamar terlihat setelah kamu meloloskannya.</p>
            ) : (
              <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-3 text-[15px] font-bold text-daun"><IconPhone size={18} />{l.pencari.telepon ?? l.pencari.email}</p>
            )}
            {l.cv_khusus_id && (
              <a href={urlBertoken(`/cv/${l.cv_khusus_id}/pdf`)} target="_blank" rel="noopener noreferrer" className="tombol tombol-garis"><IconFileCv size={20} />Buka CV Khusus</a>
            )}
            {l.tahap_berikutnya.length > 0 && (
              <section>
                <h3 className="text-base">Tahap berikutnya yang kamu kirim</h3>
                <ul className="mt-2 grid gap-2">{l.tahap_berikutnya.map((t) => <li key={t.id} className="rounded-2xl border border-garis p-3 text-[15px]">{t.detail}</li>)}</ul>
              </section>
            )}
            {l.status === "lolos" && <RatingKontak lamaranId={l.id} sisi="pemberi" untuk={l.pencari.nama} />}
          </div>
        )}

        {l && tahapan === "jenis" && (
          <div className="grid gap-2.5">
            {JENIS_TAHAP.map((j) => (
              <button key={j.id} type="button" className="alur-pilihan" aria-pressed={jenis === j.id} onClick={() => { setJenis(j.id); window.setTimeout(() => setTahapan("detail"), 200); }}>
                <span className="flex items-center gap-2">{j.id === "whatsapp" && <IconBrandWhatsapp size={22} />}{j.label}</span>
                {jenis === j.id && <IconCheck size={22} />}
              </button>
            ))}
          </div>
        )}

        {l && tahapan === "detail" && (
          <div className="grid gap-3">
            <label htmlFor="detail-tahap" className="text-[17px] text-abu">{JENIS_TAHAP.find((j) => j.id === jenis)?.contoh}</label>
            <textarea id="detail-tahap" autoFocus rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} className="input-mulai min-h-28 py-3 text-lg" />
            <p className="text-[15px] text-abu">Setelah dikirim, {l.pencari.nama.split(" ")[0]} langsung diberi tahu{l.status === "lolos" ? "." : " dan kontaknya terbuka untukmu."}</p>
            {galat && <p role="alert" className="rounded-2xl bg-merah-muda p-3 text-sm text-merah">{galat}</p>}
          </div>
        )}

        {l && tahapan === "selesai" && (
          <div className="grid gap-3">
            <p className="flex items-center gap-2 rounded-2xl bg-daun-muda p-4 text-[17px] font-bold text-daun"><IconCheck size={22} />{l.tahap_berikutnya.length > 1 ? `Tahap baru terkirim ke ${l.pencari.nama}.` : `${l.pencari.nama} lolos ke tahap berikutnya.`}</p>
            {l.pencari.telepon && <p className="text-[17px]">Kontak pelamar: <strong>{l.pencari.telepon}</strong></p>}
          </div>
        )}
      </Laci>

      <Dialog buka={tolak} onTutup={() => setTolak(false)} bahaya judul={`${l?.pencari.nama ?? "Pelamar"} tidak lolos?`} labelYa="Ya, tidak lolos" onYa={tidakLolos} ikon={<span className="grid size-12 place-items-center rounded-full bg-merah-muda text-merah"><IconX size={24} /></span>}>
        Pelamar langsung diberi tahu, dan keputusan ini tidak bisa dibatalkan.
      </Dialog>
    </div>
  );
}
