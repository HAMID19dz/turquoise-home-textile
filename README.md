# Turquoise Home Textile — 3D Showcase & Atelier
### تركواز للأثاث والمنسوجات المنزلية الفاخرة

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r163-black.svg)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-green.svg)](https://vitest.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple.svg)](https://web.dev/progressive-web-apps/)

An interactive 3D luxury furniture and bespoke home drapery showroom created for **Turquoise Home Textile**, an haute manufacture established in Algiers, Algeria. The platform combines a neoclassical **"White Marble & Gold, Greek Columns"** aesthetic with physical PBR 3D rendering, procedural bespoke customization, multi-item quote aggregation, and direct WhatsApp quotation dispatch.

---

## 🏛️ Brand Aesthetic & Visual Architecture

- **Neoclassical Greek Columns:** Interactive 3D fluted Carrara marble columns with 24k gold leaf Corinthian capitals framing the desktop viewport with physics-based parallax mouse tracking.
- **Color Harmony:** Carrara white marble backgrounds (`#FFFFFF`, `#FDFBF7`, `#F8F6F2`), metallic gold gradients (`#C5A059`, `#D4AF37`, `#F3E2A9`), and deep charcoal typography (`#2B2B2B`).
- **Trilingual Parity:** Built-in route-based localization across **Arabic (`/ar`, default RTL)**, **French (`/fr`, LTR)**, and **English (`/en`, LTR)** with 100% translation key synchronization and dynamic `<html lang dir>` switching.
- **Animate UI Dynamics:** Smooth spring physics and fluid micro-interactions powered by `@animate-ui/react` and `framer-motion`.

---

## ✨ Key Features & Capabilities

### 1. Showroom Catalog (9 Signature Creations)
- **High-Resolution Multi-Format Assets:** Responsive `<picture>` elements serving AVIF, WebP, and JPG (480w, 960w, 1600w) generated via `sharp` with base64 Low-Quality Image Placeholders (LQIP).
- **Category Filter Tabs:** Fluid category switching between All, Seating, Tables, and Curtains with gliding Animate UI pill indicators and automatic grid reflow.
- **Pinch-Zoom Lightbox:** High-resolution zoom inspector supporting mouse wheel, drag, and pinch gestures up to 3.5x magnification.
- **Dedicated Royal Drapery Showcase:** Full-width textile section showcasing heavy geometric jacquards, plain linens, and embroidered silks with pleat fullness indicators.

### 2. Unified 3D Canvas Stage (`<ProductViewer />`)
- **Lightformers Studio Lighting:** Offline HDRI studio illumination with switchable **Day** and **Warm Evening** presets.
- **Carrara Marble Plinth:** Soft contact ground shadows, 24k gold bevel ring, and ACES Filmic tone mapping.
- **9 Procedural 3D Builders:** Custom geometric mesh generators with canvas-based bump maps for bouclé loops, genuine leather grain, fine wood grain, and gold embroidery bands:
  1. `leather-armchair` (Classic Armchair with tufted back & gold studs)
  2. `leather-sofa` (3-Seater Executive Leather Sofa with brass legs)
  3. `boucle-sofa` (Curved Organic Bouclé Sofa with walnut plinth)
  4. `velvet-accent-chair` (Accent Chair with black arm stripes & silver legs)
  5. `oval-dining-set` (Fluted Pedestal Oval Dining Table with 6 royal velvet chairs)
  6. `coffee-table` (Two-Tier Solid Walnut & Glass Rectangular Coffee Table)
  7. `side-table` (Classic Round Fluted Pedestal Accent Table)
  8. `curtain-cream` (Triple-Pleated Silk Drape with Sheer Panel & Gold Tieback)
  9. `curtain-taupe` (Floor-Length Velvet Blackout Drape with Sheer Backdrop)
- **Drag & Drop GLB Loader:** Drag any standard `.glb` 3D model directly onto the stage to preview it live inside the Turquoise showroom environment.

### 3. 3D Bespoke Atelier Customizer (`<CustomizerSection />`)
- **Real-Time Material Swatching:** Live PBR fabric/leather swatches, wood finishes, and metal hardware.
- **Parametric Physical Dimension Sliders:** Live 3D model dimension tuning (W, D, H in cm) clamped to safe physical limits (`PRODUCT_DIMENSION_LIMITS`).
- **3D Dimension Guides:** Interactive bounding wireframe with floating HTML measurement tags.
- **Room Scale Reference:** 3D translucent 1.75m human silhouette and parametric room perimeter box.
- **Client Room Photo Backdrop:** Drag-and-drop client room photos (processed client-side only, <= 8MB) rendered directly behind the 3D plinth.
- **Shareable Design Permalinks:** `/ar/design?piece=boucle-sofa&color=F4F0EA&w=240&d=95&h=78` allows instant sharing and retrieval across devices.
- **High-Resolution PNG Summary Card Export:** 1-click canvas capture generating an editorial 1200x800 design specification card.
- **Local Storage Designs:** Save and reload up to 5 custom designs directly in browser storage.

### 4. Multi-Product Quote Cart Drawer (`<QuoteCartDrawer />`)
- Add standard catalog pieces and bespoke 3D customizer creations into a unified quote request.
- Automatic item bundling and quantity controls.
- Single-click compilation into a consolidated WhatsApp quotation dispatched to `+213 556 92 91 34`.

### 5. Fabric Swatch Library with 4X Macro Magnifier (`<FabricSwatchLibraryModal />`)
- Interactive 4X high-magnification weave inspector simulating tactile microscopic texture exploration.
- Curated technical dossiers for all haute textiles (Bouclé, Royal Velvet, Full-Grain Leather, Emerald Velvet, Textured Linen, Silk-Blend Drapery).
- Lab metrics: Martindale rub count (≥ 50,000 cycles), grammage (g/m²), weave structure, origin, and maintenance guidelines.
- Direct 1-tap "اعتماد في الـ 3D" action applying the chosen fabric instantly to the active 3D model.

### 6. Side-by-Side 3D Compare Mode (`<CompareModal />`)
- Dual-viewport 3D stage allowing side-by-side comparison of any two pieces from the 9-piece collection.
- Synchronized camera orbit controls via dual linked OrbitControls.
- Independent color swatch switching and synchronized day/evening lighting toggles.
- Consolidated WhatsApp quotation and cart addition for both compared pieces.

### 7. Telemetry & Analytics Module (`src/utils/analytics.ts`)
- Lightweight, zero-dependency analytics event dispatcher guarded by `siteConfig.enableAnalytics`.
- Captures key conversion touchpoints: WhatsApp quotation inquiries, 3D viewer engagements, live color changes, customizer step progression, design sharing, and cart interactions.
- Automatic dispatch to `window.dataLayer` (Google Tag Manager / GA4) and subscriber architecture.

### 8. Augmented Reality (AR) & Progressive Web App (PWA)
- **Augmented Reality (AR):** View in your room button with smart device detection (iOS Quick Look USDZ / Android Scene Viewer).
- **Progressive Web App (PWA):** `manifest.json` with brand Pegasus emblem icons (192px, 512px) and Service Worker caching (`sw.js`) for offline browsing.
- **SEO & Structured Metadata:** Complete OpenGraph cards and Schema.org `FurnitureStore` JSON-LD data without invented prices ("Price on request / السعر عند الطلب").

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework & Core** | React 18.3, TypeScript 5.6, Vite 5.4 |
| **Styling & Design System** | Tailwind CSS 3.4, `@fontsource` (Amiri, Cairo, Cormorant Garamond, Inter) |
| **Motion & Physics** | `@animate-ui/react` 2.4, `framer-motion` 11.11, `motion` 14.9 |
| **3D Rendering** | Three.js r163, `@react-three/fiber` 8.17, `@react-three/drei` 9.121 |
| **State & Storage** | Zustand 5.0 (with LocalStorage persist middleware) |
| **Asset Pipeline** | Sharp 0.33 (AVIF / WebP / JPG responsive generation + LQIP) |
| **Testing & Quality Gates** | Vitest 2.1, Playwright Core, JSDOM |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/turquoise-home/turquoise-showcase.git
cd turquoise-showcase

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
# Starts Vite local server at http://localhost:5173/
```

### Production Build & Preview
```bash
# Compile TypeScript and bundle Vite production distribution
npm run build

# Preview production build locally
npm run preview
# Serves dist/ at http://localhost:4173/
```

### Quality Gate & Test Verification
```bash
# Run all tests, type checking, and production build in a single verification pipeline
npm run verify
```

---

## 🧪 Test Suite Summary

The automated Vitest suite validates all critical business logic and architecture:

```
 RUN  v2.1.9 C:/Users/ARES/Desktop/turquoise-home

 ✓ tests/i18n.test.ts (2 tests)
   ✓ 100% key parity across Arabic, French, and English translation bundles
   ✓ Language code routing integrity
 ✓ tests/catalog.test.ts (4 tests)
   ✓ 9 catalog pieces loaded with high-resolution responsive picture sets
   ✓ Category filtering correctly partitions Seating, Tables, and Curtains
   ✓ Truth in data: No invented prices or rogue contact information
 ✓ tests/three.test.ts (3 tests)
   ✓ Procedural builder registry covers 100% of products in products.json
   ✓ Lightformers studio lighting presets & ACES tone mapping initialization
   ✓ Safe WebGL detection and non-crashing fallback
 ✓ tests/customizer.test.ts (9 tests)
   ✓ Physical dimension limits defined for all 9 models
   ✓ Shareable design URL param encoding & decoding round-trip stability
   ✓ Clamped parametric dimension sliders
   ✓ WhatsApp custom quotation message compiler in AR, FR, EN (+213 556 92 91 34)
   ✓ LocalStorage design saving FIFO limit (max 5)
 ✓ tests/quoteCart.test.ts (6 tests)
   ✓ Multi-product quote cart drawer state operations
   ✓ Automatic item bundling by color and dimensions
   ✓ Consolidated multi-item WhatsApp quote compiler
 ✓ tests/compare.test.ts (2 tests)
   ✓ Dual piece comparison initialization
   ✓ Synchronized camera state toggle
 ✓ tests/analytics.test.ts (3 tests)
   ✓ Structured event emission and history log
   ✓ Subscriber dispatch and unsubscription
   ✓ Toggleable telemetry via siteConfig.enableAnalytics

Test Files  7 passed (7)
     Tests  29 passed (29)
```

---

## 📞 Showroom & Contact Information

- **Brand:** Turquoise Home Textile & Luxury Furniture (تركواز للأثاث والمنسوجات المنزلية)
- **Direct WhatsApp:** `+213 556 92 91 34` ([https://wa.me/213556929134](https://wa.me/213556929134))
- **Showroom Address:** *PLACEHOLDER: Alger, Algérie (Showroom Principal)*
- **Hours:** *Saturday – Thursday: 09:30 – 19:30 | Friday: Closed*
- **Pricing:** *Price on request / السعر عند الطلب (Custom quotation based on selected materials and dimensions)*

---

*Designed and engineered with pride by the Google DeepMind Advanced Agentic Coding team.*
