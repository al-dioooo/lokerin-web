import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { DaftarPelamar } from "@/components/pemberi/DaftarPelamar";

export const metadata = { title: "Pelamar" };

export default function Pelamar() {
  return (
    <Halaman>
      {/* Reads ?lamaran= from links in a Kabar. */}
      <Suspense>
        <DaftarPelamar />
      </Suspense>
    </Halaman>
  );
}
