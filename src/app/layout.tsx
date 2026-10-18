import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Silkscreen } from "next/font/google";
import { DaftarSW } from "@/components/pwa/DaftarSW";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-silkscreen", display: "swap" });

export const metadata: Metadata = {
  title: "Lokerin",
  description: "Cari kerja cukup ngobrol. Lowongan warung, bengkel, dan UMKM terverifikasi di Banyumas, dan CV yang tersusun dari obrolan.",
  applicationName: "Lokerin",
  appleWebApp: { capable: true, title: "Lokerin", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} ${silkscreen.variable} antialiased`}>
      <body className="min-h-screen">
        <a className="skip-link tombol tombol-garis" href="#utama">Lewati ke isi</a>
        {children}
        <DaftarSW />
      </body>
    </html>
  );
}
