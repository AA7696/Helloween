# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**HELLOWEEN** — a full-stack **Next.js (App Router)** energy-drink storefront: public catalog + cart/checkout (Razorpay + COD) and an admin dashboard for products, orders, customers, and contact inquiries. `spec.md` is the original product/design spec (kept for reference; the app has since diverged — News & Sustainability were removed, brand renamed to Helloween).

> History: this began as a MERN app (separate `client/` Vite React + `server/` Express). It was migrated **in place** to a single full-stack Next.js app. There is no separate backend and no `client/`/`server/` folders anymore.

## Commands

```bash
npm run dev      # next dev on port 3000 (app + API together)
npm run build    # production build
npm start        # serve the production build (port 3000)
npm run lint     # next lint
npm run seed     # wipe + reseed MongoDB (admin user + 16 products); prints admin creds
```

`npm run seed` ([scripts/seed.mjs](scripts/seed.mjs)) loads `.env.local` itself and uses the catalog in [src/lib/seedData.js](src/lib/seedData.js).

## Architecture

### Full-stack Next.js, MongoDB only
API lives in **App Router route handlers** under [src/app/api/](src/app/api/) (`route.js` files), not a separate server. **MongoDB is required** — there is no mock-DB fallback. [src/lib/db.js](src/lib/db.js) holds a cached Mongoose connection singleton (`connectDB()`); every handler calls it before querying. Connection string is `MONGO_URI` in `.env.local`.

Mongoose models are in [src/lib/models/](src/lib/models/) and use the `mongoose.models.X || mongoose.model(...)` guard (required so Next hot-reload doesn't recompile models).

### Auth = httpOnly cookie sessions (not localStorage)
- [src/lib/auth.js](src/lib/auth.js): `signToken`, `setAuthCookie`/`clearAuthCookie` (cookie name `hw_token`, httpOnly), and `getCurrentUser()` which reads the cookie via `next/headers`, verifies the JWT, and returns the Mongoose user. `publicUser()` strips sensitive fields.
- Route handlers call `getCurrentUser()` and check `role` inline for authorization. **Pattern:** public GET; writes require an authenticated user; admin-only endpoints additionally require `user.role === 'admin'` (returns 401/403). All product writes, order admin routes, `/api/auth/users`, and inquiry management are admin-guarded.
- Client never sees the token. [src/context/AuthContext.jsx](src/context/AuthContext.jsx) hydrates from `GET /api/auth/me` on mount; `login({email,password})` (customer) or `login({username,password})` (admin) and `register(...)` set the cookie server-side. Same-origin `fetch` sends the cookie automatically — **do not add Authorization headers.**
- **Roles**: `User.role` is `'admin' | 'customer'`. Customers register/log in by email; the seeded admin (`admin`/`helladmin123`) logs in by username. `email`/`username` are `unique, sparse`.

### Orders & payments
- [src/lib/orders.js](src/lib/orders.js): `buildOrderItems` recomputes line items + totals **server-side from DB prices** — the client only sends `{ productId, qty }`. `getRazorpay()` lazily builds the client; `verifyRazorpaySignature` does HMAC-SHA256. **If `RAZORPAY_KEY_ID`/`SECRET` are absent, a mock fallback activates** (`/api/orders/razorpay` returns `{ mock: true }`, signature auto-passes) so checkout works keyless; [src/app/checkout/page.jsx](src/app/checkout/page.jsx) detects `mock` and skips the hosted widget. Real keys are currently set in `.env.local`.
- Order flow: `POST /api/orders/razorpay` (create RZP order) → hosted widget or mock → `POST /api/orders` (verify + persist). COD skips straight to `POST /api/orders`. `GET /api/orders/myorders` (customer), `GET /api/orders` (admin), `PUT /api/orders/:id` (admin status; COD→Delivered auto-marks Paid).

### Frontend (App Router, client components)
- [src/app/layout.jsx](src/app/layout.jsx) (server) renders fonts + `<Providers>` (client wrapper for `AuthProvider`+`CartProvider`) + `Navbar`/`Footer`. Pages: `/`, `/products`, `/contact`, `/login`, `/register`, `/cart`, `/checkout`, `/orders`, `/admin`.
- Interactive pages are `'use client'`. Navigation uses `next/link` (`href`) and `next/navigation` (`useRouter`/`usePathname`/`useSearchParams`). **Pages using `useSearchParams` must be wrapped in `<Suspense>`** (see login/register/orders) or the build fails.
- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) guards `/checkout` & `/orders` (client redirect to `/login?redirect=...`). `/admin` self-guards: it shows a login form when logged-out and `router.replace('/')`s non-admins. The admin entry point is intentionally hidden from the navbar.
- Cart is client state in [src/context/CartContext.jsx](src/context/CartContext.jsx), persisted to `localStorage` (`hell_cart`).

### Styling
Design system + CSS variables (dark/neon-red/gold palette) in [src/app/globals.css](src/app/globals.css). Components carry **inline `<style>{`...`}</style>` template-literal CSS** rather than CSS modules — follow that convention. Icons from `lucide-react`.

## Config & conventions

- `.env.local`: `MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`/`ADMIN_PASSWORD`, `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET`.
- Product `category` enum: `'Energy Drink'`, `'Functional Drink'`, `'Tonic Water'`. Inquiry `status`: `'Unread' | 'Read' | 'Replied'`. Order `orderStatus`: `Processing | Shipped | Delivered | Cancelled`.
- Catalog single source of truth: [src/lib/seedData.js](src/lib/seedData.js) (`defaultProducts`). Edit there, then `npm run seed`.
- Product images live in [public/Images/](public/Images/), referenced by root-relative URL (`/Images/<file>`). Filenames carry double extensions (e.g. `.png.png`). Brand logo is the transparent `Helloween-removebg-preview.png`.
- `next.config.mjs` lists `mongoose`/`bcryptjs` under `experimental.serverComponentsExternalPackages`. ESLint relaxes `no-img-element` / `no-unescaped-entities` (we use `<img>` for transparent packshots intentionally).
- `<img>` is used (not `next/image`) for the transparent can packshots and the logo.
