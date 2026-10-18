import { ImageResponse } from "next/og";

// The orange pin from src/app/icon.svg. This viewBox fits the whole shape (the circle pokes above y=0).
const PIN = "M12 23 4.9 13.8A9 9 0 1 1 19.1 13.8Z";
const KOTAK = { x: 3, y: -0.75, w: 18, h: 23.75 };

/** PNG app icon: the pin centred on white. `tinggi` is the pin height as a share of the side. */
export function ikonPin(sisi: number, tinggi: number) {
  const h = Math.round(sisi * tinggi);
  const w = Math.round((h * KOTAK.w) / KOTAK.h);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
        {/* Nudge down a little: the round head carries most of the weight. */}
        <svg width={w} height={h} viewBox={`${KOTAK.x} ${KOTAK.y} ${KOTAK.w} ${KOTAK.h}`} style={{ marginTop: Math.round(h * 0.07) }}>
          <path d={PIN} fill="#EA5A0C" />
        </svg>
      </div>
    ),
    { width: sisi, height: sisi },
  );
}
