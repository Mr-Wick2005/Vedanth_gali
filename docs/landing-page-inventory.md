# Landing Page Content Inventory & Schema Source of Truth

This document provides a comprehensive, field-by-field inventory of every visible and configurable element on the landing page. It defines the current values rendered on the site and serves as the exact specification for the database schema, admin panel fields, and dynamic frontend integration.

---

## 1. Global & Site-Wide Settings

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `site_title` | Text | `Vedanth Gali \| Frontend & Full-Stack Developer, Mumbai` | Primary page title for browser tab and SEO |
| `site_description` | Text | `Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building scalable web platforms and leading technical events in Mumbai.` | Meta description |
| `site_keywords` | Array<Text> | `["Vedanth Gali", "Frontend Developer", "Full-Stack Developer", "Software Engineer", "React", "Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Mumbai Developer", "ICSICE 2026", "The Rkive"]` | Meta keywords |
| `site_url` | URL | `https://vedanthgali.dev` (or `process.env.NEXT_PUBLIC_SITE_URL`) | Canonical URL |
| `author_name` | Text | `Vedanth Gali` | Meta author & publisher |
| `author_email` | Email | `vedanthmgali@gmail.com` | Primary contact email |
| `author_location` | Text | `Mumbai, IN` | Location string displayed in status badges |
| `og_image_url` | URL / Path | `/og-image.png` | OpenGraph & Twitter preview card image |
| `favicon_url` | URL / Path | `/favicon.ico` | Browser tab icon |
| `theme_mode` | Enum | `dark` | Site theme default |
| `accent_color_primary` | Color Hex | `#3b82f6` (Blue 500) | Primary electric blue brand accent |
| `accent_color_secondary` | Color Hex | `#ec4899` (Pink 500) | Warm magenta / pink secondary accent |
| `bg_base_color` | Color Hex | `#05060a` | Ultra-dark void background |
| `surface_color` | Color Hex | `#0a0c14` | Card & container dark surface |
| `display_font_family` | Font | `Unbounded` (weights: 600, 700, 800) | Bold headline typography |
| `body_font_family` | Font | `Geist` (weights: 400, 500, 600) | Editorial body copy |
| `mono_font_family` | Font | `Geist Mono` (weights: 400, 500) | Developer terminal, timestamps & tags |

---

## 2. Navigation Bar (`site-navigation`)

- **Container Style**: Fixed top banner, height 60px–68px, `bg-[#05060a]/80 backdrop-blur-md border-b border-white/[0.08]`.
- **Visibility**: Always visible, sticky.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `logo_text` | Text | `VG` | Monogram text |
| `logo_accent` | Text | `.` | Monogram dot accent |
| `logo_accent_color` | Color | `text-blue-500` | Blue accent color |
| `logo_link` | Link | `/` | Home anchor |
| `nav_items` | Array<NavItem> | Listed below | Ordered navigation links |
| `cta_label` | Text | `Résumé` (fallback `Connect`) | Action button label |
| `cta_url` | URL / Link | `/resume.pdf` (or `#contact`) | External file link or section jump |
| `cta_is_external` | Boolean | `true` | Opens in new tab when pointing to document |
| `cta_style` | Style Variant | `pill-blue` | Cyan-blue border & glow |

### Navigation Links Table (`nav_items`)
| Order | Label | Target (`href`) | Visible | Is CTA |
| :---: | :--- | :--- | :---: | :---: |
| 1 | `About` | `#about` | Yes | No |
| 2 | `Work` | `#work` | Yes | No |
| 3 | `Stack` | `#stack` | Yes | No |
| 4 | `Leadership` | `#leadership` | Yes | No |
| 5 | `Credentials` | `#credentials` | Yes | No |
| 6 | `Contact` | `#contact` | Yes | No |
| 7 | `Résumé` | `/resume.pdf` | Yes | Yes |

---

## 3. Hero Section (`#hero`)

