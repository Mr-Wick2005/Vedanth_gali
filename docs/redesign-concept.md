# Concept Specification: "Dark Stage, Violet Light"
**Subject:** Vedanth Gali Portfolio Presentation Layer Reconstruction  
**Document:** `docs/redesign-concept.md`  
**Phase:** R0 (Concept Definition & Architecture Blueprint)

---

## 1. Concept Statement

> **"Dark Stage, Violet Light"**  
> An editorial, cinematic web experience where dark atmospheric space, tactile light, and kinetic typography showcase Vedanth Gali as a builder who ships real platforms and leads engineering communities.

The redesign rejects the repetitive rounded-card template in favor of an **architectural staging model**:
- **Monotony broken:** Full-bleed typographic bands, asymmetric split viewports, sticky stacked card decks, and physical tactile objects (e.g. 3D Student ID Card, draggable credential badges).
- **Light as material:** Illumination flows from an electric-violet and neon-blue WebGL energy field, reactive cursor spotlights, and edge highlights rather than flat card borders.
- **Editorial typographic scale:** 12–14vw display headlines juxtaposed against crisp monospace metadata and high-contrast lilac-white body copy.
- **Truthful evidence:** Every card, badge, and chip directly links to verified GitHub repos, live deployments (*The Rkive*, *Nirvana*, *SkillForge*), and verifiable leadership accomplishments.

---

## 2. Design Token System Updates

### 2.1 Color Tokens
```css
:root {
  /* Canvas & Stages */
  --color-stage-black: #000000;         /* Pure black stage for Hero & Vignettes */
  --color-stage-deep: #06060f;          /* Core page background */
  --color-stage-indigo: #0a0a1f;        /* Deep spatial indigo underlay */
  
  /* Surfaces & Containers */
  --color-surface-base: #0d0d1f;        /* Subtle card & panel base */
  --color-surface-elevated: #14142b;    /* Hover & active states */
  --color-surface-glass: rgba(13, 13, 31, 0.72); /* Sticky nav backdrop */

  /* Hairlines & Borders */
  --color-hairline: rgba(255, 255, 255, 0.08); /* Minimal structural dividers */
  --color-hairline-accent: rgba(167, 139, 250, 0.25); /* Focused violet dividers */
  --color-border-glow: rgba(139, 92, 246, 0.4);

  /* Typography */
  --color-text-hero: #ffffff;           /* Ultra-bright display headlines */
  --color-text-lilac: #e8e5f7;          /* High-contrast primary text (AA+) */
  --color-text-muted: #9594b2;          /* Secondary meta & descriptions */
  --color-text-dim: rgba(255, 255, 255, 0.28); /* Scroll-fill base state */

  /* Accents & Energy */
  --color-violet-core: #8b5cf6;         /* Primary brand violet */
  --color-violet-glow: #a78bfa;         /* Neon electric highlight */
  --color-cyan-glow: #38bdf8;           /* Blue rim lighting accent */
  --color-violet-wash: rgba(139, 92, 246, 0.08); /* Ambient spotlights */
}
```

### 2.2 Typography Scale & Rules
- **Display Face:** `Unbounded` (weights 600, 700, 800) for hero display headlines, project titles, and section chapter numbers.
  - Scale: `clamp(3rem, 12vw, 11rem)` for hero name; `clamp(2rem, 5vw, 4.5rem)` for project titles.
  - Stroke utility: `-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.35); color: transparent;` for oversized numerals (`01`, `02`, `03`) and year numerals.
- **Body Face:** `Geist Sans` set at minimum **17px** (`1.0625rem`) with line-height `1.65` for optimal readability.
- **Monospace Face:** `Geist Mono` for status badges, live clocks, coordinate tags, and technical specs.

---

## 3. Per-Section Architectural Blueprints

### Section 0: Monogram Preloader
- **Visual:** Minimal full-screen curtain (`#000000`) with a central geometric `VG` monogram and a high-speed tabular monospace counter (`00` → `100`).
- **Timing:** Completes within 1.2s to 1.6s.
- **Exit:** GSAP curtain split reveal (top/bottom or vertical wipe) unlocking the hero.
- **Persistence:** Saved in `sessionStorage`; subsequent visits or reloads in the same session bypass the preloader directly.

### Section 1: Hero Stage (100svh)
- **Visual Layers (Back to Front):**
  1. Ambient dark wash with radial indigo illumination and 3.5% procedural film grain.
  2. Three.js / R3F Canvas: Rotating neon energy ring (electric violet + subtle cyan rim) + 1200 glowing particle motes that subtly repel from pointer coordinates.
  3. Real Cutout Portrait (`/images/vedanth-cutout.webp`): High-resolution cutout anchored seamlessly to the bottom-right stage without any container, box, or avatar border.
  4. Foreground Depth Ring Arc: Subtle Three.js occluding front arc wrapping around the lower shoulder, creating genuine 3D spatial integration.
  5. Editorial Typography Layer (Left):
     - Monospace metadata pill: `[ STATUS: AVAILABLE FOR ROLES ]` + pulsating green dot.
     - Oversized Hero Name: `VEDANTH` in pure white, `GALI` in electric violet, split into characters for a staggered rise-in entrance. Spring skew on character hover.
     - Dynamic rotating tagline: *"I build [responsive web platforms / full-stack systems / engineering communities]"* toggling vertically every 2.4s.
     - Live detail strip: Live Mumbai (IST) clock, current university standing (Final Year B.E. 2027), social icon links.
     - Magnetic CTAs: Primary "View My Work" (with arrow icon) and Secondary "Download Résumé" (with download icon).

