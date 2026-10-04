# SwiftParcel — Courier & Logistics Frontend

The web client for a courier platform: customers book and pay for parcels, couriers deliver them, and admins run the hub network. It talks to a separate Express/PostgreSQL API ([Courier-Logistics-backend](https://github.com/Souad5/Courier-Logistics-backend)), which owns every business rule — fees, status transitions and permissions. This app mirrors those rules for display; it never decides them.

**Live:** https://courier-logistics-frontend-eight.vercel.app

## What each role can do

**Anyone (no account)**
- Track a parcel by tracking number and see its full status history and delivery photo.
- Estimate a delivery fee from weight and the pickup and delivery hubs.
- Browse the hub coverage list, pricing table, services and FAQ.

**Customer**
- Book a parcel in four steps, with a live fee estimate while filling in the form.
- Pay by card through Stripe Checkout.
- Follow their parcels and payments, with search, status filters and sorting.

**Courier**
- See assigned parcels, update their status and upload a proof-of-delivery photo.
- Go on or off duty, and see earnings from delivered parcels.

**Admin**
- Overview with revenue and shipment charts (7, 30, 90 or 365 days).
- Manage every parcel: assign couriers, update status, filter by status, type and hub.
- Manage users and their roles, and the hubs and zones.
- Read the audit log, searchable by actor, email, IP, entity ID or action.

The interface is available in English and Bangla.

## Tech stack

- **Next.js 16** (App Router) with **React 19**, TypeScript and the React Compiler
- **Tailwind CSS v4**, shadcn/ui on Radix, lucide icons, Framer Motion
- **TanStack Query** for server state, **Zustand** for the signed-in user and UI state
- **React Hook Form** + **Zod 4** for forms, mirroring the backend's validation
- **Recharts** for the admin charts
- **Biome** for formatting and linting, plus ESLint for the React Compiler and Next.js rules

## Running it locally

You need Node.js 20.9 or newer and a running backend. The backend lives in a sibling folder:

```bash
# Backend (needs its own .env — see that repo)
cd ../Courier-Logistics-backend
npm install
npm run seed     # once: creates the demo accounts and sample hubs/parcels
npm run dev      # http://localhost:5000

# Frontend
cd ../Courier-Logistics-frontend
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3003
```

The dev server runs on **port 3003**. During development the browser only ever calls the frontend's own `/api/v1/*`, and `next.config.ts` forwards those requests to the backend. That means you can open the app from another device on your network (a phone, say) without touching the backend's CORS settings.

### Demo accounts

The login page has one-click buttons for each role. They only work against a seeded database. All of them use the password `Password@123`.

| Role     | Email                   | Lands on    |
| -------- | ----------------------- | ----------- |
| Admin    | `admin@courier.com`     | `/admin`    |
| Customer | `customer1@courier.com` | `/customer` |
| Courier  | `courier1@courier.com`  | `/courier`  |

### Environment variables

All three are public (they end up in the browser bundle) and are validated in `src/env.ts`. They're baked in at build time, so changing one means rebuilding.

| Variable                             | Example                        | Used for |
| ------------------------------------ | ------------------------------ | -------- |
| `NEXT_PUBLIC_API_BASE_URL`           | `http://localhost:5000/api/v1` | The backend API. |
| `NEXT_PUBLIC_SITE_URL`               | `http://localhost:3003`        | Canonical links, social previews, `sitemap.xml` and `robots.txt`. Set it to the real domain in production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…`                    | Optional. Payments use a Stripe Checkout redirect created by the backend, so this isn't needed today. |

## Scripts

| Command            | What it does |
| ------------------ | ------------ |
| `npm run dev`      | Development server on port 3003 |
| `npm run build`    | Production build (also type-checks) |
| `npm start`        | Serve the production build |
| `npm run lint`     | Biome, then ESLint — both must pass |
| `npm run lint:fix` | Apply Biome's fixes and formatting, then run ESLint |
| `npm run format`   | Format with Biome |

There is no automated test suite in this repo. Before pushing, run `npm run lint && npm run build`.

## How it fits together

**API calls.** Every request goes through `apiClient` (`src/lib/api-client.ts`), using paths from `ENDPOINTS` (`src/config/api.config.ts`). It unwraps the backend's `{ success, message, meta, data }` envelope and throws an `ApiClientError` on failure. Components never call `fetch` directly; they use the React Query hooks in `src/hooks/`, keyed by `src/lib/query-keys.ts`.

**Authentication.** Logging in returns an access token and a refresh token, which are stored as cookies. When a request comes back `401`, the client refreshes the token once and retries. If the refresh fails, it signs the user out and sends them to `/login`. Refreshing is deliberately single-flight, because the backend rate-limits its auth endpoints to 20 requests per 15 minutes.

**Route protection.** `src/proxy.ts` (Next 16's replacement for `middleware.ts`) reads the role from the access-token cookie and keeps each role inside its own area: `/admin`, `/customer` or `/courier`. It only reads the token; the backend verifies it on every request.

**Lists and filters.** Pagination, search, filters and sort order live in the URL (`usePagination`). A filtered view can be bookmarked or shared, and survives a reload. Only filters the backend supports are offered.

**Languages.** English and Bangla dictionaries live in `src/i18n/dictionaries/`. The chosen language is kept in a `lang` cookie and read on the server, so pages render in the right language from the first byte. The Bangla dictionary is typed against the English one, so a missing translation is a build error.

**Fees.** The pricing page, the fee calculator and the booking form all show estimates using `estimateFee()` in `src/config/content.ts`. It's a copy of the backend's formula (base fee + weight × rate + a surcharge for each hub's zone). The backend always calculates the amount that's actually charged.

## Project layout

```text
src/
├── app/            Routes, split into (public), (auth), (dashboard) and (payment) groups
├── components/
│   ├── modules/    Feature components, one folder per area (parcels, payments, admin, …)
│   ├── shared/     Navbar, DataTable, filters, dialogs and other cross-cutting pieces
│   └── ui/         shadcn/ui primitives
├── config/         API endpoints, navigation, pricing and marketing copy
├── hooks/          React Query hooks, one per backend area
├── i18n/           English and Bangla dictionaries and formatters
├── lib/            API client, auth cookies, SEO helpers
├── store/          Zustand stores
├── types/          Types and enums mirroring the backend
└── proxy.ts        Role-based route guard
```

## Deployment

The app is deployed on Vercel, and the project is connected to this GitHub repository. Every push to `main` deploys to production; other branches get a preview URL.

In production the browser calls the backend directly instead of going through the dev proxy. Two settings have to agree:

- `NEXT_PUBLIC_API_BASE_URL` on this project points at the backend.
- The backend's `CLIENT_URL` (a comma-separated list) includes this site's URL. It controls CORS, and also where Stripe is allowed to send customers back after paying.

If you add a custom domain, add it to the backend's `CLIENT_URL` and update `NEXT_PUBLIC_SITE_URL` here.

## Known limitations

These come from the backend API as it stands today:

- There's no endpoint that lists a customer's payments. The Payments page reads the payment attached to each of their parcels instead.
- There's no courier earnings endpoint. Earnings are added up from the courier's delivered parcels.
- The contact form isn't sent anywhere yet; it validates and confirms in the browser only.

## Photo credits

Photos on the public pages are from [Unsplash](https://unsplash.com/license). Each file's source is listed in `src/assets/landing/CREDITS.md`.
