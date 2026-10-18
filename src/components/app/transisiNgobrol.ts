// The way into Ngobrol: a night curtain grows out of the tapped orb until it fills the screen,
// then the call screen takes over. Leaving reverses it, shrinking back to where you came from.

let titik: { x: number; y: number } | null = null;

function kurangiGerak() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function masukNgobrol(dari: Element | null, pergi: () => void) {
  if (kurangiGerak()) return pergi();
  const r = dari?.getBoundingClientRect();
  titik = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight - 60 };
  const tirai = document.createElement("div");
  tirai.className = "tirai-ngobrol";
  tirai.style.setProperty("--x", `${titik.x}px`);
  tirai.style.setProperty("--y", `${titik.y}px`);
  document.body.appendChild(tirai);
  const lepas = () => {
    tirai.classList.add("tirai-hilang");
    window.setTimeout(() => tirai.remove(), 450);
  };
  window.addEventListener("ngobrol-siap", lepas, { once: true });
  window.setTimeout(pergi, 360);
  window.setTimeout(() => tirai.remove(), 4000); // never leave the curtain behind
}

/** Called by the Ngobrol screen once it is on screen, so the curtain can fade away. */
export function ngobrolSiap() {
  window.dispatchEvent(new Event("ngobrol-siap"));
}

export function keluarNgobrol(layar: HTMLElement | null, pergi: () => void) {
  if (!layar || kurangiGerak()) return pergi();
  const { x, y } = titik ?? { x: window.innerWidth / 2, y: window.innerHeight - 50 };
  layar.animate([{ clipPath: `circle(150vmax at ${x}px ${y}px)` }, { clipPath: `circle(28px at ${x}px ${y}px)`, opacity: 0.6 }], { duration: 420, easing: "cubic-bezier(.7, 0, .3, 1)", fill: "forwards" });
  window.setTimeout(pergi, 380);
}
