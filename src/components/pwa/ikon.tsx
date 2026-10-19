import { ImageResponse } from "next/og";
import { TAS_BADAN, TAS_GAGANG, TAS_SUARA } from "@/components/brand/Logo";

/** PNG app icon: the white bag-bubble on orange. `skala` is the 48px mark grid as a share of the side. */
export function ikonLokerin(sisi: number, skala: number) {
  const w = Math.round(sisi * skala);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#EA5A0C" }}>
        <svg width={w} height={w} viewBox="0 1.5 48 48" fill="none">
          <path d={TAS_GAGANG} stroke="#FFFFFF" strokeWidth="4" />
          <path d={TAS_BADAN} fill="#FFFFFF" />
          <path d={TAS_SUARA} stroke="#EA5A0C" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { width: sisi, height: sisi },
  );
}
