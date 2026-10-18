// Sign-in for the 18 Oct build. Google is the only method. With NEXT_PUBLIC_GOOGLE_CLIENT_ID set,
// the button opens Google's own popup (Google Identity Services, no client secret needed) and the
// access token is checked by the backend at POST /auth/google. Without it, a demo account stands in
// so the onboarding flow can still be shown end to end.

export type Akun = {
  nama: string;
  email: string;
  foto?: string;
  /** Short-lived Google access token. Only lives in this tab until onboarding creates the account. */
  aksesGoogle?: string;
};

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const AUTH_DEMO = !CLIENT_ID;

type TokenGoogle = { access_token?: string; error?: string };
type KlienToken = { requestAccessToken: (opsi?: { prompt?: string }) => void };
type Gis = {
  accounts: {
    oauth2: {
      initTokenClient: (opsi: {
        client_id: string;
        scope: string;
        callback: (t: TokenGoogle) => void;
        error_callback?: (e: { type: string }) => void;
      }) => KlienToken;
    };
  };
};

let skrip: Promise<Gis> | null = null;

/** Loads Google's script once. Call it early (on mount) so the click can open the popup right away. */
export function siapkanGoogle(): Promise<Gis> | null {
  if (AUTH_DEMO || typeof window === "undefined") return null;
  skrip ??= new Promise<Gis>((selesai, gagal) => {
    const ada = (window as unknown as { google?: Gis }).google;
    if (ada?.accounts?.oauth2) return selesai(ada);
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => selesai((window as unknown as { google: Gis }).google);
    s.onerror = () => {
      skrip = null;
      gagal(new Error("Google tidak bisa dimuat. Periksa internetmu."));
    };
    document.head.appendChild(s);
  });
  return skrip;
}

/** Rejects with `dibatalkan` when the person closes Google's popup. */
export async function masukDenganGoogle(): Promise<Akun> {
  if (AUTH_DEMO) {
    // Real version needs NEXT_PUBLIC_GOOGLE_CLIENT_ID; see siapkanGoogle.
    await new Promise((r) => setTimeout(r, 1100));
    return { nama: "Darto Prasetyo", email: "darto.prasetyo@contoh.id" };
  }
  const google = await siapkanGoogle()!;
  const aksesGoogle = await new Promise<string>((selesai, gagal) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        scope: "openid email profile",
        callback: (t) => (t.access_token ? selesai(t.access_token) : gagal(new Error(t.error ?? "Google menolak masuk."))),
        error_callback: (e) => gagal(new Error(e.type === "popup_closed" ? "dibatalkan" : "Jendela Google tidak bisa dibuka. Izinkan pop-up lalu coba lagi.")),
      })
      .requestAccessToken();
  });
  // Name and email come back from the backend check; this tab only holds the token for a moment.
  return { nama: "", email: "", aksesGoogle };
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
