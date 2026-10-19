# Lokerin design system: "Garis Kota"

Replaces the earlier "Cat Warung" direction (chosen by the team on 18 Oct 2026). Product spec: `../lokerin-docs/docs/prd.md`. Reference image of the chosen look: `docs/garis-kota-preview.png`.

## Idea

Banyumas drawn as a calm grey line-art town on white. Orange is the only accent, and it always means "there is work here": the highlighted buildings in the hero, the map pins, the urgent tag, the primary action. Everything else is near-black text, grey lines and soft grey cards. The illustration doubles as the Peta Kerja Sekitar map, and the urgent warung pulses for Butuh Hari Ini. Polished and friendly, lots of white space, big readable type.

## Update, 18 Oct: isometric town and ngonlenin buttons

- The hero art is no longer a generated image. The town is hand-built SVG in `src/components/kota/`: `iso.tsx` holds the projection and primitives (box, gable roof, windows, striped awnings, cloud trees, hedge dots, motorbikes), `KotaIsometrik.tsx` composes the Banyumas scene in i7's style (white tops, grey sides, thin #4A4743 outlines, orange only for the four workplaces) and exports `LOKASI_KERJA` so HTML pins sit on the right roofs.
- `PetaKota` turns the town into the job map: pins and chips select a workplace, the card beside it shows the job. On phones the map pans sideways instead of shrinking.
- Buttons copy ngonlenin's 3D pills: an orange gradient with an inner highlight for `utama`, an off-white gradient for `garis`. Eyebrows are pixel-font pills (Silkscreen).
- UI scale is smaller: 16px body, 44px buttons, headline up to 60px.

## Tokens

Expose as Tailwind v4 `@theme` tokens in `src/app/globals.css` (e.g. `bg-putih`, `text-tinta`, `bg-jingga`, `font-sans`, `font-mono`). Light theme only.

| Token | Hex | Use |
|---|---|---|
| putih | #FFFFFF | page background |
| kertas | #FAFAF7 | alternate section background |
| kabut | #F3F3EF | grey cards, inputs, icon tiles |
| garis | #D9D9D4 | borders, dividers, line art |
| abu | #5C6066 | secondary text (6.3:1 on white) |
| tinta | #16181D | text, icons |
| jingga | #EA5A0C | accent: headline second line, primary button (white text only at >= 19px bold), pins, urgent tag |
| jingga-terang | #F26A1B | illustration fills, decorative only, never text |
| jingga-tua | #C2410C | orange text below 19px (eyebrows, links, countdown digits) (5.2:1) |
| jingga-muda | #FFF1E8 | orange tint backgrounds |
| daun | #18794E | Terverifikasi, upah wajar |
| daun-muda | #E8F5EE | green tint |
| kuning-tua | #8A5A00 on #FFF6DB | "di bawah UMK" warning |
| merah | #B42318 on #FDECEA | "terlalu tinggi, hati-hati" |

Type (via `next/font/google`, both verified available):
- **Plus Jakarta Sans** (variable) for everything readable: headlines 800 with tight tracking (-0.03em), body 500 at 18px on mobile, line-height 1.6.
- **JetBrains Mono** (variable) for small uppercase eyebrows with wide tracking, card numbering ("01 / 14"), and the tabular countdown digits.

Shape: radius 16px on cards, 999px on buttons and pills, 1px `garis` borders, almost no shadow (a soft `0 1px 2px rgb(0 0 0 / 0.04)` at most; the phone mockup may have a larger soft shadow). Eyebrow pattern: small orange dot + mono uppercase label.

## Deliverables

Rework the existing files in place (same component names and props where they still make sense) so the old Cat Warung styling is gone:

