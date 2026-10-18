import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  title: "Lokerin",
  description: "Cari kerja cukup ngobrol. Temukan lowongan warung, bengkel, dan UMKM terverifikasi di dekatmu bersama Lokerin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen">
        <a className="skip-link tombol tombol-garis" href="#utama">Lewati ke isi</a>
        {children}
      </body>
    </html>
  );
}
