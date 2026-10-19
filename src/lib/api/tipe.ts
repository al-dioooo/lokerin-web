// Response shapes from lokerin-backend (src/domain/serialize.ts there). Names follow GLOSSARY.md.

export type Peran = "pencari" | "pemberi";

export type PemberiKerjaApi = {
  id: string;
  nama_usaha: string;
  jenis: "umkm" | "perusahaan" | "rumah_tangga";
  kota: string;
  kecamatan: string | null;
  terverifikasi: boolean;
  status_verifikasi: "belum" | "menunggu" | "terverifikasi";
  yang_dicek: string[];
  diverifikasi_pada: string | null;
};

export type MasalahPemeriksaan = { kode: string; tingkat: "tahan" | "peringatan"; pesan: string; field?: string };
export type HasilPemeriksaan = { boleh_terbit: boolean; masalah: MasalahPemeriksaan[]; diperiksa_pada: string };

export type LowonganApi = {
  id: string;
  judul: string;
  kategori: string;
  segmen: "informal" | "magang";
  deskripsi: string;
  syarat: string[];
  upah: { label: string; jenis: "harian" | "mingguan" | "bulanan" | "borongan" | "per_jam" | null; min: number | null; max: number | null; perkiraan_bulanan: number | null };
  jam_kerja: string | null;
  jam_per_hari: number | null;
  hari_per_minggu: number | null;
  jenis_kerja: string | null;
  mulai: string | null;
  lokasi: { kota: string | null; kecamatan: string | null; alamat: string | null; lat: number | null; lng: number | null };
  butuh_hari_ini: string | null;
  bahasa: "id" | "en";
  status: "draf" | "terbit" | "terisi" | "disembunyikan";
  pemeriksaan: HasilPemeriksaan | null;
  diterbitkan_pada: string | null;
  pemberi_kerja: PemberiKerjaApi;
  kemiripan?: number | null;
  kenapa_cocok?: string[];
  jarak_km?: number;
  jumlah_lamaran?: number;
  alasan_di_luar?: string;
};

export type FaktaApi = {
  id: string;
  jenis: "pengalaman" | "keahlian" | "pendidikan" | "prestasi" | "lainnya";
  judul: string;
  detail: string | null;
  tempat: string | null;
  periode: string | null;
  status: "usulan" | "terkonfirmasi" | "ditolak";
  sumber: string;
};

export type Preferensi = {
  kota: string[];
  upah_min?: number;
  upah_satuan?: "harian" | "bulanan";
  mulai?: string;
  jenis_kerja?: string[];
  mau_pindah?: boolean;
};

export type PersonaApi = {
  id: string;
  judul: string;
  ringkasan: string;
  keahlian: string[];
  fakta_ids: string[];
  preferensi: Preferensi;
};

export type ProfilApi = {
  pencari: { id: string; nama: string; kota: string; kecamatan: string | null; pendidikan: string | null; tahun_lahir: number | null };
  fakta: FaktaApi[];
  persona: PersonaApi[];
};

/** Public summary of one Persona, without contact details (GET /kartu-kerja/:id). */
export type KartuKerjaApi = { id: string; nama: string; kota: string; judul: string; ringkasan: string; keahlian: string[]; tautan: string };

export type TahapApi = { id: string; jenis: "whatsapp" | "meet" | "alamat" | "lainnya"; detail: string; jadwal: string | null; catatan: string | null };

export type StatusLamaran = "terkirim" | "dilihat" | "lolos" | "tidak_lolos";

export type LamaranApi = {
  id: string;
  status: StatusLamaran;
  pesan: string | null;
  dikirim_pada: string;
  dilihat_pada: string | null;
  diputuskan_pada: string | null;
  cv_khusus_id: string | null;
  pencari: { id: string; nama: string; kota: string; telepon: string | null; email: string | null; kontak_disembunyikan: boolean };
  persona: PersonaApi;
  lowongan: { id: string; judul: string; kota: string | null };
  pemberi_kerja: PemberiKerjaApi;
  tahap_berikutnya: TahapApi[];
};

/** CV Khusus versi 2 (ADR 0009): bagian berisi Entri dengan judul, tempat, periode, dan poin. */
export type PoinCv = { id: string; text: string; fakta_ids: string[]; diedit_pengguna?: boolean };
export type EntriCv = {
  id: string;
  judul: string;
  tempat?: string;
  keterangan?: string;
  periode?: string;
  lokasi?: string;
  poin: PoinCv[];
  fakta_ids: string[];
  diedit_pengguna?: boolean;
};
export type JenisBagianCv = "pengalaman" | "pendidikan" | "proyek" | "prestasi" | "lainnya";
export type BagianCv = { id: string; judul: string; jenis: JenisBagianCv; entri: EntriCv[] };
export type KelompokKeahlian = { id: string; label: string; isi: string[] };
export type IsiCv = {
  versi: 2;
  nama: string;
  judul: string;
  kontak: { telepon?: string; email?: string; kota?: string; tautan?: string[] };
  ringkasan: string;
  keahlian: KelompokKeahlian[];
  bagian: BagianCv[];
};

export type CvApi = {
  id: string;
  template: "satu_kolom" | "dua_kolom";
  bahasa: "id" | "en";
  isi: IsiCv;
  isi_awal?: IsiCv;
  kontak_disembunyikan: boolean;
  peringatan: string | null;
};

export type Pengguna = { id: string; peran: Peran; nama: string; kota: string };

export type MeApi = Pengguna & { kecamatan: string | null; pemberi_kerja: PemberiKerjaApi | null };

export type AkunDemo = { key: string; peran: Peran; nama: string; kota: string; pemberi_kerja: PemberiKerjaApi | null };

export type JenisKabar = "lamaran_masuk" | "lamaran_dilihat" | "lamaran_lolos" | "tahap_baru" | "lamaran_tidak_lolos" | "butuh_hari_ini";
export type KabarApi = { id: string; jenis: JenisKabar; judul: string; isi: string; tautan: string; dibaca: boolean; dibuat_pada: string };
export type DaftarKabarApi = { kabar: KabarApi[]; belum_dibaca: number };

/** What tanya_pengguna asks: one question with big answer buttons (ADR 0008). */
export type PertanyaanAgen = {
  widget: "pertanyaan";
  id: string;
  pertanyaan: string;
  pilihan: { label: string; keterangan?: string }[];
  boleh_banyak: boolean;
  boleh_ketik: boolean;
};
