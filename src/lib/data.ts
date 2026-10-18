import type { KategoriSlug } from "@/components/icons/categories";
import type { StatusUpah } from "@/components/ui/CekUpah";

// Data demo fiktif: nama usaha, orang, dan nomor kontak bukan data pihak nyata.

export type JenisUpah = "harian" | "mingguan" | "bulanan" | "borongan";
export type PersonaId = "las" | "ojek";
export type Segmen = "informal" | "magang";
export type Kota = "Banyumas" | "Purbalingga" | "Cilacap";

export type Verifikasi = { ktp: boolean; npwp: boolean; fotoUsaha: boolean; tanggal: string; ktpSamaran?: string };

export type PemberiKerja = {
  id: string;
  nama: string;
  pemilik: string;
  jenis: "umkm" | "perusahaan" | "rumah_tangga";
  kota: Kota;
  area: string;
  status: "terverifikasi" | "menunggu";
  verifikasi: Verifikasi;
  wa: string;
};

export type Lowongan = {
  id: string;
  segmen: Segmen;
  kota: Kota;
  pemberiId: string;
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
  /** Sisa menit untuk lowongan Butuh Hari Ini saat halaman dibuka. */
  mendesakMenit?: number;
  /** Skor kecocokan persona Darto (las, ojek) dan Raka (uiux, frontend). */
  cocok?: Partial<Record<string, number>>;
  dipasang: string;
};

