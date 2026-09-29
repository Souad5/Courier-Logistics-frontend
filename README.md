# Courier & Logistics Platform — Frontend (B7A7)

Next.js 16 (App Router) + TypeScript frontend for the B7A6 `courier-backend` REST API. Three role-based dashboards (Admin, Customer, Courier), public marketing pages, public parcel tracking, Stripe Checkout payments, and a 1-click demo login.

## Stack

| Concern         | Library                                                       |
| --------------- | ------------------------------------------------------------- |
| Framework       | Next.js 16 App Router, React 19, TypeScript                   |
| Styling / UI    | Tailwind CSS v4, shadcn/ui (Radix, Nova preset), lucide-react |
| Motion / themes | framer-motion, next-themes                                    |
| Server state    | @tanstack/react-query (+ devtools in dev)                     |
| Client state    | zustand (auth user, sidebar)                                  |
| Forms           | react-hook-form + zod 4 (`@hookform/resolvers`)               |
| Charts          | recharts                                                      |
| Toasts          | sonner                                                        |
| Payments        | Stripe Checkout redirect (`@stripe/stripe-js` available)      |
| Auth helpers    | jose (JWT decode), js-cookie                                  |

## Getting started

```bash
# 1. Backend (sibling folder) — needs its own .env
cd ../courier-backend
npm install
npm run seed        # once: creates the demo accounts used by 1-click login
npm run dev         # http://localhost:5000

# 2. Frontend
cd ../frontend
npm install
cp .env.example .env.local   # defaults already point at localhost:5000
npm run dev                  # http://localhost:3000
```

The backend's CORS allows `CLIENT_URL` (default `http://localhost:3000`). If the frontend runs elsewhere, set `CLIENT_URL` in the backend `.env`.

### Environment variables

| Variable                             | Default                        | Purpose                                |
| ------------------------------------ | ------------------------------ | -------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`           | `http://localhost:5000/api/v1` | Backend base URL (validated in `src/env.ts`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | —                              | Only needed for future Stripe.js UI    |

## Demo accounts

The login page has one-click buttons for each role (all use `Password@123`, created by the backend seed):

| Role     | Email                   | Lands on    |
| -------- | ----------------------- | ----------- |
| Admin    | `admin@courier.com`     | `/admin`    |
| Customer | `customer1@courier.com` | `/customer` |
| Courier  | `courier1@courier.com`  | `/courier`  |

## Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Dev server with hot reload    |
| `npm run build` | Production build              |
| `npm start`     | Serve the production build    |
| `npm run lint`  | ESLint (`eslint-config-next`) |

## Routes

| Group         | Routes                                                                                      | Access         |
| ------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `(public)`    | `/`, `/about`, `/services`, `/pricing`, `/contact`, `/track/[trackingNumber]`               | Everyone       |
| `(auth)`      | `/login`, `/register`                                                                       | Logged-out     |
| `(dashboard)` | `/admin/*` (overview, parcels, users, hubs, audit-logs)                                     | `ADMIN`        |
|               | `/customer/*` (activity, parcels, parcels/new, payments, profile)                           | `CUSTOMER`     |
|               | `/courier/*` (tasks, earnings, availability)                                                | `COURIER`      |
| `(payment)`   | `/success`, `/cancel` (Stripe Checkout return URLs)                                         | Everyone       |

## Project structure

```text
src/
├── app/                 # Route groups: (public) (auth) (dashboard) (payment) + global loading/error/not-found
├── components/
│   ├── ui/              # shadcn primitives (generated — prefer re-adding over hand edits)
│   ├── shared/          # Navbar, Footer, Sidebar, DashboardShell, DataTable, StatCard, StatusBadge…
│   ├── modules/         # Domain components: auth (DemoLoginButtons), parcels, hubs, payments, admin
│   └── providers/       # RootProvider = Theme + React Query + StoreHydrator + Auth + Toaster
├── config/              # site.ts (nav, demo accounts), api.config.ts (ENDPOINTS, ROLE_HOME), content.ts
├── hooks/               # useAuth, useParcels, useHubs, useAdmin, usePagination, useDebounce
├── lib/                 # api-client, auth-storage, query-keys, stripe, utils
├── store/               # zustand: auth.store, ui.store
├── types/               # Enums, entities and API envelopes mirroring the backend
├── env.ts               # zod-validated public env
└── proxy.ts             # Role-based route guard (Next 16 name for middleware)
```
