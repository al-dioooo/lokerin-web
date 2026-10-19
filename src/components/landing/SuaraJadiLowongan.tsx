import { GARIS } from "../kota/iso";

const BAYANG = "#F1EFEB";
const ALUR = "#D9D6D0";

/**
 * For the employer section: the owner talks into a phone in front of the warung, and the words
 * become a Draf Lowongan that passes the check. Lines on the card draw in one after another, then
 * the green tick lands. Under reduced motion the finished card is shown.
 */
export function SuaraJadiLowongan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 300" className={`suara-lowongan ${className}`} aria-hidden="true">
      {/* Warung behind, with its striped awning. */}
      <g>
        <rect x="24" y="96" width="190" height="168" fill="#FFF6EE" stroke={GARIS} strokeWidth="1.4" />
        <rect x="178" y="96" width="36" height="168" fill={BAYANG} stroke={GARIS} strokeWidth="1.4" />
        <path d="M14 96 30 64h176l16 32Z" fill="#EEEDEA" stroke={GARIS} strokeWidth="1.4" strokeLinejoin="round" />
        <g stroke={GARIS} strokeWidth="1.2">
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${14 + i * 26} 96h26v14a13 13 0 0 1-26 0Z`} fill={i % 2 ? "#FFFFFF" : "#F26A1B"} />)}
        </g>
        <rect x="40" y="150" width="120" height="114" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.3" />
        <path d="M52 172h60M52 186h40M52 200h52" stroke={ALUR} strokeWidth="3" strokeLinecap="round" />
        <rect x="128" y="226" width="22" height="38" fill="#F3F3EF" stroke={GARIS} strokeWidth="1.2" />
      </g>

      {/* The phone, listening. */}
      <g transform="translate(176 118) rotate(-6)">
        <rect width="92" height="164" rx="16" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
        <rect x="34" y="9" width="24" height="5" rx="2.5" fill={ALUR} />
        <g className="suara-batang" fill="#EA5A0C">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={17 + i * 9} y="62" width="4.5" height="28" rx="2.25" style={{ animationDelay: `${(i % 4) * -0.18}s` }} />)}
        </g>
        <circle cx="46" cy="128" r="17" fill="#EA5A0C" stroke="#C2410C" strokeWidth="1" />
        <circle className="suara-riak" cx="46" cy="128" r="17" fill="none" stroke="#EA5A0C" strokeWidth="2" />
        <path d="M42 120a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0Zm-5 7a9 9 0 0 0 18 0m-9 9v4" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* The words travel to the card. */}
      <path className="suara-jejak" d="M272 150C300 120 314 112 336 112" fill="none" stroke="#F7C9A0" strokeWidth="2.4" strokeDasharray="5 7" strokeLinecap="round" />

      {/* The Draf Lowongan. */}
      <g transform="translate(330 58)">
        <rect x="6" y="8" width="176" height="212" rx="18" fill="#FFF1E8" stroke="#F7C9A0" strokeWidth="1.2" />
        <rect width="176" height="212" rx="18" fill="#FFFFFF" stroke={GARIS} strokeWidth="1.6" />
        <rect x="16" y="16" width="70" height="16" rx="8" fill="#EA5A0C" />
        <g fill="none" strokeLinecap="round">
          <path className="suara-baris" pathLength={1} style={{ animationDelay: "0s" }} d="M16 54h120" stroke="#16181D" strokeWidth="6" />
          <path className="suara-baris" pathLength={1} style={{ animationDelay: ".35s" }} d="M16 74h84" stroke={ALUR} strokeWidth="4" />
          <path className="suara-baris" pathLength={1} style={{ animationDelay: ".7s" }} d="M16 100h64" stroke="#C2410C" strokeWidth="6" />
          <path className="suara-baris" pathLength={1} style={{ animationDelay: "1.05s" }} d="M16 124h140" stroke={ALUR} strokeWidth="4" />
          <path className="suara-baris" pathLength={1} style={{ animationDelay: "1.4s" }} d="M16 140h110" stroke={ALUR} strokeWidth="4" />
        </g>
        <rect x="16" y="160" width="144" height="36" rx="18" fill="#E8F5EE" />
        <g className="suara-centang" transform="translate(36 178)">
          <circle r="11" fill="#18794E" />
          <path d="m-5 0 3.5 3.5L5.5-3.5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d="M56 178h76" stroke="#18794E" strokeWidth="4" strokeLinecap="round" opacity=".45" />
      </g>

      <path d="M4 264h512" stroke={GARIS} strokeWidth="1.4" />
      <path d="M4 276h512" stroke={ALUR} strokeWidth="1.4" strokeDasharray="14 12" />
    </svg>
  );
}
