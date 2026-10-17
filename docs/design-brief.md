# Lokerin design system: "Cat Warung"

Lokerin is a voice-first job board for Indonesian informal workers (welders, ojol drivers, warung helpers) and small employers. Full product spec: `../lokerin-docs/docs/prd.md`. UI is 30% of the competition score and the brief rewards something anti-mainstream, so this must NOT look like a generic SaaS/shadcn template (no soft gradients, no glassmorphism, no rounded-2xl grey cards, no purple).

## Direction

The visual language comes from where these jobs are advertised today: hand-painted warung signs, "DICARI KARYAWAN" cardboard notices taped to shop windows, rubber stamps, and the red LED running-text boards in front of shops. Think **hand-painted signwriting meets neo-brutalist web**: flat saturated paint colours on warm newsprint paper, thick ink outlines, hard offset shadows (like a sign cut out of plywood), slightly rotated taped notes, stamp-style badges. Big, bold, friendly, legible for people who rarely read long text.

## Tokens

Colours (all checked for WCAG AA; respect the pairings):

| Token | Hex | Use | Text on it |
|---|---|---|---|
| kertas | #F3EAD7 | page background (newsprint) | arang |
| kertas-terang | #FBF6EC | raised paper cards | arang |
| kardus | #C9A36B | cardboard surfaces, tape | arang |
| arang | #1B1712 | ink: text, outlines, shadows | kertas / white |
| abu | #5E564A | secondary text on kertas (6:1) | - |
| cabai | #C8261B | urgent, Butuh Hari Ini, primary CTA | white or kertas |
| kunyit | #F5B400 | highlight, voice button, attention | arang only |
| daun | #1E6E3A | Terverifikasi, upah wajar | white |
| langit | #1F5AA6 | links, info, map water | white |
| malam | #14110D | LED board background | led |
| led | #FF3B2F | LED dot-matrix text | on malam only |

Type (via `next/font/google`, all verified available):
- Display / sign headings: **Bungee** (400). Uppercase signage. Use for H1/H2, category labels on tiles, big numbers.
- Body / UI: **Atkinson Hyperlegible Next** (variable). Chosen because it was designed for legibility, which matters for low-literacy users. Base size 18px on mobile, generous line-height.
- LED / countdown: **Doto** (dot-matrix, weight 800-900).

Shape: border width 3px (arang) on interactive surfaces; radius small (4-6px) or none; shadow = hard offset `4px 4px 0 arang` (pressed state: translate 2px, shadow 2px). Taped notes: a kardus-coloured translucent strip at the top, card rotated ±1-2deg. Optional subtle paper grain via CSS (no image files needed).

Expose everything as Tailwind v4 `@theme` tokens in `src/app/globals.css` (e.g. `bg-cabai`, `text-arang`, `font-papan`, `font-baca`, `font-led`, `shadow-cetak`). Light theme only for now.

## Deliverables

1. `src/app/globals.css`: tokens above, base styles, visible focus ring (thick kunyit outline + arang offset), `prefers-reduced-motion` handling.
2. `src/app/layout.tsx`: the three fonts, `lang="id"`, metadata title "Lokerin" and an Indonesian description.
3. **Logo** in `src/components/brand/Logo.tsx`: `LogoMark` and `Logo` (mark + wordmark "LOKERIN" in Bungee-like letterforms, or the mark next to text set in Bungee). Concept: a map pin whose head is a speech bubble (voice + nearby work), drawn as a flat cabai shape with a thick arang outline and a kunyit dot/sound-wave inside. Must read at 24px. Also export static `public/logo.svg` and a favicon `src/app/icon.svg`.
4. **Job category icon set** in `src/components/icons/categories.tsx`: 14 hand-drawn-feeling SVG icons on a 48x48 grid, 3px arang strokes, round caps, with one flat paint-colour fill block each, as React components taking `size` and `className`. Categories (slug: label):
   las: Tukang Las, ojek: Ojek & Driver, dapur: Warung & Dapur, bangunan: Tukang Bangunan, bengkel: Bengkel, bersih: Bersih-bersih, toko: Jaga Toko, angkut: Angkut Barang, kebun: Kebun & Tani, jahit: Jahit, laundry: Cuci & Setrika, kurir: Kurir & Antar, acara: Bantu Acara, asuh: Jaga Anak & Lansia.
   Also export a `KATEGORI` array: `{ slug, label, Icon, warna, ucapan }` where `ucapan` is the sentence read aloud in Mode baca-dengar (e.g. "Tukang las. Kerja mengelas besi dan pagar.").
