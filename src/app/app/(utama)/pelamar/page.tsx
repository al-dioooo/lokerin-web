import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { HanyaUntuk } from "@/components/app/HanyaUntuk";
import { DaftarPelamar } from "@/components/pemberi/DaftarPelamar";

export const metadata = { title: "Pelamar" };

export default function Pelamar() {
  return (
    <Halaman>
      <HanyaUntuk peran="pemberi" masuk="Masuk dengan akun usahamu untuk melihat pelamar.">
        {/* Reads ?lamaran= from links in a Kabar. */}
        <Suspense>
          <DaftarPelamar />
        </Suspense>
      </HanyaUntuk>
    </Halaman>
  );
}
