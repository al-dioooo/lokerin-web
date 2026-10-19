import Link from "next/link";
import { Logo } from "../brand/Logo";

const KOLOM = [
  { judul: "Pekerja", tautan: [["Peta kerja sekitar", "#peta"], ["Jalannya lamaran", "#jalan"], ["Obrolan jadi CV", "#cara-kerja"], ["Mulai ngobrol", "/masuk"]] },
  { judul: "Pemilik usaha", tautan: [["Pasang lowongan", "#pasang-lowongan"], ["Cara usaha dicek", "#terverifikasi"], ["Masuk", "/masuk"]] },
  { judul: "Lokerin", tautan: [["Tanya jawab", "#tanya"], ["Privasi", "/privasi"], ["Ketentuan", "/ketentuan"], ["Sistem desain", "/desain"]] },
] as const;

export function KakiHalaman() {
  return (
    <footer className="kaki">
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-14">
        <div className="col-span-2 max-w-xs md:col-span-1">
          <Logo size={26} />
          <p className="mt-4 text-sm text-abu">Lowongan warung, bengkel, dan UMKM terverifikasi di Banyumas. Cari kerjanya cukup ngobrol.</p>
        </div>
        {KOLOM.map(({ judul, tautan }) => (
          <nav key={judul} aria-label={judul}>
            <p className="piksel text-[11px] uppercase text-jingga-tua">{judul}</p>
            <ul className="mt-4 grid gap-1">
              {tautan.map(([teks, href]) => <li key={teks}>{href.startsWith("#") ? <a href={href} className="kaki-tautan">{teks}</a> : <Link href={href} className="kaki-tautan">{teks}</Link>}</li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-garis">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-abu">
          <span>© 2026 Lokerin · Purwokerto, Banyumas, Jawa Tengah</span>
          <span>Mendukung SDG 8: pekerjaan layak untuk semua.</span>
        </div>
      </div>
    </footer>
  );
}
