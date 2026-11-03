# Vedanth Gali — Personal Web Platform & Dynamic CMS

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%7C%20Auth%20%7C%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

A high-performance, database-driven developer website and administrative Content Management System (CMS). Built with Next.js 16 (App Router), React 19, TypeScript, and Supabase. Every visible section, navigation link, typography style, and media asset is live-editable through a secure `/admin` control center, persisting instantly to Supabase and refreshing the live site with zero code changes or redeployments.

---

## 🌟 Key Highlights

- **Dynamic Section Engine**: Every section on the page (`Hero`, `About`, `Work`, `Marquee Band`, `Tech Stack`, `Leadership`, `Credentials`, `Contact`) is driven by PostgreSQL tables with JSONB schemas.
- **Full Admin Control Center (`/admin`)**:
  - **Drag-and-Drop Reordering**: Built with `@dnd-kit` for seamless navigation and section ordering.
  - **Rich Text & WYSIWYG**: TipTap rich text editor with server-side HTML sanitization (`isomorphic-dompurify`).
  - **Live Publishing Controls**: Toggle draft and published statuses instantly with on-demand ISR revalidation (`revalidatePath('/')`).
  - **Version Rollback**: Automatic historical snapshots (`section_versions`) enable one-click rollbacks of prior content edits.
  - **Media Asset Library**: Multi-file drag-and-drop uploader (`react-dropzone`) supporting both image and video formats with Supabase Storage integration.
  - **Typography & Theme Editor**: Select Google Fonts or upload custom fonts with dynamic CSS custom property injection.
