# Vedanth Gali — Personal Portfolio & CMS

A high-performance, hand-crafted developer portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router, `src/` directory, React 19).
- **Styling**: Tailwind CSS v4 driven by design tokens in `src/styles/tokens.css`.
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) on all tables.
- **Authentication**: Supabase Auth with cookie management via `@supabase/ssr` and Next.js 16 network proxy (`src/proxy.ts`) verifying cryptographic JWT claims via `supabase.auth.getClaims()`.
- **Storage**: Supabase Storage bucket (`media`) with public read access and admin-only upload/mutation policies.
- **Animation / 3D**: Motion, GSAP, Lenis, and Three.js / React Three Fiber (installed for upcoming phases).

---

## 📂 Directory Layout

```
├── .agents/
│   └── rules/portfolio.md          # Agent and developer constraints & design rules
├── docs/
│   ├── BRIEF.md                    # Master prompt, Content Bible & ground rules
│   ├── design-research.md          # Mobbin portfolio research & benchmark notes
│   └── design-spec.md              # Final tokens, type scale, grid & component spec
├── scripts/
│   └── db-verify.mjs               # 15 automated RLS security & access tests (anon role)
├── src/
│   ├── app/
│   │   ├── (site)/                 # Public routes (Home, Case studies /work/[slug])
│   │   ├── admin/                  # Protected CMS portal (Login, Dashboard, CRUD)
│   │   ├── globals.css             # Global Tailwind & token bindings
│   │   └── layout.tsx              # Root HTML shell & typography variables
│   ├── components/
│   │   ├── admin/                  # CMS UI components (SignOutButton, uploaders)
│   │   ├── sections/               # Portfolio sections (Hero, About, Work, etc.)
│   │   ├── three/                  # 3D canvas and procedural elements
│   │   └── ui/                     # Reusable atomic UI components
│   ├── lib/
│   │   ├── content/                # Typed data fetching layer with ISR/fallback
│   │   └── supabase/               # Browser client, Server client, Proxy helper
│   ├── styles/
│   │   └── tokens.css              # Single source of truth for colors, type & spacing
│   ├── types/
│   │   └── database.ts             # Supabase schema TypeScript definitions
│   └── proxy.ts                    # Next.js 16 network boundary proxy
└── supabase/
    ├── migrations/                 # PostgreSQL schema, triggers & RLS policies
    └── seed.sql                    # Initial Content Bible database records
```

---

## 🚀 Getting Started

### 1. Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

A template is available in `.env.local.example`.

### 2. Available Scripts

| Command             | Description                                                       |
| :------------------ | :---------------------------------------------------------------- |
| `npm run dev`       | Start development server on `http://localhost:3000`               |
| `npm run build`     | Compile production build with static pre-rendering                |
| `npm run start`     | Start production server                                           |
| `npm run typecheck` | Run TypeScript strict compiler checks (`tsc --noEmit`)            |
| `npm run lint`      | Run ESLint checks                                                 |
| `npm run format`    | Format entire codebase using Prettier and Tailwind plugin         |
| `npm run db:verify` | Run all 15 automated RLS security checks against Supabase         |
| `npm run db:types`  | Regenerate TypeScript database types from linked Supabase project |

---

## 🔒 Supabase Database & Security Model

### Tables

1. `profile`: Name, headline, short/long bio, location, email, avatar, resume URL.
2. `site_settings`: SEO title, meta description, OpenGraph image, availability toggles.
3. `projects`: Slug, title, summary, problem, solution, outcome, role, year, tech stack, metrics, live/repo URLs, gallery.
4. `experience`: Organization, title, start/end dates, period label, description, highlights.
5. `education`: Degree, institution, field of study, years, graduation status.
6. `certifications`: Title, issuing body, year, credential link, badge image.
7. `skills`: Grouped technologies (Frontend, Languages, Backend, Databases, Design, Tools, ML).
8. `social_links`: GitHub, LinkedIn, Email, and public phone number.
9. `admin_users`: References `auth.users(id)` for users granted admin access.

### Security Definer & RLS

- **`public.is_admin()`**: Security-definer helper checking if `auth.uid()` exists in `public.admin_users`.
- **Row Level Security**:
  - Public visitors can **only SELECT published records** (`is_published = true`) and public single-row configs (`profile`, `site_settings`).
  - Unpublished drafts are completely invisible to anonymous visitors.
  - INSERT, UPDATE, and DELETE operations are restricted to confirmed admin users.
  - Bucket `media` has public read access, but only admins can upload, modify, or delete files.

### Applying Migrations & Initial Setup

```bash
# 1. Link Supabase project
npx supabase link --project-ref <your-project-ref>

# 2. Push schema migrations
npx supabase db push

# 3. Seed initial content
# Paste supabase/seed.sql into Supabase Web SQL Editor and execute.

# 4. Verify RLS and Security
npm run db:verify
```

### Creating Your First Admin User

1. In the Supabase Dashboard, go to **Authentication → Users → Add User → Create User**.
2. Enter your email (`vedanthmgali@gmail.com`) and choose a secure password.
3. In **Authentication → Providers → Email**, uncheck **"Enable Signups"** to prevent public registrations.
4. Open the SQL Editor and insert your user ID into `admin_users`:
   ```sql
   insert into public.admin_users (user_id) values ('<YOUR_COPIED_USER_UID>');
   ```
5. Log in at `http://localhost:3000/admin/login`.