export const PEMBERI_KERJA: PemberiKerja[] = [
  { id: "e-wati", nama: "Warung Bu Wati", pemilik: "Bu Wati", jenis: "umkm", kota: "Banyumas", area: "Purwokerto Utara", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "18 Oktober 2026", ktpSamaran: "3302 •••• •••• 0001" }, wa: "6281200000001" },
  { id: "e-rahmat", nama: "Depot Air Sumber Bening", pemilik: "Pak Rahmat", jenis: "umkm", kota: "Banyumas", area: "Sokaraja", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "17 Oktober 2026", ktpSamaran: "3302 •••• •••• 0417" }, wa: "6281200000002" },
  { id: "e-yoga", nama: "Sewa Tenda Mas Yoga", pemilik: "Mas Yoga", jenis: "umkm", kota: "Banyumas", area: "Kembaran", status: "terverifikasi", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 1290" }, wa: "6281200000003" },
  { id: "e-jaya", nama: "Bengkel Las Pak Jaya", pemilik: "Pak Jaya", jenis: "umkm", kota: "Banyumas", area: "Sokaraja", status: "terverifikasi", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026", ktpSamaran: "3302 •••• •••• 0733" }, wa: "6281200000004" },
  { id: "e-sri", nama: "Ayam Geprek Mbak Sri", pemilik: "Mbak Sri", jenis: "umkm", kota: "Banyumas", area: "Ajibarang", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "14 Oktober 2026", ktpSamaran: "3302 •••• •••• 2201" }, wa: "6281200000006" },
  { id: "e-slamet", nama: "Toko Bangunan Pak Slamet", pemilik: "Pak Slamet", jenis: "umkm", kota: "Banyumas", area: "Sokaraja", status: "terverifikasi", verifikasi: { ktp: true, npwp: true, fotoUsaha: false, tanggal: "15 Oktober 2026", ktpSamaran: "3302 •••• •••• 8890" }, wa: "6281200000007" },
  { id: "e-rini", nama: "Laundry Mbak Rini", pemilik: "Mbak Rini", jenis: "umkm", kota: "Banyumas", area: "Purwokerto Timur", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 3304" }, wa: "6281200000008" },
  { id: "e-siti", nama: "Toko Bu Siti", pemilik: "Bu Siti", jenis: "umkm", kota: "Banyumas", area: "Ajibarang", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 6620" }, wa: "6281200000009" },
  { id: "e-darmo", nama: "Kebun Pak Darmo", pemilik: "Pak Darmo", jenis: "rumah_tangga", kota: "Banyumas", area: "Cilongok", status: "terverifikasi", verifikasi: { ktp: true, npwp: false, fotoUsaha: true, tanggal: "12 Oktober 2026", ktpSamaran: "3302 •••• •••• 1188" }, wa: "6281200000011" },
  { id: "e-serayu", nama: "Rumah Kreatif Serayu", pemilik: "Mbak Nala", jenis: "umkm", kota: "Banyumas", area: "Purwokerto Utara", status: "terverifikasi", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "16 Oktober 2026", ktpSamaran: "3302 •••• •••• 0013" }, wa: "6281200000013" },
  { id: "e-kalibener", nama: "Lab Digital Kalibener", pemilik: "Mas Bima", jenis: "perusahaan", kota: "Banyumas", area: "Purwokerto Timur", status: "terverifikasi", verifikasi: { ktp: true, npwp: true, fotoUsaha: true, tanggal: "17 Oktober 2026", ktpSamaran: "3302 •••• •••• 0014" }, wa: "6281200000014" },
  { id: "e-sejahtera", nama: "PT Sejahtera Abadi Jaya", pemilik: "Tidak diketahui", jenis: "perusahaan", kota: "Banyumas", area: "Purwokerto Timur", status: "menunggu", verifikasi: { ktp: false, npwp: false, fotoUsaha: false, tanggal: "-" }, wa: "6281200000012" },
];

export function cariPemberi(id: string) {
  return PEMBERI_KERJA.find((p) => p.id === id);
}

// Identitas dan kontak lowongan selalu mengikuti data pemberi kerja.
const daftarLowongan: Omit<Lowongan, "usaha" | "pemilik" | "verifikasi" | "wa">[] = [
  {
    id: "cuci-piring-bu-wati", segmen: "informal", kota: "Banyumas", pemberiId: "e-wati", kategori: "dapur",
    judul: "Tukang cuci piring", upah: 120000, jenisUpah: "harian", area: "Purwokerto Utara", jarakKm: 1.2, jadwal: "Hari ini, 16.00–22.00",
    deskripsi: "Warung makan ramai malam ini karena ada acara kampus. Butuh satu orang untuk cuci piring dan bantu beres meja.", syarat: ["Bisa datang sebelum jam 16.00", "Rapi dan cekatan"],
    cekUpah: "wajar", mendesakMenit: 271, cocok: { las: 40, ojek: 35 }, dipasang: "12 menit lalu",
  },
  {
    id: "antar-galon-sokaraja", segmen: "informal", kota: "Banyumas", pemberiId: "e-rahmat", kategori: "kurir",
    judul: "Antar galon dan gas", upah: 100000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.1, jadwal: "Hari ini, 13.00–18.00",
    deskripsi: "Pengantaran galon dan tabung gas ke rumah-rumah sekitar Sokaraja. Motor dari depot.", syarat: ["Punya SIM C", "Kuat angkat galon"],
    cekUpah: "wajar", mendesakMenit: 95, cocok: { ojek: 82, las: 30 }, dipasang: "35 menit lalu",
  },
  {
    id: "bantu-hajatan-kembaran", segmen: "informal", kota: "Banyumas", pemberiId: "e-yoga", kategori: "acara",
    judul: "Bantu pasang tenda hajatan", upah: 150000, jenisUpah: "harian", area: "Kembaran", jarakKm: 5.4, jadwal: "Hari ini, 15.00–21.00",
    deskripsi: "Pasang tenda dan kursi untuk hajatan besok pagi. Kerja berdua dengan tim.", syarat: ["Tidak takut ketinggian", "Bisa kerja tim"],
    cekUpah: "wajar", mendesakMenit: 180, cocok: { las: 64, ojek: 41 }, dipasang: "1 jam lalu",
  },
  {
    id: "las-pagar-pak-jaya", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "las",
    judul: "Tukang las pagar dan kanopi", upah: 150000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.5, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Mengerjakan pesanan pagar, teralis, dan kanopi. Alat lengkap di bengkel.", syarat: ["Pengalaman las listrik minimal 1 tahun", "Bisa baca ukuran"],
    cekUpah: "wajar", cocok: { las: 92, ojek: 12 }, dipasang: "Kemarin",
  },
  {
    id: "las-teralis-borongan", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "las",
    judul: "Las teralis rumah (borongan)", upah: 2400000, jenisUpah: "borongan", area: "Purwokerto Selatan", jarakKm: 2.8, jadwal: "Selesai dalam 6 hari",
    deskripsi: "Borongan teralis untuk 8 jendela dan 1 pintu. Bahan disediakan.", syarat: ["Punya alat las sendiri lebih disukai"],
    cekUpah: "wajar", cocok: { las: 87, ojek: 8 }, dipasang: "2 hari lalu",
  },
  {
    id: "kurir-malam-ajibarang", segmen: "informal", kota: "Banyumas", pemberiId: "e-sri", kategori: "ojek",
    judul: "Kurir makanan malam", upah: 700000, jenisUpah: "mingguan", area: "Ajibarang", jarakKm: 9.6, jadwal: "Setiap hari, 18.00–22.00",
    deskripsi: "Mengantar pesanan pelanggan sekitar Ajibarang. Bensin diganti.", syarat: ["Punya motor dan SIM C", "Hafal jalan Ajibarang"],
    cekUpah: "wajar", cocok: { ojek: 88, las: 5 }, dipasang: "3 jam lalu",
  },
  {
    id: "sopir-pickup-material", segmen: "informal", kota: "Banyumas", pemberiId: "e-slamet", kategori: "angkut",
    judul: "Sopir pikap material", upah: 130000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 4, jadwal: "Senin–Sabtu, 07.00–15.00",
    deskripsi: "Mengantar pasir, semen, dan bata ke pelanggan. Bantu bongkar muat.", syarat: ["SIM A", "Kuat angkat"],
    cekUpah: "wajar", cocok: { ojek: 61, las: 33 }, dipasang: "5 jam lalu",
  },
  {
    id: "setrika-laundry-rini", segmen: "informal", kota: "Banyumas", pemberiId: "e-rini", kategori: "laundry",
    judul: "Setrika dan lipat pakaian", upah: 1600000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2, jadwal: "Senin–Sabtu, 09.00–17.00",
    deskripsi: "Menyetrika dan melipat cucian pelanggan. Makan siang disediakan.", syarat: ["Teliti", "Jujur"],
    cekUpah: "rendah", dipasang: "Kemarin",
  },
  {
    id: "jaga-toko-sembako", segmen: "informal", kota: "Banyumas", pemberiId: "e-siti", kategori: "toko",
    judul: "Jaga toko sembako", upah: 1500000, jenisUpah: "bulanan", area: "Ajibarang", jarakKm: 9.1, jadwal: "Senin–Sabtu, 07.00–15.00",
    deskripsi: "Melayani pembeli, menata barang, dan mencatat stok sederhana.", syarat: ["Bisa berhitung", "Ramah"],
    cekUpah: "rendah", dipasang: "2 hari lalu",
  },
  {
    id: "bengkel-motor-baturraden", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "bengkel",
    judul: "Montir motor", upah: 2500000, jenisUpah: "bulanan", area: "Baturraden", jarakKm: 11.2, jadwal: "Selasa–Minggu, 08.00–17.00",
    deskripsi: "Servis ringan, ganti oli, tambal ban. Bisa belajar sambil kerja.", syarat: ["Paham mesin motor dasar"],
    cekUpah: "wajar", cocok: { las: 58, ojek: 52 }, dipasang: "3 hari lalu",
  },
  {
    id: "kebun-cabai-cilongok", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "kebun",
    judul: "Petik cabai", upah: 90000, jenisUpah: "harian", area: "Cilongok", jarakKm: 13.5, jadwal: "Sabtu–Minggu, 06.00–11.00",
    deskripsi: "Panen cabai rawit. Dibayar harian setelah selesai.", syarat: ["Siap kerja pagi"],
    cekUpah: "wajar", dipasang: "4 hari lalu",
  },
  {
    id: "admin-gudang-curiga", segmen: "informal", kota: "Banyumas", pemberiId: "e-sejahtera", kategori: "angkut",
    judul: "Admin gudang, gaji Rp9 juta", upah: 9000000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 1.8, jadwal: "Senin–Jumat",
    deskripsi: "Gaji besar, tanpa pengalaman. Wajib bayar biaya seragam Rp250.000 sebelum mulai.", syarat: ["Transfer biaya seragam"],
    cekUpah: "curiga", dipasang: "Ditahan",
  },
  {
    id: "las-rangka-ruko", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "las",
    judul: "Las rangka kanopi ruko", upah: 160000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.8, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Membuat rangka kanopi ruko. Bahan, alat las, dan pelindung kerja disediakan.", syarat: ["Terbiasa las listrik", "Bisa membaca gambar ukuran"],
    cekUpah: "wajar", cocok: { las: 95, ojek: 10 }, dipasang: "20 menit lalu",
  },
  {
    id: "kenek-las-kembaran", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "las",
    judul: "Kenek las dan potong besi", upah: 100000, jenisUpah: "harian", area: "Kembaran", jarakKm: 6.2, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Membantu mengukur dan memotong besi untuk pagar. Bekerja bersama tukang las.", syarat: ["Bisa memakai meteran", "Mau mengikuti arahan keselamatan"],
    cekUpah: "wajar", cocok: { las: 85, ojek: 20 }, dipasang: "2 jam lalu",
  },
  {
    id: "perbaiki-pagar-rumah", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "las",
    judul: "Perbaiki engsel pagar rumah", upah: 450000, jenisUpah: "borongan", area: "Cilongok", jarakKm: 13.2, jadwal: "Sabtu, 08.00–16.00 · 1 hari",
    deskripsi: "Mengganti dua engsel dan mengelas sambungan pagar rumah. Bahan disediakan keluarga.", syarat: ["Punya alat las", "Pernah memperbaiki pagar"],
    cekUpah: "wajar", cocok: { las: 90, ojek: 8 }, dipasang: "Kemarin",
  },
  {
    id: "antar-katering-pagi", segmen: "informal", kota: "Banyumas", pemberiId: "e-wati", kategori: "ojek",
    judul: "Antar katering pagi", upah: 95000, jenisUpah: "harian", area: "Purwokerto Utara", jarakKm: 1.6, jadwal: "Senin–Sabtu, 06.00–11.00",
    deskripsi: "Mengantar kotak makan ke pelanggan sekitar kampus. Bensin diganti sesuai perjalanan.", syarat: ["Motor sendiri dan SIM C", "Bisa mengikat kotak makanan dengan aman"],
    cekUpah: "wajar", cocok: { las: 10, ojek: 90 }, dipasang: "3 hari lalu",
  },
  {
    id: "antar-belanja-siti", segmen: "informal", kota: "Banyumas", pemberiId: "e-siti", kategori: "ojek",
    judul: "Antar belanja pelanggan", upah: 100000, jenisUpah: "harian", area: "Ajibarang", jarakKm: 9.4, jadwal: "Senin–Sabtu, 08.00–15.00",
    deskripsi: "Mengantar belanja dari toko ke rumah pelanggan. Motor dan bensin dari toko.", syarat: ["SIM C aktif", "Bisa membaca alamat pelanggan"],
    cekUpah: "wajar", cocok: { las: 12, ojek: 86 }, dipasang: "20 menit lalu",
  },
  {
    id: "bantu-masak-wati", segmen: "informal", kota: "Banyumas", pemberiId: "e-wati", kategori: "dapur",
    judul: "Bantu masak lauk warung", upah: 100000, jenisUpah: "harian", area: "Purwokerto Utara", jarakKm: 0.8, jadwal: "Senin–Sabtu, 05.00–13.00",
    deskripsi: "Menyiapkan bahan, memasak sayur, dan membersihkan dapur setelah warung tutup.", syarat: ["Bisa memotong bahan masakan", "Terbiasa menjaga kebersihan dapur"],
    cekUpah: "wajar", cocok: { las: 25, ojek: 20 }, dipasang: "2 jam lalu",
  },
  {
    id: "siapkan-sambal-sri", segmen: "informal", kota: "Banyumas", pemberiId: "e-sri", kategori: "dapur",
    judul: "Siapkan sambal dan kemasan", upah: 80000, jenisUpah: "harian", area: "Ajibarang", jarakKm: 10.1, jadwal: "Senin–Sabtu, 09.00–17.00",
    deskripsi: "Menyiapkan sambal dan membungkus pesanan ayam. Makan siang disediakan.", syarat: ["Bisa mengikuti takaran resep", "Teliti menghitung pesanan"],
    cekUpah: "rendah", cocok: { las: 20, ojek: 25 }, dipasang: "Kemarin",
  },
  {
    id: "tukang-plester-sokaraja", segmen: "informal", kota: "Banyumas", pemberiId: "e-slamet", kategori: "bangunan",
    judul: "Tukang plester tembok", upah: 140000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 4.6, jadwal: "Senin–Sabtu, 07.30–16.00",
    deskripsi: "Memplester tembok gudang toko. Bahan dan alat kerja tersedia di lokasi.", syarat: ["Pernah mengerjakan plester", "Bisa meratakan permukaan"],
    cekUpah: "wajar", cocok: { las: 65, ojek: 15 }, dipasang: "3 hari lalu",
  },
  {
    id: "kenek-renovasi-gudang", segmen: "informal", kota: "Banyumas", pemberiId: "e-slamet", kategori: "bangunan",
    judul: "Kenek renovasi gudang", upah: 100000, jenisUpah: "harian", area: "Kembaran", jarakKm: 6.8, jadwal: "Senin–Sabtu, 07.30–16.00",
    deskripsi: "Mengaduk semen dan membantu tukang saat memperbaiki gudang penyimpanan material.", syarat: ["Siap bekerja di lokasi bangunan", "Bisa bekerja bersama tukang"],
    cekUpah: "wajar", cocok: { las: 70, ojek: 35 }, dipasang: "20 menit lalu",
  },
  {
    id: "cat-rumah-darmo", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "bangunan",
    judul: "Cat dinding rumah", upah: 120000, jenisUpah: "harian", area: "Cilongok", jarakKm: 13.8, jadwal: "Senin–Rabu, 08.00–16.00",
    deskripsi: "Mengecat dua kamar dan ruang tamu. Cat, kuas, serta tangga disediakan keluarga.", syarat: ["Pernah mengecat dinding", "Bisa menutup lantai agar tidak terkena cat"],
    cekUpah: "wajar", cocok: { las: 55, ojek: 20 }, dipasang: "2 jam lalu",
  },
  {
    id: "bantu-servis-motor", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "bengkel",
    judul: "Bantu servis motor", upah: 2400000, jenisUpah: "bulanan", area: "Baturraden", jarakKm: 11.6, jadwal: "Selasa–Minggu, 08.00–16.00",
    deskripsi: "Membantu montir mengganti oli dan kampas rem di tempat servis milik Pak Jaya.", syarat: ["Paham alat bengkel dasar", "Mau belajar dari montir"],
    cekUpah: "wajar", cocok: { las: 60, ojek: 55 }, dipasang: "Kemarin",
  },
  {
    id: "tambal-ban-sokaraja", segmen: "informal", kota: "Banyumas", pemberiId: "e-jaya", kategori: "bengkel",
    judul: "Tambal ban dan ganti oli", upah: 100000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 3.7, jadwal: "Senin–Sabtu, 10.00–18.00",
    deskripsi: "Menangani ban bocor dan ganti oli motor pelanggan. Alat dan bahan dari bengkel.", syarat: ["Bisa melepas ban motor", "Pernah menambal ban"],
    cekUpah: "wajar", cocok: { las: 56, ojek: 58 }, dipasang: "3 hari lalu",
  },
  {
    id: "bersih-rumah-darmo", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "bersih",
    judul: "Bersihkan rumah keluarga", upah: 100000, jenisUpah: "harian", area: "Cilongok", jarakKm: 14, jadwal: "Senin, Rabu, Jumat, 08.00–13.00",
    deskripsi: "Menyapu, mengepel, dan membersihkan kamar mandi. Alat kebersihan disediakan.", syarat: ["Terbiasa membersihkan rumah", "Bisa datang sesuai jadwal"],
    cekUpah: "wajar", cocok: { las: 25, ojek: 25 }, dipasang: "20 menit lalu",
  },
  {
    id: "bersih-studio-serayu", segmen: "informal", kota: "Banyumas", pemberiId: "e-serayu", kategori: "bersih",
    judul: "Bersihkan ruang studio", upah: 1800000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.9, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Membersihkan meja, lantai, dan ruang rapat studio desain. Peralatan tersedia.", syarat: ["Teliti saat membersihkan dekat komputer", "Bisa menjaga kerapian ruangan"],
    cekUpah: "rendah", cocok: { las: 20, ojek: 20 }, dipasang: "2 jam lalu",
  },
  {
    id: "kasir-material-slamet", segmen: "informal", kota: "Banyumas", pemberiId: "e-slamet", kategori: "toko",
    judul: "Kasir toko bangunan", upah: 2400000, jenisUpah: "bulanan", area: "Sokaraja", jarakKm: 4.2, jadwal: "Senin–Sabtu, 07.30–15.30",
    deskripsi: "Mencatat penjualan semen dan alat bangunan, menerima pembayaran, serta membuat nota.", syarat: ["Bisa berhitung", "Bisa menulis nota dengan jelas"],
    cekUpah: "wajar", cocok: { las: 45, ojek: 25 }, dipasang: "Kemarin",
  },
  {
    id: "tata-stok-sembako", segmen: "informal", kota: "Banyumas", pemberiId: "e-siti", kategori: "toko",
    judul: "Tata stok sembako", upah: 80000, jenisUpah: "harian", area: "Ajibarang", jarakKm: 9.8, jadwal: "Senin–Sabtu, 07.00–15.00",
    deskripsi: "Menata rak, mengecek tanggal kedaluwarsa, dan mencatat barang yang hampir habis.", syarat: ["Bisa membaca label barang", "Teliti mencatat stok"],
    cekUpah: "rendah", cocok: { las: 30, ojek: 35 }, dipasang: "3 hari lalu",
  },
  {
    id: "bongkar-semen-hari-ini", segmen: "informal", kota: "Banyumas", pemberiId: "e-slamet", kategori: "angkut",
    judul: "Bantu bongkar semen hari ini", upah: 130000, jenisUpah: "harian", area: "Sokaraja", jarakKm: 4.1, jadwal: "Hari ini, 14.00–18.00",
    deskripsi: "Membongkar kiriman semen bersama dua pekerja toko. Troli, sarung tangan, dan masker disediakan.", syarat: ["Bisa datang sebelum jam 14.00", "Terbiasa mengangkat barang bersama tim"],
    cekUpah: "wajar", mendesakMenit: 240, cocok: { las: 60, ojek: 50 }, dipasang: "20 menit lalu",
  },
  {
    id: "angkut-kursi-yoga", segmen: "informal", kota: "Banyumas", pemberiId: "e-yoga", kategori: "angkut",
    judul: "Angkut kursi dan meja acara", upah: 120000, jenisUpah: "harian", area: "Kembaran", jarakKm: 5.8, jadwal: "Sabtu–Minggu, 08.00–16.00",
    deskripsi: "Memuat kursi lipat dan meja ke pikap, lalu menurunkannya di tempat acara.", syarat: ["Bisa bekerja dalam tim", "Terbiasa mengangkat barang"],
    cekUpah: "wajar", cocok: { las: 55, ojek: 50 }, dipasang: "2 jam lalu",
  },
  {
    id: "rawat-kebun-cabai", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "kebun",
    judul: "Rawat kebun cabai keluarga", upah: 95000, jenisUpah: "harian", area: "Cilongok", jarakKm: 14.3, jadwal: "Senin–Sabtu, 06.00–13.00",
    deskripsi: "Menyiram tanaman, mencabut gulma, dan memasang penyangga cabai. Alat disediakan.", syarat: ["Siap bekerja pagi", "Bisa membedakan gulma dan bibit cabai"],
    cekUpah: "wajar", cocok: { las: 25, ojek: 20 }, dipasang: "Kemarin",
  },
  {
    id: "pilah-panen-darmo", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "kebun",
    judul: "Pilah dan kemas hasil panen", upah: 75000, jenisUpah: "harian", area: "Cilongok", jarakKm: 13.9, jadwal: "Senin–Sabtu, 07.00–15.00",
    deskripsi: "Memilah cabai yang rusak, menimbang hasil panen, dan mengemasnya untuk diambil pembeli.", syarat: ["Teliti memilah cabai", "Bisa memakai timbangan"],
    cekUpah: "rendah", cocok: { las: 20, ojek: 25 }, dipasang: "3 hari lalu",
  },
  {
    id: "jahit-permak-rini", segmen: "informal", kota: "Banyumas", pemberiId: "e-rini", kategori: "jahit",
    judul: "Jahit permak pakaian", upah: 2400000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.3, jadwal: "Senin–Sabtu, 09.00–17.00",
    deskripsi: "Mengerjakan permak celana dan mengganti ritsleting untuk pelanggan laundry. Mesin jahit tersedia.", syarat: ["Bisa memakai mesin jahit", "Pernah mengerjakan permak"],
    cekUpah: "wajar", dipasang: "20 menit lalu",
  },
  {
    id: "jahit-taplak-yoga", segmen: "informal", kota: "Banyumas", pemberiId: "e-yoga", kategori: "jahit",
    judul: "Jahit taplak meja acara", upah: 600000, jenisUpah: "borongan", area: "Kembaran", jarakKm: 5.9, jadwal: "Senin–Rabu, 08.00–15.00 · 3 hari",
    deskripsi: "Menjahit tepi 30 taplak meja. Kain, benang, dan mesin jahit disediakan di gudang tenda.", syarat: ["Bisa menjahit lurus", "Bisa mengukur kain"],
    cekUpah: "wajar", dipasang: "2 jam lalu",
  },
  {
    id: "cuci-laundry-rini", segmen: "informal", kota: "Banyumas", pemberiId: "e-rini", kategori: "laundry",
    judul: "Cuci dan jemur pakaian", upah: 1900000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.1, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Memisahkan cucian, menjalankan mesin cuci, dan menjemur pakaian sesuai label pelanggan.", syarat: ["Bisa membaca label perawatan", "Teliti memisahkan pesanan"],
    cekUpah: "rendah", dipasang: "Kemarin",
  },
  {
    id: "antar-laundry-rini", segmen: "informal", kota: "Banyumas", pemberiId: "e-rini", kategori: "kurir",
    judul: "Antar jemput cucian", upah: 100000, jenisUpah: "harian", area: "Purwokerto Timur", jarakKm: 2.5, jadwal: "Senin–Sabtu, 09.00–15.00",
    deskripsi: "Mengambil dan mengantar cucian pelanggan dalam kota. Motor dan bensin disediakan laundry.", syarat: ["SIM C aktif", "Bisa mencocokkan alamat dengan nota"],
    cekUpah: "wajar", cocok: { las: 10, ojek: 92 }, dipasang: "3 hari lalu",
  },
  {
    id: "kurir-galon-pagi", segmen: "informal", kota: "Banyumas", pemberiId: "e-rahmat", kategori: "kurir",
    judul: "Antar galon pagi", upah: 2500000, jenisUpah: "bulanan", area: "Sokaraja", jarakKm: 3.3, jadwal: "Senin–Sabtu, 07.00–15.00",
    deskripsi: "Mengantar galon ke pelanggan tetap depot. Motor, troli, dan bensin dari depot.", syarat: ["SIM C aktif", "Terbiasa membawa galon dengan aman"],
    cekUpah: "wajar", cocok: { las: 25, ojek: 89 }, dipasang: "20 menit lalu",
  },
  {
    id: "tata-kursi-hajatan", segmen: "informal", kota: "Banyumas", pemberiId: "e-yoga", kategori: "acara",
    judul: "Tata kursi dan meja hajatan", upah: 110000, jenisUpah: "harian", area: "Kembaran", jarakKm: 6.1, jadwal: "Sabtu, 07.00–15.00",
    deskripsi: "Menata kursi sesuai denah, memasang taplak, dan merapikan tempat setelah acara.", syarat: ["Bisa mengikuti denah sederhana", "Bisa bekerja dalam tim"],
    cekUpah: "wajar", cocok: { las: 45, ojek: 40 }, dipasang: "2 jam lalu",
  },
  {
    id: "dampingi-anak-darmo", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "asuh",
    judul: "Dampingi anak sepulang sekolah", upah: 1400000, jenisUpah: "bulanan", area: "Cilongok", jarakKm: 13.6, jadwal: "Senin–Jumat, 12.00–16.00",
    deskripsi: "Mendampingi anak usia 7 tahun makan dan belajar di rumah. Orang tua bekerja di kebun sebelah rumah.", syarat: ["Pernah mendampingi anak", "Sabar dan bisa membantu membaca"],
    cekUpah: "wajar", dipasang: "Kemarin",
  },
  {
    id: "dampingi-lansia-darmo", segmen: "informal", kota: "Banyumas", pemberiId: "e-darmo", kategori: "asuh",
    judul: "Temani lansia di rumah", upah: 2500000, jenisUpah: "bulanan", area: "Cilongok", jarakKm: 13.7, jadwal: "Senin–Sabtu, 08.00–16.00",
    deskripsi: "Menemani anggota keluarga berjalan ringan, menyiapkan makan, dan membantu kegiatan harian tanpa tindakan medis.", syarat: ["Pernah mendampingi lansia", "Sabar dan bisa berkomunikasi dengan keluarga"],
    cekUpah: "wajar", dipasang: "3 hari lalu",
  },
  {
    id: "magang-uiux-serayu", segmen: "magang", kota: "Banyumas", pemberiId: "e-serayu", kategori: "desain",
    judul: "Magang desain UI/UX", upah: 1800000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.8, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membuat alur layar dan purwarupa aplikasi untuk klien studio desain. Ada bimbingan desainer setiap minggu. Uang saku Rp1.800.000 per bulan.", syarat: ["Mahasiswa desain atau informatika", "Bisa memakai Figma", "Punya contoh tugas desain"],
    cekUpah: "rendah", cocok: { uiux: 95, frontend: 55 }, dipasang: "1 jam lalu",
  },
  {
    id: "magang-riset-pengguna", segmen: "magang", kota: "Banyumas", pemberiId: "e-serayu", kategori: "desain",
    judul: "Magang riset pengguna", upah: 1500000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.8, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membantu wawancara pengguna, merangkum temuan, dan menguji purwarupa bersama pembimbing. Uang saku Rp1.500.000 per bulan.", syarat: ["Mahasiswa aktif", "Pernah melakukan wawancara untuk tugas kuliah", "Bisa mencatat hasil diskusi"],
    cekUpah: "rendah", cocok: { uiux: 92, frontend: 35 }, dipasang: "Kemarin",
  },
  {
    id: "magang-desain-konten", segmen: "magang", kota: "Banyumas", pemberiId: "e-serayu", kategori: "desain",
    judul: "Magang desain konten", upah: 1300000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.8, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membuat poster dan gambar media sosial dari arahan desainer. Hasil ditinjau sebelum dikirim ke klien. Uang saku Rp1.300.000 per bulan.", syarat: ["Mahasiswa desain atau komunikasi", "Bisa memakai Figma atau aplikasi desain", "Sertakan dua contoh poster"],
    cekUpah: "rendah", cocok: { uiux: 82, frontend: 25 }, dipasang: "3 hari lalu",
  },
  {
    id: "magang-sistem-desain", segmen: "magang", kota: "Banyumas", pemberiId: "e-serayu", kategori: "desain",
    judul: "Magang komponen antarmuka", upah: 1700000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.8, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Merapikan komponen tombol, formulir, dan panduan warna di Figma bersama desainer studio. Uang saku Rp1.700.000 per bulan.", syarat: ["Mahasiswa aktif", "Paham komponen dan tata letak otomatis di Figma", "Punya tugas desain aplikasi"],
    cekUpah: "rendah", cocok: { uiux: 94, frontend: 68 }, dipasang: "1 jam lalu",
  },
  {
    id: "magang-frontend-kalibener", segmen: "magang", kota: "Banyumas", pemberiId: "e-kalibener", kategori: "teknologi",
    judul: "Magang pengembangan frontend", upah: 2000000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.7, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membuat halaman situs dari desain dan memperbaiki tampilan di ponsel. Kode diperiksa pembimbing di rumah pengembangan perangkat lunak. Uang saku Rp2.000.000 per bulan.", syarat: ["Mahasiswa informatika atau bidang terkait", "Paham HTML, CSS, dan JavaScript", "Sertakan tautan proyek kampus"],
    cekUpah: "rendah", cocok: { uiux: 58, frontend: 95 }, dipasang: "Kemarin",
  },
  {
    id: "magang-web-reaktif", segmen: "magang", kota: "Banyumas", pemberiId: "e-kalibener", kategori: "teknologi",
    judul: "Magang aplikasi web React", upah: 1900000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.7, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membantu membuat komponen React dan menghubungkannya ke data contoh di bawah bimbingan pengembang. Uang saku Rp1.900.000 per bulan.", syarat: ["Mahasiswa aktif", "Pernah memakai React dalam tugas kuliah", "Bisa memakai Git dasar"],
    cekUpah: "rendah", cocok: { uiux: 45, frontend: 93 }, dipasang: "3 hari lalu",
  },
  {
    id: "magang-uji-web", segmen: "magang", kota: "Banyumas", pemberiId: "e-kalibener", kategori: "teknologi",
    judul: "Magang pengujian situs", upah: 1500000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.7, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Menguji formulir dan tampilan situs pada beberapa ukuran layar, lalu mencatat langkah untuk mengulang masalah. Uang saku Rp1.500.000 per bulan.", syarat: ["Mahasiswa informatika", "Teliti mencatat hasil pengujian", "Paham HTML dan CSS dasar"],
    cekUpah: "rendah", cocok: { uiux: 70, frontend: 85 }, dipasang: "1 jam lalu",
  },
  {
    id: "magang-web-aksesibel", segmen: "magang", kota: "Banyumas", pemberiId: "e-kalibener", kategori: "teknologi",
    judul: "Magang perbaikan tampilan web", upah: 1800000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.7, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Membantu memperbaiki label formulir, navigasi papan ketik, dan tampilan seluler bersama pengembang. Uang saku Rp1.800.000 per bulan.", syarat: ["Mahasiswa aktif", "Paham HTML semantik dan CSS", "Punya proyek situs sederhana"],
    cekUpah: "rendah", cocok: { uiux: 76, frontend: 91 }, dipasang: "Kemarin",
  },
  {
    id: "magang-admin-studio", segmen: "magang", kota: "Banyumas", pemberiId: "e-serayu", kategori: "kantor",
    judul: "Magang administrasi studio", upah: 1000000, jenisUpah: "bulanan", area: "Purwokerto Utara", jarakKm: 1.8, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Merapikan arsip proyek dan mencatat jadwal revisi desain. Pendamping membantu pemeriksaan dokumen. Uang saku Rp1.000.000 per bulan.", syarat: ["Mahasiswa administrasi atau komunikasi", "Bisa memakai lembar kerja", "Teliti menamai dan menyimpan berkas"],
    cekUpah: "rendah", cocok: { uiux: 55, frontend: 20 }, dipasang: "3 hari lalu",
  },
  {
    id: "magang-dokumentasi-proyek", segmen: "magang", kota: "Banyumas", pemberiId: "e-kalibener", kategori: "kantor",
    judul: "Magang dokumentasi proyek", upah: 1200000, jenisUpah: "bulanan", area: "Purwokerto Timur", jarakKm: 2.7, jadwal: "Senin–Jumat, 08.00–16.00 · 3 bulan",
    deskripsi: "Mencatat hasil rapat dan menyusun petunjuk penggunaan aplikasi bersama tim pengembang. Uang saku Rp1.200.000 per bulan.", syarat: ["Mahasiswa aktif", "Bisa menulis petunjuk singkat", "Terbiasa memakai dokumen bersama"],
    cekUpah: "rendah", cocok: { uiux: 50, frontend: 65 }, dipasang: "1 jam lalu",
  },
  {
    id: "pasang-kanopi-purbalingga", segmen: "informal", kota: "Purbalingga", pemberiId: "e-jaya", kategori: "las",
    judul: "Pasang kanopi di Purbalingga", upah: 170000, jenisUpah: "harian", area: "Kalimanah", jarakKm: 19.4, jadwal: "Senin–Kamis, 08.00–16.00",
    deskripsi: "Memasang kanopi pesanan pelanggan di Kalimanah. Berangkat dari bengkel Sokaraja dengan kendaraan tim.", syarat: ["Pengalaman memasang kanopi", "Bisa bekerja di ketinggian dengan pengaman"],
    cekUpah: "wajar", cocok: { las: 92, ojek: 15 }, dipasang: "Kemarin",
  },
  {
    id: "tenda-padamara", segmen: "informal", kota: "Purbalingga", pemberiId: "e-yoga", kategori: "acara",
    judul: "Pasang tenda acara di Padamara", upah: 150000, jenisUpah: "harian", area: "Padamara", jarakKm: 18.6, jadwal: "Jumat–Sabtu, 08.00–16.00",
    deskripsi: "Tim tenda dari Kembaran mendapat pesanan di Padamara. Kendaraan dan makan siang disediakan.", syarat: ["Terbiasa memasang tenda", "Bisa bekerja bersama tim"],
    cekUpah: "wajar", cocok: { las: 68, ojek: 40 }, dipasang: "3 hari lalu",
  },
  {
    id: "bongkar-material-sampang", segmen: "informal", kota: "Cilacap", pemberiId: "e-slamet", kategori: "angkut",
    judul: "Bongkar material di Sampang", upah: 140000, jenisUpah: "harian", area: "Sampang", jarakKm: 24.5, jadwal: "Senin–Rabu, 07.00–15.00",
    deskripsi: "Mengikuti pikap toko dari Sokaraja dan membantu bongkar material di proyek pelanggan di Sampang.", syarat: ["Terbiasa bongkar muat", "Bisa mengikuti arahan sopir"],
    cekUpah: "wajar", cocok: { las: 48, ojek: 60 }, dipasang: "20 menit lalu",
  },
  {
    id: "katering-kroya", segmen: "informal", kota: "Cilacap", pemberiId: "e-wati", kategori: "dapur",
    judul: "Bantu sajikan katering di Kroya", upah: 130000, jenisUpah: "harian", area: "Kroya", jarakKm: 25, jadwal: "Minggu, 06.00–14.00",
    deskripsi: "Membantu tim warung menata hidangan katering di Kroya. Berangkat bersama dari Purwokerto Utara.", syarat: ["Terbiasa menyajikan makanan", "Bisa berangkat pagi bersama tim"],
    cekUpah: "wajar", cocok: { las: 30, ojek: 35 }, dipasang: "2 jam lalu",
  },
];

export const LOWONGAN: Lowongan[] = daftarLowongan.map((lowongan) => {
  const pemberi = cariPemberi(lowongan.pemberiId);
  if (!pemberi) throw new Error(`Pemberi kerja tidak ditemukan: ${lowongan.pemberiId}`);
  return { ...lowongan, usaha: pemberi.nama, pemilik: pemberi.pemilik, verifikasi: pemberi.verifikasi, wa: pemberi.wa };
});

export const PEKERJA = {
  nama: "Pak Darto",
  kota: "Purwokerto, Banyumas",
  umur: 38,
  persona: {
    las: { judul: "Tukang Las", ringkas: "Las pagar, teralis, dan kanopi. 5 tahun di bengkel Sokaraja.", keahlian: ["Las listrik", "Pagar dan teralis", "Kanopi", "Baca ukuran"], waktu: "Senin–Sabtu, 08.00–16.00", pengalaman: [{ peran: "Tukang las", tempat: "Bengkel las di Sokaraja", lama: "5 tahun", sumber: "suara" as const }, { peran: "Kenek las", tempat: "Proyek ruko Purwokerto", lama: "1 tahun", sumber: "formulir" as const }] },
    ojek: { judul: "Driver Ojol", ringkas: "Antar penumpang dan makanan di Purwokerto, malam hari.", keahlian: ["Motor sendiri", "SIM C", "Hafal Purwokerto"], waktu: "Setiap hari, 18.00–22.00", pengalaman: [{ peran: "Driver ojek online", tempat: "Purwokerto dan sekitarnya", lama: "3 tahun", sumber: "suara" as const }] },
  },
} as const;

export const RAKA = {
  nama: "Raka Aditya",
  kota: "Purwokerto, Banyumas",
  umur: 20,
  persona: {
    uiux: {
      judul: "Desainer UI/UX",
      ringkas: "Mahasiswa informatika semester 5. Membuat purwarupa aplikasi kampus dan pernah menjadi finalis lomba UI/UX.",
      keahlian: ["Figma", "Alur pengguna", "Purwarupa interaktif", "Wawancara pengguna", "Uji kegunaan"],
      waktu: "Senin–Jumat, 08.00–16.00 · masa magang semester depan",
      pengalaman: [
        { peran: "Desainer UI/UX tim lomba", tempat: "Lomba desain aplikasi mahasiswa", lama: "2 bulan", sumber: "suara" as const },
        { peran: "Desainer aplikasi peminjaman ruang", tempat: "Proyek mata kuliah interaksi manusia dan komputer", lama: "1 semester", sumber: "formulir" as const },
        { peran: "Staf desain dan publikasi", tempat: "Himpunan mahasiswa informatika", lama: "1 tahun", sumber: "formulir" as const },
      ],
    },
    frontend: {
      judul: "Frontend Developer",
      ringkas: "Membuat situs kegiatan mahasiswa dengan React. Terbiasa menerapkan desain Figma dan bekerja bersama tim lewat Git.",
      keahlian: ["HTML", "CSS", "JavaScript", "React", "Git", "Tampilan responsif"],
      waktu: "Senin–Jumat, 08.00–16.00 · masa magang semester depan",
      pengalaman: [
        { peran: "Pengembang frontend", tempat: "Proyek situs pendaftaran kegiatan kampus", lama: "1 semester", sumber: "suara" as const },
        { peran: "Pengelola situs kegiatan", tempat: "Himpunan mahasiswa informatika", lama: "6 bulan", sumber: "formulir" as const },
      ],
    },
  },
} as const;

export type Fakta = {
  id: string;
  pemilik: "darto" | "raka";
  jenis: "pengalaman" | "keahlian" | "pendidikan" | "prestasi" | "lainnya";
  teks: string;
  status: "terkonfirmasi" | "usulan";
  sumber: "obrolan" | "suara" | "formulir";
  persona: string[];
};

export const FAKTA: Fakta[] = [
  { id: "darto-las-bengkel", pemilik: "darto", jenis: "pengalaman", teks: "Bekerja sebagai tukang las di bengkel Sokaraja selama 5 tahun.", status: "terkonfirmasi", sumber: "suara", persona: ["las"] },
  { id: "darto-kenek-ruko", pemilik: "darto", jenis: "pengalaman", teks: "Pernah menjadi kenek las pada proyek ruko di Purwokerto selama 1 tahun.", status: "terkonfirmasi", sumber: "formulir", persona: ["las"] },
  { id: "darto-las-listrik", pemilik: "darto", jenis: "keahlian", teks: "Bisa las listrik untuk pagar, teralis, dan kanopi serta membaca ukuran.", status: "terkonfirmasi", sumber: "suara", persona: ["las"] },
  { id: "darto-ojek-pengalaman", pemilik: "darto", jenis: "pengalaman", teks: "Mengantar penumpang dan makanan sebagai pengemudi ojek online selama 3 tahun di Purwokerto.", status: "terkonfirmasi", sumber: "suara", persona: ["ojek"] },
  { id: "darto-motor-sim", pemilik: "darto", jenis: "keahlian", teks: "Punya motor sendiri, SIM C, dan hafal jalan Purwokerto.", status: "terkonfirmasi", sumber: "formulir", persona: ["ojek"] },
  { id: "darto-jadwal", pemilik: "darto", jenis: "lainnya", teks: "Bisa kerja las Senin–Sabtu pukul 08.00–16.00 dan mengantar pesanan setiap hari pukul 18.00–22.00.", status: "terkonfirmasi", sumber: "obrolan", persona: ["las", "ojek"] },
  { id: "darto-usulan-alat-las", pemilik: "darto", jenis: "keahlian", teks: "Mungkin punya alat las sendiri untuk pekerjaan borongan; perlu ditanyakan ke Pak Darto.", status: "usulan", sumber: "obrolan", persona: ["las"] },
  { id: "darto-usulan-rute", pemilik: "darto", jenis: "keahlian", teks: "Mungkin mengenal rute pengantaran Ajibarang; perlu dikonfirmasi ke Pak Darto.", status: "usulan", sumber: "obrolan", persona: ["ojek"] },
  { id: "raka-pendidikan", pemilik: "raka", jenis: "pendidikan", teks: "Mahasiswa informatika semester 5, berusia 20 tahun, dan tinggal di Purwokerto.", status: "terkonfirmasi", sumber: "formulir", persona: ["uiux", "frontend"] },
  { id: "raka-lomba-uiux", pemilik: "raka", jenis: "prestasi", teks: "Menjadi finalis lomba UI/UX mahasiswa bersama tim setelah mengerjakan desain selama 2 bulan.", status: "terkonfirmasi", sumber: "suara", persona: ["uiux"] },
  { id: "raka-proyek-ruang", pemilik: "raka", jenis: "pengalaman", teks: "Mendesain aplikasi peminjaman ruang selama satu semester untuk tugas interaksi manusia dan komputer.", status: "terkonfirmasi", sumber: "formulir", persona: ["uiux"] },
  { id: "raka-riset-figma", pemilik: "raka", jenis: "keahlian", teks: "Bisa membuat alur dan purwarupa interaktif di Figma serta melakukan wawancara dan uji kegunaan.", status: "terkonfirmasi", sumber: "suara", persona: ["uiux"] },
  { id: "raka-proyek-web", pemilik: "raka", jenis: "pengalaman", teks: "Membuat frontend situs pendaftaran kegiatan kampus dengan React selama satu semester.", status: "terkonfirmasi", sumber: "suara", persona: ["frontend"] },
  { id: "raka-keahlian-web", pemilik: "raka", jenis: "keahlian", teks: "Bisa memakai HTML, CSS, JavaScript, React, dan Git untuk membuat tampilan web responsif.", status: "terkonfirmasi", sumber: "formulir", persona: ["frontend"] },
  { id: "raka-organisasi", pemilik: "raka", jenis: "pengalaman", teks: "Menjadi staf desain dan publikasi himpunan selama 1 tahun serta mengelola situs kegiatan selama 6 bulan.", status: "terkonfirmasi", sumber: "formulir", persona: ["uiux", "frontend"] },
  { id: "raka-jadwal", pemilik: "raka", jenis: "lainnya", teks: "Bisa magang Senin–Jumat pukul 08.00–16.00 pada masa magang semester depan.", status: "terkonfirmasi", sumber: "obrolan", persona: ["uiux", "frontend"] },
  { id: "raka-usulan-sistem-desain", pemilik: "raka", jenis: "keahlian", teks: "Mungkin pernah menyusun pustaka komponen Figma; perlu contoh proyek dari Raka.", status: "usulan", sumber: "obrolan", persona: ["uiux"] },
  { id: "raka-usulan-typescript", pemilik: "raka", jenis: "keahlian", teks: "Mungkin sudah memakai TypeScript dalam proyek kampus; perlu dikonfirmasi ke Raka.", status: "usulan", sumber: "obrolan", persona: ["frontend"] },
];

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
export const LOWONGAN_INFORMAL = LOWONGAN.filter((l) => l.segmen === "informal");
export const LOWONGAN_MAGANG = LOWONGAN.filter((l) => l.segmen === "magang");