5. **UI primitives** in `src/components/ui/` (server components where possible, client only when needed):
   - `Tombol`: variants `utama` (cabai), `sorot` (kunyit), `garis` (outline on paper); sizes incl. a huge round `Mic` button ("Mulai ngobrol") with a pulsing ring.
   - `LencanaTerverifikasi`: rubber-stamp style badge in daun, slightly rotated, showing what was checked (props: ktp, npwp, fotoUsaha, tanggal), e.g. "TERVERIFIKASI · KTP · FOTO USAHA".
   - `PapanLed`: client component. LED dot-matrix board (malam background, led text in Doto, faint unlit-dot grid behind). Props `until: number` (ms timestamp) and `teks`. Shows a live HH:MM:SS countdown and a marquee of `teks` ("BUTUH HARI INI · TUKANG CUCI PIRING · WARUNG BU WATI · RP120.000"). Marquee stops under reduced motion. This is the hero of the demo video, make it great.
   - `KartuLowongan`: taped paper job card: category icon, title, employer, upah, lokasi + jarak, jadwal, verified badge, optional `mendesak` state that adds a cabai "BUTUH HARI INI" strip and a small LED countdown, and a "Bacakan" (speaker) button.
   - `CekUpah`: chip showing wage fairness vs local UMK. States `wajar` (daun), `rendah` (kunyit, "Di bawah UMK"), `curiga` (cabai, "Terlalu tinggi, hati-hati").
   - `UbinKategori`: big tappable category tile for Mode baca-dengar: large icon, Bungee label, and a speaker button that uses `window.speechSynthesis` with `lang="id-ID"` to read `ucapan`.
   - `KartuKerja`: preview of the shareable QR profile card in 9:16 (WhatsApp status size): name, personas as chips, city, verified-style stamp, and a QR placeholder drawn in SVG (no new dependency).
   - `PinPeta`: map pin marker (category icon inside a pin, cabai ring when urgent) for the future Peta Kerja Sekitar.
6. `src/app/desain/page.tsx`: a showcase page titled "Sistem Desain Lokerin" that displays every token, the type scale, the logo at several sizes, all 14 icons with labels, and every primitive with realistic Banyumas sample data (Purwokerto, Sokaraja, Ajibarang; wages like Rp120.000/hari). Copy in Bahasa Indonesia.
7. Replace `src/app/page.tsx` with a simple placeholder landing in the new style: logo, the headline "Cari kerja cukup ngobrol.", one line naming the problem (lowongan warung, bengkel dan UMKM jarang masuk portal kerja dan rawan penipuan), the big Mic button (no voice logic yet), a PapanLed with a sample urgent job, and a link to `/desain`.

## Rules

- All user-facing copy in Bahasa Indonesia; code identifiers can mix Indonesian names as above.
- No new npm dependencies. No external icon libraries; draw icons yourself.
- Responsive from 360px to desktop; no horizontal scroll; tap targets >= 48px.
- WCAG AA contrast, keyboard reachable, visible focus, `aria-label`s on icon-only buttons, decorative SVGs `aria-hidden`.
- Read the relevant guides in `node_modules/next/dist/docs/` before writing Next.js code (this Next.js version differs from older ones).
- Finish with `npm run lint` and `npm run build` both passing.
