import type { Metadata } from "next";
import { Bagian, HalamanTeks } from "@/components/landing/HalamanTeks";

export const metadata: Metadata = {
  title: "Kebijakan Privasi · Lokerin",
  description: "Data apa yang Lokerin simpan, untuk apa, dan bagaimana kamu bisa menghapusnya.",
};

const KONTAK = "apridika07@gmail.com";

export default function Privasi() {
  return (
    <HalamanTeks judul="Kebijakan Privasi" berlaku="19 Oktober 2026">
      <p>
        Lokerin membantu pencari kerja di Banyumas menemukan lowongan warung, bengkel, dan UMKM, dan membantu pemberi kerja menemukan pelamar. Halaman ini menjelaskan data apa
        yang kami simpan, untuk apa, dan apa yang bisa kamu lakukan dengannya.
      </p>

      <Bagian judul="Data yang kami simpan">
        <ul className="grid list-disc gap-2 pl-6">
          <li><b>Akun Google</b>: nama, alamat email, dan foto profil saat kamu masuk dengan Google. Kami tidak membaca Gmail, Drive, kontak, atau data Google lainnya.</li>
          <li><b>Obrolan</b>: teks obrolanmu dengan asisten Lokerin, termasuk transkrip panggilan suara. Rekaman suaranya tidak kami simpan.</li>
          <li><b>Bahan CV dan profil</b>: pengalaman, pendidikan, keahlian, prestasi, dan CV yang disusun dari bahan itu.</li>
          <li><b>Lokasi</b>: kota atau area yang kamu pilih, dan lokasi perangkat bila kamu mengizinkan, untuk menampilkan lowongan di sekitarmu.</li>
          <li><b>Lamaran</b>: lowongan yang kamu lamar dan statusnya. Pemberi kerja hanya melihat CV lamaran yang kamu kirim ke lowongan mereka.</li>
          <li><b>Notifikasi</b>: alamat langganan notifikasi bila kamu mengizinkannya.</li>
          <li><b>Pemberi kerja</b>: nama usaha, alamat, dan lowongan yang dipasang.</li>
        </ul>
      </Bagian>

      <Bagian judul="Untuk apa data itu dipakai">
        <p>
          Untuk menyusun CV, mencocokkan kamu dengan lowongan, mengirim lamaran, memberi kabar soal lamaranmu, dan menjaga layanan tetap aman dari penipuan. Kami tidak menjual
          datamu dan tidak memakainya untuk iklan.
        </p>
      </Bagian>

      <Bagian judul="Layanan pihak ketiga">
        <ul className="grid list-disc gap-2 pl-6">
          <li>Google, untuk masuk dengan akun Google.</li>
          <li>OpenAI dan OpenRouter, untuk memproses obrolan dan suara serta menyusun CV. Mereka menerima isi obrolan yang diperlukan untuk menjawab.</li>
          <li>Mapbox, untuk peta dan pencarian alamat.</li>
          <li>Vercel, untuk menayangkan situs web.</li>
          <li>IDCloudHost, tempat server dan database Lokerin berada, di Jakarta.</li>
        </ul>
      </Bagian>

      <Bagian judul="Penyimpanan dan keamanan">
        <p>
          Data disimpan di server di Indonesia dan dikirim lewat koneksi terenkripsi (HTTPS). Database dicadangkan setiap hari dan cadangan disimpan 14 hari. Akses ke server
          dibatasi untuk tim Lokerin.
        </p>
      </Bagian>

      <Bagian judul="Hakmu">
        <p>
          Kamu bisa melihat, mengubah, dan menghapus bahan CV kapan saja di halaman Profil. Untuk menghapus akun beserta semua datamu, kirim email ke{" "}
          <a href={`mailto:${KONTAK}`} className="underline">{KONTAK}</a> dari alamat email akunmu. Kami memprosesnya paling lama 14 hari.
        </p>
      </Bagian>

      <Bagian judul="Perubahan dan kontak">
        <p>
          Bila kebijakan ini berubah, tanggal di atas ikut berubah dan perubahan penting kami umumkan di aplikasi. Pertanyaan soal privasi:{" "}
          <a href={`mailto:${KONTAK}`} className="underline">{KONTAK}</a>.
        </p>
      </Bagian>
    </HalamanTeks>
  );
}
