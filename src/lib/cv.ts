"use client";

// Downloading a CV Khusus as PDF. The request carries the session in the Authorization header
// rather than in the URL, so the token never lands in browser history or server logs.

import { API_URL, bacaToken, GalatApi } from "./api/klien";

function namaDariHeader(header: string | null) {
  const utf8 = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utf8) return decodeURIComponent(utf8);
  return header?.match(/filename="([^"]+)"/i)?.[1] ?? "CV.pdf";
}

export async function ambilPdfCv(id: string) {
  const res = await fetch(`${API_URL}/cv/${encodeURIComponent(id)}/pdf?unduh=1`, { headers: { authorization: `Bearer ${bacaToken() ?? ""}` } });
  if (!res.ok) {
    const isi = (await res.json().catch(() => null)) as { galat?: string; pesan?: string } | null;
    throw new GalatApi(res.status, isi?.galat ?? "pdf_gagal", isi?.pesan ?? "PDF belum bisa dibuat. Coba lagi.");
  }
  const nama = namaDariHeader(res.headers.get("content-disposition"));
  return new File([await res.blob()], nama, { type: "application/pdf" });
}

/** Saves the PDF with a name people recognise in Downloads: "CV - Sari Wulandari - Juru Masak.pdf". */
export async function unduhCv(id: string) {
  const berkas = await ambilPdfCv(id);
  const url = URL.createObjectURL(berkas);
  const a = document.createElement("a");
  a.href = url;
  a.download = berkas.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return berkas.name;
}

export function bisaBagikanBerkas() {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [new File([""], "cek.pdf", { type: "application/pdf" })] });
  } catch {
    return false;
  }
}

/** Opens the phone's share sheet (WhatsApp, email, Files) with the PDF attached. */
export async function bagikanCv(id: string) {
  const berkas = await ambilPdfCv(id);
  await navigator.share({ files: [berkas], title: berkas.name.replace(/\.pdf$/, "") });
}
