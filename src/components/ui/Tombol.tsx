import type { ButtonHTMLAttributes } from "react";

export type TombolProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "utama" | "halus" | "garis";
  size?: "kecil" | "sedang" | "besar";
};
const variants = { utama: "tombol-utama", halus: "tombol-halus", garis: "tombol-garis" };
const sizes = { kecil: "min-h-9 px-4 text-sm", sedang: "", besar: "min-h-12 px-6 text-base" };

export function Tombol({ variant = "utama", size = "sedang", className = "", type = "button", ...props }: TombolProps) {
  return <button type={type} className={`tombol ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
