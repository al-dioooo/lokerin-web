import { Suspense } from "react";
import { PilihNgobrol } from "@/components/ngobrol/PilihNgobrol";

export const metadata = { title: "Ngobrol" };

// One conversation by its address. The id is read on the client (useParams): conversations live
// per account on the server, so this address only ever opens the signed-in person's own. The id is
// only known at request time, so the screen streams in behind the same night background.
export default function ObrolanDenganAlamat() {
  return (
    <Suspense fallback={<div className="ngobrol-layar" aria-hidden="true" />}>
      <PilihNgobrol />
    </Suspense>
  );
}
