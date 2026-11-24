# TeddyPups U.A.E. — Full-Stack Clone

A responsive, test-driven Next.js (App Router + TypeScript + Tailwind CSS v4) clone of [TeddyPups U.A.E.](https://puppy.instabizweb.com/), built as part of the Blutec AI Full Stack Developer Technical Round Assignment.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack, Static Site Generation + Route Handlers)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + custom CSS design tokens & keyframe animations (`Fraunces`, `Figtree`, `Shantell Sans` via `next/font/google`)
- **Validation:** Zod (`src/lib/enquiry.ts` + `POST /api/enquiries`)
- **Testing:** Vitest + React Testing Library + jsdom (TDD across data, API, and interactive UI components)

## Routes & Features
- `/` — 8-scene scrollytelling homepage (`HeroScene`, `MeetScene`, `PathsScene`, `ChatScene` with inline video playback, `PassportScene`, `DuskScene` with lightbox viewer, `NightScene`, `HomeScene`) + `PupCompanion` & `PawTrail`
- `/puppies` — Sketchbook-styled catalog of 15 available puppies with procedural SVG frames, URL-synced filters (`origin`, `collection`, `breed`, `gender`), and an "Already gone home" preview strip
- `/puppies/[slug]` — 42 statically generated puppy profile pages (15 available + 27 gone home) with photo/video gallery, full-screen `Lightbox`, health guarantees, and pre-filled enquiry form
- `/happy-families` — 64 polaroid family moments with full-screen keyboard-accessible `Lightbox`
- `/how-it-works` — Interactive "In Dubai" vs "Imported" journey switcher, premium promise stamps, and `#delivery` details
- `/faq` — Live search & accessible accordion board with `FAQPage` JSON-LD structured data
- `/contact` — Interactive "Dear TeddyPups" letter form wired to `POST /api/enquiries` with honeypot spam protection and sealing/posting animation
- `/gone-home` — 27 adopted puppies styled as vintage boarding tickets

## Local Development & Testing

```bash
npm install
npm test          # Run Vitest unit & component tests (56 tests across 14 files)
npm run build     # Production build & TypeScript check
npm run dev       # Start local dev server
```

## Project Structure
```text
src/
├── app/                # App Router pages & /api/enquiries route handler
├── components/         # Feature-grouped UI components + *.test.tsx specs
├── data/               # Structured JSON datasets (puppies, gone-home, family-photos, faqs, journeys)
├── lib/                # Domain logic, Zod validation, deterministic sketch generator, site config
└── styles/             # Scene, illustration, and keyframe animation styles
```
