import type { Metadata } from "next";
import Link from "next/link";
import { Bagian, HalamanTeks } from "@/components/landing/HalamanTeks";

export const metadata: Metadata = {
  title: "Ketentuan Layanan · Lokerin",
  description: "Aturan memakai Lokerin untuk pencari kerja dan pemberi kerja.",
};

const KONTAK = "apridika07@gmail.com";

export default function Ketentuan() {
  return (
    <HalamanTeks judul="Ketentuan Layanan" berlaku="19 Oktober 2026">
      <p>Dengan memakai Lokerin, kamu setuju dengan ketentuan di bawah. Bahasanya kami buat sesederhana mungkin.</p>

      <Bagian judul="Layanan">
        <p>
          Lokerin mempertemukan pencari kerja dengan lowongan di usaha kecil dan menengah. Lokerin gratis untuk pencari kerja. Lokerin bukan pemberi kerja dan bukan pihak dalam
          hubungan kerja antara kamu dan usaha yang kamu lamar.
        </p>
      </Bagian>

      <Bagian judul="Akunmu">
        <p>Satu orang satu akun. Isi data dengan benar dan jaga akses ke akun Google yang kamu pakai untuk masuk.</p>
      </Bagian>

      <Bagian judul="CV dan isi obrolan">
        <p>
          CV disusun asisten AI dari bahan yang kamu ceritakan. Asisten bisa keliru, jadi periksa CV sebelum dikirim. Kamu bertanggung jawab atas kebenaran isi CV dan lamaranmu.
        </p>
      </Bagian>

      <Bagian judul="Untuk pemberi kerja">
        <ul className="grid list-disc gap-2 pl-6">
          <li>Pasang hanya lowongan yang benar-benar ada, dengan gaji dan syarat yang jujur.</li>
          <li>Jangan memungut biaya apa pun dari pelamar.</li>
          <li>Pakai data pelamar hanya untuk proses rekrutmen lowongan itu.</li>
        </ul>
      </Bagian>

      <Bagian judul="Yang tidak boleh">
        <p>Penipuan, lowongan palsu, spam, konten yang melanggar hukum, dan usaha membobol atau membebani layanan. Akun yang melanggar bisa kami hentikan.</p>
      </Bagian>

      <Bagian judul="Batas tanggung jawab">
        <p>
          Kami berusaha memeriksa setiap lowongan, tetapi tidak bisa menjamin hasil lamaran atau keadaan di tempat kerja. Bila menemukan lowongan yang mencurigakan, laporkan
          lewat tombol Laporkan di halaman lowongan.
        </p>
      </Bagian>

      <Bagian judul="Data pribadi">
        <p>
          Cara kami menyimpan dan memakai datamu dijelaskan di <Link href="/privasi" className="underline">Kebijakan Privasi</Link>.
        </p>
      </Bagian>

      <Bagian judul="Perubahan, hukum, dan kontak">
        <p>
          Ketentuan ini bisa berubah. Tanggal di atas menunjukkan versi terakhir. Ketentuan ini tunduk pada hukum Republik Indonesia. Pertanyaan:{" "}
          <a href={`mailto:${KONTAK}`} className="underline">{KONTAK}</a>.
        </p>
      </Bagian>
    </HalamanTeks>
  );
}
