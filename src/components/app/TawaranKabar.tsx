"use client";

/*
 * Offers push once, right after a moment where waiting for news makes sense: the first Lamaran sent,
 * or the first Lowongan published (ADR 0008). Never on first launch, and never twice.
 */

import { useEffect, useState } from "react";
import { IconBell } from "../icons/tabler";
import { Dialog } from "../lapis/Dialog";
import { PESAN_PUSH } from "./PengaturanPush";
import { apiAktif } from "@/lib/api/klien";
import { cekServerPush, nyalakanPush, statusPush, type StatusPush } from "@/lib/push";

const KUNCI = "lokerin-tawaran-kabar";

function sudahDitawari() {
  try {
    return localStorage.getItem(KUNCI) === "1";
  } catch {
    return true;
  }
}

export function TawaranKabar({ picu, alasan }: { picu: boolean; alasan: string }) {
  const [status, setStatus] = useState<StatusPush | null>(null);
  const [buka, setBuka] = useState(false);

  useEffect(() => {
    if (!picu || !apiAktif || sudahDitawari()) return;
    let hidup = true;
    void Promise.all([statusPush(), cekServerPush()]).then(([s, server]) => {
      if (!hidup || !(s === "mati" || s === "perlu_dipasang") || !server.aktif) return;
      try {
        localStorage.setItem(KUNCI, "1");
      } catch {}
      setStatus(s);
      // Let the success screen land first.
      window.setTimeout(() => hidup && setBuka(true), 900);
    });
    return () => {
      hidup = false;
    };
  }, [picu]);

  if (!status) return null;
  const pasang = status === "perlu_dipasang";
  return (
    <Dialog
      buka={buka}
      onTutup={() => setBuka(false)}
      judul={pasang ? "Pasang Lokerin dulu supaya bisa dikabari" : "Mau dikabari walau Lokerin tertutup?"}
      labelYa={pasang ? "Mengerti" : "Nyalakan kabar"}
      labelBatal={pasang ? "Tutup" : "Nanti saja"}
      onYa={async () => {
        if (!pasang) await nyalakanPush().catch(() => null);
        setBuka(false);
      }}
      ikon={<span className="grid size-12 place-items-center rounded-full bg-jingga-muda text-jingga-tua"><IconBell size={24} /></span>}
    >
      {pasang ? PESAN_PUSH.perlu_dipasang : alasan}
    </Dialog>
  );
}
