import { Logo } from "../brand/Logo";
import { LencanaTerverifikasi } from "./LencanaTerverifikasi";

function QrPlaceholder() {
  return <svg viewBox="0 0 29 29" width="88" height="88" fill="#1B1712" aria-hidden="true"><path fill="#FBF6EC" d="M0 0h29v29H0z" />{[[3, 3], [19, 3], [3, 19]].map(([x, y]) => <g key={`${x}-${y}`}><path d={`M${x} ${y}h7v7h-7z`} /><path d={`M${x + 1} ${y + 1}h5v5h-5z`} fill="#FBF6EC" /><path d={`M${x + 2} ${y + 2}h3v3h-3z`} /></g>)}<path d="M12 3h3v2h-3zm1 4h3v3h-3zm-9 5h4v3H4zm6 0h3v2h-3zm5 0h2v5h-2zm4 0h7v2h-7zm3 3h2v3h-2zm-10 3h4v3h-4zm6 2h3v6h-3zm5 0h3v2h-3zm0 4h3v2h-3zm-11 0h3v2h-3z" /></svg>;
}

export function KartuKerja({ nama, personas, kota, terverifikasi = false, className = "" }: { nama: string; personas: string[]; kota: string; terverifikasi?: boolean; className?: string }) {
  return (
    <article className={`paper grain mx-auto flex aspect-[9/16] w-full max-w-[324px] flex-col overflow-hidden ${className}`} aria-label={`Kartu kerja ${nama}`}>
      <div className="warung-stripe" /><div className="flex flex-1 flex-col items-center gap-2 px-4 py-4 text-center">
        <Logo size={30} /><p className="eyebrow text-abu">Kartu kerja · Contoh</p>
        <div className="my-auto w-full border-y-3 border-arang py-2"><h3 className="break-words font-papan text-3xl leading-tight">{nama}</h3><p className="mt-2 text-base">{kota}</p></div>
        <div className="flex flex-wrap justify-center gap-2">{personas.map((persona) => <span key={persona} className="rounded border-2 border-arang bg-kunyit px-2 py-1 text-sm font-bold">{persona}</span>)}</div>
        {terverifikasi && <LencanaTerverifikasi ktp />}
        <div className="mt-auto flex flex-col items-center"><QrPlaceholder /><p className="text-xs text-abu">Contoh QR · belum dapat dipindai</p></div>
      </div><p className="bg-arang px-3 py-3 text-center text-sm font-bold text-kertas">Pindai untuk melihat profil di Lokerin</p>
    </article>
  );
}
