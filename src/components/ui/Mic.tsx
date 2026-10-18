import { MicIcon } from "../icons/interface";
import { AksiContoh } from "./AksiContoh";

export function Mic({ className = "" }: { className?: string }) {
  return <div className={`inline-flex p-3 ${className}`}><AksiContoh className="relative size-44 flex-col rounded-full p-5"><span className="mic-ring" aria-hidden="true" /><MicIcon size={48} /><span>Mulai ngobrol</span></AksiContoh></div>;
}
