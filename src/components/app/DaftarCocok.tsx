"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { KATEGORI, KATEGORI_MAGANG, type KategoriSlug } from "@/components/icons/categories";
import { LOWONGAN_TAYANG, PEKERJA, type JenisUpah, type Kota, type Lowongan, type PersonaId, type Segmen } from "@/lib/data";
import { api, apiAktif } from "@/lib/api/klien";
import { useApi, useLangsung } from "@/lib/api/hooks";
import { keLowongan } from "@/lib/api/adaptor";
import { useDaftarLangsung } from "@/lib/api/langsung";
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
    <div className="saringan-baris gulir-tepi mb-3" role="group" aria-label="Jenis upah">
      {JENIS.map((j) => <button key={j.id} type="button" className="chip-peta shrink-0" aria-pressed={jenis === j.id} onClick={() => onUbah(j.id)}>{j.label}</button>)}
    </div>
  );
}

export function DaftarCocok({ awal = LOWONGAN_TAYANG }: { awal?: Lowongan[] }) {
  const { pengguna, siap } = useSesi();
  // Until the session is read, show a placeholder rather than the sample worker's matches.
  if (apiAktif && !siap) return <KerangkaDaftar />;
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
      <div className="mb-3">
        <h2 id="judul-cocok" className="text-lg">Cocok untukmu</h2>
        <p className="text-sm text-abu">
          Sesuai lokasi dan upah yang kamu mau{personas.length === 1 ? `, untuk kerja sebagai ${personas[0]!.judul}` : ""}. Yang paling cocok di atas.
        </p>
      </div>
      {personas.length > 1 && personaId && (
        <>
          <p className="mb-1.5 text-[13px] font-semibold text-abu" aria-hidden="true">Cari lowongan sebagai</p>
          <TabPil className="mb-2" label="Cari lowongan sebagai" nilai={personaId} onUbah={setPilihan} pilihan={personas.map((p) => ({ id: p.id, label: p.judul }))} />
        </>
      )}
      <PilihJenis jenis={jenis} onUbah={setJenis} />
      {personaId ? <HasilCari key={`${personaId}-${jenis}`} personaId={personaId} jenis={jenis} /> : !profil.memuat && <p className="rounded-2xl border border-dashed border-garis p-6 text-center text-sm text-abu">Lokerin belum tahu kamu bisa kerja apa. Ceritakan pengalamanmu di Ngobrol supaya lowongan bisa dicocokkan.</p>}
    </section>
  );
}

type HasilCariApi = { hasil: LowonganApi[]; di_luar_preferensi: LowonganApi[] };

/** The best few first; the rest is one tap away, so the home screen does not become an endless list. */
const BATAS_AWAL = 6;

function KerangkaDaftar() {
  return (
    <ul className="grid gap-2" role="status" aria-label="Mencari yang cocok">
      {[0, 1, 2].map((i) => <li key={i} className="h-[92px] animate-pulse rounded-2xl bg-kabut" />)}
    </ul>
  );
}

