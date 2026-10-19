import { Suspense } from "react";
import { PilihNgobrol } from "@/components/ngobrol/PilihNgobrol";

export const metadata = { title: "Ngobrol" };

export default function Ngobrol() {
  return (
    <Suspense fallback={<div className="ngobrol-layar" aria-hidden="true" />}>
      <PilihNgobrol />
    </Suspense>
  );
}
