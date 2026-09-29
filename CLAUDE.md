@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 16 App Router frontend (B7A7) for the sibling `../courier-backend` Express API (see its CLAUDE.md for backend rules). The backend is the source of truth for business rules, fees and authorization; the frontend mirrors its types and validation.

## Commands

```bash
npm run dev      # http://localhost:3000 (backend must run on :5000 — `cd ../courier-backend && npm run dev`)
npm run build    # production build; also type-checks
npm run lint     # biome check . && eslint — must pass with zero errors
npm run lint:fix # biome check --write . (format + organize imports + safe fixes), then eslint
npm run format   # biome format --write .
npx tsc --noEmit # type-check only
npx next typegen # regenerate route types (PageProps/LayoutProps) after adding/removing routes
npx shadcn@latest add <component>   # UI primitives into src/components/ui
```

No test runner is set up yet.

## Tooling

**Biome is the formatter and main linter.** It uses the same style as the backend: 2 spaces, 100-character lines, double quotes, semicolons, and sorted imports. `biome.json` also enables Biome's `react` and `next` rule sets and Tailwind v4 CSS parsing. Suppress a rule with `// biome-ignore lint/<group>/<rule>: <reason>`.

**ESLint (`eslint.config.mjs`) runs only the rules Biome lacks:**
- `eslint-plugin-react-hooks` v7, which carries the **React Compiler** rules (`set-state-in-effect`, `refs`, `purity`, …)
- `@next/next` core-web-vitals

`globals` must stay in that config. Some `@next/next` rules only fire on known globals such as `window`.

**React Compiler is on** (`reactCompiler: true` + `babel-plugin-react-compiler`).
- It memoizes components automatically, so don't add `useMemo`, `useCallback` or `React.memo` for performance.
- A React Compiler ESLint error means the compiler will skip that component. Fix the code rather than disabling the rule.
- The compiler makes builds slower (~13 s instead of ~7 s).

**After `npx shadcn add`, run `npm run format`.** Generated files arrive in shadcn's own style.

## Next 16 differences that matter here

- Route protection lives in `src/proxy.ts` (the `middleware` convention is deprecated/renamed).
- `error.tsx` receives `retry` (not `reset`).
- `params` / `searchParams` are Promises; use the global `PageProps<"/route">` / `LayoutProps` helpers.
- Client components calling `useSearchParams` (e.g. anything using `usePagination`) must render inside `<Suspense>` or the build fails.
- Consult `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Architecture

**API base URL.**
- **`next dev`:** the client calls same-origin `/api/v1/*`, and `rewrites()` in `next.config.ts` forwards to `NEXT_PUBLIC_API_BASE_URL`. There's no CORS locally, and LAN IPs and phones work.
- **Production:** calls `NEXT_PUBLIC_API_BASE_URL` directly, which needs the frontend origin in the backend's `CLIENT_URL`.
- The switch lives in `API_BASE_URL`, `src/config/api.config.ts`.
- Don't add an `app/api/v1` route; it would clash with the dev forwarding.

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

## SEO

Don't add react-helmet. SEO comes from the Next.js Metadata API.

- **Public pages** export `metadata = pageMetadata({ title, description, path })`. Setting `path` gives the page its canonical URL and `og:url`.
- **Merging is shallow.** A page that sets `openGraph` replaces the layout's whole object, so always go through `pageMetadata` or spread `baseOpenGraph`.
- **No canonical in the root layout.** Every page would inherit it and point at `/`.
- **The social image is the `/og` route handler (`app/og/route.tsx`), not the `opengraph-image` file convention.** The file-based image disappeared on pages that set their own `openGraph`, and it also suppressed the image those pages listed in config.
- **Private routes are `noindex`:** the `(dashboard)` and `(payment)` layouts set it, and tracking pages pass `noIndex: true`.
- **`robots.txt` disallows only the dashboards.** A disallowed URL can't be crawled, so its `noindex` tag would never be seen.
- **New public routes** go in `app/sitemap.ts`.
- **`NEXT_PUBLIC_SITE_URL`** must be the production domain when deployed. Absolute URLs are built from it.

## Conventions

- There is deliberately **no route-level `loading.tsx`**. Without one, Next keeps the current page visible until the next one is ready, which feels like an SPA. A `loading.tsx` shows a full-screen skeleton whenever you switch route groups; at the root it also hides the Navbar. Put loading states inside components instead: React Query `isLoading` with a `Skeleton`, or a `<Suspense>` around components that use `useSearchParams`.

- UI comes from shadcn/ui on the Radix base with the Nova preset. `cn` comes from shadcn's `cn` package.
- In feature code, use the wrappers rather than raw shadcn primitives:
  - Every button in the app is an `AppButton`, and `components/ui/*` is only imported by the wrappers. `AppButton` handles `loading` and icons. With `asChild`, pass the icons inside the child.
  - `AppDialog` builds a dialog from props. `ConfirmDialog` takes an `onConfirm` that returns a promise, e.g. `mutateAsync`, and stays open if it rejects.
  - `shared/form` has `AppInput`, `AppTextarea`, `AppSelect` and `AppField` (the label/description/error frame). `FormInput`, `FormTextarea` and `FormSelect` are the same fields bound to react-hook-form: pass `control` and `name`.
  - These are built on shadcn's `field` components, because shadcn no longer ships a `form` component.
- Use zod 4 APIs (`z.email()`, `z.url()`). zod is pinned to v4 in `package.json`, because the shadcn dependency tree otherwise resolves v3.
- Scaffolded dashboard pages render `<ComingSoon endpoint=…>`. Replace that with the real feature, keeping `PageHeader` at the top.
