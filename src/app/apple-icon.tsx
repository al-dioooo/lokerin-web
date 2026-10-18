import { ikonPin } from "@/components/pwa/ikon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself and needs an opaque square, so the pin sits on plain white.
export default function AppleIcon() {
  return ikonPin(size.width, 0.6);
}
