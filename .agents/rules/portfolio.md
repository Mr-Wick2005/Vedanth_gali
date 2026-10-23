# Project Rules: Vedanth Gali Portfolio (Redesign Update)

## 1. Stack Summary

- Framework: Next.js 16 (App Router, `src/` directory), React 19.
- Language: TypeScript (strict mode enabled, no unchecked indexed access).
- Styling: Tailwind CSS v4 configured with design tokens in `src/styles/tokens.css`.
- Backend & Auth: Supabase (PostgreSQL, Auth, Storage) via `@supabase/supabase-js` and `@supabase/ssr`.
- Animation & 3D: Motion, GSAP ScrollTrigger, `@gsap/react`, Lenis smooth scrolling, Three.js, `@react-three/fiber`, `@react-three/drei`.
- Icons: `lucide-react` for UI; `@icons-pack/react-simple-icons` for brand tech stacks. No emoji anywhere.
- Forms & Validation: Zod, React Hook Form.
- Code Quality: ESLint, Prettier.

## 2. Design System & Tokens

- `src/styles/tokens.css` is the SINGLE SOURCE OF TRUTH.
- Never hardcode colors, font sizes, spacing, radii, or easing curves in components.
- Palette:
  - Background Stage: `#000000` for Hero, `#06060F` for page body.
  - Deep Spatial Underlay: `#0A0A1F`.
  - Surface: `#0D0D1F` (hover: `#14142B`).
  - Hairlines: `rgba(255, 255, 255, 0.08)` and `rgba(167, 139, 250, 0.25)`.
  - Text: `#FFFFFF` (display headlines), `#E8E5F7` (lilac-white body copy), `#9594B2` (muted metadata).
  - Accent: `#8B5CF6` (violet core), `#A78BFA` (violet neon glow), `#38BDF8` (subtle cyan rim).
- Typography:
  - Display: `Unbounded` (weights 600, 700, 800) for hero display headlines, project titles, and section chapter numbers.
  - Body: `Geist Sans` at minimum **17px** (`1.0625rem`) with `1.65` line height.
  - Monospace: `Geist Mono` for status badges, coordinates, and live clock.
- Layout: Asymmetric split viewports, full-bleed bands, stacked card decks, max-width 1320px.

## 3. Motion System & Animation Rules

- Motion primitives are built once in `src/components/motion/` and reused across all sections (`Reveal`, `SplitText`, `Marquee`, `Magnetic`, `Tilt`, `CountUp`, `ScrollFill`, `ImageReveal`, `Cursor`, `Preloader`, `Clock`).
- Separation of concerns:
  - Lenis handles viewport smooth scrolling and inertia.
  - GSAP ScrollTrigger handles scroll-linked pinning, stacked card scaling, and word-fill.
  - Motion handles layout animations, presence, spring physics, and micro-interactions.
  - R3F / Three.js handles the 3D hero energy ring and particle dust.
  - NEVER drive the same CSS property on the same element with two libraries.
- Duration limits (200–600ms) apply to UI transitions only. Loops, scroll-linked scrubbers, preloader, and WebGL are exempt.
- prefers-reduced-motion: turns off parallax, marquees, pins, and WebGL, rendering a clean static layout.
- Touch/mobile devices: custom cursor and magnetic physics are disabled.

## 4. Aesthetic Constraints & Banned Patterns

- BANNED:
  - Emoji in UI copy, tags, or headers.
  - Stock photography or AI-generated imagery.
  - Fake statistics ("99% client satisfaction") or unsubstantiated testimonials.
  - Percentage or skill progress bars.
  - "Verified Completion" or "Verified" badges without direct cryptographic/URL evidence.
  - Centered-everything layouts.
  - Gradient text.
  - Permanent glow on cards or body text.
- GLOW ALLOWANCE:
  - Allowed in WebGL scene, ambient radial wash, cursor spotlight wash, and interactive hover states.
- GLASSMORPHISM:
  - Allowed ONLY on the sticky navigation header.
- ICONS ARE REQUIRED on:
  - Section labels (number plus icon), project meta (role, year, stack), metrics chips, location/university/date pills, social links, buttons, leadership roles, and credential issuers.

## 5. Truth & Content Integrity

- Never invent facts, numbers, clients, testimonials, or technologies.
- Every claim must originate from the verified Content Bible or confirmed GitHub repositories.
- Any inferred item must be tagged `[CONFIRM]` and seeded as a draft (`is_published = false`) or explicit TODO.
- All dynamic counts (number of projects, leadership roles, certifications) must be computed directly from database rows.
- Admin stays accessible by direct URL only (`/admin/login`), with `noindex`. No public admin links in navigation or footer.
- Any task touching more than 3 files requires a plan first.
