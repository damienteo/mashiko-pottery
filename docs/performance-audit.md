# Performance audit

This is a walkthrough of how the site was measured, why public pages were slow, and what changed. The numbers are from one lab run, before and after the same Lighthouse command. They are not field data from real visitors. Lighthouse on a laptop is useful for catching megabyte mistakes. It is a poor way to judge a 50 ms difference.

The production build is Next.js 16.4.6 with Turbopack. Pages live under `src/app/[locale]` and are translated with next-intl (`ja` default, plus `en` and `zh`).

Live origin used for the before run: `https://mashiko-pottery.vercel.app`.

## 1. The three tools

### `next build`

```bash
npm run build
```

The route table at the end of the build is the first thing to read. Next.js 16 prints three kinds of route:

| Mark        | Meaning                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| `○` Static  | One HTML file, shared by every visitor.                                                               |
| `●` SSG     | Same idea, with a dynamic segment (`[locale]`, and later `[id]`) filled in by `generateStaticParams`. |
| `ƒ` Dynamic | Rendered on the server for every request.                                                             |

A dynamic page cannot be cached at the edge as a finished document. The live site's baseline response was:

```text
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-matched-path: /[locale]
```

After the i18n fix, locale catalog pages prerender (`●`). On Vercel a dynamic route is a serverless function. A static/ISR route is a file (or a revalidated file). Cold starts show up for the first kind and not the second.

### Bundle / images

There is no `@next/bundle-analyzer` script in this repo. Lighthouse's network table and `next/font` preload links were used instead. Cloudinary URLs now use a custom loader (`f_auto,q_auto,w_,c_limit`) so those bytes do not go through Vercel Image Optimization.

### Lighthouse

Mobile lab run, performance category only, simulated throttling.

```bash
lighthouse https://mashiko-pottery.vercel.app/ja \
  --only-categories=performance \
  --form-factor=mobile \
  --screenEmulation.mobile \
  --throttling-method=simulate \
  --output json --output html \
  --output-path /tmp/lh/ja-home \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
  --quiet
```

Pages measured:

- `/ja`, `/en`, `/zh` (home)
- `/ja/products`
- `/ja/products/1` (detail shell; the live API was returning 500 during this audit)
- `/ja/potters`
- `/ja/potters/1`

`/` redirects to `/ja`.

| Metric            | What it measures                  | Rough "good" line |
| ----------------- | --------------------------------- | ----------------- |
| Performance score | Weighted mix of the metrics below | 90–100            |
| FCP               | First Contentful Paint            | under 1.8 s       |
| LCP               | Largest Contentful Paint          | under 2.5 s       |
| TBT               | Total Blocking Time               | under 200 ms      |
| CLS               | Cumulative Layout Shift           | under 0.1         |
| Transfer          | `total-byte-weight`               | smaller is better |

`DATABASE_URL` and the Supabase public keys were present in the lab VM, but the Postgres hostname did not resolve (`ENOTFOUND`). Local `next start` against a warm database was therefore not measured. `npm run build` still completes: catalog helpers catch the missing database and emit empty lists.

## 2. What the baseline showed

### Every locale page was dynamic

`npm run build` on `main`:

```text
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/admin/...
├ ƒ /[locale]/login
├ ƒ /[locale]/potters
├ ƒ /[locale]/potters/[id]
├ ƒ /[locale]/products
├ ƒ /[locale]/products/[id]
├ ƒ /[locale]/profile
├ ƒ /[locale]/register/...
├ ƒ /[locale]/seller/...
└ ƒ /api/...
```

Nothing under `[locale]` was static. The pages do not call `cookies()` or `headers()` themselves. next-intl does. `getRequestConfig` awaited `requestLocale`, which is implemented by reading the `x-next-intl-locale` request header. Reading headers opts the route into dynamic rendering.

The proxy (`src/proxy.ts`) also called `supabase.auth.getUser()` on every HTML request. The login redirect that helper built was then discarded (the intl middleware ran on the original request), so the public catalog stayed reachable, but the extra round trip and cookie writes still sat on the hot path.

### Fonts

`src/app/[locale]/layout.tsx` loaded five Google fonts through `next/font` on every page: Inter, Playfair Display, Merriweather, Noto Sans JP, Noto Serif SC.

All five CSS variables were applied on `<html>`. Live `/ja` and `/en` both preloaded six woff2 files. English Lighthouse still downloaded Inter, Playfair, and Merriweather. Japanese and Chinese pages then fetched unicode-range slices on top.

Merriweather was only referenced by the `blockquote` rule in `globals.css`. There are no `<blockquote>` elements in the app.

`subsets: ['latin']` on the Noto families does not stop CJK slices from being generated. Chinese home transferred **1.95 MiB**, almost all of it font files. Japanese home was **1.41 MiB**. English home was **851 KiB**.

### Images and `public/`