1. `globals.css` and `layout.tsx`: tokens and fonts above; drop Bungee, Atkinson and Doto, the warung stripe, paper grain, tape and stamp styles. Keep the visible focus ring (2px `tinta` outline with 3px offset plus a `jingga` halo) and `prefers-reduced-motion` handling.
2. **Logo** (`src/components/brand/Logo.tsx`, `public/logo.svg`, `src/app/icon.svg`): the "Tas Ngobrol" mark (an orange work bag that is also a speech bubble, with white voice bars inside) followed by the lowercase wordmark "lokerin" in Plus Jakarta Sans 800. `LogoMark` is the mark alone (favicon), readable at 16px. App icons are the white mark on a full orange tile. Picked by Alice on 19 Oct 2026, replacing the pin-on-the-i logo.
3. **14 category icons** (`src/components/icons/categories.tsx`, keep the `KATEGORI` array and its `ucapan` read-aloud text): redraw as line icons matching the hero, 48x48 grid, 2px `tinta` strokes, round caps and joins, with one small `jingga-terang` fill accent each (sparks for las, a helmet for ojek, steam for dapur...). Keep slugs and labels.
4. **Primitives** in `src/components/ui/`, restyled:
   - `Tombol`: `utama` (jingga bg, white 19px+ bold text), `garis` (white bg, tinta 1.5px border), `halus` (kabut bg); pill shape, min height 52px. `Mic`: big round jingga button with a microphone and "Mulai ngobrol", with a soft pulsing ring.
   - `LencanaTerverifikasi`: green pill with a check, "Terverifikasi", plus a quiet line listing what was checked (KTP · NPWP · Foto usaha) and the date.
   - `PapanLed` -> rename to `HitungMundur` (update imports): an orange pill "BUTUH HARI INI" plus mono tabular HH:MM:SS countdown in jingga-tua on jingga-muda; live, client component, accessible label, ticks stop under reduced motion only for animation (the numbers still update).
   - `KartuLowongan`: white card, 1px garis border, 16px radius: category icon tile, title, employer, upah, lokasi + jarak, jadwal, verified pill, `CekUpah`, optional `mendesak` state with the HitungMundur row on top, a primary "Saya bisa" button and a "Bacakan" speaker button.
   - `CekUpah`: pills for `wajar`, `rendah`, `curiga` with the colours above.
   - `UbinKategori`: grey (kabut) rounded card like the preview's bottom strip: line icon, label, mono "01 / 14" numbering, a round arrow button, and the Bacakan speaker (speechSynthesis, `id-ID`) for Mode baca-dengar. Large tap target.
   - `KartuKerja`: 9:16 WhatsApp-status card in the new style: logo, name, persona pills, city, QR placeholder, "Pindai untuk melihat profil di Lokerin". No verified badge (only employers are verified).
   - `PinPeta`: orange map pin with the category line icon inside; `mendesak` adds a pulsing ring and a small "BUTUH HARI INI" tag.
5. **Landing page** `src/app/page.tsx`, matching `docs/garis-kota-preview.png`:
   - Nav: logo; links "Cari kerja", "Pasang lowongan", "Cara kerja" (anchors on the page are fine); "Mulai ngobrol" pill button.
   - Left: eyebrow "UNTUK PEKERJA DAN UMKM BANYUMAS"; h1 "Cari kerja" / "cukup ngobrol." (second line jingga); sentence "Lowongan warung, bengkel, dan UMKM terverifikasi di dekatmu. Ceritakan pengalamanmu, CV-mu tersusun dari obrolan."; buttons "Mulai ngobrol" (with mic icon) and "Pasang lowongan".
   - Right: the hero illustration `public/hero-kota.png` (via `next/image`, priority, descriptive Indonesian alt text) with an absolutely positioned `PinPeta`/tag "BUTUH HARI INI" over the orange warung (position via percentage props so it can be tuned), and a phone mockup (pure HTML/CSS, not an image) overlapping it that shows `KartuLowongan` in the urgent state: Tukang cuci piring, Warung Bu Wati, Rp120.000/hari, Purwokerto · 1,2 km, Terverifikasi, Saya bisa.
   - Below: the category strip with four `UbinKategori` (Las, Ojek, Dapur, Bangunan) and a link to all 14 on `/desain`.
   - Mobile (360px): text first, then the illustration cropped to the town with the pin, then the phone card full width (no phone frame needed on mobile), then the category tiles in a 2x2 grid. No horizontal scroll.
6. **`/desain`** showcase: update every section to the new tokens, type, logo, 14 icons, all primitives, pins over a small piece of the illustration, and the Kartu Kerja, with sample Banyumas data. Short plain section titles (Warna, Huruf, Logo, Ikon kategori, Tombol, Kartu lowongan, Peta, Kartu Kerja).

## Rules

- Follow `AGENTS.md` (no AI attribution anywhere; plain human copy in Bahasa Indonesia; no slogans or filler).
- No new npm dependencies. Draw icons yourself.
- Responsive 360px to desktop, tap targets >= 48px, WCAG AA, keyboard reachable, visible focus, `aria-label` on icon-only buttons, decorative SVGs `aria-hidden`.
- Read the relevant guides in `node_modules/next/dist/docs/` before writing Next.js code.
- Do not commit; leave changes in the working tree. Finish with `npm run lint` and `npm run build` passing (if the sandbox blocks Google Fonts during build, say so).
