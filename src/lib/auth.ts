// Sign-in for the 18 Oct build. Google is the only method. Until OAuth is wired (Auth.js with the
// Google provider), this returns a demo account so the onboarding flow can be shown end to end.

export type Akun = { nama: string; email: string; foto?: string };

export const AUTH_DEMO = true;

export async function masukDenganGoogle(): Promise<Akun> {
  // Real version: `await signIn("google", { redirectTo: "/mulai" })` from next-auth.
  await new Promise((r) => setTimeout(r, 1100));
  return { nama: "Darto Prasetyo", email: "darto.prasetyo@contoh.id" };
}

const KUNCI = "lokerin-akun";

export function simpanAkun(akun: Akun) {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify(akun));
  } catch {}
}

export function bacaAkun(): Akun | null {
  try {
    const s = sessionStorage.getItem(KUNCI);
    return s ? (JSON.parse(s) as Akun) : null;
  } catch {
    return null;
  }
}
