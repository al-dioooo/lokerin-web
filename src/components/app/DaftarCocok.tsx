"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { KATEGORI, KATEGORI_MAGANG, type KategoriSlug } from "@/components/icons/categories";
import { LOWONGAN_TAYANG, PEKERJA, type JenisUpah, type Kota, type Lowongan, type PersonaId, type Segmen } from "@/lib/data";
import { api, apiAktif } from "@/lib/api/klien";
import { useApi } from "@/lib/api/hooks";
import { keLowongan } from "@/lib/api/adaptor";
import { useSesi } from "@/lib/api/sesi";
import type { LowonganApi, ProfilApi } from "@/lib/api/tipe";
import { BarisLowongan } from "./KartuLowonganApp";
import { TabPil } from "./TabPil";

const JENIS: { id: JenisUpah | "semua"; label: string }[] = [
  { id: "semua", label: "Semua upah" },
  { id: "harian", label: "Harian" },
  { id: "mingguan", label: "Mingguan" },
  { id: "bulanan", label: "Bulanan" },
  { id: "borongan", label: "Borongan" },
];

function PilihJenis({ jenis, onUbah }: { jenis: JenisUpah | "semua"; onUbah: (j: JenisUpah | "semua") => void }) {
  return (
    <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Jenis upah">
      {JENIS.map((j) => <button key={j.id} type="button" className="chip-peta shrink-0" aria-pressed={jenis === j.id} onClick={() => onUbah(j.id)}>{j.label}</button>)}
    </div>
  );
}

export function DaftarCocok({ awal = LOWONGAN_TAYANG }: { awal?: Lowongan[] }) {
  const { pengguna } = useSesi();
  return apiAktif && pengguna?.peran === "pencari" ? <CocokDariServer /> : <CocokContoh awal={awal} />;
}

/** Signed-in worker: each Persona is searched on the server with its Preferensi Wajib. */
function CocokDariServer() {
  const profil = useApi<ProfilApi>("/profil");
  const personas = profil.data?.persona ?? [];
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [jenis, setJenis] = useState<JenisUpah | "semua">("semua");
  const personaId = pilihan ?? personas[0]?.id ?? null;
  return (
    <section aria-labelledby="judul-cocok">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="judul-cocok" className="text-lg">Cocok untuk CV {personas.find((p) => p.id === personaId)?.judul ?? "kamu"}</h2>
          <p className="text-sm text-abu">Sesuai lokasi dan upah yang kamu mau, lalu diurutkan dari yang paling cocok.</p>
        </div>
        {personas.length > 1 && personaId && (
          <TabPil label="Pilih CV" nilai={personaId} onUbah={setPilihan} pilihan={personas.map((p) => ({ id: p.id, label: p.judul }))} />
        )}
      </div>
      <PilihJenis jenis={jenis} onUbah={setJenis} />
      {personaId ? <HasilCari key={`${personaId}-${jenis}`} personaId={personaId} jenis={jenis} /> : !profil.memuat && <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada CV. Ceritakan pengalamanmu di Ngobrol supaya lowongan bisa dicocokkan.</p>}
    </section>
  );
}

