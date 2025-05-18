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
   Copy `.env.example` → `.env` and fill in:
   ```env
   DATABASE_URL=postgres://user:pass@localhost:5432/mashiko
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```
4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
5. **Start development servers**
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
      locales: ["en", "ja", "zh"],
      defaultLocale: "en",
    },
  };
  ```
- **Translations** in `src/locales/{en,ja,zh}.json`
- **Hooks**: `useTranslations()` (client) and `getTranslations()` (server)

---

## Styling & Theming

- **Tailwind CSS v4** with CSS-first theming
- Import in `src/app/[locale]/globals.css`:
  ```css
  @import "tailwindcss";
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
