import { Halaman } from "@/components/app/Halaman";
import { ProfilLangsung } from "@/components/pencari/ProfilLangsung";
import { apiAktif } from "@/lib/api/klien";

export const metadata = { title: "Profil" };

export default function Profil() {
  return (
    <Halaman>
    <div className="grid gap-5">
      {!apiAktif && (
        <div className="print:hidden">
          <h1 className="text-[1.75rem] leading-tight" data-ringkas="Profil">Satu profil, <span className="text-jingga">dua CV.</span></h1>
          <p className="mt-1 max-w-xl text-sm text-abu">Lokerin memilah pengalamanmu jadi CV untuk tiap jenis pekerjaan. Lowongan las memakai CV Tukang Las, lowongan antar memakai CV Driver Ojol.</p>
        </div>
      )}
      <ProfilLangsung />
    </div>
    </Halaman>
  );
}
