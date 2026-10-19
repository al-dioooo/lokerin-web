"use client";

import { useState } from "react";
import type { Lowongan } from "@/lib/data";
import { keLowongan } from "./adaptor";
import { api } from "./klien";
import { useLangsung } from "./hooks";
import type { LowonganApi } from "./tipe";

type Opsi = {
  /** Which newly published Lowongan belong in this list. */
  masuk: (l: LowonganApi) => boolean;
  /** Reloaded after the live connection drops and comes back, to catch what was missed. */
  muatUlang?: string;
};

/**
 * A job list that follows the live feed: a Lowongan Terbit lands at the top and a closed one leaves.
 * It starts from the list the server rendered, so without the API it is just that list.
 */
export function useDaftarLangsung(awal: Lowongan[], { masuk, muatUlang }: Opsi) {
  const [asal, setAsal] = useState(awal);
  const [daftar, setDaftar] = useState(awal);
  const [baru, setBaru] = useState<ReadonlySet<string>>(() => new Set());
  const [terakhir, setTerakhir] = useState<Lowongan | null>(null);
  if (asal !== awal) {
    setAsal(awal);
    setDaftar(awal);
    setBaru(new Set());
    setTerakhir(null);
  }

  useLangsung(
    null,
    (p) => {
      if (p.type === "lowongan.tutup") {
        const { id } = p.data as { id: string };
        setDaftar((d) => d.filter((l) => l.id !== id));
        return;
      }
      if (p.type !== "lowongan.baru" && p.type !== "butuh_hari_ini") return;
      const data = p.data as LowonganApi;
      if (!masuk(data)) return;
      const l = keLowongan(data);
      if (l.cekUpah === "curiga") return;
      setDaftar((d) => [l, ...d.filter((x) => x.id !== l.id)]);
      setBaru((b) => new Set(b).add(l.id));
      setTerakhir(l);
    },
    {
      onTersambung: () => {
        if (!muatUlang) return;
        api<{ lowongan: LowonganApi[] }>(muatUlang)
          .then((h) => setDaftar(h.lowongan.filter(masuk).map((l) => keLowongan(l)).filter((l) => l.cekUpah !== "curiga")))
          .catch(() => {});
      },
    },
  );

  return { daftar, baru, terakhir };
}
