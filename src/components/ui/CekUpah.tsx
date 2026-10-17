export type StatusUpah = "wajar" | "rendah" | "curiga";
const states = {
  wajar: { label: "Upah wajar", color: "bg-daun text-white", icon: "✓" },
  rendah: { label: "Di bawah UMK", color: "bg-kunyit text-arang", icon: "!" },
  curiga: { label: "Terlalu tinggi, hati-hati", color: "bg-cabai text-white", icon: "!" },
};

export function CekUpah({ status, wilayah = "Banyumas" }: { status: StatusUpah; wilayah?: string }) {
  const { label, color, icon } = states[status];
  return <span className={`inline-flex max-w-full items-center gap-2 rounded-kertas border-2 border-arang px-3 py-1 text-sm font-bold ${color}`}><span aria-hidden="true">{icon}</span><span>{label}<span className="sr-only">, dibandingkan dengan UMK {wilayah}</span></span></span>;
}
