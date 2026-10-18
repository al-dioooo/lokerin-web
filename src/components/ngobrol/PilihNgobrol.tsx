"use client";

import { RuangNgobrol } from "../app/RuangNgobrol";
import { RuangNgobrolLangsung } from "./RuangNgobrolLangsung";
import { apiAktif } from "@/lib/api/klien";

/** Live call when the backend is configured; Alice's scripted demo otherwise. */
export function PilihNgobrol() {
  return apiAktif ? <RuangNgobrolLangsung /> : <RuangNgobrol />;
}
