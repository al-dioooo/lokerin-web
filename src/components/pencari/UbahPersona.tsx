"use client";

/*
 * Edits one Persona: the CV title and summary, and the Preferensi Wajib that matching never breaks
 * (area, minimum pay, willing to move). Skills and the Fakta behind them stay as they are; those
 * come from what the person told Lokerin.
 */

import { useState } from "react";
import { Laci } from "../lapis/Laci";
import { AREA } from "../mulai/AlurMulai";
import { api, GalatApi } from "@/lib/api/klien";
import type { PersonaApi } from "@/lib/api/tipe";

export function UbahPersona({ persona, onTutup, onTersimpan }: { persona: PersonaApi | null; onTutup: () => void; onTersimpan: () => void }) {
  return (
    <Laci buka={persona !== null} onTutup={onTutup} label="CV-mu" judul={persona ? `Ubah CV ${persona.judul}` : ""}>
      {persona && <Isian key={persona.id} persona={persona} onTersimpan={onTersimpan} />}
    </Laci>
  );
}

function Isian({ persona, onTersimpan }: { persona: PersonaApi; onTersimpan: () => void }) {
  const pref = persona.preferensi ?? { kota: [] };
  const [judul, setJudul] = useState(persona.judul);
  const [ringkasan, setRingkasan] = useState(persona.ringkasan);
  const [kota, setKota] = useState<string[]>(pref.kota ?? []);
  const [upah, setUpah] = useState(pref.upah_min ? String(pref.upah_min) : "");
  // Older Persona have no unit; an amount this large can only be monthly.
  const [satuan, setSatuan] = useState<"harian" | "bulanan">(pref.upah_satuan ?? ((pref.upah_min ?? 0) >= 300_000 ? "bulanan" : "harian"));
  const [pindah, setPindah] = useState(Boolean(pref.mau_pindah));
  // Keep areas saved earlier (for example a whole city) as chips, so saving never drops them.
  const [pilihanKota] = useState(() => [...new Set([...(pref.kota ?? []), ...AREA])]);
  const [proses, setProses] = useState(false);
  const [galat, setGalat] = useState("");

  async function simpan() {
    setProses(true);
    setGalat("");
    try {
      const angka = Number(upah.replace(/\D/g, ""));
      await api(`/persona/${encodeURIComponent(persona.id)}`, {
        method: "PATCH",
        body: {
          judul: judul.trim(),
          ringkasan: ringkasan.trim(),
          keahlian: persona.keahlian,
          fakta_ids: persona.fakta_ids,
          preferensi: { ...pref, kota, mau_pindah: pindah, ...(angka ? { upah_min: angka, upah_satuan: satuan } : { upah_min: undefined }) },
        },
      });
      onTersimpan();
    } catch (e) {
      setGalat(e instanceof GalatApi ? e.message : "Belum tersimpan. Coba lagi.");
    } finally {
      setProses(false);
    }
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-1.5 text-[15px] font-semibold text-abu">
        Nama CV
        <input value={judul} onChange={(e) => setJudul(e.target.value)} className="input-mulai min-h-14 text-lg text-tinta" maxLength={80} />
      </label>
      <label className="grid gap-1.5 text-[15px] font-semibold text-abu">
        Ringkasan
        <textarea value={ringkasan} onChange={(e) => setRingkasan(e.target.value)} rows={3} maxLength={600} className="input-mulai min-h-24 py-3 text-[17px] text-tinta" />
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold text-abu">Mau kerja di mana?</legend>
        <div className="flex flex-wrap gap-2">
          {pilihanKota.map((a) => (
            <button key={a} type="button" aria-pressed={kota.includes(a)} onClick={() => setKota((k) => (k.includes(a) ? k.filter((x) => x !== a) : [...k, a]))} className="chip-peta min-h-12 text-[15px]">{a}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold text-abu">Upah paling sedikit (boleh kosong)</legend>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Rp</span>
          <input inputMode="numeric" value={upah} onChange={(e) => setUpah(e.target.value.replace(/[^\d.]/g, ""))} placeholder={satuan === "harian" ? "80000" : "2000000"} className="input-mulai min-h-14 flex-1 text-lg text-tinta" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["harian", "bulanan"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={satuan === s} onClick={() => setSatuan(s)} className="chip-peta min-h-12 justify-center text-[15px]">{s === "harian" ? "Per hari" : "Per bulan"}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-[15px] font-semibold text-abu">Mau pindah kota untuk kerja?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((v) => (
            <button key={String(v)} type="button" aria-pressed={pindah === v} onClick={() => setPindah(v)} className="chip-peta min-h-12 justify-center text-[15px]">{v ? "Mau" : "Tidak"}</button>
          ))}
        </div>
      </fieldset>

      {galat && <p role="alert" className="text-sm text-merah">{galat}</p>}
      <button type="button" className="tombol tombol-utama min-h-14 text-lg" disabled={proses || judul.trim().length < 2} onClick={() => void simpan()}>{proses ? "Menyimpan..." : "Simpan"}</button>
    </div>
  );
}
