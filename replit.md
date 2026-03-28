# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.
Main artifact: **DzVêtements** — a full Algerian clothing & fashion marketplace.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, TailwindCSS, Shadcn/ui, React Query, Wouter, Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (backend)
│   └── dzvetements/        # DzVêtements frontend (React + Vite)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── sellers.ts
│           ├── products.ts
│           ├── reviews.ts
│           ├── cart.ts
│           └── orders.ts
├── scripts/
│   └── src/seed.ts         # Database seeder (run: pnpm --filter @workspace/scripts run seed)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## DzVêtements App

**Algeria's fashion marketplace** with:

### Pages
- `/` — Homepage: hero, categories, featured products, stats banner
- `/products` — Listings with sidebar filters (category, price, wilaya, size, color, condition)
- `/products/:id` — Product detail with image gallery, size/color selector, add to cart, seller info, reviews
- `/sellers/:id` — Seller profile with products and reviews
- `/cart` — Cart with wilaya delivery selector, checkout form (name, phone, address)
- `/sell` — Post a listing (multi-field form)
- `/order-success` — Order confirmation

### Features
- Currency: DZD (Algerian Dinar) formatted as "X,XXX DA"
- 58 Algerian wilayas with delivery fee per wilaya
- Bilingual (French + Arabic) product condition labels
- Categories: Femmes, Hommes, Enfants, Traditionnel, Sportswear, Accessoires
- Session-based cart (no login required)
- Rich seed data: 8 sellers, 31 products, 36 reviews

### API Routes
- `GET /api/products` — list with filters
- `GET /api/products/:id` — product detail + related + reviews
- `GET /api/categories` — categories with subcategories
- `GET /api/sellers` — seller list
- `GET /api/sellers/:id` — seller profile
- `GET /api/sellers/:id/products` — seller products
- `GET|POST /api/cart` — cart management
- `DELETE /api/cart/:itemId` — remove from cart
- `POST /api/orders` — place order
- `GET|POST /api/reviews` — product reviews
- `GET /api/wilayas` — 58 Algerian wilayas
- `GET /api/stats` — marketplace stats

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root** — run `pnpm run typecheck`
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`
- `pnpm --filter @workspace/scripts run seed` — seed the database
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec

## Database

Production migrations are handled by Replit when publishing. In development, use `pnpm --filter @workspace/db run push`.
