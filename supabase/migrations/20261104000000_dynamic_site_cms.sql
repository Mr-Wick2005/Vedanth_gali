-- 20261104000000_dynamic_site_cms.sql
-- Database-driven dynamic site schema with versioning, media management, typography, and strict RLS

-- ============================================================================
-- 1. Helper Functions & Updated At Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- Ensure is_admin function exists and is secured
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- ============================================================================
-- 2. Admin Users Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin';

-- ============================================================================
-- 3. Site Settings Enhancements (Global Configuration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text NOT NULL DEFAULT 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
  site_description text NOT NULL DEFAULT 'Final-year Computer Engineering student and developer building scalable web platforms.',
  site_keywords text[] NOT NULL DEFAULT '{"Vedanth Gali", "Frontend Developer", "Full-Stack Developer", "Next.js", "React", "TypeScript", "Supabase"}'::text[],
  site_url text NOT NULL DEFAULT 'https://vedanthgali.dev',
  author_name text NOT NULL DEFAULT 'Vedanth Gali',
  author_email text NOT NULL DEFAULT 'vedanthmgali@gmail.com',
  author_location text NOT NULL DEFAULT 'Mumbai, IN',
  og_image_url text DEFAULT '/og-image.png',
  og_image_alt text DEFAULT 'Vedanth Gali Preview',
  favicon_url text DEFAULT '/favicon.ico',
  theme_mode text NOT NULL DEFAULT 'dark',
  accent_color_primary text NOT NULL DEFAULT '#3b82f6',
  accent_color_secondary text NOT NULL DEFAULT '#ec4899',
  bg_base_color text NOT NULL DEFAULT '#05060a',
  surface_color text NOT NULL DEFAULT '#0a0c14',
  display_font_family text NOT NULL DEFAULT 'Unbounded',
  body_font_family text NOT NULL DEFAULT 'Geist',
  mono_font_family text NOT NULL DEFAULT 'Geist Mono',
  social_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  availability_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Backfill missing columns on existing site_settings table if needed
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_title text NOT NULL DEFAULT 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_description text NOT NULL DEFAULT 'Final-year Computer Engineering student and developer building scalable web platforms.';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_keywords text[] NOT NULL DEFAULT '{"Vedanth Gali", "Frontend Developer", "Full-Stack Developer", "Next.js", "React", "TypeScript", "Supabase"}'::text[];
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS site_url text NOT NULL DEFAULT 'https://vedanthgali.dev';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS author_name text NOT NULL DEFAULT 'Vedanth Gali';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS author_email text NOT NULL DEFAULT 'vedanthmgali@gmail.com';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS author_location text NOT NULL DEFAULT 'Mumbai, IN';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS favicon_url text DEFAULT '/favicon.ico';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS theme_mode text NOT NULL DEFAULT 'dark';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS accent_color_primary text NOT NULL DEFAULT '#3b82f6';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS accent_color_secondary text NOT NULL DEFAULT '#ec4899';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS bg_base_color text NOT NULL DEFAULT '#05060a';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS surface_color text NOT NULL DEFAULT '#0a0c14';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS display_font_family text NOT NULL DEFAULT 'Unbounded';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS body_font_family text NOT NULL DEFAULT 'Geist';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS mono_font_family text NOT NULL DEFAULT 'Geist Mono';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ============================================================================
-- 4. Dynamic Sections Table & Version History
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  type text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at timestamptz DEFAULT now(),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.section_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  content jsonb NOT NULL,
  style jsonb NOT NULL,
  status text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. Navigation Items Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  is_cta boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. Media Library & Section Associations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_path text NOT NULL,
  public_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  alt_text text DEFAULT '',
  mime text,
  size bigint,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.section_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  role text DEFAULT 'gallery',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. Fonts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.fonts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  source text NOT NULL CHECK (source IN ('google', 'uploaded')),
  file_path text,
  weights text[] NOT NULL DEFAULT '{"400","600","700"}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fonts_name ON public.fonts(name);

-- ============================================================================
-- 8. Indexes for Query Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_sections_order ON public.sections(order_index);
CREATE INDEX IF NOT EXISTS idx_sections_key ON public.sections(key);
CREATE INDEX IF NOT EXISTS idx_sections_visibility ON public.sections(is_visible, status);
CREATE INDEX IF NOT EXISTS idx_section_versions_section ON public.section_versions(section_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nav_items_order ON public.nav_items(order_index);
CREATE UNIQUE INDEX IF NOT EXISTS idx_nav_items_href ON public.nav_items(href);
CREATE INDEX IF NOT EXISTS idx_media_type_created ON public.media(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_section_media_sec_order ON public.section_media(section_id, order_index);

-- ============================================================================
-- 9. Trigger Attachments
-- ============================================================================

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_sections_updated_at ON public.sections;
CREATE TRIGGER trg_sections_updated_at
  BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_nav_items_updated_at ON public.nav_items;
CREATE TRIGGER trg_nav_items_updated_at
  BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_media_updated_at ON public.media;
CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_fonts_updated_at ON public.fonts;
CREATE TRIGGER trg_fonts_updated_at
  BEFORE UPDATE ON public.fonts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- 10. Row Level Security (RLS) Configuration
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;

-- 10.1 admin_users RLS
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Admins can manage admin_users" ON public.admin_users
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10.2 site_settings RLS
DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" ON public.site_settings
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can modify site_settings" ON public.site_settings;
CREATE POLICY "Admins can modify site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10.3 sections RLS
DROP POLICY IF EXISTS "Public can view published sections" ON public.sections;
CREATE POLICY "Public can view published sections" ON public.sections
  FOR SELECT TO public
  USING (
    (status = 'published' AND is_visible = true) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can insert sections" ON public.sections;
CREATE POLICY "Admins can insert sections" ON public.sections
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update sections" ON public.sections;
CREATE POLICY "Admins can update sections" ON public.sections
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete sections" ON public.sections;
CREATE POLICY "Admins can delete sections" ON public.sections
  FOR DELETE TO authenticated USING (public.is_admin());

-- 10.4 section_versions RLS
DROP POLICY IF EXISTS "Admins can view section_versions" ON public.section_versions;
CREATE POLICY "Admins can view section_versions" ON public.section_versions
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage section_versions" ON public.section_versions;
CREATE POLICY "Admins can manage section_versions" ON public.section_versions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10.5 nav_items RLS
DROP POLICY IF EXISTS "Public can view visible nav_items" ON public.nav_items;
CREATE POLICY "Public can view visible nav_items" ON public.nav_items
  FOR SELECT TO public USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage nav_items" ON public.nav_items;
CREATE POLICY "Admins can manage nav_items" ON public.nav_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10.6 media & section_media RLS
DROP POLICY IF EXISTS "Public can view media" ON public.media;
CREATE POLICY "Public can view media" ON public.media
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage media" ON public.media;
CREATE POLICY "Admins can manage media" ON public.media
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view section_media" ON public.section_media;
CREATE POLICY "Public can view section_media" ON public.section_media
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage section_media" ON public.section_media;
CREATE POLICY "Admins can manage section_media" ON public.section_media
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10.7 fonts RLS
DROP POLICY IF EXISTS "Public can view fonts" ON public.fonts;
CREATE POLICY "Public can view fonts" ON public.fonts
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage fonts" ON public.fonts;
CREATE POLICY "Admins can manage fonts" ON public.fonts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================================
-- 11. Storage Buckets & Policies
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50 MB
  ARRAY[
    'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/ogg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif',
    'video/mp4', 'video/webm', 'video/ogg'
  ];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fonts',
  'fonts',
  true,
  10485760, -- 10 MB
  ARRAY[
    'font/woff', 'font/woff2', 'font/ttf', 'font/otf', 'application/font-woff', 'application/font-woff2', 'application/x-font-ttf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'font/woff', 'font/woff2', 'font/ttf', 'font/otf', 'application/font-woff', 'application/font-woff2', 'application/x-font-ttf'
  ];

-- Storage Policies: Public SELECT, Admin INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Public can view media bucket" ON storage.objects;
CREATE POLICY "Public can view media bucket" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id IN ('media', 'fonts'));

DROP POLICY IF EXISTS "Admins can insert to media & fonts" ON storage.objects;
CREATE POLICY "Admins can insert to media & fonts" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('media', 'fonts') AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update objects in media & fonts" ON storage.objects;
CREATE POLICY "Admins can update objects in media & fonts" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('media', 'fonts') AND public.is_admin())
  WITH CHECK (bucket_id IN ('media', 'fonts') AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete objects in media & fonts" ON storage.objects;
CREATE POLICY "Admins can delete objects in media & fonts" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('media', 'fonts') AND public.is_admin());

-- ============================================================================
-- 12. Seed Content: Initial Site Settings, Navbar Items & Sections
-- ============================================================================

-- Seed site_settings (singleton row if empty)
INSERT INTO public.site_settings (
  site_title, site_description, site_keywords, site_url,
  author_name, author_email, author_location, og_image_url,
  favicon_url, theme_mode, accent_color_primary, accent_color_secondary,
  bg_base_color, surface_color, display_font_family, body_font_family,
  mono_font_family, social_links, availability_visible
)
SELECT
  'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
  'Final-year Computer Engineering student and developer building scalable web platforms.',
  ARRAY['Vedanth Gali', 'Frontend Developer', 'Full-Stack Developer', 'Next.js', 'React', 'TypeScript', 'Supabase'],
  'https://vedanthgali.dev',
  'Vedanth Gali',
  'vedanthmgali@gmail.com',
  'Mumbai, IN',
  '/og-image.png',
  '/favicon.ico',
  'dark',
  '#3b82f6',
  '#ec4899',
  '#05060a',
  '#0a0c14',
  'Unbounded',
  'Geist',
  'Geist Mono',
  jsonb_build_array(
    jsonb_build_object('platform', 'GitHub', 'url', 'https://github.com/Vedanth-Gali'),
    jsonb_build_object('platform', 'LinkedIn', 'url', 'https://linkedin.com/in/vedanth-gali'),
    jsonb_build_object('platform', 'Email', 'url', 'mailto:vedanthmgali@gmail.com'),
    jsonb_build_object('platform', 'Phone', 'url', 'tel:+919876543210')
  ),
  true
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Seed nav_items
INSERT INTO public.nav_items (label, href, order_index, is_visible, is_cta)
VALUES
  ('About', '#about', 1, true, false),
  ('Work', '#work', 2, true, false),
  ('Stack', '#stack', 3, true, false),
  ('Leadership', '#leadership', 4, true, false),
  ('Credentials', '#credentials', 5, true, false),
  ('Contact', '#contact', 6, true, false),
  ('Résumé', '/resume.pdf', 7, true, true)
ON CONFLICT (href) DO UPDATE SET
  label = EXCLUDED.label,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  is_cta = EXCLUDED.is_cta,
  updated_at = now();

-- Seed Hero Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'hero',
  'hero',
  1,
  true,
  'published',
  jsonb_build_object(
    'availability_text', 'Open to work as a Frontend or Full-Stack Developer',
    'location', 'Mumbai, IN',
    'terminal_tag', '~/vedanth // final-year cs',
    'first_name', 'VEDANTH',
    'last_name', 'GALI',
    'prompt_action', 'architecting',
    'rotating_phrases', jsonb_build_array(
      'production web platforms',
      'high-performance fullstack systems',
      'international technical conferences',
      'gamified developer experiences'
    ),
    'bio', 'Final-year Computer Engineering student at Mumbai University. I build with React, Next.js, TypeScript and Supabase, and I have deployed a digital publishing platform for real use at my college.',
    'cta_primary_label', 'Explore Platforms',
    'cta_primary_url', '#work',
    'cta_secondary_label', 'Download Résumé',
    'cta_secondary_url', '/resume.pdf',
    'cohort_badge', 'Mumbai University ''27',
    'avatar_video_mp4', '/videos/vedanth-cutout.mp4',
    'marquee_row_1', jsonb_build_array(
      jsonb_build_object('name', 'Next.js 16', 'icon', 'nextjs'),
      jsonb_build_object('name', 'React 19', 'icon', 'react'),
      jsonb_build_object('name', 'TypeScript', 'icon', 'typescript'),
      jsonb_build_object('name', 'Supabase', 'icon', 'supabase'),
      jsonb_build_object('name', 'Tailwind CSS v4', 'icon', 'tailwindcss'),
      jsonb_build_object('name', 'PostgreSQL', 'icon', 'postgresql'),
      jsonb_build_object('name', 'Node.js', 'icon', 'nodejs'),
      jsonb_build_object('name', 'Python', 'icon', 'python')
    ),
    'marquee_row_2', jsonb_build_array(
      jsonb_build_object('name', 'Three.js', 'icon', 'sparkles'),
      jsonb_build_object('name', 'GSAP', 'icon', 'terminal'),
      jsonb_build_object('name', 'Docker', 'icon', 'docker'),
      jsonb_build_object('name', 'Git & GitHub', 'icon', 'git'),
      jsonb_build_object('name', 'REST & GraphQL', 'icon', 'graphql'),
      jsonb_build_object('name', 'Figma UI/UX', 'icon', 'figma'),
      jsonb_build_object('name', 'Linux', 'icon', 'linux'),
      jsonb_build_object('name', 'TensorFlow', 'icon', 'cpu')
    )
  ),
  jsonb_build_object('layout', '2-column-split', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed About Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'about',
  'about',
  2,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 03 — ABOUT & DISCIPLINE ]',
    'heading_line_1', 'ENGINEERING,',
    'heading_line_2', 'DESIGN & LEADERSHIP.',
    'terminal_title', '~/profile/engineering-philosophy.md',
    'terminal_status', 'VERIFIED',
    'terminal_kicker', '// CORE PHILOSOPHY & OBJECTIVE',
    'bio_narrative', 'I bridge systems engineering, creative direction, and technical event leadership. As a developer, I build full-stack web platforms with Next.js, React, TypeScript, and Supabase — including The Rkive, a digital publishing platform with custom flipbook physics deployed for real use at my college. In parallel, I served as Conference Coordinator & Creative Head for ICSICE 2026 and Head of the Hackathon Club, guiding multi-disciplinary teams and technical operations.',
    'disciplines', jsonb_build_array(
      jsonb_build_object(
        'code', '01 // Systems',
        'title', '01 // Systems',
        'color', 'blue',
        'icon', 'code',
        'description', 'Full-stack engineering with Next.js 16, React 19, TypeScript, and Supabase. End-to-end ownership from interface to database RLS.'
      ),
      jsonb_build_object(
        'code', '02 // Creative',
        'title', '02 // Creative',
        'color', 'pink',
        'icon', 'palette',
        'description', 'Creative Head for ICSICE 2026. Directing visual branding, promotional media, flipbook reading UX, and cinematic design systems.'
      ),
      jsonb_build_object(
        'code', '03 // Operations',
        'title', '03 // Operations',
        'color', 'emerald',
        'icon', 'users',
        'description', 'Conference Coordinator & Hackathon Club Head. Mentoring student engineers, shaping technical challenges, and executing events.'
      )
    ),
    'dossier_badge', 'FINAL YEAR',
    'dossier_title', 'VG. ENGINEER & DIRECTOR',
    'dossier_avatar', '/images/vedanth-cutout.svg',
    'dossier_name', 'VEDANTH GALI',
    'dossier_role', 'Frontend & Full-Stack Dev',
    'dossier_degree', 'B.E. Comp Eng',
    'dossier_timeline', '2023 – 2027',
    'dossier_institution', 'Mumbai University, IN'
  ),
  jsonb_build_object('layout', 'symmetrical-split', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Work Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'work',
  'work',
  3,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 04 — SELECTED PRODUCTION WORK ]',
    'heading_line_1', 'PRODUCTION',
    'heading_line_2', 'PLATFORMS.',
    'subtitle', 'Live full-stack applications with authenticated student users, interactive simulation suites, and deep-learning models.'
  ),
  jsonb_build_object('layout', 'stacked-deck', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Marquee Band Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'band',
  'marquee_band',
  4,
  true,
  'published',
  jsonb_build_object(
    'phrase', 'OPEN TO WORK • FRONTEND & FULL-STACK • MUMBAI • 2027 • ',
    'speed', 1.0
  ),
  jsonb_build_object('layout', 'infinite-track', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Stack Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'stack',
  'stack',
  5,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 06 — TECH STACK & ARCHITECTURE ]',
    'heading_line_1', 'ENGINEERING',
    'heading_line_2', 'STACK.',
    'subtitle', 'Distinguishing active production technologies deployed in live builds from foundational academic engineering proficiencies.',
    'spotlight_title', 'ACTIVE PRODUCTION STACK',
    'spotlight_subtitle', 'Live in deployed platforms: The Rkive, Escape Placement Cell',
    'spotlight_items', jsonb_build_array(
      jsonb_build_object('name', 'Next.js 14/16', 'icon', 'nextjs', 'deployedIn', 'The Rkive'),
      jsonb_build_object('name', 'React 19', 'icon', 'react', 'deployedIn', 'Escape Placement Cell'),
      jsonb_build_object('name', 'TypeScript', 'icon', 'typescript', 'deployedIn', 'All Platforms'),
      jsonb_build_object('name', 'Supabase & RLS', 'icon', 'supabase', 'deployedIn', 'The Rkive & Escape'),
      jsonb_build_object('name', 'PostgreSQL', 'icon', 'postgresql', 'deployedIn', 'The Rkive DB'),
      jsonb_build_object('name', 'Tailwind CSS v4', 'icon', 'tailwindcss', 'deployedIn', 'All Platforms'),
      jsonb_build_object('name', 'Python & TF', 'icon', 'python', 'deployedIn', 'Plant Disease CNN'),
      jsonb_build_object('name', 'Git & Vercel', 'icon', 'git', 'deployedIn', 'CI/CD Pipelines')
    )
  ),
  jsonb_build_object('layout', 'matrix-grid', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Leadership Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'leadership',
  'leadership',
  6,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 07 — POSITIONS OF RESPONSIBILITY & CONFERENCES ]',
    'heading_line_1', 'LEADERSHIP &',
    'heading_line_2', 'EVENT DIRECTION.'
  ),
  jsonb_build_object('layout', 'timeline-stream', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Credentials Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'credentials',
  'credentials',
  7,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 08 — CERTIFICATIONS & ACADEMIC MERIT ]',
    'heading_line_1', 'VERIFIED',
    'heading_line_2', 'QUALIFICATIONS.',
    'subtitle', 'Directly displaying verified academic coursework certifications, competitive industry simulations, and engineering credentials.'
  ),
  jsonb_build_object('layout', 'showcase-grid', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Contact Section
INSERT INTO public.sections (key, type, order_index, is_visible, status, content, style)
VALUES (
  'contact',
  'contact',
  8,
  true,
  'published',
  jsonb_build_object(
    'kicker', '[ 09 — NEXT STEPS & CONTACT ]',
    'heading_line_1', 'LET''S BUILD',
    'heading_line_2', 'TOGETHER.',
    'body', 'Open to full-time Frontend & Full-Stack engineering opportunities. Available to discuss systems architecture, production web builds, and technical creative direction.',
    'email', 'vedanthmgali@gmail.com',
    'cta_primary_label', 'Send An Email',
    'cta_copy_label', 'Copy Email',
    'copyright', '© 2026 Vedanth Gali'
  ),
  jsonb_build_object('layout', 'kinetic-stage', 'theme', 'dark')
)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  style = EXCLUDED.style,
  order_index = EXCLUDED.order_index,
  is_visible = EXCLUDED.is_visible,
  status = EXCLUDED.status,
  updated_at = now();

-- Seed Default Fonts
INSERT INTO public.fonts (name, source, weights)
VALUES
  ('Unbounded', 'google', ARRAY['600', '700', '800']),
  ('Geist', 'google', ARRAY['400', '500', '600']),
  ('Geist Mono', 'google', ARRAY['400', '500'])
ON CONFLICT (name) DO NOTHING;