`public/` was **31 MB**. `public/home/hero-banner.png` was **2.36 MB** (1536×1024). The live site already ran it through `next/image` (`w=750`, about 38 KB on the wire), so the PNG cost was mostly git weight and cold optimizer work. The hero used `fill` + `priority` with **no `sizes`**.

`public/potters/*.png` (about 7.8 MB) was not referenced. Several `public/pottery/*.png` files were not referenced either. Mocks still point at `vase1`, `planter1`, `mug1`, `bowl1`, `plate1`, and `pitcher1`, so those stayed.

`next-cloudinary` was in `package.json` with zero imports. Catalog images already go through `next/image` + `remotePatterns` for `res.cloudinary.com`, which spends Vercel optimization quota on files Cloudinary can transform itself.

Potter grids marked **every** card `priority`. The shipping-guarantee SVG (56 px) was also `priority`, so it competed with the LCP candidate.

### Public catalog was client-only

`/products` and `/potters` were `'use client'` pages that dispatched Redux thunks after hydration. Product and potter detail pages did the same, then waterfalled potter + related products. HTML for those routes was a loading shell.

`src/app/[locale]/products/[id]/metadata.ts` (and the other sibling `metadata.ts` files) were not wired into `page.tsx`, so App Router never used them. The unused product metadata helper fetched `${NEXT_PUBLIC_BASE_URL}/api/products/${id}` over HTTP.

The public API still lists drafts when `active` is omitted. That behaviour was left unchanged.

### JavaScript

The root layout wraps every page in Redux `StoreProvider` (admin, seller, orders, payouts slices included) plus `AuthLoader` (Supabase). That is still required for the navbar. Newsletter signup pulls `react-hook-form`, `@hookform/resolvers`, and `yup` onto the home graph. SWR is in `package.json` and unused.

`LanguageSelector` and `ClientAnalytics` call `useSearchParams`. Without a Suspense boundary, making the locale layout static fails the prerender.

### Baseline Lighthouse

Mobile, simulated, one run against production. Transfer is `total-byte-weight`.

| Page             | Score |   LCP |   CLS |    TBT |   FCP | Transfer |
| ---------------- | ----: | ----: | ----: | -----: | ----: | -------: |
| `/ja`            |    75 | 6.9 s |     0 | 124 ms | 1.3 s |  1.4 MiB |
| `/en`            |    84 | 4.5 s |     0 |  60 ms | 1.2 s |  851 KiB |
| `/zh`            |    84 | 4.5 s |     0 |  75 ms | 1.2 s |  1.9 MiB |
| `/ja/products`   |   100 | 1.2 s |     0 |  86 ms | 1.2 s |  1.0 MiB |
| `/ja/products/1` |    99 | 1.7 s |     0 |  63 ms | 1.7 s |  1.0 MiB |
| `/ja/potters`    |    99 | 1.6 s | 0.002 |  50 ms | 1.6 s |  996 KiB |
| `/ja/potters/1`  |    77 | 6.3 s |     0 |  80 ms | 1.2 s | 1013 KiB |

Home scores are LCP, not TBT. Japanese LCP is fonts plus a dynamic document. Chinese transfer is CJK slices. List/detail scores look high because the live `/api/products` and `/api/potters` handlers were 500 during the run, so those pages never downloaded catalog images.

## 3. What changed, and why

### Static / ISR catalog pages

`src/i18n/request.ts` reads the locale from `next/root-params` instead of the request header. `generateStaticParams` on the locale layout already listed `en`, `ja`, and `zh`.

Home, products, and potters now export `revalidate = 60` and load the first page of Prisma data on the server (`unstable_cache`, 60 s). Client components still own filters and pagination; they hydrate from the server payload and only hit `/api/*` when the visitor changes query state.

Product and potter detail `page.tsx` files do the same: direct Prisma (cached), not `NEXT_PUBLIC_BASE_URL`. `generateStaticParams` lists ids when the database is reachable. If it is not (this lab VM), the helpers return `[]` and the route stays `●` for on-demand ISR rather than failing the build.

Admin, seller, login, register, and profile stay `force-dynamic`. Those trees use `useSearchParams` and sessions.

### Proxy no longer talks to Supabase on public HTML

`updateSession` / `getUser()` run for every route that needs a session or cookie refresh: `/admin`, `/seller`, `/profile`, `/login`, and `/register` (locale prefix stripped). Unauthenticated visits to admin, seller, and profile redirect to `/{locale}/login`. Login and register still call `getUser()` so OTP/magic-link cookies refresh, but they are not redirected (that would loop). Public catalog pages skip the auth round trip so CDN HTML can stick.

### Fonts

- Merriweather is gone. Blockquotes, if any appear later, use Playfair.
- Inter and Playfair are variable fonts. Only the locale's body family is applied: Inter on English, Noto Sans JP (`weight: 'variable'`, `preload: false`) on Japanese, Noto Serif SC (same) on Chinese. Playfair stays for headings.
- English pages should not download Noto woff2 files. The language toggle still uses the browser CJK fallback for 「日本語」.

### Images and static files

