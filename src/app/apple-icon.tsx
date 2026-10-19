import { ikonLokerin } from "@/components/pwa/ikon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself and needs an opaque square, so the mark sits on a full orange tile.
export default function AppleIcon() {
  return ikonLokerin(size.width, 0.62);
}
