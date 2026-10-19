"use client";

/*
 * Peta Kerja Sekitar on a real map (ADR 0009). The backend finds jobs within a radius with PostGIS
 * and hands the browser a short-lived, read-only Mapbox token; the secret token never leaves the
 * server. Pins and the card strip below stay in sync: tap a pin and its card comes up, swipe the
 * cards and the map follows. Without a token (or the API) this falls back to Alice's isometric map.
 */

import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoJSONSource, Map as PetaGl } from "mapbox-gl";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { IconMapPin } from "../icons/tabler";
import { BarisLowongan } from "../app/KartuLowonganApp";
import { PetaLangsung } from "./PetaLangsung";
import { keLowongan } from "@/lib/api/adaptor";
import { api } from "@/lib/api/klien";
import { useDaftarLangsung } from "@/lib/api/langsung";
import type { Titik } from "@/lib/api/sumber";
import type { LowonganApi } from "@/lib/api/tipe";
import type { Lowongan } from "@/lib/data";
import "./peta.css";

type KunciPeta = { aktif: true; token: string; kedaluwarsa: string; gaya: string } | { aktif: false };

const JINGGA = "#F27719";
const MENDESAK = "#C2410C";
const RADIUS = [2, 5, 10] as const;

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

export function PetaMapbox({ awal, pusat: pusatAwal, radiusKm }: { awal: Lowongan[]; pusat: Titik; radiusKm: number }) {
  const wadah = useRef<HTMLDivElement>(null);
  const peta = useRef<PetaGl | null>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [status, setStatus] = useState<"memuat" | "siap" | "cadangan">("memuat");
  const [pusat, setPusat] = useState(pusatAwal);
  const [radius, setRadius] = useState<number>(RADIUS.includes(radiusKm as 2) ? radiusKm : 5);
  const [mendesakSaja, setMendesakSaja] = useState(false);
  const [diAku, setDiAku] = useState(false);
  const [sumber, setSumber] = useState(awal);
  const [memuat, setMemuat] = useState(false);
  const [terpilih, setTerpilih] = useState<string | null>(null);
  const [pesan, setPesan] = useState("");
  const pilihTerbaru = useRef<(id: string, dari: "peta" | "kartu") => void>(() => {});

  const { daftar, baru } = useDaftarLangsung(sumber, {
    masuk: (l) => l.lokasi.lat != null && (!mendesakSaja || Boolean(l.butuh_hari_ini)),
    muatUlang: `/lowongan/peta?lat=${pusat.lat}&lng=${pusat.lng}&radius_km=${radius}${mendesakSaja ? "&butuh_hari_ini=true" : ""}`,
  });
  const urut = daftar.filter((l) => l.titik).toSorted((a, b) => a.jarakKm - b.jarakKm);

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
        cooperativeGestures: false,
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
      map.on("error", () => setPesan("Sebagian peta belum termuat. Daftar lowongan di bawah tetap bisa dipakai."));
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
        m.addLayer({
          id: "titik",
          type: "circle",
          source: "lowongan",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": ["case", ["get", "mendesak"], MENDESAK, JINGGA],
            "circle-radius": ["case", ["boolean", ["feature-state", "terpilih"], false], 13, 9],
            "circle-stroke-color": ["case", ["get", "baru"], "#1F7A4D", "#fff"],
            "circle-stroke-width": ["case", ["boolean", ["feature-state", "terpilih"], false], 4, 3],
          },
        });
        m.on("click", "kluster", (e) => {
          const f = e.features?.[0];
          const id = f?.properties?.cluster_id as number | undefined;
          if (id == null || f?.geometry.type !== "Point") return;
          (m.getSource("lowongan") as GeoJSONSource).getClusterExpansionZoom(id, (err, zoom) => {
            if (err || zoom == null) return;
            m.easeTo({ center: f.geometry.type === "Point" ? (f.geometry.coordinates as [number, number]) : undefined, zoom, duration: gerakHalus() ? 500 : 0 });
          });
        });
        m.on("click", "titik", (e) => {
          const id = e.features?.[0]?.properties?.id as string | undefined;
          if (id) pilihTerbaru.current(id, "peta");
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

  // Pins follow the list.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    (m.getSource("lowongan") as GeoJSONSource | undefined)?.setData(koleksi(daftar, baru));
  }, [status, daftar, baru]);

  // The selected pin grows.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m || !terpilih) return;
    m.setFeatureState({ source: "lowongan", id: terpilih }, { terpilih: true });
    return () => {
      if (peta.current?.getSource("lowongan")) peta.current.setFeatureState({ source: "lowongan", id: terpilih }, { terpilih: false });
    };
  }, [status, terpilih, daftar]);

  // Radius ring and framing follow the centre and the distance.
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    const cincin = lingkaran(pusat, radius);
    (m.getSource("radius") as GeoJSONSource | undefined)?.setData(cincin);
    const lng = cincin.geometry.coordinates[0].map((c) => c[0]);
    const lat = cincin.geometry.coordinates[0].map((c) => c[1]);
    m.fitBounds([[Math.min(...lng), Math.min(...lat)], [Math.max(...lng), Math.max(...lat)]], { padding: { top: 68, bottom: 24, left: 20, right: 20 }, duration: gerakHalus() ? 600 : 0 });
  }, [status, pusat, radius]);

  // Blue dot for "Lokasiku".
  useEffect(() => {
    const m = peta.current;
    if (status !== "siap" || !m) return;
    (m.getSource("aku") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: diAku ? [{ type: "Feature", properties: {}, geometry: { type: "Point", coordinates: [pusat.lng, pusat.lat] } }] : [],
    });
  }, [status, diAku, pusat]);

  function pilih(id: string, dari: "peta" | "kartu") {
    setTerpilih(id);
    const l = urut.find((x) => x.id === id) ?? daftar.find((x) => x.id === id);
    if (dari === "peta") document.getElementById(`kartu-peta-${id}`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: gerakHalus() ? "smooth" : "auto" });
    // Close enough that the chosen job is its own pin, not part of a cluster.
    else if (l?.titik && peta.current) peta.current.easeTo({ center: [l.titik.lng, l.titik.lat], zoom: Math.max(peta.current.getZoom(), 15), duration: gerakHalus() ? 450 : 0 });
  }

  // Map listeners are attached once; they always reach the latest pilih through this ref.
  useLayoutEffect(() => {
    pilihTerbaru.current = pilih;
  });

  async function muat(baruPusat: Titik, km: number, mendesak: boolean) {
    setMemuat(true);
    setPesan("");
    try {
      const h = await api<{ lowongan: LowonganApi[] }>(`/lowongan/peta?lat=${baruPusat.lat}&lng=${baruPusat.lng}&radius_km=${km}${mendesak ? "&butuh_hari_ini=true" : ""}`, { token: null });
      setSumber(h.lowongan.map((l) => keLowongan(l)).filter((l) => l.cekUpah !== "curiga"));
      setTerpilih(null);
      // A new list starts at its first card without choosing it, so the map keeps framing the whole radius.
      abaikanGeser.current = true;
      strip.current?.scrollTo({ left: 0 });
      window.setTimeout(() => (abaikanGeser.current = false), 800);
    } catch {
      setPesan("Lowongan belum bisa dimuat. Coba lagi.");
    } finally {
      setMemuat(false);
    }
  }

  function gantiRadius(km: number) {
    setRadius(km);
    void muat(pusat, km, mendesakSaja);
  }
  function gantiMendesak() {
    const nilai = !mendesakSaja;
    setMendesakSaja(nilai);
    void muat(pusat, radius, nilai);
  }
  function lokasiku() {
    if (!navigator.geolocation) return setPesan("HP ini belum bisa membagikan lokasi.");
    setPesan("Mencari lokasimu...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const titik = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPusat(titik);
        setDiAku(true);
        void muat(titik, radius, mendesakSaja);
      },
      () => setPesan("Lokasi belum diizinkan. Peta tetap memakai pusat Purwokerto."),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  // Selecting by swiping: the card nearest the middle of the strip becomes the selected pin.
  function saatGeser() {
    const el = strip.current;
    if (!el) return;
    const tengah = el.scrollLeft + el.clientWidth / 2;
    let dekat: { id: string; jarak: number } | null = null;
    for (const anak of Array.from(el.children) as HTMLElement[]) {
      const jarak = Math.abs(anak.offsetLeft + anak.offsetWidth / 2 - tengah);
      if (!dekat || jarak < dekat.jarak) dekat = { id: anak.dataset.id ?? "", jarak };
    }
    if (dekat?.id && dekat.id !== terpilih) pilih(dekat.id, "kartu");
  }
  const geserTimer = useRef(0);
  const abaikanGeser = useRef(false);

  if (status === "cadangan") return <PetaLangsung awal={awal} pusat={pusatAwal} radiusKm={radiusKm} />;

  return (
    <section className="peta-kartu-wadah" aria-label="Peta lowongan di sekitarmu">
      <div className="peta-gl-wadah">
      <div ref={wadah} className="peta-gl" role="application" aria-label="Peta. Daftar lowongan yang sama ada di bawah peta." />
      {status === "memuat" && <div className="peta-memuat" role="status">Memuat peta...</div>}

      <div className="peta-atas">
        <div className="peta-chip-baris" role="group" aria-label="Jarak">
          {RADIUS.map((km) => (
            <button key={km} type="button" className="peta-chip" aria-pressed={radius === km} onClick={() => gantiRadius(km)}>{km} km</button>
          ))}
          <button type="button" className="peta-chip" aria-pressed={mendesakSaja} onClick={gantiMendesak}>Butuh hari ini</button>
        </div>
        <button type="button" className="peta-lokasiku" onClick={lokasiku} aria-label="Pakai lokasiku"><IconMapPin size={20} /></button>
      </div>

      {(pesan || memuat) && <p className="peta-pesan" role="status">{memuat ? "Memuat lowongan..." : pesan}</p>}
      </div>

      <div className="peta-bawah">
        {urut.length ? (
          <ul
            ref={strip}
            className="peta-strip"
            aria-label={`${urut.length} lowongan dalam ${radius} km`}
            onScroll={() => {
              window.clearTimeout(geserTimer.current);
              if (abaikanGeser.current) return;
              geserTimer.current = window.setTimeout(saatGeser, 120);
            }}
          >
            {urut.map((l, i) => (
              <li key={l.id} id={`kartu-peta-${l.id}`} data-id={l.id} data-terpilih={terpilih === l.id || undefined} style={{ "--i": i } as CSSProperties}>
                <BarisLowongan lowongan={l} baru={baru.has(l.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="peta-kosong">Belum ada lowongan{mendesakSaja ? " butuh hari ini" : ""} dalam {radius} km. Coba perbesar jarak.</p>
        )}
      </div>
    </section>
  );
}
