"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Reveals its content the first time it scrolls into view. The motion is a CSS transition, so it
 * always finishes even if the page stops rendering for a moment.
 */
function useMuncul<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.setAttribute("data-terlihat", "");
        io.disconnect();
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Muncul({ children, className = "", jeda = 0 }: { children: ReactNode; className?: string; jeda?: number }) {
  const ref = useMuncul<HTMLDivElement>();
  return <div ref={ref} className={`muncul ${className}`} style={{ "--jeda": `${jeda}s` } as CSSProperties}>{children}</div>;
}

/** Like Muncul, but the block also scales up, like a window being brought forward. */
export function Maju({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useMuncul<HTMLDivElement>();
  return <div ref={ref} className={`muncul maju ${className}`}>{children}</div>;
}