- Hero is `public/home/hero-banner.webp` (about 114 KB on disk, `sizes="100vw"`, reserved `h-64 md:h-96`).
- Deleted unreferenced `public/potters/*.png` and unused pottery mock PNGs. `public/` is about **11 MB**.
- `SmartImage` sends Cloudinary URLs through `cloudinaryLoader`. Local files still use the default optimizer.
- Only the first potter card is `priority`. Shipping-guarantee SVG is not.

### Home is mostly RSC

Hero, featured, how-it-works, spotlights, shipping, and testimonials are server components. Newsletter signup is `next/dynamic` so form libraries are not in the first home chunk. Spotlights receive the first three potters from the server and reserve `aspect-square` + `bg-gray-100` so the grid does not collapse while images decode.

### Speed Insights

`@vercel/speed-insights` is in the locale layout. It stays quiet until Speed Insights is enabled on the Vercel project.

### Dependency cleanup

`next-cloudinary` was unused and was removed.

## 4. After, measured the same way

`npx tsc --noEmit`, `npm run lint` (0 errors; the six `react-hooks/exhaustive-deps` warnings were already on `main`), `npx prettier --check .`, and `npm run build` passed.

After `next build` (this VM has no database, so detail `[id]` params are empty and lists prerender empty):

```text
├   /[locale]
│ ├ ● /en
│ ├ ● /ja
│ └ ● /zh
├   /[locale]/potters
│ ├ ● /en/potters
│ ├ ● /ja/potters
│ └ ● /zh/potters
├ ● /[locale]/potters/[id]
├   /[locale]/products
│ ├ ● /en/products
│ ├ ● /ja/products
│ └ ● /zh/products
├ ● /[locale]/products/[id]
├ ƒ /[locale]/admin/...
├ ƒ /[locale]/login
├ ƒ /[locale]/profile
├ ƒ /[locale]/register/...
├ ƒ /[locale]/seller/...
└ ƒ /api/...
```

Lighthouse **after** is against the Vercel preview of this branch, same mobile/simulate command as section 1. Single runs vary.

| Page             |     Score |         LCP |         CLS |          TBT |         FCP |       Transfer |
| ---------------- | --------: | ----------: | ----------: | -----------: | ----------: | -------------: |
| `/ja`            |  75 → TBD | 6.9 s → TBD |     0 → TBD | 124 → TBD ms | 1.3 s → TBD |  1.4 MiB → TBD |
| `/en`            |  84 → TBD | 4.5 s → TBD |     0 → TBD |  60 → TBD ms | 1.2 s → TBD |  851 KiB → TBD |
| `/zh`            |  84 → TBD | 4.5 s → TBD |     0 → TBD |  75 → TBD ms | 1.2 s → TBD |  1.9 MiB → TBD |
| `/ja/products`   | 100 → TBD | 1.2 s → TBD |     0 → TBD |  86 → TBD ms | 1.2 s → TBD |  1.0 MiB → TBD |
| `/ja/products/1` |  99 → TBD | 1.7 s → TBD |     0 → TBD |  63 → TBD ms | 1.7 s → TBD |  1.0 MiB → TBD |
| `/ja/potters`    |  99 → TBD | 1.6 s → TBD | 0.002 → TBD |  50 → TBD ms | 1.6 s → TBD |  996 KiB → TBD |
| `/ja/potters/1`  |  77 → TBD | 6.3 s → TBD |     0 → TBD |  80 → TBD ms | 1.2 s → TBD | 1013 KiB → TBD |

The static-rendering win is the cache header (`s-maxage` / `x-nextjs-prerender`) more than this table. Re-measure LCP from Vercel Speed Insights after a few days of traffic if you want the field number.

## 5. Left undone, on purpose

**Subset Noto to the characters in the locale JSON.** Japanese and Chinese pages will still download unicode-range slices. A one-file subset would tofu any new kanji until rebuild.

**Split the Redux store.** Admin/seller/orders slices still register on every page because the navbar and `AuthLoader` sit in the locale layout. The heavy form/Lexical code is not imported on public routes.

**Remove Google Analytics.** `gtag/js` is about 89 KB (`id=undefined` when `NEXT_PUBLIC_GA_ID` is missing). That is product analytics, not this audit.

**Filter drafts on the public API.** All 63 products being drafts that the public list still returns is a separate product decision.

**SWR.** Still unused. Left in `package.json`.

**More than one Lighthouse run.** Medians of three would make TBT trustworthy. Font and static-rendering effects are large enough that one before run is enough to believe the diagnosis.

## 6. Repeating the after measurement

```bash
git switch <this branch>
npm ci   # or npm install if the lockfile and package.json disagree
npx tsc --noEmit
npm run lint
npx prettier --check .
npm run build
# Lighthouse against the Vercel preview URL, same flags as section 1
```

Expect `●` on `/en`, `/ja`, `/zh` and the catalog list routes, `Cache-Control` that is not `private, no-cache` on those URLs, no Noto woff2 on an English home document, and Cloudinary `<img>` URLs that contain `f_auto`.
