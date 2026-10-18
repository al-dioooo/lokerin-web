import { Halaman } from "@/components/app/Halaman";
import { PasangLowongan } from "@/components/pemberi/PasangLowongan";

export const metadata = { title: "Pasang lowongan" };

export default function Pasang() {
  return (
    <Halaman>
      <PasangLowongan />
    </Halaman>
  );
}