### Section 2: Infinite Brand Marquee Strip
- **Visual:** Two horizontal rows of authentic brand icons moving in opposite directions across the screen.
- **Row 1 (Left to Right):** Next.js, React, TypeScript, Node.js, Tailwind CSS, PostgreSQL, Supabase, Python.
- **Row 2 (Right to Left):** Git, Docker, GraphQL, Redis, GSAP, Three.js, Figma, Linux.
- **Behavior:** Pure CSS infinite loop; automatically pauses when hovered.

### Section 3: About & Interactive 3D Student ID Card
- **Layout:** Asymmetric two-column split.
- **Left Column:** Pinned narrative block with word-by-word scroll-fill animation via GSAP ScrollTrigger. Muted gray text transitions to brilliant lilac-white as the visitor scrolls through his journey from college platforms to technical community leadership.
- **Right Column:** Physical 3D Student ID Card:
  - Realistic dimensions with smooth rounded corners (`16px`), glass sheen, and hairline metallic edge.
  - Features: Vedanth's portrait crop, Student Name, "B.E. Computer Engineering", "Mumbai University", "2023–2027", and a highlighted `FINAL YEAR` chip.
  - Interaction: Follows mouse movement with 3D tilt up to ±12 degrees and an active specular highlight gradient tracking the pointer.
- **Bottom Facts Strip:** Metric count-ups with icons:
  - Projects Shipped (`3+`)
  - Leadership Roles (`3`)
  - Certifications (`6+`)

### Section 4: Stacked Work Showcase
- **Mechanism:** Full-viewport sticky cards using GSAP ScrollTrigger. As the user scrolls down, Card 01 pins, and Card 02 slides over it while Card 01 gently scales down to `0.94`, dims opacity to `0.6`, and gains a subtle `2px` blur.
- **Card Content:**
  - Giant outlined stroke numeral (`01`, `02`, `03`) floating in the background.
  - Project Title in wide Unbounded typography.
  - Project Summary with role and year icons.
  - Real metric chips with count-up animations (e.g. *The Rkive*: "500+ Active Users", "40% Time Saved").
  - Tech stack icon row (Simple Icons).
  - Magnetic Action Buttons: "Case Study" (deep link to `/work/[slug]`), "Live Demo" (external), "GitHub" (external).
  - Media Mockup: Browser-frame device container displaying high-fidelity screenshots of the actual platform, equipped with subtle 3D hover tilt (up to 6°) and mouse parallax.
  - Custom Cursor: Hovering over the media transforms the cursor into a pulsing circular `VIEW` badge.
- **Case Study Subpages (`/work/[slug]`):**
  - Full-bleed media banner, meta matrix with icons, Problem/Solution/Outcome sections, interactive metrics, and a giant "Next Project" transition footer.

### Section 5: Dynamic Typographic Status Band
- **Visual:** Full-bleed marquee ribbon: `OPEN TO WORK • FRONTEND & FULL-STACK • MUMBAI • 2027 •`.
- **Interaction:** Scroll-velocity linked: scrolling faster speeds up the marquee; reversing scroll direction smoothly flips the translation direction.

### Section 6: Tech Stack Matrix with Bidirectional Cross-Mapping
- **Visual:** Categorized grid of tech tiles (Frontend, Backend, Languages, Databases, Tools).
- **Icons:** Simple Icons for official brand logos; Lucide icons for conceptual technologies (REST APIs, UI/UX).
- **Interaction:** Hovering any tile lifts it with a subtle spring tilt and reveals a floating tooltip badge: *"Used in: The Rkive, Personal Portfolio"*, computed in real-time by matching `skills.name` with `projects.stack`.

### Section 7: Leadership & Community Timeline
- **Visual:** Vertical chaptered timeline connected by a luminous violet progress spine that fills as you scroll.
- **Background:** Huge outlined year numerals (`2024`, `2025`, `2026`) drifting softly in parallax behind the text.
- **Cards:** Each role features an organization icon badge, role title in display font, tenure label, 2–3 quantified bullet points with icon bullets, and a high-contrast photo reveal mask. (Tasteful geometric typographic fallback if photo is pending).

