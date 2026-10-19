import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { HanyaUntuk } from "@/components/app/HanyaUntuk";
import { LamaranSaya } from "@/components/pencari/LamaranSaya";

export const metadata = { title: "Lamaranku" };

export default function Lamaran() {
  return (
    <Halaman>
      <HanyaUntuk peran="pencari" masuk="Masuk untuk melihat lamaran yang sudah kamu kirim.">
        {/* Reads ?lamaran= from links in a Kabar. */}
        <Suspense>
          <LamaranSaya />
        </Suspense>
      </HanyaUntuk>
    </Halaman>
  );
}
