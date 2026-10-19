import type { NextConfig } from "next";

// Produksi: halaman publik di lokerin.site, aplikasi di app.lokerin.site. Sesi disimpan per origin,
// jadi masuk, daftar, dan /app selalu dibuka di host aplikasi. Preview *.vercel.app tidak kena.
const APEX = "(www\\.)?lokerin\\.site";
const APP = "https://app.lokerin.site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/app", has: [{ type: "host", value: APEX }], destination: `${APP}/app`, permanent: false },
      { source: "/app/:rest*", has: [{ type: "host", value: APEX }], destination: `${APP}/app/:rest*`, permanent: false },
      { source: "/masuk", has: [{ type: "host", value: APEX }], destination: `${APP}/masuk`, permanent: false },
      { source: "/mulai", has: [{ type: "host", value: APEX }], destination: `${APP}/mulai`, permanent: false },
      { source: "/", has: [{ type: "host", value: "app\\.lokerin\\.site" }], destination: "/app", permanent: false },
      { source: "/:path*", has: [{ type: "host", value: "www\\.lokerin\\.site" }], destination: "https://lokerin.site/:path*", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
