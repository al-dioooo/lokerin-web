type LogoProps = { size?: number; className?: string };

// The mark on a 48x48 grid: a work bag that is also a speech bubble, with voice bars inside.
export const TAS_GAGANG = "M17 12V8.5A3.5 3.5 0 0 1 20.5 5h7A3.5 3.5 0 0 1 31 8.5V12";
export const TAS_BADAN = "M13 12h22a10 10 0 0 1 10 10v8a10 10 0 0 1-10 10H23l-11 6 1.5-6H13A10 10 0 0 1 3 30v-8a10 10 0 0 1 10-10Z";
export const TAS_SUARA = "M16 22v8M24 18v16M32 22v8";

export function LogoMark({ size = 48, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0.5 48 48" fill="none" aria-hidden="true" className={className}>
      <path d={TAS_GAGANG} stroke="var(--color-jingga, #EA5A0C)" strokeWidth="4" />
      <path d={TAS_BADAN} fill="var(--color-jingga, #EA5A0C)" />
      <path d={TAS_SUARA} stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 42, className = "" }: LogoProps) {
  return <span role="img" aria-label="lokerin" className={`brand-wordmark ${className}`} style={{ fontSize: size }}><LogoMark className="brand-mark" /><span aria-hidden="true">lokerin</span></span>;
}
