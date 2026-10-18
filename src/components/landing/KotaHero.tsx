import Image from "next/image";
import { Suspense } from "react";
import { Logo } from "../brand/Logo";
import { BellIcon } from "../icons/interface";
import { ContohKartuMendesak, KartuLoading } from "../desain/ContohMendesak";
import { PinPeta } from "../ui/PinPeta";

export function KotaHero({ pinLeft = 28, pinTop = 46 }: { pinLeft?: number; pinTop?: number }) {
  return <div className="hero-visual"><div className="town-scene"><div className="town-canvas"><Image src="/hero-kota.png" alt="Ilustrasi garis kota Banyumas di kaki Gunung Slamet, dengan warung, bengkel, dan tempat usaha berwarna jingga yang membuka lowongan." fill preload sizes="(min-width: 1200px) 65vw, 100vw" /><PinPeta kategori="dapur" mendesak left={pinLeft} top={pinTop} /></div></div><div className="phone" id="lowongan"><div className="phone-screen"><div className="phone-notch" aria-hidden="true" /><div className="phone-chrome"><div className="mb-5 flex justify-between text-[11px] font-extrabold" aria-hidden="true"><span>9:41</span><span>▮▮▮ ▰</span></div><div className="mb-3 flex items-center justify-between"><Logo size={28} /><BellIcon size={23} /></div></div><div className="phone-picture"><Image src="/hero-kota.png" alt="" fill sizes="320px" /></div><Suspense fallback={<KartuLoading />}><ContohKartuMendesak /></Suspense></div></div></div>;
}