- **Container Style**: `min-h-[100svh] lg:h-[100svh] overflow-hidden bg-[#05060a] pt-14 sm:pt-16 flex flex-col justify-between`.
- **Layout**: 2-column split (7 columns editorial, 5 columns video avatar stage) + bottom marquee band.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `availability_status` | Text | `Open to work as a Frontend or Full-Stack Developer` | Live availability pill text |
| `availability_indicator` | Boolean | `true` | Shows pulsing green emerald dot |
| `location_label` | Text | `Mumbai, IN` | Pinned alongside status |
| `terminal_breadcrumb` | Text | `~/vedanth // final-year cs` | Monospace developer tag |
| `headline_first` | Text | `VEDANTH` | First line headline (white, SplitText) |
| `headline_last` | Text | `GALI` | Second line headline (gradient accent, SplitText) |
| `prompt_prefix` | Text | `$` | Monospace terminal dollar sign |
| `prompt_action` | Text | `architecting` | Fixed verb prefix |
| `rotating_phrases` | Array<Text> | 1. `production web platforms`<br>2. `high-performance fullstack systems`<br>3. `international technical conferences`<br>4. `gamified developer experiences` | Cycles every 2.5s with underline accent |
| `bio_summary` | Rich Text | `Final-year Computer Engineering student at Mumbai University. I build with React, Next.js, TypeScript and Supabase, and I have deployed a digital publishing platform for real use at my college.` | Concise hero narrative |
| `cta_primary_label` | Text | `Explore Platforms` | Primary magnetic action button |
| `cta_primary_url` | Link | `#work` | Scrolls to work showcase |
| `cta_primary_icon` | Icon | `arrow-down` | Downward motion icon |
| `cta_secondary_label` | Text | `Download Résumé` | Secondary action button |
| `cta_secondary_url` | URL / Link | `/resume.pdf` | Direct download / inspect |
| `cta_secondary_icon` | Icon | `download` | Download icon |
| `show_live_clock` | Boolean | `true` | Renders IST clock (`MUMBAI IST: HH:MM:SS`) |
| `education_chip` | Text | `Mumbai University '27` | Inline cohort credential |
| `avatar_video_webm` | Media URL | `/videos/avatar-animation.webm` | High-efficiency VP9 alpha video |
| `avatar_video_mp4` | Media URL | `/videos/avatar-animation.mp4` | Universal MP4/H.264 fallback |
| `avatar_fallback_image` | Media URL | `/images/vedanth-cutout.svg` | Static vector cutout fallback |
| `avatar_alt_text` | Text | `Vedanth Gali 3D Avatar` | Accessibility label |
| `marquee_row_1` | Array<Tech> | Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS v4, PostgreSQL, Node.js, Python | Leftward ticker (speed 28) |
| `marquee_row_2` | Array<Tech> | Three.js, GSAP, Docker, Git & GitHub, REST & GraphQL, Figma UI/UX, Linux, TensorFlow | Rightward ticker (speed 32) |

---

## 4. About & Discipline Section (`#about`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] py-16 sm:py-24`.
- **Layout**: Symmetrical 12-column grid (`items-stretch`, equal height 7-col vs 5-col split).

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 03 — ABOUT & DISCIPLINE ]` | Section number in blue-400 |
| `heading_line_1` | Text | `ENGINEERING,` | Display typography |
| `heading_line_2` | Text | `DESIGN & LEADERSHIP.` | Gradient accent highlight |
| `terminal_title` | Text | `~/profile/engineering-philosophy.md` | macOS terminal window chrome title |
| `terminal_status` | Text | `VERIFIED` | Green/blue verified pill badge |
| `terminal_kicker` | Text | `// CORE PHILOSOPHY & OBJECTIVE` | Code comment subheader |
| `biography_narrative` | Rich Text | `I bridge systems engineering, creative direction, and technical event leadership. As a developer, I build full-stack web platforms with Next.js, React, TypeScript, and Supabase — including The Rkive, a digital publishing platform with custom flipbook physics deployed for real use at my college. In parallel, I served as Conference Coordinator & Creative Head for ICSICE 2026 and Head of the Hackathon Club, guiding multi-disciplinary teams and technical operations.` | Progressive ScrollFill text |
| `discipline_1_title` | Text | `01 // Systems` | Blue systems pillar |
| `discipline_1_body` | Text | `Full-stack engineering with Next.js 16, React 19, TypeScript, and Supabase. End-to-end ownership from interface to database RLS.` | Card copy |
| `discipline_2_title` | Text | `02 // Creative` | Pink creative pillar |
| `discipline_2_body` | Text | `Creative Head for ICSICE 2026. Directing visual branding, promotional media, flipbook reading UX, and cinematic design systems.` | Card copy |
| `discipline_3_title` | Text | `03 // Operations` | Emerald operations pillar |
| `discipline_3_body` | Text | `Conference Coordinator & Hackathon Club Head. Mentoring student engineers, shaping technical challenges, and executing events.` | Card copy |
| `dossier_badge` | Text | `FINAL YEAR` | Status badge with pulsing green light |
| `dossier_title` | Text | `VG. ENGINEER & DIRECTOR` | Dossier header title |
| `portrait_image` | Media URL | `/images/vedanth-cutout.svg` (or profile avatar) | 4:3 authentic portrait |
| `dossier_name` | Text | `VEDANTH GALI` | Full legal/display name |
| `dossier_role` | Text | `Frontend & Full-Stack Dev` | Primary professional title |
| `dossier_degree` | Text | `B.E. Comp Eng` | Degree title |
| `dossier_timeline` | Text | `2023 – 2027` | Academic cohort timeline |
| `dossier_institution` | Text | `Mumbai University, IN` | College / University name |

