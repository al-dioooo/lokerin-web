# Lokerin

Lokerin is a voice-first job board for informal work in Banyumas, Central Java. Workers find nearby jobs by talking instead of filling in forms, and small employers (warung, bengkel, UMKM, households) post jobs after a visible verification check. Deals happen outside the platform over WhatsApp.

Built for ITASE 7.0 Web Development (ITASEFEST 2026), SDG 8. Product spec: [lokerin-docs/docs/prd.md](https://github.com/al-dioooo/lokerin-docs/blob/main/docs/prd.md).

Live URL: not deployed yet.

## Tech stack

- Next.js (App Router) and Tailwind CSS v4, hosted on Vercel
- Convex for the database, realtime queries, vector search and file storage (planned)
- OpenAI Realtime API over WebRTC for voice calls, with short-lived tokens issued by a Convex HTTP action (planned)
- Fonts: Plus Jakarta Sans and JetBrains Mono via `next/font/google`

## Setup and run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

The Garis Kota design system lives at `/desain`; the hero illustration is `public/hero-kota.png`.

The pages are still a preview. "Bacakan" reads text aloud with the browser's `speechSynthesis` in Indonesian. The talk, apply and post-job buttons only show a notice; they don't record audio or send data yet.

The build downloads both fonts from Google Fonts, so it needs network access.

## Environment variables

None are needed yet. When Convex and voice land, copy `.env.example` to `.env.local` and fill it in. Never commit `.env*` files other than `.env.example`.

## Project structure

```
src/app/            routes: / (landing) and /desain (design system)
src/components/
  brand/            logo mark and wordmark
  icons/            14 job category icons and UI icons
  ui/               primitives: buttons, countdown, job card, badges
docs/               design brief and decision notes
```

## Deployment

Not set up yet. The plan is Vercel preview builds from `main`, with production following a `release` branch.

## Team

To be filled in.

## Credits

UI icons are from [Tabler Icons](https://tabler.io/icons) (MIT), vendored as local components in `src/components/icons/tabler.tsx`. The isometric town and the 14 job category icons are drawn for Lokerin.
