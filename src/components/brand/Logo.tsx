type LogoProps = { size?: number; className?: string };

export function LogoMark({ size = 48, className = "" }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 44 11 28C1 15 10 4 24 4c12 0 21 8 18 19-2 8-10 12-18 21Z" fill="#C8261B" stroke="#1B1712" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 14h20v13H23l-6 5v-5h-3Z" fill="#F5B400" stroke="#1B1712" strokeWidth="3" strokeLinejoin="round" />
      <path d="M21 19v3m6-5v7" stroke="#1B1712" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 42, className = "" }: LogoProps) {
  return <span className={`inline-flex items-center gap-2 ${className}`}><LogoMark size={size} /><span className="font-papan leading-none tracking-tight" style={{ fontSize: size * .62 }}>LOKERIN</span></span>;
}