---

## 5. Work / Flagship Platforms Section (`#work`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] py-16 sm:py-24`.
- **Layout**: Stacked vertical deck with sticky card scrolling offsets (`calc(4.5rem + idx * 16px)`).

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 04 — SELECTED PRODUCTION WORK ]` | Section number in blue-400 |
| `heading_line_1` | Text | `PRODUCTION` | Display typography |
| `heading_line_2` | Text | `PLATFORMS.` | Gradient accent highlight |
| `section_subtitle` | Text | `Live full-stack applications with authenticated student users, interactive simulation suites, and deep-learning models.` | Monospace section summary |

### Project 1: The Rkive
- **Slug**: `the-rkive`
- **Category Badge**: `FLAGSHIP PRODUCTION` (pulsing green dot)
- **Year**: `2024–2025`
- **Index**: `01`
- **Title**: `The Rkive — Academic Publishing Platform`
- **Summary**: `A high-performance digital publishing platform engineered for college departments, featuring custom flipbook interaction physics, server-side PDF rasterization, and zero-latency reading.`
- **Metrics**:
  1. Label: `Active Readers`, Value: `100+ Students`
  2. Label: `Performance`, Value: `98% Lighthouse`
  3. Label: `First Contentful Paint`, Value: `0.4s FCP`
- **Stack**: `Next.js 16`, `React 19`, `Supabase`, `Tailwind CSS`, `TypeScript`, `PostgreSQL`
- **Live URL**: `https://the-rkive.vercel.app` (or verified link)
- **Repo URL**: `https://github.com/vedanthgali/the-rkive`
- **Gallery Media**: 3 screenshots showing desktop flipbook, mobile reader, and CMS dashboard.

### Project 2: Escape: The Placement Cell
- **Slug**: `escape-placement-cell`
- **Category Badge**: `INTERACTIVE SIMULATION` (cyan dot)
- **Year**: `2024`
- **Index**: `02`
- **Title**: `Escape: The Placement Cell`
- **Summary**: `An isometric 2.5D gamified aptitude and interview simulation web platform. Integrates interactive logic puzzles, real-time timer systems, and departmental leaderboards.`
- **Metrics**:
  1. Label: `Engaged Players`, Value: `500+ Players`
  2. Label: `Render Latency`, Value: `<16ms 60FPS`
  3. Label: `Simulation Engine`, Value: `Canvas 2D`
- **Stack**: `React`, `Canvas API`, `Tailwind CSS`, `TypeScript`, `Supabase`
- **Live URL**: `https://escape-placement.vercel.app`
- **Repo URL**: `https://github.com/vedanthgali/escape-placement`
- **Gallery Media**: 2 screenshots showing puzzle board and results matrix.

### Project 3: Plant Leaf Disease Detection
- **Slug**: `plant-leaf-disease-detection`
- **Category Badge**: `ML RESEARCH` (pink dot)
- **Year**: `2024`
- **Index**: `03`
- **Title**: `Plant Leaf Disease Detection`
- **Summary**: `Deep convolutional neural network architecture trained to classify agricultural crop leaf diseases across 38 class variations with real-time browser inference.`
- **Metrics**:
  1. Label: `Validation Accuracy`, Value: `96.4%`
  2. Label: `Disease Classes`, Value: `38 Variations`
  3. Label: `Architecture`, Value: `MobileNetV2`
- **Stack**: `Python`, `TensorFlow`, `Keras`, `Streamlit`, `OpenCV`
- **Repo URL**: `https://github.com/vedanthgali/plant-disease-detection`
- **Gallery Media**: 2 screenshots showing model evaluation metrics and disease classification interface.

