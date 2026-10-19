"use client";

/*
 * Peta Kerja Sekitar on a real map (ADR 0009). The backend finds jobs within a radius with PostGIS
 * and hands the browser a short-lived, read-only Mapbox token; the secret token never leaves the
 * server. On a phone the map fills the screen and the jobs sit in a sheet you drag between a peek,
 * half and full height; tapping a pin turns the sheet into that job's card. Moving the map offers
 * "Cari di area ini". Without a token (or the API) this falls back to Alice's isometric map.
 */

import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoJSONSource, Map as PetaGl } from "mapbox-gl";
import { animate, m, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";
import { IconBolt, IconCurrentLocation, IconRoute, IconSearch, IconX } from "../icons/tabler";
import { getKategori } from "../icons/categories";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { SisaWaktu } from "../app/SisaWaktu";
import { TautanArah } from "../app/TautanArah";
import { PetaLangsung } from "./PetaLangsung";
import { jarakKm, keLowongan } from "@/lib/api/adaptor";
import { api } from "@/lib/api/klien";
import { useDaftarLangsung } from "@/lib/api/langsung";
import type { Titik } from "@/lib/api/sumber";
import type { LowonganApi } from "@/lib/api/tipe";
import { upahTeks, type Lowongan } from "@/lib/data";
import "./peta.css";

type KunciPeta = { aktif: true; token: string; kedaluwarsa: string; gaya: string } | { aktif: false };
type Snap = "intip" | "setengah" | "penuh";

const JINGGA = "#F27719";
const MENDESAK = "#C2410C";
const RADIUS = [2, 5, 10] as const;
const ATAS = 60; // app header
const NAV = 96; // room for the floating pill nav under the sheet
const KEPALA = 84; // grabber and the count line
const PEGAS = { type: "spring", stiffness: 420, damping: 42 } as const;

function lingkaran(pusat: Titik, km: number) {
  const titik: [number, number][] = [];
  for (let i = 0; i <= 64; i++) {
    const sudut = (i / 64) * 2 * Math.PI;
    const dLat = (km / 111.32) * Math.cos(sudut);
    const dLng = (km / (111.32 * Math.cos((pusat.lat * Math.PI) / 180))) * Math.sin(sudut);
    titik.push([pusat.lng + dLng, pusat.lat + dLat]);
  }
  return { type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [titik] } };
}

function koleksi(daftar: Lowongan[], baru: ReadonlySet<string>) {
  return {
    type: "FeatureCollection" as const,
    features: daftar
      .filter((l) => l.titik)
      .map((l) => ({
        type: "Feature" as const,
        properties: { id: l.id, mendesak: Boolean(l.mendesakMenit), baru: baru.has(l.id) },
        geometry: { type: "Point" as const, coordinates: [l.titik!.lng, l.titik!.lat] },
      })),
  };
}

const gerakHalus = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const km = (n: number) => String(n).replace(".", ",");

const LAYAR_LEBAR = "(min-width: 1024px)";
function useLayarLebar() {
  return useSyncExternalStore(
    (fn) => {
      const mq = window.matchMedia(LAYAR_LEBAR);
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    },
    () => window.matchMedia(LAYAR_LEBAR).matches,
    () => false,
  );
}

function tinggiSnap(snap: Snap, layar: number) {
  if (snap === "intip") return NAV + KEPALA;
  if (snap === "setengah") return Math.max(NAV + KEPALA + 140, Math.round(layar * 0.48));
  return layar - ATAS - 8;
}

