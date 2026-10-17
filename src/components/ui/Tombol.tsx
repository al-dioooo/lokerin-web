import type { ButtonHTMLAttributes } from "react";

export type TombolProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "utama" | "sorot" | "garis";
  size?: "kecil" | "sedang" | "besar";
};
const variants = { utama: "bg-cabai text-white", sorot: "bg-kunyit text-arang", garis: "bg-kertas-terang text-arang" };
const sizes = { kecil: "text-base", sedang: "text-lg", besar: "min-h-16 px-7 text-xl" };

export function Tombol({ variant = "utama", size = "sedang", className = "", type = "button", ...props }: TombolProps) {
  return <button type={type} className={`tombol ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
