"use client";

import { RuangNgobrol } from "../app/RuangNgobrol";
import { Ngobrol } from "./Ngobrol";
import { apiAktif } from "@/lib/api/klien";

/** Live call when the backend is configured; Alice's scripted demo otherwise. */
export function PilihNgobrol() {
  return apiAktif ? <Ngobrol /> : <RuangNgobrol />;
}