---

## 6. Big-Type Velocity Marquee Band

- **Container Style**: `bg-black border-y border-white/[0.08] py-8 sm:py-12 overflow-hidden`.
- **Animation**: GSAP ScrollTrigger directional velocity momentum marquee.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `marquee_phrase` | Text | `OPEN TO WORK • FRONTEND & FULL-STACK • MUMBAI • 2027 • ` | Outlined and filled typography alternation |
| `speed_multiplier` | Number | `1.0` | Velocity dynamic decay |

---

## 7. Tech Stack & Architecture Section (`#stack`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] py-16 sm:py-24`.
- **Layout**: Active production bar + 3-column equal-height categorized matrix.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 06 — TECH STACK & ARCHITECTURE ]` | Section number in blue-400 |
| `heading_line_1` | Text | `ENGINEERING` | Display typography |
| `heading_line_2` | Text | `STACK.` | Gradient accent highlight |
| `section_subtitle` | Text | `Distinguishing active production technologies deployed in live builds from foundational academic engineering proficiencies.` | Header summary text |
| `production_badge_label` | Text | `ACTIVE PRODUCTION STACK` | Header in spotlight bar |
| `production_badge_subtext` | Text | `Live in deployed platforms: The Rkive, Escape Placement Cell` | Spotlight subtext |
| `production_technologies` | Array | Next.js 14/16, React 19, TypeScript, Supabase & RLS, PostgreSQL, Tailwind CSS v4, Python & TF, Git & Vercel | Pinned spotlight chips with deployed project tags |

### Categorized Skills Grid
1. **Frontend**: Next.js, React, TypeScript, Tailwind CSS, JavaScript, HTML5, CSS3
2. **Backend**: Node.js, Express, REST APIs, Supabase Edge Functions
3. **Databases**: Supabase, PostgreSQL, MySQL
4. **Tools**: Git & GitHub, Vercel, Docker, VS Code, Linux/Bash, Postman
5. **Design**: Figma, Responsive Design, Design Systems, Wireframing
6. **Machine Learning**: Python, TensorFlow, Keras, OpenCV, NumPy, Pandas
7. **Languages**: TypeScript, JavaScript, Python, C++, Java, SQL

---

## 8. Leadership & Operations Timeline (`#leadership`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] py-16 sm:py-24`.
- **Layout**: Animated progress line, glowing nodes, oversized parallax year numbers, and 2-column cards.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 07 — POSITIONS OF RESPONSIBILITY & CONFERENCES ]` | Section number in blue-400 |
| `heading_line_1` | Text | `LEADERSHIP &` | Display typography |
| `heading_line_2` | Text | `EVENT DIRECTION.` | Gradient accent highlight |

### Timeline Roles
1. **Conference Coordinator & Creative Head — ICSICE 2026**
   - **Company / Event**: `ICSICE 2026`
   - **Badge**: `CONFERENCE DIRECTION` (pink)
   - **Year**: `2026`
   - **File Tag**: `~/leadership/conference-coordinator-creative-head.tsx`
   - **Description**: `Coordinated operations and directed end-to-end visual identity for the International Conference on Smart Information and Communication Engineering.`
   - **Highlights**:
     - `Directed stage branding, promotional media, and conference kit design`
     - `Led a 25+ student volunteer committee across technical sessions and logistics`
     - `Coordinated with international researchers, keynote speakers, and session chairs`
   - **Media**: Multi-photo gallery slideshow with zoom lightbox.

2. **Head of Hackathon Club — Mumbai University Student Chapter**
   - **Company / Org**: `Department Hackathon Club`
   - **Badge**: `HACKATHON OPERATIONS` (emerald)
   - **Year**: `2025`
   - **File Tag**: `~/leadership/head-of-hackathon-club.tsx`
   - **Description**: `Organized university-wide hackathons, curated technical problem statements, mentored 120+ participants.`
   - **Highlights**:
     - `Spearheaded 36-hour hackathons with 120+ participating student developers`
     - `Curated real-world problem statements across AI, web3, and IoT tracks`
     - `Engineered evaluation portal and rubric tracking for industry judges`
   - **Media**: Multi-photo gallery slideshow.

3. **Technical Activity Coordinator — Computer Engineering Council**
   - **Company / Org**: `Computer Engineering Student Council`
   - **Badge**: `TECHNICAL LEADERSHIP` (blue)
   - **Year**: `2024`
   - **File Tag**: `~/leadership/technical-activity-coordinator.tsx`
   - **Description**: `Led technical workshops on modern web development, Git workflows, and competitive coding.`
   - **Highlights**:
     - `Conducted hands-on workshops on React, TypeScript, and Git for 80+ peers`
     - `Managed technical lab environments and setup for departmental competitions`
     - `Mentored junior engineers on open-source contributions and portfolio development`
   - **Media**: Multi-photo gallery slideshow.

---

## 9. Verified Credentials & Certifications Rail (`#credentials`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] py-16 sm:py-24`.
- **Layout**: 4-column symmetrical card showcase with 3D tilt, hover inspect pill, and full-screen detail modal.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 08 — CERTIFICATIONS & ACADEMIC MERIT ]` | Section number in blue-400 |
| `heading_line_1` | Text | `VERIFIED` | Display typography |
| `heading_line_2` | Text | `QUALIFICATIONS.` | Gradient accent highlight |
| `section_subtitle` | Text | `Directly displaying verified academic coursework certifications, competitive industry simulations, and engineering credentials.` | Monospace section summary |

### Credentials List
1. **Meta Front-End Developer Specialization**
   - **Issuer**: `Coursera / Meta`
   - **Year**: `2024`
   - **Credential ID**: `META-FE-98421`
   - **Verification URL**: `https://coursera.org/verify/specialization/meta-front-end`
   - **Skills**: `React, JavaScript, CSS Architecture, UI/UX Principles`
   - **Media**: Certificate document replica preview + verified badge.

