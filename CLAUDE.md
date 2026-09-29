@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 16 App Router frontend (B7A7) for the sibling `../courier-backend` Express API (see its CLAUDE.md for backend rules). The backend is the source of truth for business rules, fees and authorization; the frontend mirrors its types and validation.

## Commands

```bash
npm run dev      # http://localhost:3000 (backend must run on :5000 — `cd ../courier-backend && npm run dev`)
npm run build    # production build; also type-checks
npm run lint     # eslint (eslint-config-next, includes React Compiler hook rules)
npx tsc --noEmit # type-check only
npx next typegen # regenerate route types (PageProps/LayoutProps) after adding/removing routes
npx shadcn@latest add <component>   # UI primitives into src/components/ui
```

No test runner is set up yet.

## Next 16 differences that matter here

- Route protection lives in `src/proxy.ts` (the `middleware` convention is deprecated/renamed).
- `error.tsx` receives `retry` (not `reset`).
- `params` / `searchParams` are Promises; use the global `PageProps<"/route">` / `LayoutProps` helpers.
- Client components calling `useSearchParams` (e.g. anything using `usePagination`) must render inside `<Suspense>` or the build fails.
- Consult `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Architecture

**API layer.** All requests go through `apiClient` in `src/lib/api-client.ts`, using paths from `ENDPOINTS` in `src/config/api.config.ts`:
- It unwraps the backend envelope `{ success, message, meta?, data }` into `{ message, data, meta }`, and throws `ApiClientError { status, message, errors }` on failure. Use `getErrorMessage(error)` for toasts.
- List payloads are wrapped in a key: `data.parcels`, `data.users`, `data.hubs`, `data.logs`, `data.stats`.
- Prisma Decimals (`fee`, `amount`) arrive as strings; `formatCurrency` accepts them directly.

**Data fetching.** Use React Query hooks in `src/hooks/use*.ts`, with keys from `src/lib/query-keys.ts`. Mutations toast their results and invalidate by prefix (e.g. `queryKeys.parcels.all`). Add new endpoints to `ENDPOINTS`, the types, and a hook — don't call `fetch` from components.

**Auth flow.**
- Login and register return `{ user, tokens }`. `useAuthStore.setSession` writes the tokens to JS-readable cookies (`src/lib/auth-storage.ts`) and keeps only `user` in the zustand store, which is persisted to localStorage.
- The access cookie deliberately outlives its JWT. `proxy.ts` decodes the role from it without verifying (the secret stays on the backend), and treats an expired token as valid while a `refreshToken` cookie exists.
- On a 401, `apiClient` makes one single-flight refresh via `/auth/refresh-token` and retries. If that fails, it clears the session and hard-redirects to `/login?redirect=`. Refresh must stay single-flight: the backend's auth rate limit is 20 requests per 15 minutes, shared by login, register, refresh and logout.
- `AuthProvider` refreshes `user` from `GET /users/me`.

**Hydration.** Both persisted zustand stores use `skipHydration`. `StoreHydrator` (in `RootProvider`) rehydrates them after mount and then sets `useAuthStore.hydrated`. Never read cookies or localStorage during render unless you gate it on `hydrated`, or you'll get hydration mismatches.

**Roles and routing.**
- `ROLE_HOME` maps `ADMIN`, `CUSTOMER` and `COURIER` to `/admin`, `/customer` and `/courier`. `proxy.ts` inlines its own copy of this map, so keep the two in sync.
- Sidebar links for each role live in `dashboardNav` (`src/config/site.ts`).
- The demo accounts for 1-click login (`demoAccounts`, password `Password@123`) come from the backend seed and only work against a seeded DB.

**Payments.** `PayNowButton` sends `POST /payments/initiate` with `successUrl=${origin}/success?session_id={CHECKOUT_SESSION_ID}` and `cancelUrl=${origin}/cancel`, then redirects to the returned `checkoutUrl`. The backend Stripe webhook marks the payment PAID; the `/success` page only invalidates cached parcel queries.

**Mirrored backend rules.** Keep these in sync when the backend changes:
- `ALLOWED_TRANSITIONS` in `src/types/enums.ts` mirrors `parcel.service.ts`.
- `PRICING` in `src/config/content.ts` mirrors `parcel.constant.ts`.
- The form zod schemas mirror the backend `*.validation.ts` files.

**Known backend gaps:**
- There is no "list my payments" endpoint. Derive payments from `parcel.payment` on `/parcels/my-parcels`.
- There is no courier earnings endpoint. Derive earnings from DELIVERED parcels.
- There is no contact endpoint. The contact form only acknowledges client-side.

## Conventions

- UI comes from shadcn/ui on the Radix base with the Nova preset. `cn` comes from shadcn's `cn` package.
- In feature code, use the wrappers rather than raw shadcn primitives:
  - `AppButton` handles `loading` and icons. With `asChild`, pass the icons inside the child.
  - `AppDialog` builds a dialog from props. `ConfirmDialog` takes an `onConfirm` that returns a promise, e.g. `mutateAsync`, and stays open if it rejects.
  - `shared/form` has `AppInput`, `AppTextarea`, `AppSelect` and `AppField` (the label/description/error frame). `FormInput`, `FormTextarea` and `FormSelect` are the same fields bound to react-hook-form: pass `control` and `name`.
  - These are built on shadcn's `field` components, because shadcn no longer ships a `form` component.
- Use zod 4 APIs (`z.email()`, `z.url()`). zod is pinned to v4 in `package.json`, because the shadcn dependency tree otherwise resolves v3.
- Scaffolded dashboard pages render `<ComingSoon endpoint=…>`. Replace that with the real feature, keeping `PageHeader` at the top.
