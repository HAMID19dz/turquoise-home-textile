# Verification Workflow

Run this workflow at the end of each milestone or major change before claiming completion.

## Pipeline Steps

1. **Linting**
   ```bash
   npm run lint
   ```
   *Expectation: 0 warnings, 0 errors.*

2. **TypeScript Compilation Check**
   ```bash
   npm run typecheck
   ```
   *Expectation: Clean build without type errors.*

3. **Unit & Logic Tests (Vitest)**
   ```bash
   npm run test
   ```
   *Expectation: 100% passing tests for WhatsApp message builders, dimension validators, design URL encode/decode, and i18n translation key parity across AR, FR, and EN.*

4. **Production Build**
   ```bash
   npm run build
   ```
   *Expectation: Bundle generates cleanly with asset chunks optimized.*

5. **Multi-Viewport & Multi-Language Browser Validation**
   - Run the local preview or dev server (`npm run preview` or `npm run dev`).
   - Validate layouts at:
     - **375px** (Mobile)
     - **768px** (Tablet)
     - **1440px** (Desktop)
   - Validate languages:
     - **Arabic (`/ar`)**: RTL layout, font rendering (Amiri / Cairo / Tajawal), mirrored controls, WhatsApp drawer.
     - **French (`/fr`)**: LTR layout, Cormorant Garamond / Inter.
     - **English (`/en`)**: LTR layout, typography and button labels.
   - Capture screenshots and attach them to milestone verification artifacts.
