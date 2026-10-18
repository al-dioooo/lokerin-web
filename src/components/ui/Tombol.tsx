import type { ButtonHTMLAttributes } from "react";

export type TombolProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "utama" | "halus" | "garis";
  size?: "kecil" | "sedang" | "besar";
};
const variants = { utama: "tombol-utama", halus: "tombol-halus", garis: "tombol-garis" };
const sizes = { kecil: "px-4", sedang: "", besar: "min-h-16 px-7 text-xl" };

export function Tombol({ variant = "utama", size = "sedang", className = "", type = "button", ...props }: TombolProps) {
  return <button type={type} className={`tombol ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