2. **Full-Stack Web Development with React & Node**
   - **Issuer**: `freeCodeCamp`
   - **Year**: `2024`
   - **Credential ID**: `FCC-FS-5501`
   - **Verification URL**: `https://freecodecamp.org/certification/vedanthgali/full-stack`
   - **Skills**: `Full-Stack Architecture, Node.js, Express, MongoDB, REST`
   - **Media**: Certificate document preview.

3. **Postman API Fundamentals Student Expert**
   - **Issuer**: `Postman`
   - **Year**: `2024`
   - **Credential ID**: `PSTMN-EXP-2024`
   - **Verification URL**: `https://badgr.com/public/assertions/postman-student-expert`
   - **Skills**: `API Testing, Mock Servers, Postman Collections, CI/CD Integration`
   - **Media**: Official badge preview.

4. **Machine Learning with Python**
   - **Issuer**: `IBM / Cognitive Class`
   - **Year**: `2023`
   - **Credential ID**: `IBM-ML-7729`
   - **Verification URL**: `https://cognitiveclass.ai/certificates/machine-learning-python`
   - **Skills**: `Scikit-Learn, Regression, Classification, Model Evaluation`
   - **Media**: Course certificate preview.

---

## 10. Kinetic Contact Stage & Editorial Footer (`#contact`)

- **Container Style**: `bg-[#05060a] border-t border-white/[0.08] pt-24 pb-12`.

| Field Name | Type | Current Value | Notes |
| :--- | :--- | :--- | :--- |
| `section_kicker` | Text | `[ 09 — NEXT STEPS & CONTACT ]` | Section number in blue-400 |
| `heading_line_1` | Text | `LET'S BUILD` | Display typography |
| `heading_line_2` | Text | `TOGETHER.` | Gradient accent highlight |
| `section_body` | Text | `Open to full-time Frontend & Full-Stack engineering opportunities. Available to discuss systems architecture, production web builds, and technical creative direction.` | Contact narrative |
| `email_address` | Email | `vedanthmgali@gmail.com` | Primary contact email |
| `cta_primary_label` | Text | `Send An Email` | Mailto button |
| `cta_copy_label` | Text | `Copy Email` | Interactive clipboard copy |
| `copied_feedback_label` | Text | `Copied to Clipboard` | Feedback toast on click |
| `social_links` | Array<SocialLink> | GitHub, LinkedIn, Email, Phone | Social network links with icons |
| `copyright_text` | Text | `© 2026 Vedanth Gali` | Bottom colophon |
| `admin_link_text` | Text | `// admin` | Direct link to `/admin` dashboard |
| `back_to_top_text` | Text | `Back to Top` | Smooth scroll trigger |