- **Zero-Downtime Fallback Architecture**: A resilient fallback layer (`src/lib/content/fallback.ts`) ensures the site never displays a blank page, even if Supabase is initializing or undergoing network maintenance.
- **Defense-in-Depth Security**: Next.js 16 proxy network boundary (`src/proxy.ts`), Supabase Auth (Password & Magic Link), PostgreSQL security-definer RPC functions (`is_admin()`), and Row Level Security (RLS) on all tables.
- **Cinematic Visual Experience**: Symmetrical manifesto layout, 3D Hero video avatar, interactive credentials modal with lightbox preview, kinetic velocity marquees, and responsive mobile drawers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16.4 (App Router, Turbopack, Server Actions, Route Handlers) |
| **Language & Runtime** | React 19, TypeScript 5 (Strict Mode, zero `any`) |
| **Styling** | Tailwind CSS v4, CSS Custom Properties (`src/styles/tokens.css`) |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth (`@supabase/ssr`), Supabase Storage |
| **CMS & State** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@tiptap/react`, `react-hook-form`, `zod` |
| **Animation & Media** | Motion, GSAP, HTML5 Video, SVG Canvas |
| **Deployment** | Vercel (Edge Network, On-Demand ISR, Serverless Compute) |

---

## 📂 Repository Architecture

```text
├── docs/
│   ├── landing-page-inventory.md       # Content inventory & field-by-field schema reference
│   └── screenshots/                    # QA visual audit & device verification captures
├── public/
│   ├── images/                         # Static icons, vector marks, and badge graphics
│   ├── videos/                         # High-fidelity video assets (e.g. vedanth-cutout.mp4)
│   └── favicon.ico                     # Default favicon asset
├── scripts/
│   ├── db-verify.mjs                   # Supabase RLS security verification suite
│   ├── inspect-about.mjs               # Symmetrical alignment verification script
│   └── verify-hero-video.mjs           # Hero video playback & layout validation
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx                # Dynamic homepage dispatcher with JSON-LD metadata
│   │   │   └── work/[slug]/page.tsx    # Dynamic project case study routes
│   │   ├── admin/                      # Protected Admin Control Center
│   │   │   ├── layout.tsx              # Admin shell with server-side role gate
│   │   │   ├── page.tsx                # Dashboard metrics & system overview
│   │   │   ├── login/page.tsx          # Dual-mode authentication (Password / Magic Link)
│   │   │   ├── sections/page.tsx       # Drag-and-drop section manager
│   │   │   ├── sections/[id]/page.tsx  # Dynamic per-section field editor & version history
│   │   │   ├── navigation/page.tsx     # Reorderable navbar manager & CTA selector
│   │   │   ├── media/page.tsx          # Multi-asset media library & dropzone
│   │   │   ├── typography/page.tsx     # Dynamic font selector & weight manager
│   │   │   └── settings/page.tsx       # Global SEO, Open Graph & theme configuration
│   │   ├── globals.css                 # Base styling & utility declarations
│   │   ├── layout.tsx                  # Root layout injecting dynamic fonts & theme tokens
│   │   ├── robots.txt                  # Search engine crawlers directive
│   │   └── sitemap.xml                 # Search engine XML index
│   ├── components/
│   │   ├── admin/                      # Modular CMS editing interfaces
│   │   │   ├── NavbarManager.tsx       # Reorderable navigation list
│   │   │   ├── SectionsManager.tsx     # Section cards with visibility & duplicate toggles
│   │   │   ├── SectionEditor.tsx       # Tabbed form generator with rich text & styling
│   │   │   ├── MediaLibraryManager.tsx # Cloud storage dropzone & asset manager
│   │   │   ├── TypographyManager.tsx   # Font configuration controls
│   │   │   ├── RichTextEditor.tsx      # TipTap editor with HTML output
│   │   │   └── ToastContext.tsx        # Inline notification toasts
│   │   ├── sections/                   # Public landing page sections
│   │   │   ├── Navigation.tsx          # Snug responsive navbar with glassmorphism
│   │   │   ├── Hero.tsx                # Hero stage with 3D video avatar & tech marquees
│   │   │   ├── HeroVideoAvatar.tsx     # Clean HTML5 video streamer
│   │   │   ├── About.tsx               # Symmetrical engineering manifesto & dossier card
│   │   │   ├── Work.tsx                # Stacked project deck with interactive links
│   │   │   ├── BigTypeBand.tsx         # Velocity-driven kinetic ticker
│   │   │   ├── Skills.tsx              # Architecture matrix & deployment mapping
│   │   │   ├── Leadership.tsx          # Scroll-linked SVG timeline
│   │   │   ├── Certifications.tsx      # Qualifications grid with modal inspector
│   │   │   └── Footer.tsx              # Contact terminal & copyright bar
│   │   └── ui/                         # Atomic interface primitives
│   │       ├── CredentialModal.tsx     # Interactive certificate preview dialog
│   │       ├── ImageSlideshow.tsx      # Smooth multi-image carousel
│   │       ├── LightboxModal.tsx       # Asset zoom inspector
│   │       ├── SpotlightCard.tsx       # Hover-reactive radial lighting card
│   │       └── TerminalWindow.tsx      # macOS / Linux style terminal wrapper
│   ├── lib/
│   │   ├── actions/                    # Server Actions with role validation & revalidation
│   │   │   ├── sections.ts             # Section update, reorder & rollback actions
│   │   │   ├── navigation.ts           # Navbar link management actions
│   │   │   ├── media.ts                # Storage asset upload & delete actions
│   │   │   ├── fonts.ts                # Typography registration actions
│   │   │   └── settings.ts             # Global settings mutation actions
│   │   ├── content/                    # Typed data fetching layer
│   │   │   ├── index.ts                # Supabase queries with graceful fallback
│   │   │   └── fallback.ts             # Seed defaults ensuring 100% uptime
│   │   ├── supabase/                   # Supabase client configurations
│   │   │   ├── client.ts               # Browser client (anon key only)
│   │   │   ├── server.ts               # Server Component & Server Action client
│   │   │   └── proxy.ts                # Cookie-preserving proxy helper
│   │   ├── env.ts                      # Runtime environment variable validation with Zod
│   │   ├── sanitize.ts                 # Server-side HTML sanitization
│   │   └── validations.ts              # Zod validation schemas
│   ├── styles/
│   │   └── tokens.css                  # Design system color and spacing tokens
│   ├── types/
│   │   └── database.ts                 # Supabase TypeScript schema types
│   └── proxy.ts                        # Next.js 16 route protection proxy
├── supabase/
│   └── migrations/
│       └── 20261104000000_dynamic_site_cms.sql # Complete CMS schema, RLS & seed data
├── .env.example                        # Template for required environment variables
└── next.config.ts                      # Next.js 16 build configuration & remote patterns
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### 2. Clone and Install
```bash
git clone https://github.com/Mr-Wick2005/Vedanth_gali.git
cd Vedanth_gali
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Control Center.

---

## 🗄️ Supabase Database Setup

### Step 1: Run the Database Migration
1. Go to the [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Navigate to **SQL Editor** in the left sidebar.
3. Click **New query** (the `+` icon).
4. Copy the entire contents of [`supabase/migrations/20261104000000_dynamic_site_cms.sql`](supabase/migrations/20261104000000_dynamic_site_cms.sql) and paste it into the editor.
5. Click **Run**. This will create:
   - All core CMS tables (`site_settings`, `sections`, `section_versions`, `nav_items`, `media`, `section_media`, `fonts`, `admin_users`).
   - Row Level Security (RLS) policies allowing public visitors to read published data while restricting all mutations to authenticated admins.
   - Supabase Storage buckets (`media` and `fonts`) with file size and MIME-type restrictions.
   - Initial seed content matching the live site.

### Step 2: Create the Admin User
1. In your Supabase Dashboard, go to **Authentication → Users**.
2. Click **Add user → Create user** and enter your admin email and password.
3. Copy the generated `User ID` (UUID).
4. In the **SQL Editor**, run the following query to grant admin permissions:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('YOUR_COPIED_USER_UUID', 'your-email@example.com', 'admin')
   ON CONFLICT (user_id) DO NOTHING;
   ```

