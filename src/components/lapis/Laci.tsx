"use client";

/*
 * Laci (drawer) is for doing something related to the screen behind it: reading a Lowongan,
 * choosing a Persona, filling in a Tahap Berikutnya, reviewing proposed Fakta. The page stays
 * visible above the sheet, so the person never loses their place. On phones it is a bottom sheet
 * that follows the finger and can be flicked away; on wider screens it is a panel from the right.
 * Use Dialog instead when the person has to decide something short and important.
 */

import { LazyMotion, animate, domMax, m, useDragControls, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { IconX } from "../icons/tabler";
import "./lapis.css";
import { PEGAS_LACI, PEGAS_TENANG, proyeksi, useGerakDikurangi, useLayarLebar } from "./gerakLapis";

type Props = {
  buka: boolean;
  onTutup: () => void;
  judul: string;
  label?: string;
  keterangan?: ReactNode;
  children: ReactNode;
  /** One primary action, pinned to the bottom of the sheet. */
  aksi?: ReactNode;
};

export function Laci({ buka, onTutup, judul, label, keterangan, children, aksi }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const lembar = useRef<HTMLElement>(null);
  const idJudul = useId();
  const lebar = useLayarLebar();
  const dikurangi = useGerakDikurangi();
  const kendaliTarik = useDragControls();
  const geser = useMotionValue(10_000);
  const [ukuran, setUkuran] = useState(800);
  const tirai = useTransform(geser, [0, ukuran], [1, 0]);
  const menutup = useRef(false);

  const ukur = useCallback(() => {
    const el = lembar.current;
    if (!el) return 800;
    const nilai = lebar ? el.offsetWidth : el.offsetHeight;
    setUkuran(nilai || 800);
    return nilai || 800;
  }, [lebar]);

  const tutup = useCallback(
    (kecepatan = 0) => {
      if (menutup.current) return;
      menutup.current = true;
      const selesai = () => {
        dialog.current?.close();
        menutup.current = false;
        onTutup();
      };
      if (dikurangi) {
        geser.set(ukuran);
        selesai();
        return;
      }
      void animate(geser, ukuran, { ...PEGAS_TENANG, velocity: kecepatan }).then(selesai);
    },
    [dikurangi, geser, onTutup, ukuran],
  );

  useLayoutEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (buka && !d.open) {
      d.showModal();
      const h = ukur();
      if (dikurangi) {
        geser.set(0);
      } else {
        geser.set(h);
        void animate(geser, 0, PEGAS_LACI);
      }
    } else if (!buka && d.open && !menutup.current) {
      tutup();
    }
  }, [buka, dikurangi, geser, tutup, ukur]);

  // Esc and the browser back gesture on Android both fire `cancel`; animate out instead of snapping shut.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const batal = (e: Event) => {
      e.preventDefault();
      tutup();
    };
    d.addEventListener("cancel", batal);
    return () => d.removeEventListener("cancel", batal);
  }, [tutup]);

  function lepas(_: PointerEvent, info: PanInfo) {
    const kecepatan = lebar ? info.velocity.x : info.velocity.y;
    const tujuan = geser.get() + proyeksi(kecepatan);
    if (tujuan > ukuran * 0.5 || kecepatan > 900) tutup(kecepatan);
    else void animate(geser, 0, { ...PEGAS_LACI, velocity: kecepatan });
  }

  const sumbu = lebar ? "x" : "y";

  return (
    <dialog ref={dialog} className="laci-dialog" aria-labelledby={idJudul}>
      <LazyMotion features={domMax} strict>
        <m.div className="laci-tirai" style={{ opacity: dikurangi ? 1 : tirai }} onClick={() => tutup()} aria-hidden="true" />
        <m.section
          ref={lembar}
          className={lebar ? "laci-lembar laci-samping" : "laci-lembar laci-bawah"}
          style={dikurangi ? undefined : lebar ? { x: geser } : { y: geser }}
          drag={dikurangi ? false : sumbu}
          dragControls={kendaliTarik}
          dragListener={false}
          dragConstraints={lebar ? { left: 0 } : { top: 0 }}
          dragElastic={lebar ? { left: 0.06, right: 1 } : { top: 0.06, bottom: 1 }}
          dragMomentum={false}
          onDragEnd={lepas}
        >
          <header className="laci-kepala" onPointerDown={(e) => kendaliTarik.start(e)}>
            {!lebar && <span className="laci-pegangan" aria-hidden="true" />}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {label && <p className="piksel text-[11px] uppercase text-jingga-tua">{label}</p>}
                <h2 id={idJudul} className="text-xl leading-snug">{judul}</h2>
                {keterangan && <div className="mt-1 text-[15px] text-abu">{keterangan}</div>}
              </div>
              <button type="button" className="icon-button size-11 shrink-0 bg-kabut" aria-label="Tutup" onClick={() => tutup()}>
                <IconX size={20} />
              </button>
            </div>
          </header>
          <div className="laci-isi">{children}</div>
          {aksi && <footer className="laci-aksi">{aksi}</footer>}
        </m.section>
      </LazyMotion>
    </dialog>
  );
}
