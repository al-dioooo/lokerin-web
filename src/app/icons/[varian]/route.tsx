import { ikonPin } from "@/components/pwa/ikon";

// Manifest icons. Maskable keeps the pin inside the 80% safe zone so launchers can crop it to any shape.
const VARIAN: Record<string, { sisi: number; tinggi: number }> = {
  "96": { sisi: 96, tinggi: 0.62 },
  "192": { sisi: 192, tinggi: 0.62 },
  "512": { sisi: 512, tinggi: 0.62 },
  "maskable-512": { sisi: 512, tinggi: 0.5 },
};

export function generateStaticParams() {
  return Object.keys(VARIAN).map((varian) => ({ varian }));
}

export async function GET(_req: Request, { params }: RouteContext<"/icons/[varian]">) {
  const ukuran = VARIAN[(await params).varian];
  if (!ukuran) return new Response("Tidak ditemukan", { status: 404 });
  return ikonPin(ukuran.sisi, ukuran.tinggi);
}
