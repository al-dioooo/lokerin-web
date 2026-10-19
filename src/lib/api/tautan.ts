"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef } from "react";

/**
 * Opens the Lamaran named in `?lamaran=` (or `awalId`, when the list is shown in a drawer) once the
 * list has it, for links from a Kabar or a push. The page that uses it must sit inside <Suspense>,
 * because it reads the URL.
 */
export function useBukaDariTautan<T extends { id: string }>(daftar: T[] | undefined, buka: (item: T) => void, awalId?: string) {
  const dariAlamat = useSearchParams().get("lamaran");
  const id = awalId ?? dariAlamat;
  const sudah = useRef<string | null>(null);
  const bukaItem = useEffectEvent(buka);
  useEffect(() => {
    if (!id || !daftar || sudah.current === id) return;
    const item = daftar.find((x) => x.id === id);
    if (!item) return;
    const t = window.setTimeout(() => {
      sudah.current = id;
      bukaItem(item);
    }, 0);
    return () => window.clearTimeout(t);
  }, [id, daftar]);
}
