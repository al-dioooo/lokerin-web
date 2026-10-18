import type { IconProps } from "./categories";
import type { ReactNode } from "react";

function Icon({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{children}</svg>;
}
export function SpeakerIcon(props: IconProps) {
  return <Icon {...props}><path d="M3 9h4l5-4v14l-5-4H3Zm13-1c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /></Icon>;
}
export function MicIcon(props: IconProps) {
  return <Icon {...props}><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-3 0h6" /></Icon>;
}
export function ArrowIcon(props: IconProps) {
  return <Icon {...props}><path d="m9 5 7 7-7 7" /></Icon>;
}
export function LocationIcon(props: IconProps) {
  return <Icon {...props}><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>;
}
export function CoinIcon(props: IconProps) {
  return <Icon {...props}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v14c0 4 14 4 14 0V5M5 10c0 4 14 4 14 0M5 15c0 4 14 4 14 0" /></Icon>;
}
export function ClockIcon(props: IconProps) {
  return <Icon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
}
export function CheckIcon(props: IconProps) {
  return <Icon {...props}><path d="m5 12 4 4L19 6" /></Icon>;
}
export function BellIcon(props: IconProps) {
  return <Icon {...props}><path d="M6 10a6 6 0 0 1 12 0v5l2 3H4l2-3Zm4 11h4M12 2v2" /></Icon>;
}
