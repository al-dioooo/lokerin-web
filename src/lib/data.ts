import type { KategoriSlug } from "@/components/icons/categories";
import type { StatusUpah } from "@/components/ui/CekUpah";

// Sample data for the 18 Oct build. Business names are made up; nothing here is a real listing.

export type JenisUpah = "harian" | "mingguan" | "bulanan" | "borongan";
export type PersonaId = "las" | "ojek";

export type Verifikasi = { ktp: boolean; npwp: boolean; fotoUsaha: boolean; tanggal: string; ktpSamaran?: string };

export type Lowongan = {
  id: string;
  kategori: KategoriSlug;
  judul: string;
  usaha: string;
  pemilik: string;
  upah: number;
  jenisUpah: JenisUpah;
  area: string;
  jarakKm: number;
  jadwal: string;
  deskripsi: string;
  syarat: string[];
  cekUpah: StatusUpah;
  verifikasi: Verifikasi;
  wa: string;
  /** Minutes left for a Butuh Hari Ini listing when the page opens. */
  mendesakMenit?: number;
  cocok?: Partial<Record<PersonaId, number>>;
  dipasang: string;
};

export const LOWONGAN: Lowongan[] = [
  { id: "cuci-piring-bu-wati", kategori: "dapur", judul: "Tukang cuci piring", usaha: "Warung Bu Wati", pemilik: "Bu Wati", upah: 120000, jenisUpah: "harian", area: "Purwokerto Utara", jarakKm: 1.2, jadwal: "Hari ini, 16.00–22.00", deskripsi: "Warung makan ramai malam ini karena ada acara kampus. Butuh satu orang untuk cuci piring dan bantu beres meja.", syarat: ["Bisa datang sebelum jam 16.00", "Rapi dan cekatan"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "18 Oktober 2026", ktpSamaran: "3302 •••• •••• 0001" }, wa: "6281200000001", mendesakMenit: 271, cocok: { las: 40, ojek: 35 }, dipasang: "12 menit lalu" },
  { id: "antar-galon-sokaraja", kategori: "kurir", judul: "Antar galon dan gas", usaha: "Depot Air Sumber Bening", pemilik: "Pak Rahmat", upah: 100000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.1, jadwal: "Hari ini, 13.00–18.00", deskripsi: "Pengantaran galon dan tabung gas ke rumah-rumah sekitar Sokaraja. Motor dari depot.", syarat: ["Punya SIM C", "Kuat angkat galon"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "17 Oktober 2026", ktpSamaran: "3302 •••• •••• 0417" }, wa: "6281200000002", mendesakMenit: 95, cocok: { ojek: 82, las: 30 }, dipasang: "35 menit lalu" },
  { id: "bantu-hajatan-kembaran", kategori: "acara", judul: "Bantu pasang tenda hajatan", usaha: "Sewa Tenda Mas Yoga", pemilik: "Mas Yoga", upah: 150000, jenisUpah: "harian", area: "Kembaran", jarakKm: 5.4, jadwal: "Hari ini, 15.00–21.00", deskripsi: "Pasang tenda dan kursi untuk hajatan besok pagi. Kerja berdua dengan tim.", syarat: ["Tidak takut ketinggian", "Bisa kerja tim"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 1290" }, wa: "6281200000003", mendesakMenit: 180, cocok: { las: 64, ojek: 41 }, dipasang: "1 jam lalu" },
  { id: "las-pagar-pak-jaya", kategori: "las", judul: "Tukang las pagar dan kanopi", usaha: "Bengkel Las Pak Jaya", pemilik: "Pak Jaya", upah: 150000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.5, jadwal: "Senin–Sabtu, 08.00–16.00", deskripsi: "Mengerjakan pesanan pagar, teralis, dan kanopi. Alat lengkap di bengkel.", syarat: ["Pengalaman las listrik minimal 1 tahun", "Bisa baca ukuran"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026", ktpSamaran: "3302 •••• •••• 0733" }, wa: "6281200000004", cocok: { las: 92, ojek: 12 }, dipasang: "Kemarin" },
  { id: "las-teralis-borongan", kategori: "las", judul: "Las teralis rumah (borongan)", usaha: "CV Karya Baja Mandiri", pemilik: "Pak Hendra", upah: 2400000, jenisUpah: "borongan", area: "Purwokerto Selatan", jarakKm: 2.8, jadwal: "Selesai dalam 6 hari", deskripsi: "Borongan teralis untuk 8 jendela dan 1 pintu. Bahan disediakan.", syarat: ["Punya alat las sendiri lebih disukai"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: false, tanggal: "15 Oktober 2026", ktpSamaran: "3302 •••• •••• 5512" }, wa: "6281200000005", cocok: { las: 87, ojek: 8 }, dipasang: "2 hari lalu" },
  { id: "kurir-malam-ajibarang", kategori: "ojek", judul: "Kurir makanan malam", usaha: "Ayam Geprek Mbak Sri", pemilik: "Mbak Sri", upah: 700000, jenisUpah: "mingguan", area: "Ajibarang", jarakKm: 9.6, jadwal: "Setiap hari, 18.00–22.00", deskripsi: "Mengantar pesanan pelanggan sekitar Ajibarang. Bensin diganti.", syarat: ["Punya motor dan SIM C", "Hafal jalan Ajibarang"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "14 Oktober 2026", ktpSamaran: "3302 •••• •••• 2201" }, wa: "6281200000006", cocok: { ojek: 88, las: 5 }, dipasang: "3 jam lalu" },
  { id: "sopir-pickup-material", kategori: "angkut", judul: "Sopir pikap material", usaha: "Toko Bangunan Pak Slamet", pemilik: "Pak Slamet", upah: 130000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 4, jadwal: "Senin–Sabtu, 07.00–15.00", deskripsi: "Mengantar pasir, semen, dan bata ke pelanggan. Bantu bongkar muat.", syarat: ["SIM A", "Kuat angkat"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: false, tanggal: "15 Oktober 2026", ktpSamaran: "3302 •••• •••• 8890" }, wa: "6281200000007", cocok: { ojek: 61, las: 33 }, dipasang: "5 jam lalu" },
  { id: "setrika-laundry-rini", kategori: "laundry", judul: "Setrika dan lipat pakaian", usaha: "Laundry Mbak Rini", pemilik: "Mbak Rini", upah: 1600000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2, jadwal: "Senin–Sabtu, 09.00–17.00", deskripsi: "Menyetrika dan melipat cucian pelanggan. Makan siang disediakan.", syarat: ["Teliti", "Jujur"], cekUpah: "rendah", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 3304" }, wa: "6281200000008", dipasang: "Kemarin" },
  { id: "jaga-toko-sembako", kategori: "toko", judul: "Jaga toko sembako", usaha: "Toko Bu Siti", pemilik: "Bu Siti", upah: 1500000, jenisUpah: "bulanan", area: "Ajibarang", jarakKm: 9.1, jadwal: "Senin–Sabtu, 07.00–15.00", deskripsi: "Melayani pembeli, menata barang, dan mencatat stok sederhana.", syarat: ["Bisa berhitung", "Ramah"], cekUpah: "rendah", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 6620" }, wa: "6281200000009", dipasang: "2 hari lalu" },
  { id: "bengkel-motor-baturraden", kategori: "bengkel", judul: "Montir motor", usaha: "Bengkel Jaya Motor", pemilik: "Mas Dwi", upah: 2500000, jenisUpah: "bulanan", area: "Baturraden", jarakKm: 11.2, jadwal: "Selasa–Minggu, 08.00–17.00", deskripsi: "Servis ringan, ganti oli, tambal ban. Bisa belajar sambil kerja.", syarat: ["Paham mesin motor dasar"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "13 Oktober 2026", ktpSamaran: "3302 •••• •••• 4781" }, wa: "6281200000010", cocok: { las: 58, ojek: 52 }, dipasang: "3 hari lalu" },
  { id: "kebun-cabai-cilongok", kategori: "kebun", judul: "Petik cabai", usaha: "Kebun Pak Darmo", pemilik: "Pak Darmo", upah: 90000, jenisUpah: "harian", area: "Cilongok", jarakKm: 13.5, jadwal: "Sabtu–Minggu, 06.00–11.00", deskripsi: "Panen cabai rawit. Dibayar harian setelah selesai.", syarat: ["Siap kerja pagi"], cekUpah: "wajar", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "12 Oktober 2026", ktpSamaran: "3302 •••• •••• 1188" }, wa: "6281200000011", dipasang: "4 hari lalu" },
  { id: "admin-gudang-curiga", kategori: "angkut", judul: "Admin gudang, gaji Rp9 juta", usaha: "PT Sejahtera Abadi Jaya", pemilik: "Tidak diketahui", upah: 9000000, jenisUpah: "bulanan", area: "Purwokerto", jarakKm: 1.8, jadwal: "Senin–Jumat", deskripsi: "Gaji besar, tanpa pengalaman. Wajib bayar biaya seragam Rp250.000 sebelum mulai.", syarat: ["Transfer biaya seragam"], cekUpah: "curiga", verifikasi: { ktp: false, npwp: false, fotoUsaha: false, tanggal: "-" }, wa: "6281200000012", dipasang: "Ditahan" },
];

export const PEKERJA = {
  nama: "Pak Darto",
  kota: "Purwokerto, Banyumas",
  umur: 38,
  persona: {
    las: { judul: "Tukang Las", ringkas: "Las pagar, teralis, dan kanopi. 5 tahun di bengkel Sokaraja.", keahlian: ["Las listrik", "Pagar dan teralis", "Kanopi", "Baca ukuran"], waktu: "Senin–Sabtu, 08.00–16.00", pengalaman: [{ peran: "Tukang las", tempat: "Bengkel las di Sokaraja", lama: "5 tahun", sumber: "suara" as const }, { peran: "Kenek las", tempat: "Proyek ruko Purwokerto", lama: "1 tahun", sumber: "formulir" as const }] },
    ojek: { judul: "Driver Ojol", ringkas: "Antar penumpang dan makanan di Purwokerto, malam hari.", keahlian: ["Motor sendiri", "SIM C", "Hafal Purwokerto"], waktu: "Setiap hari, 18.00–22.00", pengalaman: [{ peran: "Driver ojek online", tempat: "Purwokerto dan sekitarnya", lama: "3 tahun", sumber: "suara" as const }] },
  },
} as const;

export const JENIS_UPAH_LABEL: Record<JenisUpah, string> = { harian: "/hari", mingguan: "/minggu", bulanan: "/bulan", borongan: " borongan" };

export function rupiah(n: number) {
  return `Rp${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function upahTeks(l: Pick<Lowongan, "upah" | "jenisUpah">) {
  return `${rupiah(l.upah)}${JENIS_UPAH_LABEL[l.jenisUpah]}`;
}

export function cariLowongan(id: string) {
  return LOWONGAN.find((l) => l.id === id);
}

export const LOWONGAN_TAYANG = LOWONGAN.filter((l) => l.cekUpah !== "curiga");
export const BUTUH_HARI_INI = LOWONGAN_TAYANG.filter((l) => l.mendesakMenit);
