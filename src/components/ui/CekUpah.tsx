export type StatusUpah = "wajar" | "rendah" | "curiga";
const states = {
  wajar: { label: "Upah wajar", color: "bg-daun-muda text-daun", icon: "✓" },
  rendah: { label: "Di bawah UMK", color: "bg-kuning-muda text-kuning-tua", icon: "!" },
  curiga: { label: "Terlalu tinggi, hati-hati", color: "bg-merah-muda text-merah", icon: "!" },
};

export function CekUpah({ status, wilayah = "Banyumas" }: { status: StatusUpah; wilayah?: string }) {
  const { label, color, icon } = states[status];
  return <span className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${color}`}><span aria-hidden="true">{icon}</span><span>{label}<span className="sr-only">, dibandingkan dengan UMK {wilayah}</span></span></span>;
}
