# Project Overview

ATS (Applicant Tracking System) dashboard sederhana berbasis Next.js App Router. Fokus project ini adalah UI dashboard + data mock (tanpa backend database), dengan proteksi route berbasis cookie.

## Teknologi

- **Next.js 16 (App Router)**: routing berbasis folder di `src/app/`.
- **React 19 + TypeScript**: komponen UI dan type-safety.
- **Tailwind CSS v4**: styling via utility class, token dasar ada di `src/app/globals.css`.
- **Zustand (+ persist)**: state client-side untuk **Jobs**, **Applications/Pipeline**, dan **Activity**.
- **dnd-kit**: drag & drop untuk kanban pipeline.
- **react-hook-form + zod**: validasi form (login + form job) dengan `@hookform/resolvers`.
- **lucide-react**: icon set.
- **ESLint (eslint-config-next)**: linting.

## Struktur Project

### Root

- `package.json` — dependencies dan scripts (`dev`, `build`, `start`, `lint`).
- `next.config.ts` — konfigurasi Next.js.
- `tsconfig.json` — konfigurasi TypeScript.
- `eslint.config.mjs` — konfigurasi ESLint.
- `postcss.config.mjs` — konfigurasi PostCSS (Tailwind v4 via `@tailwindcss/postcss`).

### Source (`src/`)

- `src/app/` — **App Router** (routes, layouts, API routes).
- `src/components/` — komponen UI (layout + UI primitives).
- `src/lib/` — helper dan data mock.
- `src/stores/` — Zustand store.
- `src/proxy.ts` — **route guard**/redirect berbasis cookie (proxy/middleware style).

## Routing (App Router)

Routes utama berada di `src/app/`:

- `src/app/(auth)/login/` — halaman login.
- `src/app/(app)/dashboard/` — dashboard utama.
- `src/app/(app)/jobs/` — manajemen job posting (list + modal add/edit/view/delete).
- `src/app/(app)/pipeline/` — kandidat pipeline (kanban + DnD).

Entry root:

- `src/app/page.tsx` melakukan redirect ke `/dashboard` atau `/login` berdasarkan cookie auth.

API routes:

- `src/app/api/auth/login/route.ts` — set cookie auth.
- `src/app/api/auth/logout/route.ts` — clear cookie auth.

## Auth & Proteksi Route (Dummy)

- Cookie name disimpan di `src/lib/auth.ts` (`AUTH_COOKIE_NAME = "ats_auth"`).
- Login mem-validasi kredensial dummy (`DUMMY_CREDENTIALS`) dan menyetel cookie via API.
- Proteksi route dilakukan di `src/proxy.ts`:
  - Halaman publik: `/login`, `/api/auth/*`.
  - Halaman lain butuh cookie auth.
  - Request ke `/` diarahkan ke `/dashboard` (jika authed) atau `/login`.

## Data & State (Mock)

- Data awal ada di `src/lib/mock-data.ts`:
  - `INITIAL_JOBS`, `INITIAL_APPLICATIONS`, `INITIAL_ACTIVITY`.
- Store utama ada di `src/stores/ats-store.ts`:
  - `jobs`, `applications`, `activity`.
  - actions: `addJob`, `updateJob`, `deleteJob`, `moveApplication`.
  - persist key: `ats-store` (local storage).

## UI Components

- Layout:
  - `src/components/layout/app-shell.tsx` — wrapper halaman app (sidebar + topbar).
  - `src/components/layout/sidebar.tsx` — sidebar nav (item dari `nav-items.ts`).
  - `src/components/layout/topbar.tsx` — topbar (menu mobile, dll).
- UI primitives:
  - `src/components/ui/*` — `Button`, `Card`, `Dialog`, `Input`, dsb.

## Menjalankan Project

- Development: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start production: `npm run start`
