import { IconDownload, IconShare } from "@/components/icons/tabler";
import { KartuKerja } from "@/components/ui/KartuKerja";
import { PEKERJA } from "@/lib/data";

export const metadata = { title: "Kartu Kerja" };

export default function Kartu() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-[1.75rem] leading-tight">Kartu Kerja <span className="text-jingga">untuk status WhatsApp.</span></h1>
        <p className="mt-1 max-w-md text-sm text-abu">Pasang di status WhatsApp atau tempel di warung. Orang yang memindai QR-nya melihat CV-mu tanpa nomor HP.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="tombol tombol-utama"><IconDownload size={18} />Simpan gambar</button>
          <button type="button" className="tombol tombol-garis"><IconShare size={18} />Bagikan ke WhatsApp</button>
        </div>
        <p className="mt-3 text-xs text-abu">Contoh tampilan. Menyimpan dan membagikan kartu belum aktif.</p>
      </div>
      <KartuKerja nama={PEKERJA.nama} personas={[PEKERJA.persona.las.judul, PEKERJA.persona.ojek.judul]} kota={PEKERJA.kota} />
    </div>
  );
}
