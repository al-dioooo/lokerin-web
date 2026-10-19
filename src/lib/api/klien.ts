// Talks to lokerin-backend. Without NEXT_PUBLIC_API_URL the app runs on the sample data in src/lib/data.ts.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
export const apiAktif = API_URL.length > 0;

const KUNCI_TOKEN = "lokerin-token";

export class GalatApi extends Error {
  constructor(
    public status: number,
    public kode: string,
    pesan: string,
  ) {
    super(pesan);
  }
}

export function bacaToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KUNCI_TOKEN);
  } catch {
    return null;
  }
}

export function simpanToken(token: string | null) {
  try {
    if (token) localStorage.setItem(KUNCI_TOKEN, token);
    else localStorage.removeItem(KUNCI_TOKEN);
  } catch {}
}

type Opsi = { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: unknown; signal?: AbortSignal; token?: string | null };

// POSTs that only read or start something; they change nothing other screens show.
const BUKAN_PERUBAHAN = /^\/(lowongan\/cari|auth\/|suara\/sesi|chat)/;

export async function api<T>(path: string, opsi: Opsi = {}): Promise<T> {
  if (!apiAktif) throw new GalatApi(0, "tanpa_server", "Belum tersambung ke server.");
  const token = opsi.token === undefined ? bacaToken() : opsi.token;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: opsi.method ?? "GET",
      headers: {
        ...(opsi.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: opsi.body !== undefined ? JSON.stringify(opsi.body) : undefined,
      signal: opsi.signal,
      // Public reads may use the browser cache, always checked with the server (a cheap 304 when
      // nothing changed). Anything sent with a session is never written to the browser's disk.
      cache: !token && (opsi.method ?? "GET") === "GET" ? "no-cache" : "no-store",
    });
  } catch {
    throw new GalatApi(0, "jaringan", "Tidak tersambung. Periksa internetmu lalu coba lagi.");
  }
  const type = res.headers.get("content-type") ?? "";
  const data = type.includes("json") ? await res.json() : null;
  if (!res.ok) {
    const galat = data as { galat?: string; pesan?: string } | null;
    throw new GalatApi(res.status, galat?.galat ?? "server", galat?.pesan ?? "Ada yang salah di server. Coba lagi.");
  }
  if ((opsi.method ?? "GET") !== "GET" && !BUKAN_PERUBAHAN.test(path) && typeof window !== "undefined") {
    window.dispatchEvent(new Event("lokerin:tersimpan"));
  }
  return data as T;
}

/** URL for EventSource and links that cannot send an Authorization header. */
export function urlBertoken(path: string) {
  const token = bacaToken();
  const sep = path.includes("?") ? "&" : "?";
  return `${API_URL}${path}${token ? `${sep}token=${encodeURIComponent(token)}` : ""}`;
}
