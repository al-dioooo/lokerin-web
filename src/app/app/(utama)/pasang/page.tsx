import { Suspense } from "react";
import { Halaman } from "@/components/app/Halaman";
import { PasangLowongan } from "@/components/pemberi/PasangLowongan";

export const metadata = { title: "Pasang lowongan" };

export default function Pasang() {
  return (
    <Halaman>
      {/* The draft to edit comes from the URL, which is only known in the browser. */}
      <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-kabut" role="status" aria-label="Memuat" />}>
        <PasangLowongan />
      </Suspense>
    </Halaman>
  );
}
