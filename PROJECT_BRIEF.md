\# Turquoise Home Textile — 3D Luxury Furniture \& Textile Showcase (DEMO v2)



\## STEP ZERO — Install the SkillFinder skill and use it to discover helpful skills (before anything else)



Before planning or writing any code:



1\. \*\*Install the SkillFinder skill\*\* from https://github.com/yya007/SkillFinder (local semantic search over 42,000+ `SKILL.md` agent skills; runs locally with FAISS + Ollama, no API calls). Put it in Antigravity's \*\*skills directory\*\* (workspace-level, e.g. `.agent/skills/skill-finder/`; use the global skills folder instead if that is what this Antigravity version expects). Try in this order and stop at the first that works:

&#x20;  - `npx skills add yya007/SkillFinder`

&#x20;  - `git clone https://github.com/yya007/SkillFinder <skills-dir>/skill-finder`

&#x20;  - `npm install -g @yya007/skill-finder`, then copy `$(npm root -g)/@yya007/skill-finder` into the skills directory

2\. \*\*Finish its setup\*\* (the install step only copies files):

&#x20;  - `pip install numpy faiss-cpu requests pyyaml`

&#x20;  - `ollama pull qwen3-embedding:0.6b` (requires Ollama installed locally; Python 3.10+)

&#x20;  - If Ollama or Python is unavailable or setup fails, \*\*do not block\*\*: tell me in one line what failed, and continue by searching the web for skills instead.

3\. \*\*Use SkillFinder to search\*\* (e.g. `python scripts/search.py "<query>" --no-json --propose 5` from the skill folder, or natural language "find a skill for …") for skills useful to THIS project. Suggested queries:

&#x20;  - React Three Fiber / Three.js / drei 3D scenes and GLB handling

&#x20;  - Tailwind CSS RTL / Arabic / i18n (react-i18next)

&#x20;  - Frontend design and luxury UI polish; Framer Motion / GSAP animation

&#x20;  - Image optimization with sharp (AVIF/WebP), asset pipelines

&#x20;  - Playwright / browser testing, Lighthouse and accessibility audits

&#x20;  - SEO / JSON-LD, PWA

4\. \*\*Vet before installing.\*\* SkillFinder only indexes skills with ≥ 10 GitHub stars and, apart from ClawHub results, does not safety-scan them. For every candidate: read its `SKILL.md` and repository first, install only skills that are clearly relevant, from reputable authors, with no hidden network calls, credential access, or destructive commands. Prefer a few well-maintained skills over many. Never run install scripts you have not read.

5\. \*\*Report in the Implementation Plan\*\* a short table: skills considered → decision (install / skip) → reason → install command. Install the approved ones before M0. Tell me which skills you installed so I can review them.



\## 0. How to work (Antigravity instructions)



\- Use \*\*Planning mode\*\*. FIRST produce an \*\*Implementation Plan\*\* artifact and a \*\*Task List\*\* artifact, then wait for my approval before writing app code.

