# Mashiko Pottery E-Commerce Platform

A multi-locale, multi-role e-commerce marketplace for handmade Mashiko pottery.  
Built with Next.js v15 (App Router) for customer-facing pages and an Express/TypeScript server for complex operations.

---

## 🏺 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Scripts](#scripts)
4. [Project Structure](#project-structure)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [Styling & Theming](#styling--theming)
7. [Fonts](#fonts)
8. [Authentication & Security](#authentication--security)
9. [State Management (Redux)](#state-management-redux)
10. [API & Data Layer](#api--data-layer)
11. [Testing](#testing)
12. [Linting & Formatting](#linting--formatting)
13. [Analytics & Monitoring](#analytics--monitoring)
14. [Deployment](#deployment)
15. [Roadmap & Next Steps](#roadmap--next-steps)
16. [Contributing](#contributing)
17. [License](#license)

---

## Features

- **Multi-Role**

  - **Consumers:** Browse, filter, cart, checkout, order history
  - **Admins:** Products/Order/Payout management, CSV/batch uploads, reporting
  - **Potters:** Inventory management, sales stats, profile updates, payout tracking

- **Multi-Locale**: English, 日本語, 简体中文
- **Internationalized Metadata** for SEO
- **Server-Side & Client-Side Routes**: Next.js Route Handlers for simple APIs; Express for heavy operations
- **Offline-First Product Intake**: Form data locally then batch-upload
- **Secure Authentication**: Sessions + JWT + OAuth (Google, Apple, LINE…)
- **Payment Gateways**: Stripe (JP), PayPal, WeChat Pay/Alipay
- **Headless CMS-Style Admin**: CRUD UIs with Role-Based Access Control
- **Theming & Fonts**: Tailwind v4 CSS-first theming, next/font Google fonts
- **Analytics**: Google Analytics 4 wrapper (cookieless mode supported)
- **CI/CD**: ESLint, Prettier, Husky, lint-staged
- **Testing**: Jest + Supertest, Cypress end-to-end

---

## Tech Stack

| Layer              | Framework / Library                                                   |
| ------------------ | --------------------------------------------------------------------- |
| Frontend           | Next.js 15 (App Router), React 19                                     |
| Styling            | Tailwind v4, PostCSS, CSS-First `@theme`                              |
| Fonts              | `next/font/google` (Inter, Playfair, Noto)                            |
| State Management   | Redux Toolkit, React-Redux                                            |
| i18n               | next-intl 4                                                           |
| Data Fetching      | SWR                                                                   |
| Form Validation    | React Hook Form + Yup + `@hookform/resolvers`                         |
| Analytics          | Custom GA4 wrapper using `<Script>`                                   |
| Backend (light)    | Next.js Route Handlers (API Routes)                                   |
| Backend (heavy)    | Express 5 + TypeScript                                                |
| ORM & DB           | Prisma 6 + PostgreSQL                                                 |
| Auth & Sessions    | bcrypt, express-session, jsonwebtoken, OAuth2 via google-auth-library |
| Email & PDF        | nodemailer, pdf-lib                                                   |
| Logging & Security | morgan, helmet, cors, express-rate-limit                              |
| Testing            | Jest + ts-jest + Supertest; Cypress                                   |
| Lint & Format      | ESLint (Next config), Prettier, Husky, lint-staged                    |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.18
- **npm** ≥ 9.x or **yarn**
- **PostgreSQL** database
- (Optional) Docker & Docker-Compose for DB & Redis

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/mashiko-pottery.git
   cd mashiko-pottery
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**  
   Create two `.env` files for different environments:

   - `.env.staging` (used during development & preview deployments):

     ```env
     DATABASE_URL=your_supabase_postgres_url
     NEXT_PUBLIC_BASE_URL=https://mashiko-pottery.vercel.app
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

   - `.env.production` (used for production deployment):
     ```env
     DATABASE_URL=
     NEXT_PUBLIC_BASE_URL=
     NEXT_PUBLIC_SUPABASE_URL=
     NEXT_PUBLIC_SUPABASE_ANON_KEY=
     SESSION_SECRET=
     JWT_SECRET=
     GOOGLE_CLIENT_ID=
     GOOGLE_CLIENT_SECRET=
     ```

   > `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to expose to the browser, as they only allow client-side reads on public tables with Row Level Security.

   > Use `.env.staging` by default during local development:

   ```bash
   cp .env.staging .env
   ```

   > You can also persist Prisma CLI access to the `.env.staging` config with:
   >
   > ```bash
   > alias prisma:staging="env $(cat .env.staging | xargs) npx prisma"
   > ```
   >
   > Then use `prisma:staging db push` or `prisma:staging generate`.

4. **Initialize the database**

   ⚠️ Prisma's `migrate reset` is **destructive** and should only be used in local dev.  
   If you're using Supabase (or any remote PostgreSQL), follow this safe migration flow:

   1. **Create migration without applying it**

      ```bash
      npx prisma migrate dev --name init --create-only
      ```

   2. **Connect to Supabase and apply manually**
      First, open a psql session:

      ```bash
      env $(cat .env.staging | grep -v '^#' | xargs) bash -c 'psql "$DATABASE_URL"'
      ```

      Then from inside psql, run:

      ```sql
      \i prisma/migrations/2025xxxxxx-init/migration.sql
      ```

   3. **Pull schema back into Prisma (if needed)**

      ```bash
      npx prisma db pull
      ```

   4. **Regenerate the Prisma Client**

      ```bash
      npx prisma generate
      ```

   5. **Update Supabase schema manually (if needed)**

      If you've updated your Prisma schema manually (e.g. changed `title`/`description` to `Json` or added `imageUrl`), you must also update your Supabase schema.

      Open a `psql` session:

      ```bash
      env $(cat .env.staging | grep -v '^#' | xargs) bash -c 'psql "$DATABASE_URL"'
      ```

      Then apply the changes manually:

      ```sql
      -- Convert fields to JSON
      ALTER TABLE "Product"
        ALTER COLUMN "title" TYPE jsonb USING "title"::jsonb,
        ALTER COLUMN "description" TYPE jsonb USING "description"::jsonb;

      -- Add imageUrl to Potter model
      ALTER TABLE "Potter" ADD COLUMN "imageUrl" text;
      ```

      > After making changes, pull the updated schema and regenerate the Prisma client:

      ```bash
      npx prisma db pull
      npx prisma generate
      ```

   You can also create a shortcut:

   ```bash
   alias prisma:staging="env $(cat .env.staging | xargs) npx prisma"
   ```

   > Then use `prisma:staging db pull`, `prisma:staging generate`, etc.

5. **Seed the database with mock data**

   ```bash
   npx dotenv -e .env.staging -- tsx prisma/seed.ts
   ```

   This will insert:

   - 45 users across admin, ops, seller, and customer roles
   - 10 potters linked to seller users
   - 12 multilingual products distributed among potters
   - 1 order with order items
   - Reviews and favorites for seeded products
   - 1 invoice and 1 refund transaction

   > Run this step only after the database schema has been fully initialized.

6. **Start development servers**
   ```bash
   npm run dev
   # Next.js on http://localhost:3000
   # (If using a separate Express server) Express on http://localhost:4000
   ```

---

## Scripts

- `npm run dev` – Run Next.js + Express dev servers
- `npm run build` – Build for production
- `npm run start` – Start Next.js in production mode
- `npm run lint` – Run ESLint
- `npm run test` – Run Jest & Supertest
- `npm run cypress` – Open Cypress test runner

---

## Project Structure

```
/
├── prisma/                   # Prisma schema & migrations
├── server/                   # Express custom server (TypeScript)
├── src/
│   ├── app/                  # Next.js App Router (i18n folders, pages, API)
│   ├── components/           # Shared UI components
│   ├── lib/                  # Utils (analytics, auth, etc.)
│   ├── store/                # Redux slices & store
│   ├── locales/              # Translation JSON files
│   └── types/                # TypeScript types
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS plugins
├── next.config.js            # Next.js configuration (i18n)
├── tsconfig.json             # TypeScript configuration
└── package.json              # NPM scripts & dependencies
```

---

## Internationalization (i18n)

- **Locales**: `en`, `ja`, `zh`
- **Route structure** under `src/app/[locale]/…`
- **Config** in `next.config.js`:
  ```js
  module.exports = {
    i18n: {
      locales: ['en', 'ja', 'zh'],
      defaultLocale: 'en',
    },
  }
  ```
- **Translations** in `src/locales/{en,ja,zh}.json`
- **Hooks**: `useTranslations()` (client) and `getTranslations()` (server)

---

## Styling & Theming

- **Tailwind CSS v4** with CSS-first theming
- Import in `src/app/[locale]/globals.css`:
  ```css
  @import 'tailwindcss';
  @theme {
    /* Custom CSS variables (colors, radii, etc.) */
  }
  ```

---

## Fonts

Loaded via `next/font/google` (e.g., Inter, Playfair Display, Noto Sans JP, Noto Serif SC) in `src/lib/fonts.ts`, then applied per-locale in `layout.tsx` using CSS variables (`--font-…`).

---

## Authentication & Security

- **bcrypt** for password hashing
- **express-session** + **jsonwebtoken** for sessions & JWT
- **OAuth** (Google, LINE, etc.) via `google-auth-library`
- **Security middleware**: `helmet`, `cors`, `express-rate-limit`
- **RBAC** in Express for Admin/Potter/Consumer routes

---

## State Management (Redux)

- **Redux Toolkit** slices for:
  - Cart (`cartSlice`) – persisted to localStorage
  - Products List & Single Product (`productsListSlice`, `productDetailSlice`)
  - Potters List & Single Potter
  - Orders List & Order Details
  - Payouts List & Payout Details
- Wrap `<Provider>` in a client component (`StoreProvider.tsx`)

---

## API & Data Layer

### Next.js Route Handlers

- Under `src/app/api/…` for lightweight endpoints (products, cart, etc.)

### Express Server

- For heavy operations (batch uploads, PDF generation) in `server/src`

### Database & ORM

- **Prisma 6** connecting to PostgreSQL
- Models: `User`, `Potter`, `Product`, `Order`, `OrderItem`, `Payout`

---

## Testing

- **Jest** + **ts-jest** for unit tests & calculation logic
- **Supertest** for Express API tests
- **Cypress** for E2E/user-flow testing

---

## Linting & Formatting

- **ESLint** with `eslint-config-next`
- **Prettier**
- **Husky** + **lint-staged** for pre-commit hooks

---

## Analytics & Monitoring

- **Google Analytics 4** via a custom React wrapper (`lib/analytics.ts`)
- Cookieless tracking mode supported

---

## Deployment

- **Frontend**: Vercel (Next.js App Router)
- **Backend**: Vercel Serverless Functions or containerized Express
- **Database**: Supabase, AWS RDS, PlanetScale, etc.

---

## Roadmap & Next Steps

1. Finalize Admin Portal features
2. Build Potter Dashboard (self-service)
3. Add B2B/Wholesale workflows
4. Performance tuning (CDN, ISR, caching)
5. PWA/offline catalog support

---

## License

MIT © 2025 Mashiko Pottery
