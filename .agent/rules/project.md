# Project Rules — Turquoise Home Textile (DEMO v2)

This file contains sections 0, 9, and 10 of PROJECT_BRIEF.md to ensure persistent guidelines across sessions.

---

## 0. How to work (Antigravity instructions)

- Use **Planning mode**. FIRST produce an **Implementation Plan** artifact and a **Task List** artifact, then wait for my approval before writing app code.
- Create a workspace **Rules** file (Antigravity's rules location, e.g. `.agent/rules/project.md`) containing sections 0, 9 and 10 of this brief so the rules persist across sessions. Create a **Workflow** (e.g. `.agent/workflows/verify.md`) that runs: lint → typecheck → tests → build → browser-agent screenshot pass.
- Build in **milestones M0–M5** (section 12). After each milestone: run the dev server, use the **browser agent** to verify at **375px, 768px, 1440px** in **Arabic (RTL), French and English (LTR)**, attach **screenshots / a short recording** as artifacts, and stop for my review.
- At the end, produce a **Walkthrough** artifact: what was built, how to run it, how to replace assets, known limitations.
- This is a **DEMO / front-end only**: no backend, no database, no auth, no payments. All data is static (typed config + JSON). Never invent prices, addresses, testimonials, or product facts; use clearly marked placeholders (section 9).
- Code must be typed (TypeScript), componentized, and clean. No half-finished features: if something is out of scope, leave a clear `TODO` and list it in the Walkthrough.

---

## 9. 3D Customizer — «صمّم أثاثك وستائرك ثلاثية الأبعاد حسب الطلب» / "Design your furniture & curtains in 3D"

**Layout:** split (mirrors in RTL): large 3D stage + controls; on mobile: stage on top, controls in a bottom sheet with tabs.

**Flow with live preview on the model:**
1. **Choose piece:** sofa / armchair / table / curtain.
2. **Materials & colors** (animated transition): fabric/leather swatches (light grey, taupe, ivory, charcoal, sage, navy, terracotta; named in 3 languages; include the colors sampled from the real photos); wood (natural walnut, honey oak, dark walnut, bleached oak); metal legs (gunmetal, polished silver, brushed gold). Curtains: fabric (heavy geometric / plain linen / embroidered), sheer color, embroidery (gold/silver/none), tieback (pearl / gold cord / none). **Fabric swatch library** with macro zoom (M5).
3. **Dimensions (cm):** length, width, height, validated with min/max per piece and a live dimension overlay. Curtains: window width, curtain height, fullness (×2 / ×2.5 / ×3). Optional **room size** (L × W × H cm) with a **room preview** (simple 3D room box, person-height reference silhouette).
4. **Upload a room/design photo:** drag-drop + camera on mobile, client-side preview, JPG/PNG/WebP ≤ 8 MB, remove button. Image never leaves the browser.
5. **Review & send:** summary (piece, materials, colors, dimensions, room, notes, name, optional city) → **"Send via WhatsApp"**.

**WhatsApp logic (be honest about limitations):**
- Build a structured text message in the **current UI language** and open `wa.me/213556929134?text=...`.
- `wa.me` **cannot attach images**, so: on supported mobile browsers use **Web Share API with files** (`navigator.canShare({files})`) to send photo + text together; otherwise open the text message AND show a clear translated notice "attach your photo in the chat after it opens", plus a **Download design summary** button.
- Include a **shareable design link** (`/ar/design?piece=sofa&fabric=taupe&w=210&d=95&h=85`) that restores the exact design; put it in the message.
- Also: **Copy summary**, **Download summary as PNG** (3D snapshot + specs), **Save design** (localStorage, up to 5).
- **Quote cart (M5):** add several pieces/designs and send ONE WhatsApp quote request.

---

## 10. Content, data & quality rules

- No real prices: "Price on request / السعر عند الطلب / Prix sur demande"; optional config flag `showIndicativePrice` (default false).
- Placeholders visibly marked (`PLACEHOLDER:`) for address, hours, map, socials, about text; omit testimonials unless real ones exist.
- Product copy in AR/FR/EN based strictly on section 7 and what is visible in the photos.
- No copyrighted/third-party images or brand assets. Textures procedural or generated in code.
- **Performance:** Lighthouse mobile (demo build) Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90 (3D chunk lazy). 3D ≥ 50 FPS on a mid-range laptop, ≥ 30 FPS on a mid-range phone. No layout shift on language switch.
- **Accessibility:** full keyboard access, contrast checked on gold-on-white, alt texts, reduced-motion support.
- **Tests (Vitest):** WhatsApp message builder (3 languages, encoding), dimension validators, design-link encode/decode, i18n key parity. 
- **SEO:** per-language meta, `hreflang`, OG/Twitter images, sitemap, JSON-LD `FurnitureStore`/`LocalBusiness` (no invented data) and `Product` (without price).
- `npm run build` passes with zero TS/ESLint errors. README covers install, run, build, deploy (Netlify/Vercel/GitHub Pages), how to swap logo/photos/GLB, edit contact data, add products via JSON.