### Section 8: Draggable Credentials Rail
- **Visual:** Horizontal auto-scrolling rail of credential cards.
- **Content:** Issuer logo (Oracle, AWS, Coursera), credential title, issue year, and "View credential" link (only displayed when URL exists).
- **Interaction:** Grabbable and draggable with inertia; pauses on hover; opens full credential image or certificate URL in a clean lightbox. No fake "Verified" claims.

### Section 9: Kinetic Contact Stage & Editorial Footer
- **Visual:**
  - Massive kinetic headline: `LET'S BUILD TOGETHER.`
  - Oversized Magnetic "Send an Email" CTA button.
  - Secondary "Copy Email" button with instant toast confirmation (`vedanth.gali@... copied to clipboard`).
  - Monospace Info Grid: Live Mumbai (IST) digital clock, Availability status indicator, Social icon links (GitHub, LinkedIn, Email).
  - Giant edge-to-edge `VEDANTH GALI` wordmark that slowly scales into view at the very bottom.
  - "Back to Top" magnetic button.
  - *Clean removal:* Zero public CMS links; zero "Computed live" developer debug lines. Admin remains strictly accessible by direct URL with `noindex`.

---

## 4. Motion System Architecture

### 4.1 Libraries & Separation of Concerns
1. **Lenis (`@studio-freight/lenis` / `lenis`):** Viewport smooth scroll and inertial momentum.
2. **GSAP + ScrollTrigger:** Scroll-linked pinning, stacked card transitions, word-fill scrollytelling, velocity calculations.
3. **Motion (`motion/react`):** Component-level layout animations, interactive springs, hover physics, dialog presence.
4. **Three.js + React Three Fiber (`three`, `@react-three/fiber`):** Real-time 3D glowing energy ring and particle field in Hero.

*Rule:* Never drive the same CSS property on the same element with two different libraries.

### 4.2 Motion Primitives (`src/components/motion/`)
- `Reveal.tsx`: Viewport intersection fade & slide up using Motion.
- `SplitText.tsx`: Splits text into words or characters for staggered reveal and hover physics.
- `Marquee.tsx`: GPU-accelerated CSS marquee with pause-on-hover and velocity multipliers.
- `Magnetic.tsx`: Physics spring attraction to pointer coordinates for buttons and icons.
- `Tilt.tsx`: 3D perspective tilt on mousemove for project cards and student ID.
- `CountUp.tsx`: Smooth numeric interpolation from 0 to target value on scroll view.
- `ScrollFill.tsx`: Word-by-word opacity transition driven by GSAP ScrollTrigger.
- `ImageReveal.tsx`: Clip-path geometric curtain reveal for project and leadership media.
- `Cursor.tsx`: Custom desktop cursor with dot, magnetic ring, and context badges (`VIEW`, `DRAG`).
- `Preloader.tsx`: Monogram counter and split curtain screen.
- `Clock.tsx`: Real-time IST clock with second-hand pulse.

### 4.3 Accessibility & Reduced Motion
- When `prefers-reduced-motion: reduce` is detected:
  - Disable GSAP pinning, camera dollying, and 3D tilts.
  - Display cards in a clean, high-contrast static vertical layout.
  - WebGL canvas replaced by static high-res graphic or disabled.
  - Marquees remain static or display as a flex-wrap tag grid.

---

## 5. Performance Budget & Core Web Vitals

| Metric | Target | Implementation Strategy |
| :--- | :--- | :--- |
| **Lighthouse Performance** | **≥ 85** (Mobile) | Code splitting, image optimization, lightweight SVG noise |
| **Lighthouse Accessibility** | **≥ 95** | High-contrast text (>4.5:1), ARIA labels, semantic landmark tags |
| **Lighthouse SEO** | **≥ 95** | Structured Person JSON-LD, OpenGraph tags, semantic headers |
| **LCP (Largest Contentful Paint)** | **< 2.5s** | Hero cutout loaded via `next/image` with `priority`; WebGL deferred |
| **CLS (Cumulative Layout Shift)**| **< 0.05** | Fixed aspect-ratio containers for all media, no dynamic layout shifts |
| **Initial JS Payload** | **< 250 KB** | Heavy Three.js bundle lazy-loaded via `requestIdleCallback` |

---

## 6. Mobile & Responsive Strategy (375px / 768px / 1440px)

- **Mobile Viewport (< 768px):**
  - Disable custom cursor and magnetic hover attractions entirely.
  - Hero layout stacks vertically: Name and headline first, followed by portrait cutout.
  - WebGL replaced with lightweight CSS conic gradient ring to conserve battery and GPU cycles.
  - Work section converts from stacked viewport pinning into a standard vertical card feed.
  - About ID Card renders flat with subtle gradient instead of 3D tilt.
- **Tablet (768px – 1024px):**
  - Side-by-side hero with proportional typography scaling (`clamp()`).
  - Simplified scroll-fill speeds.
- **Desktop (1024px+):**
  - Full experiential mode enabled: WebGL depth occlusion, stacked card deck, custom magnetic cursor, and 3D pointer physics.
