import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Bungee, Doto } from "next/font/google";
import "./globals.css";

const papan = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee", display: "swap" });
const baca = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-atkinson", display: "swap" });
const led = Doto({ weight: ["800", "900"], subsets: ["latin"], variable: "--font-doto", display: "swap" });

export const metadata: Metadata = {
  title: "Lokerin",
  description: "Cari kerja cukup ngobrol. Temukan lowongan warung, bengkel, dan UMKM terverifikasi di dekatmu bersama Lokerin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${papan.variable} ${baca.variable} ${led.variable} antialiased`}>
      <body className="grain min-h-screen">
        <a className="skip-link tombol bg-kunyit" href="#utama">Lewati ke isi</a>
        {children}
      </body>
    </html>
  );
}
