# Camli Beauty Egypt (كاملي بيوتي مصر)

<div align="center">

![Camli Beauty Egypt](https://www.camlibeautyeg.com/cdn/shop/files/Camli_logo.png?v=1704291549&width=400)

**Heritage Skincare Rooted in Authentic Sudanese Beauty Rituals**  
_عناية فاخرة بالبشرة مستوحاة من طقوس الجمال السودانية الأصيلة_

[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-blue?style=flat-square&logo=react)](https://tanstack.com/start)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Shopify Integration](https://img.shields.io/badge/Shopify-Cart_Hand--off-96bf48?style=flat-square&logo=shopify)](https://www.camlibeautyeg.com)
[![Bilingual](https://img.shields.io/badge/i18n-EN_%7C_%D8%B9%D8%B1%D8%A8%D9%8A-emerald?style=flat-square)](#internationalization-i18n)

</div>

---

## 📖 Overview

**Camli Beauty Egypt** is a modern, high-performance luxury e-commerce web application for the Camli Beauty brand. Crafted with **TanStack Start** and **React 19**, it pairs editorial aesthetics and rich storytelling with enterprise-grade SSR/SSG performance, full bilingual Arabic & English support with dynamic RTL/LTR layouts, and direct checkout hand-off to Shopify.

---

## ✨ Key Features

- **🌿 Heritage Sudanese Beauty Rituals**: Showcasing authentic Dilka, Nayra Hibiscus scrubs, and ultra-hydrating body butters.
- **⚡ TanStack Start SSR/SSG Architecture**: Server-driven routing with full client-side hydration, instant navigation, and zero layout shift.
- **🌐 Native Bilingual Experience (English & Arabic)**:
  - Instant RTL/LTR switching across layout and typography.
  - Tailored fonts: _Amiri_ / _Cairo_ for Arabic and _Playfair Display_ / _Inter_ for English.
  - Fully translated product catalogs, metadata, benefits, and policies.
- **🛍️ Shopify Cart Integration**:
  - Live client-side cart drawer with item count badges, quantity controls, and order notes.
  - Real Shopify variant IDs enabling one-click checkout hand-off to `camlibeautyeg.com/cart`.
- **🔍 Production SEO & Structured Data**:
  - OpenGraph, Twitter Cards, and canonical links on all pages.
  - Rich JSON-LD schemas: `Organization`, `WebSite`, `Product`, and `BreadcrumbList`.
- **🎨 Luxury Aesthetics & Accessible UI**:
  - Powered by Tailwind CSS v4 and Radix UI primitives.
  - Smooth micro-interactions, hero video background, and image zoom gallery.
  - Sheet, dialog, drawer, and popover components respect viewport safe areas (`panel-frame`).
- **💬 Customer Support & Engagement**:
  - Floating WhatsApp concierge and interactive chat assistant.
  - Newsletter subscription with validation.
  - Customer review showcases and Instagram reels gallery.

---

## 🗺️ Route Directory

| Route                             | URL                 | Description                                                                | SEO & Structured Data       |
| :-------------------------------- | :------------------ | :------------------------------------------------------------------------- | :-------------------------- |
| `src/routes/index.tsx`            | `/`                 | Home page: Hero video, product carousels, mission gallery, ritual story    | `WebSite`, `Organization`   |
| `src/routes/shop.tsx`             | `/shop`             | Full catalog with category filters (Scrubs, Butters, Eye care)             | `CollectionPage`            |
| `src/routes/products.$handle.tsx` | `/products/:handle` | Product details: gallery, variant selector, ingredients, benefits, reviews | `Product`, `BreadcrumbList` |
| `src/routes/best-sellers.tsx`     | `/best-sellers`     | Curated best-selling customer favorites                                    | `CollectionPage`            |
| `src/routes/about.tsx`            | `/about`            | Brand philosophy, Sudanese heritage, natural ingredient ethics             | `AboutPage`                 |
| `src/routes/contact.tsx`          | `/contact`          | Contact form, customer service hours, and direct social links              | `ContactPage`               |
| `src/routes/search.tsx`           | `/search`           | Real-time bilingual product search with query highlighting                 | `SearchResultsPage`         |
| `src/routes/cart.tsx`             | `/cart`             | Full shopping bag page with checkout actions                               | `Cart`                      |
| `src/routes/shipping.tsx`         | `/shipping`         | Shipping & delivery terms across Egyptian governorates                     | `Policy`                    |
| `src/routes/privacy.tsx`          | `/privacy`          | Privacy policy and customer data handling                                  | `Policy`                    |
| `src/routes/terms.tsx`            | `/terms`            | Store terms of service                                                     | `Policy`                    |
| `src/routes/profile.tsx`          | `/profile`          | Customer account dashboard & order history                                 | Private Route               |

---

## 🏗️ Project Architecture

```
camli-beauty-seo-refresh/
├── .lovable/                 # Lovable project configuration
├── public/                   # Static public assets, favicon, and brand icons
├── src/
│   ├── app/                  # Application providers (Theme, i18n, Account)
│   ├── components/
│   │   ├── layout/           # App shell (Header, Footer, CartDrawer, AuthModal)
│   │   ├── shared/           # Reusable widgets (Catalog, HeroVideo, ProductCard)
│   │   └── ui/               # Radix UI + Tailwind design tokens & primitives
│   ├── data/                 # Product catalog & official Shopify CDN assets
│   ├── i18n/                 # English/Arabic translation dictionaries
│   ├── lib/                  # Cart logic, SEO builder, error boundaries
│   ├── routes/               # TanStack Start file-based route definitions
│   │   ├── __root.tsx        # Root HTML document shell & providers
│   │   ├── index.tsx         # Home page
│   │   └── products.$handle.tsx # Dynamic product route
│   ├── routeTree.gen.ts      # Generated TanStack router manifest
│   ├── router.tsx            # Router factory
│   ├── server.ts             # Server entry point
│   ├── start.ts              # Client entry point
│   └── styles.css            # Tailwind CSS v4 configuration and styles
├── AGENTS.md                 # Agent instructions and Lovable sync rules
├── ARCHITECTURE.md           # In-depth technical architecture documentation
├── CONTRIBUTING.md           # Contribution guidelines & coding conventions
├── ROADMAP.md                # Project roadmap and milestones
├── package.json              # Project dependencies & scripts
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Vite & TanStack Start build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: [Bun](https://bun.sh/) (recommended) or `npm` / `pnpm`

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/Confidential-solutions/Camli-beauty-EG-F.git

# Navigate into the project directory
cd Camli-beauty-EG-F

# Install dependencies with Bun
bun install
# or with npm:
npm install
```

### Running Locally

Launch the local development server with Vite:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:3000` (or the port indicated in your terminal).

### Running Tests

Execute unit and integration tests using Vitest:

```bash
bun run test
# or with watch mode:
bun run test:watch
```

### Production Build

Create an optimized production bundle:

```bash
bun run build
bun run preview
```

---

## 🛠️ Tech Stack & Libraries

| Category                  | Technology                                                                      |
| :------------------------ | :------------------------------------------------------------------------------ |
| **Framework**             | [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev/)   |
| **Routing**               | [TanStack Router](https://tanstack.com/router) (File-based, Type-safe)          |
| **State & Data Fetching** | [TanStack React Query](https://tanstack.com/query)                              |
| **Styling**               | [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`            |
| **UI Primitives**         | [Radix UI](https://www.radix-ui.com/) accessible primitives                     |
| **Icons**                 | [Lucide React](https://lucide.dev/)                                             |
| **Testing**               | [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) |
| **Code Quality**          | ESLint & Prettier                                                               |
| **Platform Integration**  | [Lovable](https://lovable.dev) & [Shopify](https://www.shopify.com)             |

---

## 📚 Additional Documentation

- 🧭 [**Architecture Guide (ARCHITECTURE.md)**](./ARCHITECTURE.md): Deep dive into TanStack Start file-based routing, SEO pipeline, i18n engine, and cart state.
- 🗺️ [**Roadmap (ROADMAP.md)**](./ROADMAP.md): Track completed milestones and upcoming store features.
- 🤝 [**Contributing Guide (CONTRIBUTING.md)**](./CONTRIBUTING.md): Branching model, PR process, code formatting, and Lovable git integration safeguards.
- 🤖 [**Agent Guidelines (AGENTS.md)**](./AGENTS.md): Coding rules, safe viewport panel offsets, and Lovable synchronization protocols.

---

## 📄 License & Attribution

All brand assets, photography, logos, and product copy are the intellectual property of **Camli Beauty Egypt** ([camlibeautyeg.com](https://www.camlibeautyeg.com)).  
Source code is managed by Confidential Solutions.
