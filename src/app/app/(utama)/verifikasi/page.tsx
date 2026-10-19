import { Halaman } from "@/components/app/Halaman";
import { HanyaUntuk } from "@/components/app/HanyaUntuk";
import { AlurVerifikasi } from "@/components/pemberi/AlurVerifikasi";

export const metadata = { title: "Verifikasi usaha" };

export default function Verifikasi() {
  return (
    <Halaman>
      <HanyaUntuk peran="pemberi" masuk="Masuk dengan akun usahamu untuk memverifikasi usaha.">
        <AlurVerifikasi />
      </HanyaUntuk>
    </Halaman>
  );
}
