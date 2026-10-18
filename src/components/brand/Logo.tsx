type LogoProps = { size?: number; className?: string };

export function LogoMark({ size = 48, className = "" }: LogoProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}><path d="M12 23 4.9 13.8A9 9 0 1 1 19.1 13.8Z" fill="var(--color-jingga, #EA5A0C)" /></svg>;
}

export function Logo({ size = 42, className = "" }: LogoProps) {
  return <span role="img" aria-label="lokerin" className={`brand-wordmark ${className}`} style={{ fontSize: size }}><span aria-hidden="true">loker<span className="brand-i">ı<LogoMark /></span>n</span></span>;
}
