import { Logo } from "../brand/Logo";
import { LocationIcon } from "../icons/interface";

function QrPlaceholder() {
  return <svg viewBox="0 0 29 29" width="80" height="80" fill="var(--color-tinta)" aria-hidden="true"><path fill="white" d="M0 0h29v29H0z" />{[[3, 3], [19, 3], [3, 19]].map(([x, y]) => <g key={`${x}-${y}`}><path d={`M${x} ${y}h7v7h-7z`} /><path d={`M${x + 1} ${y + 1}h5v5h-5z`} fill="white" /><path d={`M${x + 2} ${y + 2}h3v3h-3z`} /></g>)}<path d="M12 3h3v2h-3zm1 4h3v3h-3zm-9 5h4v3H4zm6 0h3v2h-3zm5 0h2v5h-2zm4 0h7v2h-7zm3 3h2v3h-2zm-10 3h4v3h-4zm6 2h3v6h-3zm5 0h3v2h-3zm0 4h3v2h-3zm-11 0h3v2h-3z" /></svg>;
}

export function KartuKerja({ nama, personas, kota, className = "" }: { nama: string; personas: string[]; kota: string; className?: string }) {
  return <article className={`card mx-auto flex aspect-[9/16] w-full max-w-[324px] flex-col p-5 ${className}`} aria-label={`Kartu kerja ${nama}`}><Logo size={28} /><p className="mt-3 font-mono text-xs uppercase tracking-widest text-abu">Kartu Kerja</p><div className="my-auto py-4"><h3 className="break-words text-3xl">{nama}</h3><p className="mt-3 flex items-center gap-2 text-sm text-abu"><LocationIcon size={18} />{kota}</p><div className="mt-4 flex flex-wrap gap-2">{personas.map((persona) => <span key={persona} className="rounded-full bg-kabut px-3 py-1 text-xs font-bold">{persona}</span>)}</div></div><div className="flex flex-col items-center border-t border-garis pt-4 text-center"><QrPlaceholder /><p className="mt-1 text-[11px] text-abu">Contoh QR · belum dapat dipindai</p><p className="mt-2 text-xs font-bold">Pindai untuk melihat profil di Lokerin</p></div></article>;
}
