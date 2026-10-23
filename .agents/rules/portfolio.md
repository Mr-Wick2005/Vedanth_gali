# Project Rules: Vedanth Gali Portfolio

## 1. Stack Summary

- Framework: Next.js 16 (App Router, `src/` directory), React 19.
- Language: TypeScript (strict mode enabled, no unchecked indexed access).
- Styling: Tailwind CSS v4 configured with design tokens in `src/styles/tokens.css`.
- Backend & Auth: Supabase (PostgreSQL, Auth, Storage) via `@supabase/supabase-js` and `@supabase/ssr`.
- Animation & 3D (to be built in later phases): Motion, GSAP, `@gsap/react`, Lenis smooth scrolling, Three.js, `@react-three/fiber`, `@react-three/drei`.
- Forms & Validation: Zod, React Hook Form.
- Code Quality: ESLint, Prettier with `prettier-plugin-tailwindcss`.

## 2. Design System & Tokens

- `src/styles/tokens.css` is the SINGLE SOURCE OF TRUTH.
- Never hardcode colors, font sizes, spacing, radii, or easing curves in components.
- Baseline Palette:
  - Background: `#06060F`
  - Surface: `#0D0D1F` (hover: `#14142B`)
  - Border: `rgba(139, 92, 246, 0.22)` (hover: `rgba(139, 92, 246, 0.45)`)
  - Text: `#F2F2FA`
  - Muted: `#9A9AB5`
  - Accent: `#8B5CF6` (single violet accent across UI)
- Blue is strictly confined to inside the 3D scene.
- Typography:
  - Display: Wide geometric font (default candidate `Unbounded`, H1/H2 only).
  - Body: `Geist Sans`.
  - Labels & tags: `Geist Mono` (e.g. `01 — ABOUT`).
  - `Inter` is currently wired as a temporary placeholder font slot only and will be swapped in Phase 1.
- Layout: 12-column grid, max-width 1200px, section padding `clamp(96px, 12vw, 160px)`, left-aligned content (avoid centered-everything layouts).

## 3. Aesthetic Constraints & Banned Patterns

- BANNED:
  - Gradient text
  - Glassmorphism / backdrop-blur cards
  - Emoji in UI copy or headers
  - Generic icon-card grids
  - Floating ambient blobs
  - Card glows / neon bars
  - Centered-everything layouts
  - Fake statistics ("99% client satisfaction", "5+ years experience")
  - Skill percentage or progress bars
- GLOW EXCEPTION:
  - Allowed ONLY on the hero 3D ring and one subtle, soft radial wash behind the hero.
- Card styling: Solid `#0D0D1F` surface with 1px low-opacity accent border (`rgba(139, 92, 246, 0.22)`). Hover interaction brightens border to `rgba(139, 92, 246, 0.45)` and translates Y by -2px.

## 4. Truth & Content Integrity

- Never invent facts, numbers, clients, testimonials, or technologies.
- Every claim must originate from the verified Content Bible (`docs/BRIEF.md`) or confirmed GitHub repositories.
- Any inferred item must be tagged `[CONFIRM]` and seeded as a draft (`is_published = false`) or explicit TODO.
- Discrepancies between sources (e.g. résumé vs repository code) must be logged and reported, never silently resolved.
- All dynamic counts (number of projects, leadership roles, certifications) must be computed directly from database rows, never hardcoded.
- Target Role: Frontend Developer or Full-Stack Developer. Do not mention internships or "entry-level" anywhere.

## 5. Animation & 3D Rules

- One animation idea per section.
- Durations strictly constrained to 200–600ms.
- Respect `prefers-reduced-motion` at all times.
- 3D elements must be procedural, low-poly, DPR capped, lazy-loaded with an immediate static fallback, and reduced on mobile devices.

## 6. Architecture & Code Quality

- Server Components by default. Use Client Components (`"use client"`) only for interactive controls, state, or client hooks.
- Small, single-purpose components.
- Zero dead code or unreferenced dependencies.
- All content editable via `/admin` backed by Supabase. No content hardcoded in components.
- Phone number is stored only as a `social_links` row (`is_published = true`), never in the public `profile` table.
- Plan thoroughly before any task modifying more than 3 files.
- Verify UI across standard responsive viewports: 375px (mobile), 768px (tablet), and 1440px (desktop) before completing any UI task.
