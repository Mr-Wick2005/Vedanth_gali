# REDESIGN MASTER PROMPT: complete reconstruction of the presentation layer



## 0. Scope and ground rules

- Rebuild the UI from scratch. KEEP the Supabase schema, data layer (src/lib/content), admin, auth, routes and Content Bible. REPLACE components, layout, styling and motion. Schema changes only through NEW migration files that I apply.

- The current UI (screenshots attached) is rejected: text-only, every section is the same rounded card, tags have no icons, the hero is static. Do not iterate on it. Replace it.

- Truth rules still apply: no invented facts, stats, testimonials or "verified" claims without evidence.

- Save this brief to docs/REDESIGN_BRIEF.md. Plan once per phase, commit per step, and stop at the gates below.



## 1. Defects to fix (all of them)

- Project cards have no imagery. Every tag, chip, label and metric lacks an icon. The About pills use emoji.

- All sections use the same rounded-card pattern. The hero is static. No infinite loops, no transitions, no depth.

- Remove "Verified Completion" from certificates (show "View certificate" only when a credential URL or image exists). Remove "Verified" from the footer counts.

- Remove the public "CMS Admin" link and the "Computed live..." footer line. Admin stays reachable by URL only, with noindex.



## 2. Research (Phase R0)

Use the Mobbin MCP server (connected). Search Sites with filters Portfolio + Scroll Effects, Motion, 3D, Typography, Dark. Hunt for these patterns: preloader/intro, kinetic hero typography, marquee/infinite loops, pinned or stacked project showcases, project hover previews, scroll-highlighted text, timelines, tech-stack grids with icons, credential rails, giant footer wordmarks, page transitions, custom cursors.

Also use the browser tool to study (principles only; skip anything that fails to load): awwwards.com portfolio websites and its Elements section, godly.website, dennissnellenberg.com, robinpayot.com, aristidebenoist.com, bruno-simon.com, lusion.co, activetheory.net, locomotive.ca, 14islands.com.

Write docs/redesign-research.md with 10–12 references, each with: the specific pattern, why it works, how to adapt it to my content, what to avoid. Then write docs/redesign-concept.md (concept statement, token updates, per-section blueprints, motion system, component inventory, performance budget, mobile plan). Do not copy layouts, assets or code.

GATE A: stop and show me the concept. Include one static HTML hero mock in docs/mocks if cheap.



## 3. Concept direction (starting point; research may refine)

"Dark stage, violet light": a cinematic dark stage where light and motion carry the story, with editorial scale.

- Break the card monotony: alternate full-bleed bands, oversized type, outlined numerals, asymmetric and overlapping layouts, sticky and pinned scenes. Rounded containers only where meaningful (credentials, the ID card).

- Type: keep the wide display face, with extreme scale contrast (hero up to about 14vw), outline/stroke text for numerals and secondary words, mono for labels, body at least 17px.

- Color: violet accent stays; add a lilac-white for large type and deep indigo for depth. Gradients only in ambient washes and WebGL, never on text.

- Texture: 3–4% film grain, animated hairline dividers, soft vignette.

- Imagery: my real photos, screenshots and loops only. No stock photos, no AI-generated imagery.



## 4. Section architecture (nav: About, Work, Stack, Leadership, Credentials, Contact, plus a Résumé button)

0 Preloader: counter 0 to 100 with the VG monogram, then a curtain reveal. Max 1.6s, skippable, once per session.

1 Hero (section 7 below).

2 Marquee strip: two rows of tech icons (brand icons) in opposite directions; pauses on hover.

3 About: pinned paragraph that fills word by word as you scroll. Beside it, a tiltable student ID card (portrait crop, name, B.E. Computer Engineering, Mumbai University, 2023–2027, FINAL YEAR chip, subtle sheen following the pointer). Facts row with icons. Counts (projects, roles, certifications) computed from the database with count-up.

