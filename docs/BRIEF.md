# BRIEF: Vedanth Gali Portfolio

## 0. Ground Rules

- Tools: Use the Mobbin MCP server (connected) for design research. Use the browser tool to open live projects and GitHub repos and verify facts. Use the Supabase CLI only to write migrations; the user applies them.
- Truth: Never invent facts, numbers, clients, testimonials or technologies. Every claim on the site must come from the Content Bible below or from a verified source (repos, README files, live URLs). Anything inferred is marked `[CONFIRM]` and must be seeded as a draft (`is_published=false`) or a visible TODO.
- If sources disagree (for example résumé vs README), report the discrepancy. Do not silently pick one.
- Work discipline: Plan once per phase, work in small steps, commit after each step, no vague rework loops. Stop at every gate.

## 1. Plan Approval & Amendments

- A1: `.env.local.example` must use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...`.
- A2: RLS: Admins need SELECT on ALL rows, including unpublished drafts. Public SELECT stays limited to published rows wherever `is_published` exists.
- A3: The proxy matcher must skip `_next/static`, `_next/image`, `favicon` and static asset extensions (`svg`, `png`, `jpg`, `jpeg`, `gif`, `webp`, `avif`, `glb`, `pdf`).
- A4: `next.config` must allow the Supabase Storage host (`*.supabase.co`) in `images.remotePatterns`.
- A5: Schema additions: table `education` (`institution`, `degree`, `field`, `start_year`, `end_year`, `status`, `logo_url`, `logo_alt`); table `certifications` (`title`, `issuer`, `year`, `credential_url`, `image_url`, `image_alt`); `experience` gets `period_label` (text), `org_url`, `logo_url`, `logo_alt`; `projects` gets `metrics` (jsonb array of `{label, value}`) and `cover_image_alt`; `site_settings` table (single row: `seo_title`, `seo_description`, `og_image_url`, `og_image_alt`, `availability_visible`). New tables follow RLS, `sort_order`, `is_published` pattern, with admin stub pages.
- A6: Inter is a temporary placeholder only. Replaced in Phase 1 (Unbounded / Geist Sans / Geist Mono).
- A7 (Updated by Patch 1): Phone number is NOT stored in `profile`. Added as a `social_links` row: label "Phone", url "tel:+919987602631", display text "+91 99876 02631", `is_published=true`.

## 2. Positioning & Goals

- Individual: Vedanth Gali, Mumbai. Final-year B.E. Computer Engineering student, Mumbai University (2023–2027).
- Target Role: Frontend Developer or Full-Stack Developer. (No mention of internships or "entry-level").
- Hero availability pill: "Open to work · Frontend / Full-Stack"
- availability_text: "Open to work as a Frontend or Full-Stack Developer"
- Role line: "Frontend & Full-Stack developer · Computer Engineering student"
- SEO title: "Vedanth Gali | Frontend & Full-Stack Developer, Mumbai"
- Goal: Get interviews. In 10 seconds a visitor should know identity, see real projects, and be able to contact.
- Positioning: A student who designs, builds, and ships real platforms (The Rkive is deployed for real use at college) and leads technical teams and events.
- All content editable via `/admin` (Supabase). No hardcoded content in components.
- Links: GitHub https://github.com/Mr-Wick2005 | LinkedIn https://www.linkedin.com/in/vedanth-gali-22v2005/

## 3. Story Arc & Sitemap

- Story: Builds, then Leads, then Learns, then Let's talk.
- Single-page home with anchored sections, plus `/work/[slug]` case-study pages, plus `/admin`.
- Sections in order: Hero | 01 About | 02 Work | 03 Leadership | 04 Skills | 05 Certifications | 06 Contact | Footer.
- Nav: About, Work, Leadership, Skills, Contact, plus Résumé button.
- Excluded: Services, Testimonials, Process, "years of experience / clients" stats, skill percentage bars. All counts computed from database rows.

## 4. Design Direction

- Dark neon-violet aesthetic.
- Color palette: bg `#06060F`, surface `#0D0D1F`, border `rgba(139,92,246,.22)`, text `#F2F2FA`, muted `#9A9AB5`, accent `#8B5CF6`.
- Solid surfaces with 1px low-opacity accent border; hover brightens border and lifts 2px. No glassmorphism, no card glow, no gradient text, no neon bars, no floating blobs.
- Glow exception: Allowed ONLY on hero 3D ring and one soft radial wash behind hero.
- Blue appears only inside 3D scene. UI uses single violet accent.
- Type candidate: Display = Unbounded (wide geometric, H1/H2 only), Body = Geist Sans, Labels/Eyebrows = Geist Mono.
- Layout: 12-column grid, max-width 1200px, section padding `clamp(96px, 12vw, 160px)`, left-aligned.
- Hero: Eyebrow, two-tone display name (white + violet), one-line value statement, two CTAs (View my work, Download résumé), availability pill, social icons; right side is portrait cutout with 3D ring and subtle pointer parallax.
- Motion: Lenis smooth scroll, hero load reveal, section reveal (fade + 8px, ~400ms), Leadership timeline line drawing on scroll, project card hover. Respects `prefers-reduced-motion`.
- 3D: Procedural only (torus ring, particle dust, 2–3 low-poly shards), no heavy models, DPR capped, lazy-loaded with static fallback, reduced on mobile.

## 5. Mobbin Research & Spec (Phase 1)

- Collect 8–10 references from Mobbin portfolio search (Dark, 3D, Motion, Scroll Effects, Typography).
- Write `docs/design-research.md` and `docs/design-spec.md`.
- Present spec plus 2 hero options at GATE before building UI.

## 6. Content Bible (Single Source of Truth)

- Profile, Education, Experience, Skills, Certifications, and Social Links as seeded into Supabase.
- Projects Order: The Rkive, Escape Placement Cell, Plant Leaf Multi-Disease Detection. Drafts: CVAdapt AI, College Buzz.

## 7. Supabase Connection (Patch 2)

- URL: `https://twnsjjnbrtemxywaxduo.supabase.co`
- Publishable Key: `sb_publishable_qZA8qKtK1-A3KHmG6YbHPQ_0m3CFNgO`
- Project Ref: `twnsjjnbrtemxywaxduo`
- Bucket: `media` (public-read, 10 MB limit, strict MIME types)
