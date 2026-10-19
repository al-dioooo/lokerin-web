"use client";

import { m } from "motion/react";
import { useId } from "react";

/**
 * Segmented tabs with a spring thumb that slides to the selected tab. Each tab is as wide as its
 * label; long labels (a Persona like "Desainer UI/UX | Frontend Developer") end in an ellipsis and
 * the row scrolls sideways when it does not fit, with the tapped tab brought into view.
 */
export function TabPil<T extends string>({ pilihan, nilai, onUbah, label, className = "" }: { pilihan: { id: T; label: string }[]; nilai: T; onUbah: (v: T) => void; label: string; className?: string }) {
  const id = useId();
  return (
    <m.div layoutScroll className={`tab-pil ${className}`} role="tablist" aria-label={label}>
      {pilihan.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={p.id === nilai}
          title={p.label.length > 24 ? p.label : undefined}
          onClick={(e) => {
            e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
            onUbah(p.id);
          }}
        >
          {p.id === nilai && <m.span layoutId={`tab-${id}`} className="tab-pil-geser" transition={{ type: "spring", stiffness: 480, damping: 34 }} />}
          <span className="relative">{p.label}</span>
        </button>
      ))}
    </m.div>
  );
}
