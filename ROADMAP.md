# 🗺️ Camli Beauty Egypt — Product Roadmap

This document outlines the development phases, completed milestones, and upcoming enhancements for the **Camli Beauty Egypt** storefront.

---

## 🏁 Phase 1: Architecture & Framework Modernization

- [x] **TanStack Start Migration**: Upgraded codebase to TanStack Start 1.168 with React 19.
- [x] **File-based Routing**: Migrated routing from classic client-side SPA routing to TanStack Start file-based routing (`src/routes/`).
- [x] **Tailwind CSS v4 Integration**: Adopted Vite-native `@tailwindcss/vite` configuration with custom CSS theme tokens.
- [x] **Design System Primitives**: Configured complete Radix UI component library (Dialog, Drawer, Accordion, Dropdown Menu, Popover, Sheet, Tabs, Tooltip).
- [x] **Safe-Area Panel Offsets**: Implemented `panel-frame` utility across sheets, dialogs, drawers, and popovers to respect viewport boundaries.

---

## 🔍 Phase 2: SEO & Structured Data Refresh

- [x] **Canonical URLs**: Added auto-generated canonical `<link rel="canonical" />` across all route head elements.
- [x] **Meta Descriptions & Keywords**: Added localized meta descriptions and high-intent beauty keywords for both English and Arabic.
- [x] **OpenGraph & Twitter Cards**: Implemented rich social media preview tags with fallback brand photography for every page.
- [x] **JSON-LD Schema Markup**:
  - [x] `Organization` & `WebSite` schemas on the root/home layout.
  - [x] `Product` schema with variant pricing, availability, and images on product detail pages (`/products/$handle`).
  - [x] `BreadcrumbList` schema on navigation routes.
- [x] **Search Engine Directives**: Standardized robot indexing directives and theme-color definitions.

---

## 🌐 Phase 3: Internationalization (i18n) & Responsive Polish

- [x] **Bilingual Support**: Comprehensive English (`en`) and Arabic (`ar`) translations for all UI strings, product titles, descriptions, and policies.
- [x] **Dynamic RTL/LTR Switching**: Instant document direction and font styling adjustment based on active language.
- [x] **Responsive Layout Audits**:
  - [x] Mobile drawer navigation and header search.
  - [x] Responsive product gallery with mobile swipe and desktop hover zoom.
  - [x] Responsive cart drawer with bottom sheet layout on mobile screens.
- [x] **Error Boundaries & 404 Pages**: Standardized luxury fallback screens for broken routes or runtime errors with retry mechanisms.

---

## 🛍️ Phase 4: Commerce & Store Experience

- [x] **Shopify Catalog Integration**: Real product data, descriptions, benefits, and specifications mapped from the live Shopify store (`camlibeautyeg.com`).
- [x] **Client-Side Cart Management**: Persistent cart state with item counter, quantity modification, and item removal.
- [x] **Shopify Checkout Hand-off**: Cart drawer seamlessly forwards selected variants and quantities directly to the official Shopify checkout endpoint.
- [x] **Interactive Customer Concierge**: Floating WhatsApp contact button and bilingual chat modal for inquiries.
- [x] **Security & Account Hardening**:
  - [x] Eradicated plaintext password storage in `localStorage`.
  - [x] Replaced fake auth with secure local guest profile (name & email preferences).
  - [x] Direct hand-off link to official Shopify Customer Account (`camlibeautyeg.com/account/login`).
- [x] **Shopify Live Catalog Sync**:
  - [x] Real-time inventory & pricing resolution via `useLiveShopifyCatalog()` hook.
  - [x] Release verification script (`npm run sync:products`) to prevent product drift.

---

## 🚀 Phase 5: Upcoming Enhancements (Future Sprints)

- [ ] **Wishlist Functionality**: Save favorite items to a local storage wishlist with quick add-to-cart.
- [ ] **Dynamic Live Reviews Integration**: Connect verified customer reviews and ratings directly from Judge.me / Shopify Reviews.
- [ ] **Governorate-based Delivery Estimator**: Real-time shipping calculation and delivery date estimates based on Egypt governorate selection.
- [ ] **Native Shopify Customer Account API Integration**: OAuth-based customer login sync once headless account tokens are provisioned.
- [ ] **Automated End-to-End Testing**: Expand Vitest suite to include automated Playwright visual regression tests across multiple viewport sizes.
