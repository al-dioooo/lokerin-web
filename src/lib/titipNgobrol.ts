/*
 * Handing a message to Ngobrol from another screen, for example "Ubah lewat Ngobrol" on a CV lamaran.
 * The message waits in sessionStorage so it survives the move into Ngobrol; the event lets an
 * Ngobrol that is already on screen (the CV was opened in its drawer) take it straight away.
 * Whoever reads it first removes it, so it is sent once.
 */

export type Titipan = {
  /** What the person sees in their bubble. */
  teks: string;
  /** A line for the agent only ("[konteks: ...]"), hidden in the thread and the title. */
  konteks: string;
  /** Start a new conversation for it instead of continuing the open one. */
  baru: boolean;
};

const KUNCI = "lokerin-titipan-ngobrol";
export const PERISTIWA_TITIPAN = "lokerin:titip-ngobrol";

export function titipKeNgobrol(titipan: Titipan) {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify(titipan));
  } catch {}
  window.dispatchEvent(new Event(PERISTIWA_TITIPAN));
}

export function ambilTitipan(): Titipan | null {
  try {
    const isi = sessionStorage.getItem(KUNCI);
    if (!isi) return null;
    sessionStorage.removeItem(KUNCI);
    return JSON.parse(isi) as Titipan;
  } catch {
    return null;
  }
}

/** The agent-only line the app adds at the end of a message. */
const KONTEKS = /\s*\[konteks:[^\]]*\]\s*$/;

export function tanpaKonteks(teks: string) {
  return teks.replace(KONTEKS, "");
}

export function barisKonteks(isi: Record<string, string>) {
  return `[konteks: ${Object.entries(isi).map(([k, v]) => `${k}=${v}`).join("; ")}]`;
}
