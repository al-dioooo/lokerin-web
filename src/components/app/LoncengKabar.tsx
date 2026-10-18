"use client";

/*
 * The bell in the app header. It opens a Laci with recent news about Lamaran: new applicants for
 * an employer (lamaran.masuk), and seen, passed or declined for a worker (lamaran.status). The list
 * is read from the server and reloads whenever one of those live events arrives.
 */

import { useState, useSyncExternalStore } from "react";
import { IconBell, IconCircleCheck, IconEye, IconUserCheck, IconX } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { TautanArah } from "./TautanArah";
import { waktuLalu } from "@/lib/api/adaptor";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { apiAktif } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";
import type { LamaranApi } from "@/lib/api/tipe";
import { LOWONGAN_TAYANG } from "@/lib/data";

type Kabar = { id: string; jenis: "masuk" | "dilihat" | "lolos" | "tahap" | "tidak_lolos"; teks: string; waktu: string; href: string };

const KUNCI_DIBACA = "lokerin-kabar-dibaca";
const IKON = { masuk: IconUserCheck, dilihat: IconEye, lolos: IconCircleCheck, tahap: IconCircleCheck, tidak_lolos: IconX };

function kabarPemberi(daftar: LamaranApi[]): Kabar[] {
  return daftar.map((l) => ({ id: `masuk-${l.id}`, jenis: "masuk", teks: `${l.pencari.nama} melamar ${l.lowongan.judul}`, waktu: l.dikirim_pada, href: "/app/pelamar" }));
}

function kabarPencari(daftar: LamaranApi[]): Kabar[] {
  return daftar.flatMap((l): Kabar[] => {
    const usaha = l.pemberi_kerja.nama_usaha;
    const waktu = l.diputuskan_pada ?? l.dilihat_pada;
    if (!waktu || l.status === "terkirim") return [];
    const jenis = l.status === "lolos" && l.tahap_berikutnya.length > 1 ? "tahap" : l.status;
    const teks = {
      dilihat: `${usaha} sudah membuka lamaranmu untuk ${l.lowongan.judul}`,
      lolos: `Kamu lolos untuk ${l.lowongan.judul}. Lihat tahap berikutnya dari ${usaha}`,
      tahap: `${usaha} mengirim tahap baru untuk ${l.lowongan.judul}`,
      tidak_lolos: `${usaha} belum memilihmu untuk ${l.lowongan.judul}`,
    }[jenis];
    return [{ id: `${jenis}-${l.id}`, jenis, teks, waktu, href: "/app/lamaran" }];
  });
}

// Sample news for the unconnected demo, from the same sample jobs the other screens show.
const CONTOH: Kabar[] = LOWONGAN_TAYANG.slice(0, 2).map((l, i) => ({
  id: `contoh-${l.id}`,
  jenis: i === 0 ? "dilihat" : "lolos",
  teks: i === 0 ? `${l.usaha} sudah membuka lamaranmu untuk ${l.judul}` : `Kamu lolos untuk ${l.judul}. Lihat tahap berikutnya dari ${l.usaha}`,
  waktu: "",
  href: "/app",
}));

function bacaDibaca() {
  try {
    return localStorage.getItem(KUNCI_DIBACA) ?? "";
  } catch {
    return "";
  }
}

export function LoncengKabar() {
  const { pengguna } = useSesi();
  const [buka, setBuka] = useState(false);
  const path = !apiAktif || !pengguna ? null : pengguna.peran === "pemberi" ? "/pemberi/lamaran" : "/pencari/lamaran";
  const daftar = useApi<{ lamaran: LamaranApi[] }>(path);
  const [baru, setBaru] = useState(0);
  // When the drawer was last opened; news after that counts as unread. Kept per browser only.
  const [dibaca, setDibaca] = useState<string | null>(null);
  const dibacaTersimpan = useSyncExternalStore(() => () => {}, bacaDibaca, () => "");
  const batasBaca = dibaca ?? dibacaTersimpan;

  useLangsung(null, (p) => {
    if (p.type !== "lamaran.masuk" && p.type !== "lamaran.status") return;
    setBaru((n) => n + 1);
    daftar.muatUlang();
  }, { aktif: Boolean(path) });

  const semua = !apiAktif ? CONTOH : (pengguna?.peran === "pemberi" ? kabarPemberi : kabarPencari)(daftar.data?.lamaran ?? []);
  const kabar = semua.toSorted((a, b) => b.waktu.localeCompare(a.waktu)).slice(0, 20);
  const belumDibaca = apiAktif ? kabar.filter((k) => k.waktu > batasBaca).length : 0;
  const titik = Math.max(belumDibaca, baru);

  function bukaLaci() {
    const sekarang = new Date().toISOString();
    try {
      localStorage.setItem(KUNCI_DIBACA, sekarang);
    } catch {}
    setDibaca(sekarang);
    setBaru(0);
    setBuka(true);
  }

  return (
    <>
      <button type="button" onClick={bukaLaci} aria-haspopup="dialog" className="icon-button relative size-10 min-h-10 min-w-10 border border-garis bg-white" aria-label={titik ? `Kabar lamaran, ${titik} baru` : "Kabar lamaran"}>
        <IconBell size={20} />
        {titik > 0 && <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-jingga ring-2 ring-white" aria-hidden="true" />}
      </button>
      <Laci buka={buka} onTutup={() => setBuka(false)} label="Kabar" judul="Kabar lamaran" keterangan={pengguna?.peran === "pemberi" ? "Pelamar baru untuk lowonganmu." : "Kabar dari usaha yang kamu lamar."}>
        {apiAktif && !pengguna ? (
          <p className="rounded-2xl bg-kabut p-4 text-[17px] text-abu">Masuk dulu untuk melihat kabar lamaranmu.</p>
        ) : daftar.memuat && !daftar.data ? (
          <p className="py-6 text-center text-abu" role="status">Memuat kabar...</p>
        ) : kabar.length ? (
          <ul className="grid gap-2">
            {kabar.map((k) => {
              const Ikon = IKON[k.jenis];
              return (
                <li key={k.id}>
                  <TautanArah arah="maju" href={k.href} onClick={() => setBuka(false)} className="flex min-h-14 items-start gap-3 rounded-2xl border border-garis bg-white p-3">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full ${k.jenis === "tidak_lolos" ? "bg-kabut text-abu" : k.jenis === "dilihat" ? "bg-jingga-muda text-jingga-tua" : "bg-daun-muda text-daun"}`}><Ikon size={20} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-snug">{k.teks}</span>
                      {k.waktu && <span className="mt-0.5 block text-sm text-abu">{waktuLalu(k.waktu)}</span>}
                    </span>
                  </TautanArah>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-[15px] text-abu">Belum ada kabar. {pengguna?.peran === "pemberi" ? "Pelamar baru muncul di sini begitu masuk." : "Begitu usaha membuka atau memutuskan lamaranmu, kabarnya muncul di sini."}</p>
        )}
      </Laci>
    </>
  );
}
