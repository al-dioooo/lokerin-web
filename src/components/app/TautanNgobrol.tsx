"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { masukNgobrol } from "./transisiNgobrol";

/** Link into Ngobrol with the curtain transition. Modified clicks (new tab) behave normally. */
export function TautanNgobrol({ onClick, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  const router = useRouter();
  function klik(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    masukNgobrol(e.currentTarget, () => router.push("/app/ngobrol"));
  }
  return <Link href="/app/ngobrol" {...props} onClick={klik} />;
}
