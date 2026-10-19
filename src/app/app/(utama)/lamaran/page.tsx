import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { LamaranSaya } from "@/components/pencari/LamaranSaya";

export const metadata = { title: "Lamaranku" };

export default function Lamaran() {
  return (
    <Halaman>
      {/* Reads ?lamaran= from links in a Kabar. */}
      <Suspense>
        <LamaranSaya />
      </Suspense>
    </Halaman>
  );
}
