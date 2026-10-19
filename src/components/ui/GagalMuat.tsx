"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { IconAlertTriangle } from "../icons/tabler";

/**
 * Shown when the server could not be reached, which is not the same as "this does not exist":
 * the page offers to try again instead of saying the job is gone.
 */
export function GagalMuat({ judul, pesan = "Tidak tersambung ke server. Periksa internetmu, lalu coba lagi." }: { judul: string; pesan?: string }) {
  const router = useRouter();
  const [mencoba, mulai] = useTransition();
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-3 py-16 text-center" role="alert">
      <span className="grid size-14 place-items-center rounded-full bg-kabut text-abu"><IconAlertTriangle size={28} /></span>
      <h1 className="text-xl">{judul}</h1>
      <p className="text-[15px] text-abu">{pesan}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <button type="button" className="min-h-12 rounded-full bg-jingga px-6 font-bold text-white disabled:opacity-60" disabled={mencoba} onClick={() => mulai(() => router.refresh())}>
          {mencoba ? "Mencoba…" : "Coba lagi"}
        </button>
        <Link href="/app" className="inline-flex min-h-12 items-center rounded-full border border-garis bg-white px-6 font-bold">Ke Beranda</Link>
      </div>
    </div>
  );
}
