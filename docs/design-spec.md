# Design Specification: Vedanth Gali Portfolio

## 1. Palette & Design Tokens

### Color Tokens & Accessibility (WCAG AA)
- **Background**: `#06060F` (Near-black navy grounding; 16.5:1 contrast against text)
- **Surface**: `#0D0D1F` (Dark structural card layer)
- **Surface Hover**: `#14142B` (Subtle 2-step hover brightening)
- **Border**: `rgba(139, 92, 246, 0.22)` (1px violet-tinted crisp outline)
- **Border Hover**: `rgba(139, 92, 246, 0.45)` (Active interactive state)
- **Text (Primary)**: `#F2F2FA` (High-contrast cool white; 15.8:1 contrast against background)
- **Text (Muted)**: `#9A9AB5` (Secondary metadata, body descriptions; 5.2:1 contrast, passes AA)
- **Accent (Single UI Accent)**: `#8B5CF6` (Vibrant violet for interactive focus and pill highlights)
- **Accent Subtle**: `rgba(139, 92, 246, 0.12)` (Pill fills, badge backgrounds)
- **3D Scene Internal Accent**: Cyan/Blue hues permitted **exclusively** within the WebGL Three.js canvas.

---

## 2. Typography Specification

| Slot | Font Family | Role | Weights | Hierarchy Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | **Unbounded** | H1, H2, Two-tone hero name | 700 (Bold), 800 (ExtraBold) | Restricted to H1 and Section H2s only. Wide geometric rhythm. |
| **Body** | **Geist Sans** | Paragraphs, case-study narrative, metadata | 400 (Regular), 500 (Medium) | Neutral, engineered grotesque font optimized for high screen density. |
| **Mono** | **Geist Mono** | Section indexes (`01 — ABOUT`), metrics, tags | 400, 600 (SemiBold) | Tabular figures for data, uppercase for technical section indexes. |

*Note: `Inter` was used strictly as a scaffolding placeholder and will be replaced by `Unbounded` in the implementation phase.*

### Fluid Type Scale
- `--font-size-xs`: `clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)` (12px – 13px)
- `--font-size-sm`: `clamp(0.875rem, 0.82rem + 0.28vw, 0.9375rem)` (14px – 15px)
- `--font-size-base`: `clamp(1rem, 0.95rem + 0.25vw, 1.0625rem)` (16px – 17px)
- `--font-size-lg`: `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)` (20px – 24px)
- `--font-size-xl`: `clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)` (24px – 30px)
- `--font-size-2xl`: `clamp(1.875rem, 1.65rem + 1.1vw, 2.375rem)` (30px – 38px)
- `--font-size-3xl`: `clamp(2.25rem, 1.95rem + 1.5vw, 3rem)` (36px – 48px)
- `--font-size-4xl`: `clamp(2.75rem, 2.3rem + 2.25vw, 4rem)` (44px – 64px)

---

## 3. Grid, Container & Spacing

- **Container Max Width**: `1200px` centered with responsive horizontal gutters (`1.5rem` mobile, `2rem` tablet, `2.5rem` desktop).
- **Column System**: 12-column grid (`gap-6` on desktop, `gap-4` on mobile).
- **Section Padding**: `clamp(96px, 12vw, 160px)` vertical breathing room between narrative milestones.
- **Card Padding**: `1.5rem` (24px) to `2rem` (32px) internal padding.

---

## 4. Component Inventory

### 1. Sticky Navigation
- Fixed top navigation bar with solid surface fallback (`bg-[#06060F]/80 backdrop-blur-md`).
- Left: Monogram brandmark (`VG`).
- Center/Right: Anchor links (`About`, `Work`, `Leadership`, `Skills`, `Contact`).
- CTA: Direct "Résumé" download button with accent border.

### 2. Hero Section
- **Availability Pill**: Floating badge (`Open to work · Frontend / Full-Stack`) with a pulsing green/accent micro-dot.
- **Two-Tone Name**: `Vedanth` in solid `#F2F2FA` + `Gali` in solid `#8B5CF6`.
- **Value Statement**: One crisp line: *"I build web platforms and lead tech events, from first sketch to deployment."*
- **Action Group**: Primary CTA (*View My Work*), Secondary CTA (*Download Résumé*), Social Links (*GitHub, LinkedIn, Email*).
- **Right Visual**: Portrait cutout with procedural glowing 3D torus ring rotating behind the subject, responding to subtle mouse parallax.

### 3. Section Headers
- Monospace label tag above title: `01 — ABOUT`, `02 — WORK`, `03 — LEADERSHIP`, `04 — SKILLS`, `05 — CERTIFICATIONS`, `06 — CONTACT`.
- Left-aligned bold display heading in `Unbounded`. No centered headings.