\- Create a workspace \*\*Rules\*\* file (Antigravity's rules location, e.g. `.agent/rules/project.md`) containing sections 0, 9 and 10 of this brief so the rules persist across sessions. Create a \*\*Workflow\*\* (e.g. `.agent/workflows/verify.md`) that runs: lint → typecheck → tests → build → browser-agent screenshot pass.

\- Build in \*\*milestones M0–M5\*\* (section 12). After each milestone: run the dev server, use the \*\*browser agent\*\* to verify at \*\*375px, 768px, 1440px\*\* in \*\*Arabic (RTL), French and English (LTR)\*\*, attach \*\*screenshots / a short recording\*\* as artifacts, and stop for my review.

\- At the end, produce a \*\*Walkthrough\*\* artifact: what was built, how to run it, how to replace assets, known limitations.

\- This is a \*\*DEMO / front-end only\*\*: no backend, no database, no auth, no payments. All data is static (typed config + JSON). Never invent prices, addresses, testimonials, or product facts; use clearly marked placeholders (section 9).

\- Code must be typed (TypeScript), componentized, and clean. No half-finished features: if something is out of scope, leave a clear `TODO` and list it in the Walkthrough.



\## 1. ASSET INTAKE \& AUTO-IDENTIFICATION (do this first, Milestone M0)



I will attach 7 images (arbitrary file names) to this message AND/OR drop them in `public/assets/source/`. \*\*Look at every image yourself (vision), identify what it shows, and map it to the catalog yourself. Do not wait for me to name them.\*\*



\### Steps

1\. \*\*Inventory:\*\* list every file in `public/assets/source/` (and attached images). For each: dimensions, orientation, subject, dominant colors, quality notes.

2\. \*\*Classify \& map\*\* each image to a product id from section 6, or to `logo`, or `unmatched`. Give a \*\*confidence (0–1)\*\* and a one-line reason.

3\. \*\*Produce an "Asset Mapping" artifact\*\* (table: source file → role/product id → confidence → proposed new name → crop/focal point → issues). \*\*Pause for my confirmation only if any item has confidence < 0.8 or two images compete for the same role.\*\* Otherwise continue and I will review it in the artifact.

4\. \*\*Process assets\*\* with a script `scripts/process-assets.mjs` (use `sharp`):

&#x20;  - Output to `public/assets/products/<product-id>.{avif,webp,jpg}` in widths 480 / 960 / 1600, plus a tiny blur placeholder (LQIP) per image.

&#x20;  - Keep originals untouched in `public/assets/source/`.

&#x20;  - Extract a \*\*dominant color palette\*\* per photo and write everything to `src/data/assets.generated.json` (paths, sizes, focal point, LQIP, palette).

&#x20;  - Use the sampled colors as the \*\*default material colors\*\* of the matching procedural 3D model so 3D and photo look consistent.

5\. \*\*Generate alt text\*\* for every image in AR / FR / EN (factual, short; describe only what is visible).

6\. \*\*Do not retouch or alter the products.\*\* Showroom photos have background clutter (other furniture, curtains, small price/label tags on curtains, reflections on tiles). Handle that with CSS `object-fit: cover` + focal point or a conservative crop; never paint over or fake details.

7\. \*\*Missing photos:\*\* if a catalog product has no matching photo, mark it `photo: null` and use the procedural render with a "Photo coming soon" label. Never reuse a photo of a different product and never use an AI-generated photo.



\### What the images are (expected, to help you match — verify against what you actually see)

\- \*\*Logo:\*\* a screenshot of a profile card: black circular emblem with a \*\*golden winged horse (Pegasus) inside a laurel wreath\*\* and the word TURQUOISE / "Home Textile" under it, followed by text on a dark background. \*\*Crop only the circular emblem\*\*, discard the surrounding text/background, export: `logo.png` (transparent outside the circle, ≥ 512px), `logo-512.png`, `favicon.ico`, `apple-touch-icon.png`, and an OG image. If upscaling would look blurry, say so in the mapping and keep the original size.

\- \*\*Light grey leather armchair\*\* (portrait): center-tufted back, wide flared arms with piping, dark angular metal legs, glossy white tile floor.

\- \*\*Light grey leather 2-3 seat sofa\*\* (landscape): same design, two square geometric-pattern cushions, dark metal legs, curtains behind it.

\- \*\*Heavy grey/taupe geometric curtains\*\* (portrait): white inner sheer, pearl tiebacks, black rod, spotlights above.

\- \*\*Cream pleated curtains\*\* (portrait): wide \*\*gold embroidery band\*\*, pearl tiebacks.

\- \*\*Natural wood rectangular coffee table\*\* (landscape): lower open shelf; a white bouclé sofa is partially visible behind it (this is NOT a dedicated bouclé photo).

\- \*\*Oval wood dining table with 6 chairs\*\* (landscape): glossy warm wood, wide cylindrical pedestal, white runner with a gold candle holder, curved-back chairs in grey-beige woven fabric.

\- Products with \*\*no dedicated photo\*\* in this set: `boucle-sofa` and `velvet-accent-chair`.



\## 2. Brand \& contact



\- \*\*Store name:\*\* Turquoise Home Textile (AR: تركواز للأثاث والمنسوجات المنزلية)

\- \*\*Phone / WhatsApp:\*\* `+213 556 92 91 34`

&#x20; - `tel:+213556929134`

&#x20; - WhatsApp: `https://wa.me/213556929134?text=<encodeURIComponent(message)>` (digits only, no `+`, no spaces)

\- ALL business data in one file: `src/config/site.ts` (name, phone, whatsapp, address, hours, socials, map embed). Unknown values are marked `PLACEHOLDER:`.

\- Contact touchpoints: \*\*call button\*\* in header and footer, \*\*floating WhatsApp button\*\* (bottom corner, auto-mirrored in RTL, subtle gold pulse, respects `prefers-reduced-motion`).

\- Logo is displayed inside a circular badge in the header; the black emblem on the white header must look intentional (thin gold ring).



\## 3. Visual identity — "White Marble \& Gold, Greek Columns"



\*\*Palette (CSS variables + Tailwind tokens):\*\*

\- Background: pure white `#FFFFFF` and marble off-white `#F8F6F2` with a very subtle marble-vein texture (SVG/CSS, low opacity, no heavy images)

\- Gold: `#D4AF37`, `#C5A059`, metallic gradient `linear-gradient(135deg,#C5A059,#D4AF37,#F3E2A9,#C5A059)` for buttons, borders, accents, dividers. Darker gold `#9A7B2F` for small text (contrast).

\- Text: charcoal `#2B2B2B`, secondary soft gray `#8A8A8A`

\- Gold only for interactive elements and accents; generous whitespace, thin gold hairlines, soft refined shadows.



\*\*Typography:\*\* Arabic headings \*\*Amiri\*\*, Arabic body \*\*Tajawal\*\* or \*\*Cairo\*\*; Latin headings \*\*Cormorant Garamond\*\* or \*\*Playfair Display\*\*, Latin body \*\*Inter\*\* or \*\*Jost\*\*. Load with `@fontsource`, `font-display: swap`.



\*\*Greek columns frame (left \& right edges, fixed while scrolling):\*\*

\- Classical Ionic (volutes) or Corinthian capitals, white marble fluted shaft, \*\*gold-leaf details\*\* on capital and base.

\- Implement as \*\*SVG/CSS\*\* with light \*\*parallax + mouse-tilt\*\* depth. Optional tiny Three.js version only on ≥ 1280px if FPS stays ≥ 50.

\- Below `lg`: columns become slim decorative strips or hide; content never gets squeezed.

\- Disabled motion under `prefers-reduced-motion`.



\*\*Motion:\*\* Framer Motion for reveals, hovers and shared-element transitions (catalog card → 3D viewer). Smooth scroll (Lenis or native). GSAP ScrollTrigger only if needed for hero/column parallax. Calm, cinematic easing, editorial spacing, large imagery. Do not copy any specific existing design.



\## 4. Tech stack



\- \*\*Vite + React 18 + TypeScript\*\*

\- \*\*Tailwind CSS\*\* with \*\*logical properties\*\* (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `start-0`) so RTL works without hacks

\- \*\*Framer Motion\*\* (primary), GSAP optional

\- \*\*three\*\*, \*\*@react-three/fiber\*\*, \*\*@react-three/drei\*\*

\- \*\*zustand\*\* (customizer state), \*\*react-router\*\* (language routes), \*\*react-i18next\*\* (or typed dictionary)

\- \*\*Vitest\*\* + Testing Library for logic tests; \*\*sharp\*\* for asset processing; `@google/model-viewer` for AR (M5)

\- No UI kit that fights the custom look.



\## 5. i18n \& RTL



\- Arabic (default), French, English. Route-based: `/ar`, `/fr`, `/en` with `hreflang` tags; `/` redirects by saved choice, then browser language.

\- Switcher in header (text only: ع / FR / EN). Persist choice in `localStorage`. Set `<html lang dir>` dynamically.

\- All UI strings, product copy, material names, alt texts and the WhatsApp message templates live in `src/i18n/{ar,fr,en}.json`.

\- Add a script/test that \*\*fails if any key is missing in any language\*\*.

\- Western digits for phone and dimensions in all languages. Check mirrored arrows, carousels, sliders, drawers, floating buttons.



\## 6. Pages / sections



1\. \*\*Header:\*\* circular logo, nav (Home, Collection, Curtains \& Textiles, Design Your Own, About, Contact), language switcher, call button, quote-cart icon (M5).

2\. \*\*Hero:\*\* headline + subline, auto-rotating 3D armchair on a marble floor with gold light accents; CTAs "Explore the collection" and "Design your own".

3\. \*\*Collection (3D catalog):\*\* filters (All / Seating / Tables / Curtains). Card: photo (or procedural thumbnail), name, short description, material chips, buttons \*\*"View in 3D"\*\*, \*\*"Customize"\*\*, \*\*"Ask on WhatsApp"\*\* (pre-filled with the product name and its page link).

4\. \*\*Curtains \& Luxury Textiles:\*\* two models with fabric/size customization.

5\. \*\*Design Your Own 3D (customizer):\*\* section 9.

6\. \*\*About / Craftsmanship:\*\* short story + 4-step "made to order" process (Choose → Customize → Confirm on WhatsApp → Delivery/Installation). Placeholder copy.

7\. \*\*Contact \& Visit:\*\* phone, WhatsApp, address/hours/map placeholders.

8\. \*\*Footer:\*\* logo, links, call + WhatsApp buttons, language switcher, "Demo version" note.



\## 7. Product catalog (`src/data/products.json`, JSON-driven so new products can be added without code)



Each product: `id`, localized `name/description`, `category`, default `dimensionsCm {w,d,h}`, `materials`, `colorOptions`, `photo` (from `assets.generated.json` or `null`), `glb?`, `procedural` builder key.



| id | Product |

|---|---|

| `leather-armchair` | Modern light grey/taupe leather armchair: soft leather, center stitch/tufting on backrest, wide flared arms with piping, dark metallic angular legs along the sides |

| `leather-sofa` | Matching sofa, same design, two square cushions with soft geometric pattern, dark angular metal legs |

| `boucle-sofa` | Curved cream bouclé sofa: textured ivory fabric, wide curved arms, warm wooden base and legs, 3 cushions (2 square + 1 rectangular center) |

| `velvet-accent-chair` | Luxury single chair, beige/grey textured fabric, \*\*black vertical stripe\*\* on front of both arms, matching back cushion, polished silver metal legs |

| `oval-dining-set` | Oval warm polished wood table (glossy), wide cylindrical wooden pedestal, white runner with \*\*gold candle holder\*\*, \*\*6\*\* wooden chairs with curved padded backs in grey-beige woven fabric |

| `coffee-table` | Rectangular natural polished wood coffee table, classic-modern, recessed top frame line, open lower shelf |

| `curtain-taupe` | Heavy geometric-pattern grey/taupe curtains, inner white sheer, pearl tiebacks |

| `curtain-cream` | Pleated light-cream curtains with a \*\*wide gold embroidery band\*\*, pearl tiebacks |



Photos come from the auto-identification step (section 1). Products without a photo show the procedural render and "Photo coming soon".



\## 8. 3D Viewer (reusable `<ProductViewer />`)



\- \*\*One shared `<Canvas>`\*\* for the viewer; catalog cards use images/thumbnails (never a Canvas per card).

\- OrbitControls: 360° rotation, zoom limits, damping, pan off by default, vertical angle clamped above the floor; double-click/tap resets; auto-rotate until first interaction.

\- Realistic lighting: `Environment` built with \*\*Lightformers\*\* (works offline, no external HDRI), key + fill lights, `ContactShadows`, soft marble floor, ACES tone mapping, sRGB output. \*\*Day / Warm-evening lighting toggle.\*\*

\- \*\*Materials (MeshPhysicalMaterial):\*\* leather (roughness \~0.45, subtle clearcoat); bouclé/woven fabric (high roughness, `sheen`, procedural bump/normal noise); wood (procedural grain + clearcoat); metal (metalness 1, low roughness); pearls (clearcoat + sheen).

\- \*\*Procedural builders\*\* (`src/three/procedural/\*`) with RoundedBox / Cylinder / Lathe / Extrude, parametric by cm dimensions (→ meters). Match the silhouettes in the photos: tufting lines, piping, angular legs, pedestal oval table, 6 curved-back chairs, candle holder, cushions.

\- \*\*Curtains:\*\* subdivided ribbon geometry with sinusoidal pleats (shader or CPU), gentle sway on idle/hover, separate transparent sheer layer, gold embroidery band as a textured strip, pearl tiebacks. Width/height/fullness drive pleat count.

\- \*\*GLB/GLTF:\*\* `useGLTF` + Draco; use `product.glb` if present, else procedural. Add a \*\*drag-and-drop GLB loader\*\* (demo) to preview any model locally. `public/models/README.md` documents naming, scale (meters) and pivot (floor center).

\- \*\*Photo/3D toggle\*\* and a pinch-zoom photo lightbox.

\- \*\*Compare mode (M5):\*\* two pieces side by side with synced camera.

\- \*\*Fallbacks/perf:\*\* no WebGL → photo + friendly message; `frameloop="demand"` when idle; `dpr={\[1,1.75]}`; lazy-load the 3D chunk with a branded loader; pause when off-screen; error boundary around the Canvas.

\- \*\*Accessibility:\*\* keyboard rotate/zoom (arrows, +/−), aria-labels, visible focus, text alternative per model.



\## 9. 3D Customizer — «صمّم أثاثك وستائرك ثلاثية الأبعاد حسب الطلب» / "Design your furniture \& curtains in 3D"



\*\*Layout:\*\* split (mirrors in RTL): large 3D stage + controls; on mobile: stage on top, controls in a bottom sheet with tabs.



\*\*Flow with live preview on the model:\*\*

1\. \*\*Choose piece:\*\* sofa / armchair / table / curtain.

2\. \*\*Materials \& colors\*\* (animated transition): fabric/leather swatches (light grey, taupe, ivory, charcoal, sage, navy, terracotta; named in 3 languages; include the colors sampled from the real photos); wood (natural walnut, honey oak, dark walnut, bleached oak); metal legs (gunmetal, polished silver, brushed gold). Curtains: fabric (heavy geometric / plain linen / embroidered), sheer color, embroidery (gold/silver/none), tieback (pearl / gold cord / none). \*\*Fabric swatch library\*\* with macro zoom (M5).

3\. \*\*Dimensions (cm):\*\* length, width, height, validated with min/max per piece and a live dimension overlay. Curtains: window width, curtain height, fullness (×2 / ×2.5 / ×3). Optional \*\*room size\*\* (L × W × H cm) with a \*\*room preview\*\* (simple 3D room box, person-height reference silhouette).

4\. \*\*Upload a room/design photo:\*\* drag-drop + camera on mobile, client-side preview, JPG/PNG/WebP ≤ 8 MB, remove button. Image never leaves the browser.

5\. \*\*Review \& send:\*\* summary (piece, materials, colors, dimensions, room, notes, name, optional city) → \*\*"Send via WhatsApp"\*\*.



\*\*WhatsApp logic (be honest about limitations):\*\*

\- Build a structured text message in the \*\*current UI language\*\* and open `wa.me/213556929134?text=...`.

\- `wa.me` \*\*cannot attach images\*\*, so: on supported mobile browsers use \*\*Web Share API with files\*\* (`navigator.canShare({files})`) to send photo + text together; otherwise open the text message AND show a clear translated notice "attach your photo in the chat after it opens", plus a \*\*Download design summary\*\* button.

\- Include a \*\*shareable design link\*\* (`/ar/design?piece=sofa\&fabric=taupe\&w=210\&d=95\&h=85`) that restores the exact design; put it in the message.

\- Also: \*\*Copy summary\*\*, \*\*Download summary as PNG\*\* (3D snapshot + specs), \*\*Save design\*\* (localStorage, up to 5).

\- \*\*Quote cart (M5):\*\* add several pieces/designs and send ONE WhatsApp quote request.



\## 10. Content, data \& quality rules



\- No real prices: "Price on request / السعر عند الطلب / Prix sur demande"; optional config flag `showIndicativePrice` (default false).

\- Placeholders visibly marked (`PLACEHOLDER:`) for address, hours, map, socials, about text; omit testimonials unless real ones exist.

\- Product copy in AR/FR/EN based strictly on section 7 and what is visible in the photos.

\- No copyrighted/third-party images or brand assets. Textures procedural or generated in code.

\- \*\*Performance:\*\* Lighthouse mobile (demo build) Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90 (3D chunk lazy). 3D ≥ 50 FPS on a mid-range laptop, ≥ 30 FPS on a mid-range phone. No layout shift on language switch.

\- \*\*Accessibility:\*\* full keyboard access, contrast checked on gold-on-white, alt texts, reduced-motion support.

\- \*\*Tests (Vitest):\*\* WhatsApp message builder (3 languages, encoding), dimension validators, design-link encode/decode, i18n key parity. 

\- \*\*SEO:\*\* per-language meta, `hreflang`, OG/Twitter images, sitemap, JSON-LD `FurnitureStore`/`LocalBusiness` (no invented data) and `Product` (without price).

\- `npm run build` passes with zero TS/ESLint errors. README covers install, run, build, deploy (Netlify/Vercel/GitHub Pages), how to swap logo/photos/GLB, edit contact data, add products via JSON.



\## 11. Antigravity artifacts I expect



Implementation Plan → Task List → \*\*Asset Mapping table\*\* → per-milestone screenshots/recordings (375/768/1440, RTL + LTR) → test + Lighthouse report → final Walkthrough.



\## 12. Milestones



\- \*\*M0 – Asset intake:\*\* identify \& map images, process assets, logo/favicon/OG, generated manifest, Asset Mapping artifact.

\- \*\*M1 – Foundation:\*\* project setup, Tailwind theme, fonts, i18n + RTL + language routes, header/footer, floating WhatsApp + call buttons, Greek-column frame, hero (static), contact section.

\- \*\*M2 – Catalog:\*\* JSON-driven products, cards with real photos, filters, lightbox, per-product WhatsApp button, thumbnails.

\- \*\*M3 – 3D viewer:\*\* shared canvas, procedural builders for all 8 products, materials, lighting + day/evening toggle, GLB loader + fallback, Photo/3D toggle, performance pass.

\- \*\*M4 – Customizer \& order flow:\*\* live recoloring, dimensions, room preview, photo upload, WhatsApp/Web Share logic, shareable link, saved designs, summary PNG.

\- \*\*M5 – Enhancements:\*\* AR "View in your room" (`model-viewer`, Android Scene Viewer / iOS Quick Look, enabled only for products with a GLB), quote cart, swatch library, compare mode, PWA (installable, offline catalog), optional analytics events behind a config flag (WhatsApp click, 3D view, customizer completion), SEO/JSON-LD, final polish, README, Walkthrough.

