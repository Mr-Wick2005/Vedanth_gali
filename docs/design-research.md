# Design Research & Benchmark Analysis

## 1. Mobbin MCP Server Status

Per project Ground Rule 0 and Section 5.4 (_"If the MCP fails, tell me. Do not invent references"_):

- **Status**: Mobbin MCP server connected, but API requests failed with:
  `Mobbin MCP requires a paid plan. Upgrade at https://mobbin.com/pricing to continue.`
- **Action**: In accordance with the project rules, no fake Mobbin search results or simulated URLs have been fabricated.

---

## 2. Benchmark Reference Analysis: Dark Neon-Violet Portfolio

The user's aesthetic reference is a dark neon-violet developer portfolio. Below is the deconstructed design audit detailing what is kept, what is eliminated to prevent a templated look, and what is adapted for a hand-crafted, professional engineering presence.

### What We KEEP

1. **Near-Black Navy Grounding (`#06060F`)**: Deep, low-fatigue background that establishes immediate high contrast without the harshness of pure `#000000`.
2. **Single Violet Accent (`#8B5CF6`)**: Restrained color discipline. Violet provides vibrancy while remaining sophisticated and engineering-focused.
3. **Two-Tone Display Name**: Solid white for first name (`Vedanth`) paired with solid violet for surname (`Gali`), creating visual hierarchy without illegible text clipping.
4. **Wide Geometric Display Type (`Unbounded`)**: Gives the header typographic presence and structural weight.
5. **Monospace Section Counters (`01 — ABOUT`, `02 — WORK`)**: Anchors content in a technical, indexical format reminiscent of blueprints and code editors.
6. **Hero Composition**: Left-aligned headline, value statement, and actions paired with a right-aligned portrait framed by an ambient 3D geometric ring.
7. **Borders & Micro-surfaces**: Deliberate 1px borders with low-opacity violet tint (`rgba(139, 92, 246, 0.22)`).

---

### What We CHANGE (To Avoid Generic / AI-Generated Portfolio Tropes)

| Banned Generic Trope                | Why It Fails Recruiter Scrutiny                                      | What We Do Instead                                                                             |
| :---------------------------------- | :------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Gradient Text**                   | Decreases legibility at varying angles, feels dated and generic.     | Solid high-contrast text (`#F2F2FA`) with solid accent colors.                                 |
| **Glassmorphism / Heavy Blur**      | Performance-heavy, causes GPU paint lag on low-power mobile devices. | Solid dark surface (`#0D0D1F`) with crisp 1px borders.                                         |
| **Card Glows & Neon Bars**          | Distracts the eye from actual project descriptions and metrics.      | Subtle 1px border highlight (`rgba(139, 92, 246, 0.45)`) and 2px lift on hover only.           |
| **Floating Blobs / Ambient Meshes** | Read as decorative templates with no functional purpose.             | Glow is restricted strictly to the hero 3D ring and a single soft radial wash behind the hero. |
| **Skill Percentage Bars**           | Meaningless metric ("90% JavaScript" means nothing to a recruiter).  | Grouped categorical tech chips with recognizable tech icons.                                   |
| **Centered-Everything Layouts**     | Monotonous and hard to scan for hiring managers.                     | Clear left-aligned 12-column grid with strong visual rag.                                      |
| **Fake Stats & Testimonials**       | Immediately detected as artificial by senior engineers.              | Strictly dynamic metrics and counts computed from actual database records.                     |

---

## 3. Core Principles Extracted

1. **Hierarchy Before Decoration**: Typography and spacing must communicate identity, role, and proof of work in under 10 seconds.
2. **Restrained Accent Economy**: One accent color (`#8B5CF6`) applied with intention to interactive triggers, status indicators, and key metric callouts.
3. **Tactile Micro-interactions**: Fast, purposeful motion (200–400ms) with spring-like precision; no sluggish transition delays.
4. **Progressive Enhancement & Fallbacks**: The portfolio must look complete, sharp, and readable even if 3D Canvas fails to initialize or if the user has `prefers-reduced-motion` enabled.
