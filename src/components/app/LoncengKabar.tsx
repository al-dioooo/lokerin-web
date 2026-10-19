"use client";

/*
 * The bell in the app header. It opens a Laci with the person's Kabar (ADR 0008): stored on the
 * server, so they are still there after the app was closed, and pushed in live as `kabar.baru`.
 * Opening the drawer marks them read. The bottom of the drawer turns push on or off.
 */

import { useState } from "react";
import { IconBell } from "../icons/tabler";
import { Laci } from "../lapis/Laci";
import { IkonKabar } from "./IkonKabar";
import { PengaturanPush } from "./PengaturanPush";
import { TautanArah } from "./TautanArah";
import { waktuLalu } from "@/lib/api/adaptor";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { api, apiAktif } from "@/lib/api/klien";
import { useSesi } from "@/lib/api/sesi";
import type { DaftarKabarApi, KabarApi } from "@/lib/api/tipe";
import { LOWONGAN_TAYANG } from "@/lib/data";

// Sample news for the unconnected demo, from the same sample jobs the other screens show.
const CONTOH: KabarApi[] = LOWONGAN_TAYANG.slice(0, 2).map((l, i) => ({
  id: `contoh-${l.id}`,
  jenis: i === 0 ? "lamaran_dilihat" : "lamaran_lolos",
  judul: i === 0 ? "Lamaranmu sudah dilihat" : "Kamu lolos!",
  isi: i === 0 ? `${l.usaha} sudah melihat lamaranmu untuk ${l.judul}.` : `${l.usaha} meloloskan lamaranmu untuk ${l.judul}.`,
  tautan: "/app",
  dibaca: true,
  dibuat_pada: "",
}));

export function LoncengKabar() {
  const { pengguna } = useSesi();
  const [buka, setBuka] = useState(false);
  const masuk = apiAktif && Boolean(pengguna);
  const daftar = useApi<DaftarKabarApi>(masuk ? "/kabar" : null);

  useLangsung(null, (p) => {
    if (p.type === "kabar.baru") daftar.muatUlang();
  }, { aktif: masuk, onTersambung: () => daftar.muatUlang() });

  const kabar = !apiAktif ? CONTOH : (daftar.data?.kabar ?? []);
  const belum = daftar.data?.belum_dibaca ?? 0;

  function bukaLaci() {
    setBuka(true);
    if (masuk && belum > 0) void api<DaftarKabarApi>("/kabar/baca", { method: "POST", body: {} }).then(() => daftar.muatUlang()).catch(() => {});
  }

  return (
    <>
      <button type="button" onClick={bukaLaci} aria-haspopup="dialog" className="icon-button relative size-10 min-h-10 min-w-10 border border-garis bg-white" aria-label={belum ? `Kabar, ${belum} baru` : "Kabar"}>
        <IconBell size={20} />
        {belum > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-jingga px-1 text-[11px] font-extrabold leading-5 text-white ring-2 ring-white" aria-hidden="true">{belum > 9 ? "9+" : belum}</span>}
      </button>
      <Laci buka={buka} onTutup={() => setBuka(false)} label="Kabar" judul="Kabar" keterangan={pengguna?.peran === "pemberi" ? "Pelamar baru dan kabar lowonganmu." : "Kabar lamaranmu dan lowongan mendadak di dekatmu."}>
        {apiAktif && !pengguna ? (
          <p className="rounded-2xl bg-kabut p-4 text-[17px] text-abu">Masuk dulu untuk melihat kabarmu.</p>
        ) : daftar.memuat && !daftar.data ? (
          <p className="py-6 text-center text-abu" role="status">Memuat kabar...</p>
        ) : kabar.length ? (
          <ul className="grid gap-2">
            {kabar.map((k) => (
              <li key={k.id}>
                <TautanArah arah="maju" href={k.tautan} onClick={() => setBuka(false)} className={`flex min-h-14 items-start gap-3 rounded-2xl border p-3 ${k.dibaca ? "border-garis bg-white" : "border-[#F7C9A0] bg-jingga-muda"}`}>
                  <IkonKabar jenis={k.jenis} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-snug">{k.judul}</span>
                    <span className="block text-[15px] leading-snug">{k.isi}</span>
                    {k.dibuat_pada && <span className="mt-0.5 block text-sm text-abu">{waktuLalu(k.dibuat_pada)}</span>}
                  </span>
                </TautanArah>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-[15px] text-abu">Belum ada kabar. {pengguna?.peran === "pemberi" ? "Pelamar baru muncul di sini begitu masuk." : "Begitu usaha membuka atau memutuskan lamaranmu, kabarnya muncul di sini."}</p>
        )}
        {masuk && <PengaturanPush />}
      </Laci>
    </>
  );
}
