import { Halaman } from "@/components/app/Halaman";
import { DaftarPelamar } from "@/components/pemberi/DaftarPelamar";

export const metadata = { title: "Pelamar" };

export default function Pelamar() {
  return (
    <Halaman>
      <DaftarPelamar />
    </Halaman>
  );
}