### Step 3: Configure Authentication URLs
In **Authentication → URL Configuration**:
- **Site URL**: `https://your-domain.vercel.app` (or `http://localhost:3000` for development).
- **Redirect URLs**:
  - `http://localhost:3000/**`
  - `http://localhost:3000/admin/**`
  - `https://your-domain.vercel.app/**`
  - `https://your-domain.vercel.app/admin/**`

---

## ☁️ Vercel Deployment Guide

This project is built and optimized for seamless zero-configuration deployment on **Vercel**.

### Step 1: Import Repository
1. Navigate to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Select your GitHub repository: `Mr-Wick2005/Vedanth_gali`.
3. Keep the default settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Add Environment Variables
Add the following keys under **Environment Variables** in the Vercel project configuration:

| Variable Name | Environments | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | Your Supabase Project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Public anonymous key for client-side queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development | Secret service role key for administrative server actions (**never exposed to client**) |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | Canonical domain (`https://your-domain.vercel.app`) |

### Step 3: Deploy & Verify
1. Click **Deploy**. Vercel will run `npm run build`, optimize static assets, and deploy the application across its global edge network.
2. Once deployed, open `https://your-domain.vercel.app/admin/login` and log in with your admin credentials.
3. Test making a minor edit in **Sections Manager** and clicking **Publish**.
4. Check your live homepage—the changes will reflect instantly via on-demand ISR revalidation without needing a redeployment.

---

## 🛡️ Security Architecture

1. **Row Level Security (RLS)**:
   - Public visitors have access to `SELECT` operations on records marked with `status = 'published'` and `is_visible = true`.
   - Unpublished drafts and section revisions remain completely shielded from the public.
   - All `INSERT`, `UPDATE`, and `DELETE` queries strictly require an authenticated admin session evaluated against `public.is_admin()`.

2. **Server-Side Authorization**:
   - The Next.js 16 Proxy layer (`src/proxy.ts`) inspects signed auth cookies and intercepts unauthorized requests before reaching `/admin` routes.
   - The Admin Layout (`src/app/admin/layout.tsx`) executes a secondary server-side RPC verification before rendering any admin controls.

3. **Input Sanitization & Validation**:
   - Every CMS action validates input data against strict `zod` schemas.
   - Rich text inputs are filtered through `isomorphic-dompurify` prior to storage and rendering, neutralizing XSS attack vectors.

4. **Zero Client Leakage**:
   - Privileged operations use `SUPABASE_SERVICE_ROLE_KEY` exclusively within server-side execution contexts.
   - The browser bundle strictly receives `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch local development server on `http://localhost:3000` |
| `npm run build` | Compile production build with Turbopack and static generation |
| `npm run start` | Start the local production server |
| `npm run typecheck` | Run strict TypeScript validation (`tsc --noEmit`) |
| `npm run lint` | Run ESLint checks across all components and libraries |
| `npm run format` | Format entire project using Prettier and Tailwind formatting rules |
| `npm run db:verify` | Run automated Supabase RLS and security checks |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Vedanth Gali**  
- **GitHub**: [@Vedanth-Gali](https://github.com/Vedanth-Gali)  
- **LinkedIn**: [linkedin.com/in/vedanth-gali](https://linkedin.com/in/vedanth-gali)  
- **Email**: [vedanthmgali@gmail.com](mailto:vedanthmgali@gmail.com)  
- **Location**: Mumbai, Maharashtra, India
