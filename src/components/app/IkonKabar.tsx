import { IconBolt, IconCircleCheck, IconEye, IconUserCheck, IconX } from "../icons/tabler";
import type { JenisKabar } from "@/lib/api/tipe";

const IKON = {
  lamaran_masuk: IconUserCheck,
  lamaran_dilihat: IconEye,
  lamaran_lolos: IconCircleCheck,
  tahap_baru: IconCircleCheck,
  lamaran_tidak_lolos: IconX,
  butuh_hari_ini: IconBolt,
} satisfies Record<JenisKabar, unknown>;

const WARNA: Record<JenisKabar, string> = {
  lamaran_masuk: "bg-jingga-muda text-jingga-tua",
  lamaran_dilihat: "bg-jingga-muda text-jingga-tua",
  lamaran_lolos: "bg-daun-muda text-daun",
  tahap_baru: "bg-daun-muda text-daun",
  lamaran_tidak_lolos: "bg-kabut text-abu",
  butuh_hari_ini: "bg-jingga text-white",
};

export function IkonKabar({ jenis }: { jenis: JenisKabar }) {
  const Ikon = IKON[jenis] ?? IconCircleCheck;
  return <span className={`grid size-10 shrink-0 place-items-center rounded-full ${WARNA[jenis] ?? "bg-kabut text-abu"}`} aria-hidden="true"><Ikon size={20} /></span>;
}