### 4. Project Card (Work Section)
- Solid `#0D0D1F` surface with 1px `rgba(139, 92, 246, 0.22)` border.
- Hover transition: Border illuminates to `rgba(139, 92, 246, 0.45)`, card translates Y by -2px.
- Media cover with aspect ratio `16:9` and fallback gradient placeholder.
- Key metrics callout badges (e.g. `91.82% Accuracy`, `7 Publication States`).
- Stack chips along card base. Arrow link `↗` leading to `/work/[slug]`.

### 5. Leadership Timeline Item
- Vertical line running along the left margin in `rgba(139, 92, 246, 0.25)`.
- Line draws continuously downward on scroll.
- Node indicators highlight the active position of responsibility.
- Period label badge (`2026`, `2024–2025`).
- Bulleted outcome highlights.

### 6. Categorized Skill Chips
- Grouped by category in order: Frontend, Languages, Backend, Databases, Design, Tools, Machine Learning.
- Solid `#0D0D1F` micro-chips with 1px border.
- Tech icon + label. Zero percentage bars.

### 7. Footer
- Minimal single-accent layout.
- Contact email with one-click copy-to-clipboard feedback state.
- Phone number as direct `tel:+919987602631` link (`+91 99876 02631`).
- Dynamic counts indicator: *"Showing X verified projects, Y leadership roles, Z certifications."*
- Copyright notice.

---

## 5. Motion & Micro-Interactions Spec

- **Engine**: Lenis smooth scrolling paired with Motion / GSAP ScrollTrigger.
- **Duration Constraint**: Strictly 200ms to 600ms.
- **Standard Easing**: `cubic-bezier(0.2, 0, 0, 1)`.
- **Interactions**:
  1. *Hero Load*: Staggered upward fade (`opacity: 0 -> 1`, `translateY: 16px -> 0px`, 500ms).
  2. *Section Reveal*: IntersectionObserver fade + 8px translateY (400ms).
  3. *Leadership Timeline*: SVG path draw synchronized with scroll offset.
  4. *Project Card Hover*: CSS hardware-accelerated `transform: translateY(-2px)` + border color interpolation (250ms).
- **Reduced Motion**: If `prefers-reduced-motion` is detected, all transitions become instant, 3D canvas stays static, and scroll smoothing is disabled.

---

## 6. Procedural 3D Element Spec

- **Geometry**: Procedural `TorusGeometry` with metallic roughness, accompanied by a sparse particle field (~40-60 ambient floaters).
- **Shaders/Lighting**: One directional key light and one soft violet rim light.
- **Performance Budget**:
  - Max 3 draw calls.
  - Device Pixel Ratio capped at `Math.min(window.devicePixelRatio, 2)`.
  - Geometry generated in memory (0 KB network model payload).
  - Canvas lazy-loaded with an immediate CSS static radial fallback.
  - Suspended / paused when scrolled out of viewport.

---

## 7. Responsive Viewport Strategy

- **Mobile (375px)**:
  - Hero stacks vertically: Text above, portrait below (or compact portrait circle).
  - 3D scene renders with reduced particle density (20 particles) or a static fallback SVG ring to conserve battery and CPU.
  - Project cards render in a single column with full-width touch targets (minimum 44px height).
- **Tablet (768px)**:
  - 2-column project and certification grids.
  - Hero switches to a compact 2-column layout.
- **Desktop (1440px)**:
  - Full 12-column asymmetric layout with max-width `1200px`.

---

## 8. Two Hero Layout Options (For User Review at Gate)

### Option 1: Asymmetric Split Grid (Hero Anchor Right) — Recommended
- **Structure**: 12-column grid. Left 7 columns house the text hierarchy (availability pill, H1 display name in white/violet, one-line value statement, CTAs, and social links). Right 5 columns house the portrait cutout with the procedural glowing 3D torus ring floating directly behind the head/shoulders.
- **Visual Dynamic**: Clean, highly readable, recruiter-friendly scan pattern. The eye reads the value proposition on the left first, then absorbs the portrait and 3D visual anchor on the right. Subtle mouse parallax shifts the ring slightly in opposition to cursor movement.

### Option 2: Architectural Framed Overlap (Layered Geometric Center-Right)
- **Structure**: 12-column grid. Left 6 columns house the availability pill, large headline block, and primary CTAs. Columns 7–12 feature an architectural rectangular frame (`border: 1px solid rgba(139,92,246,0.22)`) inside which the portrait sits. The glowing 3D ring intersects the edge of this frame, breaking the bounding box for depth.
- **Visual Dynamic**: More editorial and magazine-inspired (reminiscent of *The Rkive* publishing aesthetic), with strong framing geometry and tactile depth.
