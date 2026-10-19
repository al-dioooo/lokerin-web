import { ikonLokerin } from "@/components/pwa/ikon";

// Manifest icons. Maskable keeps the mark inside the 80% safe zone so launchers can crop it to any shape.
const VARIAN: Record<string, { sisi: number; skala: number }> = {
  "96": { sisi: 96, skala: 0.62 },
  "192": { sisi: 192, skala: 0.62 },
  "512": { sisi: 512, skala: 0.62 },
  "maskable-512": { sisi: 512, skala: 0.5 },
};

export function generateStaticParams() {
  return Object.keys(VARIAN).map((varian) => ({ varian }));
}

export async function GET(_req: Request, { params }: RouteContext<"/icons/[varian]">) {
  const ukuran = VARIAN[(await params).varian];
  if (!ukuran) return new Response("Tidak ditemukan", { status: 404 });
  return ikonLokerin(ukuran.sisi, ukuran.skala);
}
