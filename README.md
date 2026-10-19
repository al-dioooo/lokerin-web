# Lokerin

Lokerin is a job board for informal work and internships in Banyumas, Central Java, that you use by talking or typing. Job seekers tell Lokerin what work they can do, see nearby jobs, and send a Lamaran with a CV built from what they said. Small employers (warung, bengkel, UMKM, households) post a job, it goes through a check for fees and low pay, and applicants arrive live. Interviews and the deal happen outside Lokerin, following the next step the employer writes.

Built for ITASE 7.0 Web Development (ITASEFEST 2026), SDG 8. Product spec, ADRs and glossary: [al-dioooo/lokerin-docs](https://github.com/al-dioooo/lokerin-docs). Backend: [dikaprilio/lokerin-backend](https://github.com/dikaprilio/lokerin-backend).

Live: [lokerin.site](https://lokerin.site) (public pages) and [app.lokerin.site](https://app.lokerin.site) (the app).

## Tech stack

- Next.js 16 (App Router) with Cache Components and partial prefetching, React 19, TypeScript
- Tailwind CSS v4 with the "Garis Kota" tokens in `src/app/globals.css` (see `docs/design-brief.md`)
- `motion` for transitions and drawers, Lenis for smooth scrolling on the landing page, `mapbox-gl` for Peta
- Fonts: Plus Jakarta Sans, JetBrains Mono and Silkscreen via `next/font/google`; CMU Serif for the CV, in `public/fonts/cmu`
- A service worker (`public/sw.js`) for offline pages and Web Push
- Backend (separate repo): Fastify with Mastra agents, Postgres with PostGIS and pgvector, voice calls through OpenAI `gpt-live-1` over WebRTC, live updates over Server-Sent Events

## Setup and run

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
npm run lint
npm run build
```

The build downloads fonts from Google Fonts, so it needs network access.

Without `NEXT_PUBLIC_API_URL` the app runs on the sample data in `src/lib/data.ts` (Pak Darto and 54 made-up jobs around Banyumas). On wider screens the app header says so. Ngobrol then plays a scripted demo, and screens that only make sense with an account (Lamaranku, Pelamar, CV lamaran) say they need the server.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit any `.env*` file other than `.env.example`.

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_API_URL` | Address of lokerin-backend, for example `http://localhost:8080` or `https://api.lokerin.site`. Empty means sample data. The backend must list the frontend origin in its `FRONTEND_ORIGINS`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (Web application). It must match one of the backend's `GOOGLE_CLIENT_IDS`. Empty means the Google button signs in to a demo account. |

The Mapbox token for Peta comes from the backend (`GET /peta/kunci`) as a short-lived read-only token, so the frontend needs no Mapbox variable.

## Project structure

```
src/app/                 routes
  page.tsx               landing page
  masuk/, mulai/         sign-in and onboarding
  app/                   the app: Beranda, Peta, Ngobrol, Lamaranku, Profil, Kartu Kerja,
                         Pasang, Pelamar, Verifikasi, lowongan/[id], cv/[id]
  kartu/[id]/            public Kartu Kerja, opened from its QR code
  desain/                Garis Kota design system
  privasi/, ketentuan/   privacy and terms
src/components/          one folder per area (app, ngobrol, pencari, pemberi, cv, kota, landing,
                         lapis for drawers and dialogs, ui for primitives, icons, pwa)
src/lib/api/             API client, session, useApi cache, live events, response types
src/lib/data.ts          sample data used without the API
docs/                    design brief
```

Pages meant for one role (Lamaranku and Kartu Kerja for job seekers; Pasang, Pelamar and Verifikasi for employers) check the role in the browser with `HanyaUntuk`.

## Deployment

Vercel builds every branch as a preview on `*.vercel.app` and deploys `main` to production. `lokerin.site` serves the public pages; sign-in and `/app` redirect to `app.lokerin.site`, because the session is stored per origin (see `next.config.ts`).

Vercel's Hobby plan only builds commits by the project owner. When someone else pushes to `main`, the `Redeploy on Vercel` workflow (`.github/workflows/redeploy.yml`) adds an empty commit as the owner so the latest `main` still deploys.

The backend runs on its own VPS behind `api.lokerin.site`; its README covers deployment.

## Not finished yet

- Business verification and ratings are simulated in the browser. The backend has no routes for document upload, review or ratings yet.

## Team

- Alice ([@al-dioooo](https://github.com/al-dioooo))
- Dika ([@dikaprilio](https://github.com/dikaprilio))

## Credits

UI icons are from [Tabler Icons](https://tabler.io/icons) (MIT), vendored in `src/components/icons/tabler.tsx`. CMU Serif is under the SIL Open Font License (`public/fonts/cmu/OFL.txt`). The isometric town, the job flyer pole, the work tool illustrations and the 14 job category icons are drawn for Lokerin.