export function PetaMapbox({ awal, pusat: pusatAwal, radiusKm }: { awal: Lowongan[]; pusat: Titik; radiusKm: number }) {
  const layarRef = useRef<HTMLElement>(null);
  const wadah = useRef<HTMLDivElement>(null);
  const peta = useRef<PetaGl | null>(null);
  const kartuRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"memuat" | "siap" | "cadangan">("memuat");
  const [pusat, setPusat] = useState(pusatAwal);
  const [radius, setRadius] = useState<number>(RADIUS.includes(radiusKm as 2) ? radiusKm : 5);
  const [mendesakSaja, setMendesakSaja] = useState(false);
  const [aku, setAku] = useState<Titik | null>(null);
  const [sumber, setSumber] = useState(awal);
  const [memuat, setMemuat] = useState(false);
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [sorot, setSorot] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");
  const [tengahPeta, setTengahPeta] = useState<Titik | null>(null);
  const [snap, setSnap] = useState<Snap>("setengah");
  const [tinggiLayar, setTinggiLayar] = useState(0);
  const [tinggiKartu, setTinggiKartu] = useState(0);
  const lebar = useLayarLebar();
  const tinggi = useMotionValue(0);
  const putaranMuat = useRef(0);
  // Map listeners are attached once; they reach the latest state through this ref.
  const dariPeta = useRef({ pilih: (id: string) => void id, lepas: () => {}, geser: () => {}, ruang: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) });

  const { daftar, baru } = useDaftarLangsung(sumber, {
    masuk: (l) => l.lokasi.lat != null && jarakKm(l.lokasi.lat, l.lokasi.lng, pusat) <= radius && (!mendesakSaja || Boolean(l.butuh_hari_ini)),
    muatUlang: `/lowongan/peta?lat=${pusat.lat}&lng=${pusat.lng}&radius_km=${radius}${mendesakSaja ? "&butuh_hari_ini=true" : ""}`,
  });
  const urut = daftar.filter((l) => l.titik).toSorted((a, b) => Number(baru.has(b.id)) - Number(baru.has(a.id)) || a.jarakKm - b.jarakKm);
  const pilihan = terpilih ? urut.find((l) => l.id === terpilih) ?? null : null;
  const jumlahMendesak = urut.filter((l) => l.mendesakMenit).length;
  const jauhDariPusat = tengahPeta ? jarakKm(tengahPeta.lat, tengahPeta.lng, pusat) > Math.max(0.6, radius * 0.35) : false;

  // How tall the sheet should be right now (phones only; on wide screens it is a side panel).
  const target = lebar || !tinggiLayar ? 0 : pilihan ? Math.min(NAV + 36 + (tinggiKartu || 260), tinggiLayar - ATAS - 8) : tinggiSnap(snap, tinggiLayar);

  // Map setup, once: token from the backend, then the map itself.
  useEffect(() => {
    let batal = false;
    let map: PetaGl | undefined;
    void (async () => {
      const kunci = await api<KunciPeta>("/peta/kunci", { token: null }).catch((): KunciPeta => ({ aktif: false }));
      if (batal) return;
      if (!kunci.aktif || !wadah.current) return setStatus("cadangan");
      const { default: mapboxgl } = await import("mapbox-gl");
      if (batal) return;
      mapboxgl.accessToken = kunci.token;
      map = new mapboxgl.Map({
        container: wadah.current,
        style: kunci.gaya,
        center: [pusatAwal.lng, pusatAwal.lat],
        zoom: 12.6,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
      map.on("error", () => setPesan("Sebagian peta belum termuat. Daftar lowongan tetap bisa dipakai."));
      map.on("load", () => {
        const m = map!;
        m.addSource("radius", { type: "geojson", data: lingkaran(pusatAwal, radius) });
        m.addLayer({ id: "radius-isi", type: "fill", source: "radius", paint: { "fill-color": JINGGA, "fill-opacity": 0.06 } });
        m.addLayer({ id: "radius-garis", type: "line", source: "radius", paint: { "line-color": JINGGA, "line-opacity": 0.55, "line-width": 1.5, "line-dasharray": [2, 2] } });
        m.addSource("aku", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
        m.addLayer({ id: "aku-halo", type: "circle", source: "aku", paint: { "circle-radius": 18, "circle-color": "#2563EB", "circle-opacity": 0.15 } });
        m.addLayer({ id: "aku", type: "circle", source: "aku", paint: { "circle-radius": 7, "circle-color": "#2563EB", "circle-stroke-color": "#fff", "circle-stroke-width": 3 } });
        m.addSource("lowongan", { type: "geojson", data: { type: "FeatureCollection", features: [] }, cluster: true, clusterRadius: 42, clusterMaxZoom: 14, promoteId: "id" });
        m.addLayer({
          id: "kluster",
          type: "circle",
          source: "lowongan",
          filter: ["has", "point_count"],
          paint: { "circle-color": JINGGA, "circle-radius": ["step", ["get", "point_count"], 18, 10, 23, 30, 28], "circle-stroke-color": "#fff", "circle-stroke-width": 3 },
        });
        m.addLayer({
          id: "kluster-angka",
          type: "symbol",
          source: "lowongan",
          filter: ["has", "point_count"],
          layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"], "text-size": 15 },
          paint: { "text-color": "#fff" },
        });
        const besar = ["any", ["boolean", ["feature-state", "terpilih"], false], ["boolean", ["feature-state", "sorot"], false]];
        m.addLayer({
          id: "titik",
          type: "circle",
          source: "lowongan",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["case", ["get", "mendesak"], MENDESAK, JINGGA],
            "circle-radius": ["case", besar, 13, 9],
            "circle-stroke-color": ["case", ["get", "baru"], "#1F7A4D", "#fff"],
            "circle-stroke-width": ["case", besar, 4, 3],
          },
        });
        m.on("click", "kluster", (e) => {
          const f = e.features?.[0];
          const id = f?.properties?.cluster_id as number | undefined;
          if (id == null || f?.geometry.type !== "Point") return;
          const pusatKluster = f.geometry.coordinates as [number, number];
          (m.getSource("lowongan") as GeoJSONSource).getClusterExpansionZoom(id, (err, zoom) => {
            if (err || zoom == null) return;
            m.easeTo({ center: pusatKluster, zoom, padding: dariPeta.current.ruang(), duration: gerakHalus() ? 500 : 0 });
          });
        });
        m.on("click", "titik", (e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          if (id) dariPeta.current.pilih(id);
        });
        // A tap on empty map closes the job card.
        m.on("click", (e) => {
          if (!m.queryRenderedFeatures(e.point, { layers: ["titik", "kluster"] }).length) dariPeta.current.lepas();
        });
        // Moving the map yourself tucks the sheet away and offers to search where you are looking.
        m.on("dragstart", () => dariPeta.current.geser());
        m.on("moveend", (e) => {
          if (!("originalEvent" in e) || !e.originalEvent) return;
          const c = m.getCenter();
          setTengahPeta({ lat: c.lat, lng: c.lng });
        });
        for (const lapis of ["kluster", "titik"]) {
          m.on("mouseenter", lapis, () => (m.getCanvas().style.cursor = "pointer"));
          m.on("mouseleave", lapis, () => (m.getCanvas().style.cursor = ""));
        }
        peta.current = m;
        setStatus("siap");
      });
    })();
    return () => {
      batal = true;
      peta.current = null;
      map?.remove();
    };
    // The map is created once; later changes go through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    dariPeta.current = {
      pilih: (id) => {
        setTerpilih(id);
        const l = urut.find((x) => x.id === id);
        if (l?.titik && peta.current) {
          const bawah = lebar ? 0 : Math.min(NAV + 36 + (tinggiKartu || 260), tinggiLayar * 0.6);
          peta.current.easeTo({ center: [l.titik.lng, l.titik.lat], zoom: Math.max(peta.current.getZoom(), 14.5), padding: { ...dariPeta.current.ruang(), bottom: bawah }, duration: gerakHalus() ? 450 : 0 });
        }
      },
      // The part of the map not under the header, the chips or the sheet: camera moves aim there.
      ruang: () => ({ top: lebar ? 56 : ATAS + 64, bottom: lebar ? 0 : Math.min(tinggi.get(), tinggiLayar * 0.55), left: 0, right: 0 }),
      lepas: () => setTerpilih(null),
      geser: () => {
        if (!terpilih && snap !== "intip") setSnap("intip");
      },
    };
  });

  // Sheet size follows the screen and, for a job card, the card itself.
  useEffect(() => {
    const el = layarRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTinggiLayar(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);
  useEffect(() => {
    const el = kartuRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTinggiKartu(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [terpilih]);

  useEffect(() => {
    if (!target) return;
    if (!gerakHalus() || tinggi.get() === 0) {
      tinggi.set(target);
      return;
    }
    const a = animate(tinggi, target, PEGAS);
    return () => a.stop();
  }, [target, tinggi]);

  // Things floating over the map ride on top of the sheet.
  useMotionValueEvent(tinggi, "change", (v) => layarRef.current?.style.setProperty("--lembar", `${Math.round(v)}px`));

  // Pins follow the list.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    (m.getSource("lowongan") as GeoJSONSource | undefined)?.setData(koleksi(daftar, baru));
  }, [status, daftar, baru]);

  // The selected pin, and the one under the pointer in the list, grow.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m || !terpilih) return;
    m.setFeatureState({ source: "lowongan", id: terpilih }, { terpilih: true });
    return () => {
      if (peta.current?.getSource("lowongan")) peta.current.setFeatureState({ source: "lowongan", id: terpilih }, { terpilih: false });
    };
  }, [status, terpilih, daftar]);
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m || !sorot) return;
    m.setFeatureState({ source: "lowongan", id: sorot }, { sorot: true });
    return () => {
      if (peta.current?.getSource("lowongan")) peta.current.setFeatureState({ source: "lowongan", id: sorot }, { sorot: false });
    };
  }, [status, sorot, daftar]);

  // Radius ring and framing follow the centre and the distance, leaving room for the sheet.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    const cincin = lingkaran(pusat, radius);
    (m.getSource("radius") as GeoJSONSource | undefined)?.setData(cincin);
    const lng = cincin.geometry.coordinates[0].map((c) => c[0]);
    const lat = cincin.geometry.coordinates[0].map((c) => c[1]);
    const ruang = dariPeta.current.ruang();
    m.fitBounds([[Math.min(...lng), Math.min(...lat)], [Math.max(...lng), Math.max(...lat)]], {
      padding: { top: ruang.top + 8, bottom: ruang.bottom + 16, left: 20, right: 20 },
      duration: gerakHalus() ? 600 : 0,
    });
  }, [status, pusat, radius]);

  // Blue dot for "Lokasiku".
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    (m.getSource("aku") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: aku ? [{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [aku.lng, aku.lat] } }] : [],
    });
  }, [status, aku]);

  async function muat(baruPusat: Titik, kmBaru: number, mendesak: boolean) {
    const putaran = ++putaranMuat.current;
    setMemuat(true);
    setPesan("");
    try {
      const h = await api<{ lowongan: LowonganApi[] }>(`/lowongan/peta?lat=${baruPusat.lat}&lng=${baruPusat.lng}&radius_km=${kmBaru}${mendesak ? "&butuh_hari_ini=true" : ""}`, { token: null });
      if (putaran !== putaranMuat.current) return;
      setPusat(baruPusat);
      setTengahPeta(null);
      setSumber(h.lowongan.map((l) => keLowongan(l)).filter((l) => l.cekUpah !== "curiga"));
      setTerpilih(null);
    } catch {
      if (putaran === putaranMuat.current) setPesan("Lowongan belum bisa dimuat. Coba lagi.");
    } finally {
      if (putaran === putaranMuat.current) setMemuat(false);
    }
  }

  function gantiRadius(kmBaru: number) {
    setRadius(kmBaru);
    void muat(pusat, kmBaru, mendesakSaja);
  }
  function gantiMendesak() {
    const nilai = !mendesakSaja;
    setMendesakSaja(nilai);
    void muat(pusat, radius, nilai);
  }
  function lokasiku() {
    if (!navigator.geolocation) return setPesan("HP ini belum bisa membagikan lokasi.");
    setPesan("Mencari lokasimu…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const titik = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setAku(titik);
        void muat(titik, radius, mendesakSaja);
      },
      () => setPesan("Lokasi belum diizinkan. Peta tetap memakai pusat Purwokerto."),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  // Dragging the sheet by its top. A short tap steps it up (peek, half, full, back to peek).
  const tarik = useRef<{ y: number; h: number; t: number; vy: number; gerak: boolean } | null>(null);
  function mulaiTarik(e: PointerEvent<HTMLDivElement>) {
    if (lebar || (e.target as HTMLElement).closest("button, a")) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    tinggi.stop();
    tarik.current = { y: e.clientY, h: tinggi.get(), t: e.timeStamp, vy: 0, gerak: false };
  }
  function saatTarik(e: PointerEvent<HTMLDivElement>) {
    const t = tarik.current;
    if (!t) return;
    const dy = e.clientY - t.y;
    if (Math.abs(dy) > 6) t.gerak = true;
    const batasAtas = tinggiLayar - ATAS - 8;
    const h = Math.min(batasAtas + 12, Math.max(NAV + KEPALA - 40, t.h - dy));
    const dt = Math.max(1, e.timeStamp - t.t);
    t.vy = (h - tinggi.get()) / dt;
    t.t = e.timeStamp;
    tinggi.set(h);
  }
  function akhiriTarik() {
    const t = tarik.current;
    tarik.current = null;
    if (!t) return;
    const sekarang = tinggi.get();
    if (pilihan) {
      // A job card: pulled down far enough closes it, otherwise it springs back.
      if (t.gerak && sekarang < target - 60) setTerpilih(null);
      else void animate(tinggi, target, PEGAS);
      return;
    }
    let baruSnap: Snap;
    if (!t.gerak) baruSnap = snap === "intip" ? "setengah" : snap === "setengah" ? "penuh" : "intip";
    else {
      const ramal = sekarang + t.vy * 180;
      baruSnap = (["intip", "setengah", "penuh"] as const).reduce((a, b) => (Math.abs(tinggiSnap(b, tinggiLayar) - ramal) < Math.abs(tinggiSnap(a, tinggiLayar) - ramal) ? b : a));
    }
    setSnap(baruSnap);
    void animate(tinggi, tinggiSnap(baruSnap, tinggiLayar), PEGAS);
  }

  if (status === "cadangan") {
    return (
      <div className="grid gap-6">
        <div>
          <h1 className="text-[1.75rem] leading-tight">Peta Kerja <span className="text-jingga">Sekitar.</span></h1>
          <p className="mt-1 max-w-xl text-[15px] text-abu">Titik jingga sedang mencari orang.</p>
        </div>
        <PetaLangsung awal={awal} pusat={pusatAwal} radiusKm={radiusKm} />
      </div>
    );
  }

  // With nothing found, the header itself offers the way out, so it shows even at the lowest sheet height.
  const kosong = !memuat && !urut.length;
  const radiusLebih = radius < 5 ? 5 : 10;
  const ringkas = memuat
    ? "Memuat lowongan…"
    : urut.length
      ? `${urut.length} lowongan dalam ${radius} km`
      : `Belum ada lowongan${mendesakSaja ? " butuh hari ini" : ""} dalam ${radius} km`;

  return (
    <section ref={layarRef} className="peta-layar" data-snap={pilihan ? "kartu" : lebar ? undefined : snap} aria-labelledby="judul-peta">
      <h1 id="judul-peta" className="sr-only">Peta Kerja Sekitar</h1>
      <div className="peta-gl-wadah">
        <div ref={wadah} className="peta-gl" role="application" aria-label="Peta lowongan. Daftar yang sama ada di panel lowongan." />
        {status === "memuat" && <div className="peta-memuat" role="status">Memuat peta…</div>}

        <div className="peta-atas">
          <div className="peta-chip-baris" role="group" aria-label="Saring peta">
            {RADIUS.map((k) => (
              <button key={k} type="button" className="peta-chip" aria-pressed={radius === k} onClick={() => gantiRadius(k)}>{k} km</button>
            ))}
            <span className="peta-chip-pemisah" aria-hidden="true" />
            <button type="button" className="peta-chip" aria-pressed={mendesakSaja} onClick={gantiMendesak}><IconBolt size={18} />Butuh hari ini</button>
          </div>
          {jauhDariPusat && !memuat && tengahPeta && (
            <button type="button" className="peta-cari-sini" onClick={() => void muat(tengahPeta, radius, mendesakSaja)}>
              <IconSearch size={18} />Cari di area ini
            </button>
          )}
          {pesan && <p className="peta-pesan" role="status">{pesan}</p>}
        </div>

        <button type="button" className="peta-lokasiku" onClick={lokasiku} aria-pressed={Boolean(aku)} aria-label="Cari di sekitar lokasiku">
          <IconCurrentLocation size={22} />
        </button>
      </div>

      <m.aside className="peta-lembar" style={lebar ? undefined : { height: tinggi }} aria-label="Lowongan di peta">
        <div className="peta-lembar-kepala" onPointerDown={mulaiTarik} onPointerMove={saatTarik} onPointerUp={akhiriTarik} onPointerCancel={akhiriTarik}>
          <span className="peta-pegangan" aria-hidden="true" />
          {pilihan ? null : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[17px] font-extrabold leading-tight" role="status">{ringkas}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-abu">
                  {jumlahMendesak > 0 && <><span className="inline-block size-2.5 rounded-full" style={{ background: MENDESAK }} aria-hidden="true" />{jumlahMendesak} butuh hari ini ·</>}
                  {urut[0] ? `terdekat ${km(urut[0].jarakKm)} km` : memuat ? "" : "Coba jarak lain atau geser peta"}
                </p>
              </div>
              {kosong ? (
                radius < 10 ? (
                  <button type="button" className="tombol tombol-garis min-h-10 shrink-0 px-4 text-sm" onClick={() => gantiRadius(radiusLebih)}>Perbesar ke {radiusLebih} km</button>
                ) : (
                  <button type="button" className="tombol tombol-garis min-h-10 shrink-0 px-4 text-sm" onClick={() => void muat(pusatAwal, radius, mendesakSaja)}>Kembali ke pusat</button>
                )
              ) : (
                !lebar && (
                  <button type="button" className="tombol tombol-halus min-h-10 shrink-0 px-4 text-sm" aria-expanded={snap === "penuh"} onClick={() => setSnap(snap === "penuh" ? "intip" : "penuh")}>
                    {snap === "penuh" ? "Lihat peta" : "Daftar"}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div className="peta-lembar-isi">
          {pilihan ? (
            <div ref={kartuRef}>
              <KartuPilihan l={pilihan} onTutup={() => setTerpilih(null)} />
            </div>
          ) : urut.length ? (
            <ul className="grid gap-2" onMouseLeave={() => setSorot(null)}>
              {urut.map((l, i) => (
                <li key={l.id} data-sorot={sorot === l.id || undefined} style={{ "--i": Math.min(i, 8) } as CSSProperties} onMouseEnter={() => setSorot(l.id)}>
                  <BarisLowongan lowongan={l} baru={baru.has(l.id)} />
                </li>
              ))}
            </ul>
          ) : (
            kosong && (
              <p className="rounded-2xl border border-dashed border-garis px-4 py-3 text-[15px] text-abu">
                {mendesakSaja ? "Tidak ada yang butuh orang hari ini di area ini. Matikan saringan Butuh hari ini untuk melihat semua lowongan." : "Geser peta ke daerah lain lalu ketuk Cari di area ini, atau perbesar jaraknya."}
              </p>
            )
          )}
        </div>
      </m.aside>
    </section>
  );
}

/** The job behind a tapped pin: what it pays, how far, and the two next steps. */
function KartuPilihan({ l, onTutup }: { l: Lowongan; onTutup: () => void }) {
  const { Icon, label } = getKategori(l.kategori);
  const jalan = l.jarakKm <= 2.5;
  const menit = jalan ? Math.max(1, Math.round((l.jarakKm / 4.5) * 60)) : Math.max(2, Math.round((l.jarakKm / 25) * 60));
  const rute = l.titik ? `https://www.google.com/maps/dir/?api=1&destination=${l.titik.lat},${l.titik.lng}&travelmode=${jalan ? "walking" : "driving"}` : null;
  return (
    <article className="peta-pilihan" aria-labelledby={`pilihan-${l.id}`}>
      <div className="flex items-start gap-3">
        <span className="ubin-ikon"><Icon size={30} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-abu">{label}</p>
          <h2 id={`pilihan-${l.id}`} className="text-lg leading-tight">{l.judul}</h2>
          <p className="truncate text-sm text-abu">{l.usaha} · {l.area}</p>
        </div>
        <button type="button" className="peta-tutup" onClick={onTutup} aria-label="Tutup, kembali ke daftar"><IconX size={20} /></button>
      </div>
      {(l.mendesakMenit || l.segmen === "magang") && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {l.mendesakMenit && <><span className="urgent-tag">Butuh hari ini</span><span className="text-jingga-tua">tutup dalam <SisaWaktu menit={l.mendesakMenit} /></span></>}
          {l.segmen === "magang" && <span className="lencana-magang">Magang</span>}
        </p>
      )}
      <dl className="mt-3 grid grid-cols-2 gap-2">
        <div className="peta-angka"><dt>Upah</dt><dd className="tabular-nums">{upahTeks(l)}</dd></div>
        <div className="peta-angka"><dt>Jarak</dt><dd>{km(l.jarakKm)} km</dd><dd className="text-xs font-normal text-abu">± {menit} menit {jalan ? "jalan kaki" : "naik motor"}</dd></div>
        <div className="peta-angka col-span-2"><dt>Jadwal</dt><dd className="font-semibold">{l.jadwal}</dd></div>
      </dl>
      <div className="mt-3 flex gap-2">
        <TautanArah arah="maju" href={`/app/lowongan/${l.id}`} className="tombol tombol-utama flex-1">Lihat lowongan</TautanArah>
        {rute && <a href={rute} target="_blank" rel="noopener noreferrer" className="tombol tombol-garis"><IconRoute size={18} />Rute</a>}
      </div>
    </article>
  );
}
