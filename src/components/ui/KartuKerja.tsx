import { encode } from "uqr";
import { Logo } from "../brand/Logo";
import { LocationIcon } from "../icons/interface";

/** Public address of Lokerin. The QR always points here, never at a preview or tunnel host. */
export const SITUS = "https://lokerin.site";

function Qr({ isi }: { isi: string }) {
  const { size, data } = encode(isi, { border: 2 });
  const titik = data.flatMap((baris, y) => baris.map((gelap, x) => (gelap ? `M${x} ${y}h1v1h-1z` : ""))).join("");
  return <svg viewBox={`0 0 ${size} ${size}`} width="96" height="96" shapeRendering="crispEdges" role="img" aria-label={`Kode QR ke ${isi}`}><path fill="white" d={`M0 0h${size}v${size}H0z`} /><path fill="var(--color-tinta)" d={titik} /></svg>;
}

/** `tautan` is the card's public page. Without one the QR opens the Lokerin home page. */
export function KartuKerja({ nama, personas, kota, tautan, className = "" }: { nama: string; personas: string[]; kota: string; tautan?: string; className?: string }) {
  return <article className={`card mx-auto flex aspect-[9/16] w-full max-w-[324px] flex-col p-5 ${className}`} aria-label={`Kartu kerja ${nama}`}><Logo size={28} /><p className="mt-3 font-mono text-xs uppercase tracking-widest text-abu">Kartu Kerja</p><div className="my-auto py-4"><h3 className="break-words text-3xl">{nama}</h3><p className="mt-3 flex items-center gap-2 text-sm text-abu"><LocationIcon size={18} />{kota}</p><div className="mt-4 flex flex-wrap gap-2">{personas.map((persona) => <span key={persona} className="rounded-full bg-kabut px-3 py-1 text-xs font-bold">{persona}</span>)}</div></div><div className="flex flex-col items-center border-t border-garis pt-4 text-center"><Qr isi={tautan ?? SITUS} /><p className="mt-2 text-xs font-bold">{tautan ? "Pindai untuk melihat profil di Lokerin" : "Pindai untuk membuka Lokerin"}</p></div></article>;
}
