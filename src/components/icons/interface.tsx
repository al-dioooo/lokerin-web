import type { IconProps } from "./categories";

export function SpeakerIcon({ size = 24, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><path d="M4 9h4l5-4v14l-5-4H4Zm13-1c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /></svg>;
}

export function MicIcon({ size = 48, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><rect x="17" y="5" width="14" height="25" rx="7" fill="#FBF6EC" /><path d="M10 23a14 14 0 0 0 28 0M24 37v7m-8 0h16m-15-29h6m-6 6h6" /></svg>;
}