4 Work: stacked full-viewport project panels. Each panel pins and the previous one scales down behind it. Each has a giant outlined number, the title in display type, the summary, role/year with icons, metric chips with icons that count up, a tech icon row, and magnetic buttons (Case study, Live, GitHub). Media is a browser-frame mockup of the live-site screenshot, with an optional looping video, a pointer tilt of up to 6 degrees, and parallax. Hover turns the cursor into "VIEW". Mobile: plain vertical cards, media on top, no pinning.

   Case-study pages (/work/[slug]): hero media; meta row with icons (Role, Year, Stack, Links); Problem, Solution and Outcome with scroll reveals; metrics count-up; parallax gallery; a "next project" footer in giant type with a clip-path or view transition.

5 Big-type marquee band: "OPEN TO WORK • FRONTEND & FULL-STACK •" with speed linked to scroll velocity and direction flip.

6 Stack: icon tiles grouped by category (Frontend, Languages, Backend, Databases, Design, ML, Tools). Brand icons from Simple Icons, Lucide fallbacks for items like REST APIs and UI/UX. On hover a tile lifts and tilts, and a tooltip shows "Used in: <projects>", computed by matching skills to projects.stack.

7 Leadership: chaptered sticky timeline; a progress line driven by scroll; oversized outline year numerals parallaxing behind; per role an icon badge, the title in display type, the org, 2–3 highlight rows with icons, and a photo slot with a mask reveal. If no photo exists, show a tasteful typographic placeholder, never a broken box.

8 Credentials: an auto-scrolling, draggable rail of badge cards (issuer monogram or logo, title, year). A lightbox opens if a certificate image exists; a link opens if credential_url exists.

9 Contact and footer: giant kinetic "LET'S BUILD TOGETHER."; magnetic "Send an email" button; copy-email with a toast; phone, LinkedIn and GitHub as icon links; live Mumbai (IST) clock; availability pill; an oversized "VEDANTH GALI" wordmark that reveals on scroll; back to top.



## 5. Icon system

- Registry at src/components/ui/icon.tsx mapping name to component. UI icons from lucide-react; brand icons from @icons-pack/react-simple-icons. skills.icon_key maps into the registry (add an icon picker to the admin skill form). A fallback icon if none matches. No emoji anywhere.

- Icons are REQUIRED on: section labels (number plus icon), project meta (role, year, stack), metrics, location/university/date pills, social links, buttons, leadership roles, credential issuer and year. Stroke 1.5, sizes 16/20/24.



## 6. Motion system (build once in src/components/motion/, reuse everywhere)

Libraries: Lenis (smooth scroll), GSAP ScrollTrigger (scroll-linked and pinning), Motion (UI, layout, presence), R3F (hero scene). Never drive the same property with two libraries.

Primitives: Reveal, SplitText (line/word/char), Marquee (CSS-driven, direction, speed, pause on hover, optional scroll-velocity), Magnetic, Tilt, CountUp, ScrollFill, ImageReveal (clip-path), Cursor (dot, link ring, "VIEW" label, drag), Preloader, PageTransition (View Transitions API where supported, with a curtain-wipe fallback; check what Next.js 16 supports), ScrollProgress, Clock (IST).

Rules: animate transform and opacity only; use will-change sparingly; pause offscreen loops with IntersectionObserver; UI transitions 200–600ms (loops, scroll-linked motion, the preloader and WebGL are exempt); easing from tokens. prefers-reduced-motion turns off parallax, marquees, pins and WebGL and shows a static layout. Touch devices: no custom cursor or magnetic effects. Mobile: no pinning, lighter effects.



## 7. Hero (highest priority)

Stage is 100svh. Layers back to front: ambient violet/indigo wash plus grain; WebGL canvas (a glowing ring, particle dust, 2–3 low-poly shards); the portrait cutout; a masked front arc of the ring so it wraps around my shoulders (depth illusion); name and text; the marquee strip at the bottom.

