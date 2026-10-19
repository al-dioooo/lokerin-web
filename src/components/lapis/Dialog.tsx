"use client";

/*
 * Dialog (modal) is for a short decision that needs the person's full attention before
 * anything else happens: publishing a Lowongan, declining a Lamaran, turning on the
 * microphone, signing out. It dims everything behind it and asks one question with at most
 * two answers. Anything longer, or anything the person browses or fills in, belongs in a Laci.
 */

import { LazyMotion, animate, domMax, m, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PEGAS_TENANG, useGerakDikurangi } from "./gerakLapis";
import "./lapis.css";

type Props = {
  buka: boolean;
  onTutup: () => void;
  judul: string;
  children?: ReactNode;
  labelYa: string;
  labelBatal?: string;
  onYa: () => void | Promise<void>;
  /** Red confirm button for actions that cannot be undone. */
  bahaya?: boolean;
  ikon?: ReactNode;
};

export function Dialog({ buka, onTutup, judul, children, labelYa, labelBatal = "Batal", onYa, bahaya, ikon }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const idJudul = useId();
  const idIsi = useId();
  const dikurangi = useGerakDikurangi();
  const tampak = useMotionValue(0);
  const skala = useTransform(tampak, [0, 1], [0.94, 1]);
  const [sibuk, setSibuk] = useState(false);
  const menutup = useRef(false);

  const tutup = useCallback(() => {
    if (menutup.current) return;
    menutup.current = true;
    const selesai = () => {
      dialog.current?.close();
      menutup.current = false;
      onTutup();
    };
    if (dikurangi) return selesai();
    void animate(tampak, 0, { ...PEGAS_TENANG, duration: 0.2 }).then(selesai);
  }, [dikurangi, onTutup, tampak]);

  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (buka && !d.open) {
      d.showModal();
      tampak.set(dikurangi ? 1 : 0);
      if (!dikurangi) void animate(tampak, 1, { ...PEGAS_TENANG, duration: 0.28 });
    } else if (!buka && d.open && !menutup.current) {
      tutup();
    }
  }, [buka, dikurangi, tampak, tutup]);

  // Next keeps a page alive, hidden, after navigating away. A modal left open there would still block
  // every tap on the next page, so it closes while hidden and opens again when the page shows.
  useEffect(() => {
    const d = dialog.current;
    return () => {
      if (d?.open) d.close();
    };
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const batal = (e: Event) => {
      e.preventDefault();
      if (!sibuk) tutup();
    };
    d.addEventListener("cancel", batal);
    return () => d.removeEventListener("cancel", batal);
  }, [sibuk, tutup]);

  async function ya() {
    setSibuk(true);
    try {
      await onYa();
      tutup();
    } finally {
      setSibuk(false);
    }
  }

  return (
    <dialog ref={dialog} className="modal-dialog" role={bahaya ? "alertdialog" : "dialog"} aria-labelledby={idJudul} aria-describedby={children ? idIsi : undefined}>
      <LazyMotion features={domMax} strict>
        <m.div className="laci-tirai" style={{ opacity: tampak }} onClick={() => !sibuk && tutup()} aria-hidden="true" />
        <m.div className="modal-kartu" style={dikurangi ? { opacity: tampak } : { opacity: tampak, scale: skala }}>
          {ikon && <div className="mb-3">{ikon}</div>}
          <h2 id={idJudul} className="text-xl leading-snug">{judul}</h2>
          {children && <div id={idIsi} className="mt-2 text-[15px] text-abu">{children}</div>}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <button type="button" className="tombol tombol-garis order-2 sm:order-1" onClick={tutup} disabled={sibuk}>{labelBatal}</button>
            <button type="button" className={`tombol order-1 sm:order-2 ${bahaya ? "tombol-bahaya" : "tombol-utama"}`} onClick={ya} disabled={sibuk} aria-busy={sibuk}>
              {sibuk ? "Sebentar..." : labelYa}
            </button>
          </div>
        </m.div>
      </LazyMotion>
    </dialog>
  );
}
