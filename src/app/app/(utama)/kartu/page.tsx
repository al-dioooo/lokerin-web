import { Halaman } from "@/components/app/Halaman";
import { HanyaUntuk } from "@/components/app/HanyaUntuk";
import { KartuPersona } from "@/components/app/KartuPersona";

export const metadata = { title: "Kartu Kerja" };

export default function Kartu() {
  return (
    <Halaman>
      {/* Signed-out visitors see Pak Darto's sample cards. */}
      <HanyaUntuk peran="pencari" bolehTamu>
        <KartuPersona />
      </HanyaUntuk>
    </Halaman>
  );
}