function HasilCari({ personaId, jenis }: { personaId: string; jenis: JenisUpah | "semua" }) {
  const [hasil, setHasil] = useState<HasilCariApi | null>(null);
  const [putaran, setPutaran] = useState(0);
  const [baru, setBaru] = useState<ReadonlySet<string>>(() => new Set());
  const [semua, setSemua] = useState(false);
  // A newly published job is matched by the server like the rest, so search again; a closed one just leaves.
  useLangsung(
    null,
    (p) => {
      if (p.type === "lowongan.tutup") {
        const { id } = p.data as { id: string };
        setHasil((h) => h && { hasil: h.hasil.filter((l) => l.id !== id), di_luar_preferensi: h.di_luar_preferensi.filter((l) => l.id !== id) });
      } else if (p.type === "lowongan.baru" || p.type === "butuh_hari_ini") {
        setBaru((b) => new Set(b).add((p.data as LowonganApi).id));
        setPutaran((n) => n + 1);
      }
    },
    { onTersambung: () => setPutaran((n) => n + 1) },
  );
  useEffect(() => {
    const kendali = new AbortController();
    api<HasilCariApi>("/lowongan/cari", {
      method: "POST",
      body: { persona_id: personaId, batas: 20, ...(jenis !== "semua" ? { jenis_upah: jenis } : {}) },
      signal: kendali.signal,
    })
      .then(setHasil)
      .catch(() => !kendali.signal.aborted && setHasil((h) => h ?? { hasil: [], di_luar_preferensi: [] }));
    return () => kendali.abort();
  }, [personaId, jenis, putaran]);
  if (!hasil) return <KerangkaDaftar />;
  if (!hasil.hasil.length) return <p className="rounded-2xl border border-dashed border-garis px-4 py-3 text-sm text-abu">Belum ada lowongan yang cocok dengan pilihan ini. Coba jenis upah lain.</p>;
  const tampil = semua ? hasil.hasil : hasil.hasil.slice(0, BATAS_AWAL);
  return (
    <>
      <ul className="urut grid gap-2">
        {tampil.map((api, i) => (
          <li key={api.id} style={{ "--i": Math.min(i, 8) } as CSSProperties}>
            <BarisLowongan lowongan={keLowongan(api)} skor={api.kemiripan ?? undefined} baru={baru.has(api.id)} alasan={api.kenapa_cocok?.slice(0, 2).join(" · ") || undefined} />
          </li>
        ))}
      </ul>
      {tampil.length < hasil.hasil.length && (
        <button type="button" className="mt-3 min-h-12 w-full rounded-2xl border border-garis bg-white text-[15px] font-bold" onClick={() => setSemua(true)}>
          Lihat {hasil.hasil.length - tampil.length} lowongan lagi
        </button>
      )}
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
  const { daftar: semua, baru } = useDaftarLangsung(awal, { masuk: () => true, muatUlang: "/lowongan?batas=100" });
  const [persona, setPersona] = useState<PersonaId>("las");
  const [segmen, setSegmen] = useState<Segmen>("informal");
  const [kota, setKota] = useState<Kota | "semua">("semua");
  const [kategori, setKategori] = useState<KategoriSlug | "semua">("semua");
  const [jenis, setJenis] = useState<JenisUpah | "semua">("semua");
  const [lihatSemua, setLihatSemua] = useState(false);
  const daftarKategori = segmen === "magang" ? KATEGORI_MAGANG : KATEGORI.filter((k) => k.slug !== "magang");
  const daftar = semua
    .filter((l) => (l.segmen ?? "informal") === segmen)
    .filter((l) => kota === "semua" || (l.kota ?? "Banyumas") === kota)
    .filter((l) => kategori === "semua" || l.kategori === kategori)
    .filter((l) => jenis === "semua" || l.jenisUpah === jenis)
    .toSorted((a, b) => Number(baru.has(b.id)) - Number(baru.has(a.id)) || (b.cocok?.[persona] ?? 0) - (a.cocok?.[persona] ?? 0));
  return (
    <section aria-labelledby="judul-cocok">
      <div className="mb-3">
        <h2 id="judul-cocok" className="text-lg">{segmen === "magang" ? "Lowongan magang" : `Cocok untuk ${PEKERJA.persona[persona].judul}`}</h2>
        <p className="text-sm text-abu">{segmen === "magang" ? "Magang dengan uang saku di Banyumas." : "Diurutkan dari yang paling cocok dengan pengalamanmu."}</p>
      </div>
      <div className="saringan mb-3">
        <TabPil label="Jenis lowongan" className="w-fit" nilai={segmen} onUbah={(x) => { setSegmen(x); setKategori("semua"); }} pilihan={[{ id: "informal", label: "Kerja" }, { id: "magang", label: "Magang" }]} />
        {segmen === "informal" && <TabPil label="Cari lowongan sebagai" nilai={persona} onUbah={setPersona} pilihan={(Object.keys(PEKERJA.persona) as PersonaId[]).map((p) => ({ id: p, label: PEKERJA.persona[p].judul }))} />}
        <div className="saringan-baris gulir-tepi" role="group" aria-label="Kota">
          {KOTA.map((k) => <button key={k} type="button" className="chip-peta shrink-0" aria-pressed={kota === k} onClick={() => setKota(k)}>{k === "semua" ? "Semua kota" : k}</button>)}
        </div>
        <div className="saringan-baris gulir-tepi" role="group" aria-label="Kategori">
          <button type="button" className="chip-peta shrink-0" aria-pressed={kategori === "semua"} onClick={() => setKategori("semua")}>Semua kategori</button>
          {daftarKategori.map(({ slug, label, Icon }) => <button key={slug} type="button" className="chip-peta chip-ikon shrink-0" aria-pressed={kategori === slug} onClick={() => setKategori(slug)}><Icon size={18} />{label}</button>)}
        </div>
      </div>
      <PilihJenis jenis={jenis} onUbah={setJenis} />
      <p className="mb-2 text-xs text-abu">{daftar.length} lowongan</p>
      {daftar.length ? (
        <>
          <ul key={`${persona}-${segmen}-${kota}-${kategori}-${jenis}`} className="urut grid gap-2">{(lihatSemua ? daftar : daftar.slice(0, BATAS_AWAL)).map((l, i) => <li key={l.id} style={{ "--i": Math.min(i, 8) } as CSSProperties}><BarisLowongan lowongan={l} persona={segmen === "informal" ? persona : undefined} baru={baru.has(l.id)} /></li>)}</ul>
          {!lihatSemua && daftar.length > BATAS_AWAL && <button type="button" className="mt-3 min-h-12 w-full rounded-2xl border border-garis bg-white text-[15px] font-bold" onClick={() => setLihatSemua(true)}>Lihat {daftar.length - BATAS_AWAL} lowongan lagi</button>}
        </>
      ) : <p className="rounded-2xl border border-dashed border-garis px-4 py-3 text-sm text-abu">Belum ada lowongan yang cocok dengan saringan ini.</p>}
    </section>
  );
}
