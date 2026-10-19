import { IconPlus } from "../icons/tabler";
import { Muncul } from "../gerak/Muncul";

const TANYA = [
  ["Apakah Lokerin berbayar?", "Tidak. Pekerja dan pemilik usaha memakai Lokerin tanpa biaya. Lowongan yang meminta uang dari pelamar ditahan dan tidak tayang."],
  ["Saya belum pernah bikin CV. Bisa?", "Bisa. Ceritakan pengalamanmu seperti mengobrol biasa. Lokerin menyusun profil dan CV dari hal-hal yang sudah kamu setujui, dan kamu tetap bisa mengubahnya."],
  ["Bagaimana pemilik usaha dicek?", "Pemilik usaha mengunggah KTP dan NPWP atau foto usahanya. Lencana Terverifikasi menyebut apa yang dicek dan kapan. Selama masa lomba, dokumen yang dipakai masih contoh."],
  ["Apakah suara saya direkam?", "Audio tidak disimpan. Yang tersimpan hanya teks obrolan dan hasilnya, dan kamu bisa menghapusnya kapan saja."],
  ["Wawancaranya lewat Lokerin?", "Lamaran dikirim dan diproses di Lokerin. Setelah lolos, pemilik usaha menulis tahap berikutnya, misalnya nomor WhatsApp, tautan Google Meet, atau alamat."],
  ["Lowongannya ada di mana saja?", "Untuk sekarang di Banyumas, ditambah beberapa di Purbalingga dan Cilacap."],
] as const;

export function TanyaJawab() {
  return (
    <section id="tanya" className="shell py-20 sm:py-28" aria-labelledby="judul-tanya">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <Muncul className="max-w-md"><p className="pil-piksel mb-4">Tanya jawab</p><h2 id="judul-tanya" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">Yang sering <span className="text-jingga">ditanyakan.</span></h2><p className="mt-4 text-base text-abu">Belum ketemu jawabannya? Tanyakan saja waktu ngobrol dengan Lokerin.</p></Muncul>
        <Muncul jeda={0.1}>
          <div className="tanya-daftar">
            {TANYA.map(([tanya, jawab]) => (
              <details key={tanya} className="tanya-item">
                <summary><span>{tanya}</span><IconPlus size={20} className="tanya-tanda" /></summary>
                <p>{jawab}</p>
              </details>
            ))}
          </div>
        </Muncul>
      </div>
    </section>
  );
}