function HasilCari({ personaId, jenis }: { personaId: string; jenis: JenisUpah | "semua" }) {
  const [hasil, setHasil] = useState<{ hasil: LowonganApi[]; di_luar_preferensi: LowonganApi[] } | null>(null);
  useEffect(() => {
    const kendali = new AbortController();
    api<{ hasil: LowonganApi[]; di_luar_preferensi: LowonganApi[] }>("/lowongan/cari", {
      method: "POST",
      body: { persona_id: personaId, batas: 20, ...(jenis !== "semua" ? { jenis_upah: jenis } : {}) },
      signal: kendali.signal,
    })
      .then(setHasil)
      .catch(() => !kendali.signal.aborted && setHasil({ hasil: [], di_luar_preferensi: [] }));
    return () => kendali.abort();
  }, [personaId, jenis]);
  if (!hasil) return <p className="py-6 text-center text-sm text-abu">Mencari yang cocok...</p>;
  if (!hasil.hasil.length) return <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada lowongan yang cocok dengan pilihan ini.</p>;
  return (
    <>
      <ul className="urut grid gap-2">
        {hasil.hasil.map((api, i) => (
          <li key={api.id} style={{ "--i": i } as CSSProperties}>
            <BarisLowongan lowongan={keLowongan(api)} skor={api.kemiripan ?? undefined} />
            {api.kenapa_cocok?.length ? <p className="mt-1 px-2 text-xs text-abu">{api.kenapa_cocok.slice(0, 2).join(" · ")}</p> : null}
          </li>
        ))}
      </ul>
      {hasil.di_luar_preferensi.length > 0 && (
        <details className="mt-4 rounded-2xl border border-garis bg-white p-4">
          <summary className="cursor-pointer text-[15px] font-bold">Di luar pilihanmu ({hasil.di_luar_preferensi.length})</summary>
          <ul className="mt-3 grid gap-2">
            {hasil.di_luar_preferensi.map((api) => (
              <li key={api.id}><BarisLowongan lowongan={keLowongan(api)} />{api.alasan_di_luar && <p className="mt-1 px-2 text-xs text-abu">{api.alasan_di_luar}</p>}</li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

const KOTA: (Kota | "semua")[] = ["semua", "Banyumas", "Purbalingga", "Cilacap"];

function CocokContoh({ awal }: { awal: Lowongan[] }) {
  const [persona, setPersona] = useState<PersonaId>("las");
  const [segmen, setSegmen] = useState<Segmen>("informal");
  const [kota, setKota] = useState<Kota | "semua">("semua");
  const [kategori, setKategori] = useState<KategoriSlug | "semua">("semua");
  const [jenis, setJenis] = useState<JenisUpah | "semua">("semua");
  const daftarKategori = segmen === "magang" ? KATEGORI_MAGANG : KATEGORI.filter((k) => k.slug !== "magang");
  const daftar = awal
    .filter((l) => (l.segmen ?? "informal") === segmen)
    .filter((l) => kota === "semua" || (l.kota ?? "Banyumas") === kota)
    .filter((l) => kategori === "semua" || l.kategori === kategori)
    .filter((l) => jenis === "semua" || l.jenisUpah === jenis)
    .toSorted((a, b) => (b.cocok?.[persona] ?? 0) - (a.cocok?.[persona] ?? 0));
  return (
    <section aria-labelledby="judul-cocok">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="judul-cocok" className="text-lg">{segmen === "magang" ? "Lowongan magang" : `Cocok untuk CV ${PEKERJA.persona[persona].judul}`}</h2>
          <p className="text-sm text-abu">{segmen === "magang" ? "Magang dengan uang saku di Banyumas." : "Diurutkan dari yang paling cocok dengan pengalamanmu."}</p>
        </div>
        {segmen === "informal" && <TabPil label="Pilih CV" nilai={persona} onUbah={setPersona} pilihan={(Object.keys(PEKERJA.persona) as PersonaId[]).map((p) => ({ id: p, label: PEKERJA.persona[p].judul }))} />}
      </div>
      <div className="saringan mb-3">
        <TabPil label="Jenis lowongan" className="w-fit" nilai={segmen} onUbah={(x) => { setSegmen(x); setKategori("semua"); }} pilihan={[{ id: "informal", label: "Kerja" }, { id: "magang", label: "Magang" }]} />
        <div className="saringan-baris" role="group" aria-label="Kota">
          {KOTA.map((k) => <button key={k} type="button" className="chip-peta shrink-0" aria-pressed={kota === k} onClick={() => setKota(k)}>{k === "semua" ? "Semua kota" : k}</button>)}
        </div>
        <div className="saringan-baris" role="group" aria-label="Kategori">
          <button type="button" className="chip-peta shrink-0" aria-pressed={kategori === "semua"} onClick={() => setKategori("semua")}>Semua kategori</button>
          {daftarKategori.map(({ slug, label, Icon }) => <button key={slug} type="button" className="chip-peta chip-ikon shrink-0" aria-pressed={kategori === slug} onClick={() => setKategori(slug)}><Icon size={18} />{label}</button>)}
        </div>
      </div>
      <PilihJenis jenis={jenis} onUbah={setJenis} />
      <p className="mb-2 text-xs text-abu">{daftar.length} lowongan</p>
      {daftar.length ? <ul key={`${persona}-${segmen}-${kota}-${kategori}-${jenis}`} className="urut grid gap-2">{daftar.map((l, i) => <li key={l.id} style={{ "--i": Math.min(i, 12) } as CSSProperties}><BarisLowongan lowongan={l} persona={segmen === "informal" ? persona : undefined} /></li>)}</ul> : <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Belum ada lowongan yang cocok dengan saringan ini.</p>}
    </section>
  );
}
