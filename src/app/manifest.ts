import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lokerin",
    short_name: "Lokerin",
    description: "Cari lowongan warung, bengkel, dan UMKM terverifikasi di Banyumas lewat obrolan.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    lang: "id",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Ngobrol",
        description: "Ceritakan pengalamanmu dan cari kerja",
        url: "/app/ngobrol",
        icons: [{ src: "/icons/96", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Peta",
        description: "Lihat lowongan di sekitarmu",
        url: "/app/peta",
        icons: [{ src: "/icons/96", sizes: "96x96", type: "image/png" }],
      },
    ],
  };
}