- Name: split into characters; staggered rise-in from a mask after the preloader (about 900ms total). "GALI" in violet. On hover, characters shift and skew toward the pointer, springy and subtle. On scroll, the name shrinks and translates up, the portrait parallaxes, and the ring camera dollies out.

- Rotating line, "I build [interfaces / full-stack platforms / tech events].", with a vertical slide or scramble every 2.4s. Static first phrase under reduced motion.

- Live details: IST clock, availability pill with a pulsing dot, scroll cue, social icon column (GitHub, LinkedIn, Mail).

- CTAs: magnetic "View my work" and "Download résumé", both with icons.

- Pointer: portrait tilts up to 4 degrees, ring up to 10 degrees, particles repel from the pointer.

- Fallback for mobile, low-power devices (hardwareConcurrency of 4 or less), reduced motion, or no WebGL: static portrait plus a CSS-animated ring (rotating conic gradient). No WebGL.

- Performance: mount the canvas after first paint (requestIdleCallback); DPR at most 1.75; at most 1500 particles on desktop; additive blending as a fake bloom, no heavy postprocessing; pause when offscreen or when the tab is hidden. The LCP element is the name and portrait, never the canvas. The portrait uses next/image with priority.



## 8. Media and assets

- I will provide: a high-resolution transparent portrait, event photos for Leadership, certificate images, college/org logos, and any screen recordings. Use clearly marked placeholders until then.

- You may capture screenshots of my live project URLs with the browser tool (1440x900 and 390x844) for covers and browser-frame mockups. Store them under /public/placeholders for now; I will upload finals through admin.

- Looping video: muted, playsInline, loop, lazy-loaded, 3 MB or less each, WebM/MP4, with a poster fallback.

- NEW migration: projects.cover_video_url and cover_video_poster_url; experience.image_url, image_alt and gallery (jsonb); the media bucket allows video/mp4 and video/webm and its limit rises to 25 MB. I will apply it, then run db:types. Update the admin uploaders for the new fields.



## 9. Quality bars

- Lighthouse mobile: Performance 85 or more, Accessibility 95 or more, SEO 95 or more. LCP under 2.5s. CLS under 0.05. Initial route JS 250 KB gzipped or less, excluding the lazy WebGL chunk.

- Keyboard navigation, visible focus rings, skip link, semantic landmarks, alt text from the database, AA contrast.

- Test at 375/768/1440px, with reduced motion on, and with 4x CPU throttling. No console errors or hydration warnings.



## 10. Rules update (.agents/rules/portfolio.md)

- Replace "one animation idea per section" with the motion system in section 6: every motion comes from a named primitive and serves the story.

- Duration limits apply to UI transitions only.

- Glow is allowed in the WebGL scene, ambient wash, cursor spotlight and interactive hover states. No permanent glow on cards or text. Gradients are ambient and WebGL only, never on text.

- The "icon-card grid" ban stays for generic feature grids. Icons on tags, labels and metrics are REQUIRED.

- Glassmorphism only on the sticky nav.

- Still banned: emoji, stock or AI imagery, fake stats, testimonials, percentage bars, "verified" labels without evidence, centered-everything layouts. Content must stay truthful, styling token-driven, components server-first, and any task touching more than 3 files needs a plan first.



## 11. Phases and gates

R0 Research and concept (GATE A).

R1 Foundations: tokens, the new migration (I apply it), icon registry, motion primitives, Lenis/GSAP, cursor, grain, preloader, page transition, nav and footer shell.

R2 Hero. GATE B: stop with screenshots at 1440/768/375 and a short screen recording if possible.

R3 Work, case-study pages, marquee strip, big-type band.

R4 About, Stack, Leadership, Credentials.

R5 Contact, footer, SEO and OG image, performance and accessibility audit, a critic pass against the banned list. GATE C: report.

After every phase: typecheck, lint and build pass, then commit.



## 12. Report at each gate

