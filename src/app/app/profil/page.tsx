import { ProfilCv } from "@/components/app/ProfilCv";

export const metadata = { title: "Profil" };

export default function Profil() {
  return (
    <div className="grid gap-5">
      <div className="print:hidden">
        <h1 className="text-[1.75rem] leading-tight">Satu profil, <span className="text-jingga">dua CV.</span></h1>
        <p className="mt-1 max-w-xl text-sm text-abu">Lokerin memilah pengalamanmu jadi CV untuk tiap jenis pekerjaan. Lowongan las memakai CV Tukang Las, lowongan antar memakai CV Driver Ojol.</p>
      </div>
      <ProfilCv />
    </div>
  );
}
