-- 20261023000000_initial_schema.sql
-- Initial schema for Vedanth Gali Portfolio with strict RLS and security hardening

-- ============================================================================
-- 1. Helper Functions & Triggers
-- ============================================================================

-- Function to automatically update 'updated_at' timestamp
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- 2. Tables Definition
-- ============================================================================

-- 2.1 Admin Users Table (referenced by is_admin())
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Security Definer function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- 2.2 Profile Table (Single row)
create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  headline text not null,
  short_bio text not null,
  long_bio text not null,
  location text not null,
  email text not null,
  availability_text text not null default 'Open to work as a Frontend or Full-Stack Developer',
  avatar_url text,
  avatar_alt text,
  resume_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.3 Site Settings Table (Single row for SEO and metadata)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  seo_title text not null default 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
  seo_description text not null default 'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer.',
  og_image_url text,
  og_image_alt text,
  availability_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.4 Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  problem text,
  solution text,
  outcome text,
  role text,
  year integer,
  stack text[] not null default '{}'::text[],
  live_url text,
  repo_url text,
  cover_image_url text,
  cover_image_alt text,
  gallery jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.5 Experience Table
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  title text not null,
  start_date date not null,
  end_date date,
  period_label text,
  org_url text,
  description text not null,
  highlights text[] not null default '{}'::text[],
  logo_url text,
  logo_alt text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.6 Education Table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text not null,
  start_year integer not null,
  end_year integer not null,
  status text not null,
  logo_url text,
  logo_alt text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.7 Certifications Table
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  year integer not null,
  credential_url text,
  image_url text,
  image_alt text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.8 Skills Table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon_key text,
  icon_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.9 Social Links Table (Phone stored here with label 'Phone')
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  display_text text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. Updated At Triggers
-- ============================================================================

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_experience_updated_at on public.experience;
create trigger set_experience_updated_at
  before update on public.experience
  for each row execute function public.set_updated_at();

drop trigger if exists set_education_updated_at on public.education;
create trigger set_education_updated_at
  before update on public.education
  for each row execute function public.set_updated_at();

drop trigger if exists set_certifications_updated_at on public.certifications;
create trigger set_certifications_updated_at
  before update on public.certifications
  for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

drop trigger if exists set_social_links_updated_at on public.social_links;
create trigger set_social_links_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 4. Row Level Security (RLS) Configuration
-- ============================================================================

alter table public.admin_users enable row level security;
alter table public.profile enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.skills enable row level security;
alter table public.social_links enable row level security;

-- 4.1 admin_users RLS: Strictly Admin only
drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select" on public.admin_users
  for select using (public.is_admin());

drop policy if exists "admin_users_insert" on public.admin_users;
create policy "admin_users_insert" on public.admin_users
  for insert with check (public.is_admin());

drop policy if exists "admin_users_update" on public.admin_users;
create policy "admin_users_update" on public.admin_users
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_users_delete" on public.admin_users;
create policy "admin_users_delete" on public.admin_users
  for delete using (public.is_admin());

-- 4.2 profile RLS: Public read, Admin write
drop policy if exists "profile_select" on public.profile;
create policy "profile_select" on public.profile
  for select using (true);

drop policy if exists "profile_insert" on public.profile;
create policy "profile_insert" on public.profile
  for insert with check (public.is_admin());

drop policy if exists "profile_update" on public.profile;
create policy "profile_update" on public.profile
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "profile_delete" on public.profile;
create policy "profile_delete" on public.profile
  for delete using (public.is_admin());

-- 4.3 site_settings RLS: Public read, Admin write
drop policy if exists "site_settings_select" on public.site_settings;
create policy "site_settings_select" on public.site_settings
  for select using (true);

drop policy if exists "site_settings_insert" on public.site_settings;
create policy "site_settings_insert" on public.site_settings
  for insert with check (public.is_admin());

drop policy if exists "site_settings_update" on public.site_settings;
create policy "site_settings_update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "site_settings_delete" on public.site_settings;
create policy "site_settings_delete" on public.site_settings
  for delete using (public.is_admin());

-- 4.4 projects RLS: Public read published only, Admin read all & write
drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects
  for select using (is_published = true or public.is_admin());

drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects
  for insert with check (public.is_admin());

drop policy if exists "projects_update" on public.projects;
create policy "projects_update" on public.projects
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete" on public.projects
  for delete using (public.is_admin());

-- 4.5 experience RLS: Public read published only, Admin read all & write
drop policy if exists "experience_select" on public.experience;
create policy "experience_select" on public.experience
  for select using (is_published = true or public.is_admin());

drop policy if exists "experience_insert" on public.experience;
create policy "experience_insert" on public.experience
  for insert with check (public.is_admin());

drop policy if exists "experience_update" on public.experience;
create policy "experience_update" on public.experience
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "experience_delete" on public.experience;
create policy "experience_delete" on public.experience
  for delete using (public.is_admin());

-- 4.6 education RLS: Public read published only, Admin read all & write
drop policy if exists "education_select" on public.education;
create policy "education_select" on public.education
  for select using (is_published = true or public.is_admin());

drop policy if exists "education_insert" on public.education;
create policy "education_insert" on public.education
  for insert with check (public.is_admin());

drop policy if exists "education_update" on public.education;
create policy "education_update" on public.education
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "education_delete" on public.education;
create policy "education_delete" on public.education
  for delete using (public.is_admin());

-- 4.7 certifications RLS: Public read published only, Admin read all & write
drop policy if exists "certifications_select" on public.certifications;
create policy "certifications_select" on public.certifications
  for select using (is_published = true or public.is_admin());

drop policy if exists "certifications_insert" on public.certifications;
create policy "certifications_insert" on public.certifications
  for insert with check (public.is_admin());

drop policy if exists "certifications_update" on public.certifications;
create policy "certifications_update" on public.certifications
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "certifications_delete" on public.certifications;
create policy "certifications_delete" on public.certifications
  for delete using (public.is_admin());

-- 4.8 skills RLS: Public read published only, Admin read all & write
drop policy if exists "skills_select" on public.skills;
create policy "skills_select" on public.skills
  for select using (is_published = true or public.is_admin());

drop policy if exists "skills_insert" on public.skills;
create policy "skills_insert" on public.skills
  for insert with check (public.is_admin());

drop policy if exists "skills_update" on public.skills;
create policy "skills_update" on public.skills
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "skills_delete" on public.skills;
create policy "skills_delete" on public.skills
  for delete using (public.is_admin());

-- 4.9 social_links RLS: Public read published only, Admin read all & write
drop policy if exists "social_links_select" on public.social_links;
create policy "social_links_select" on public.social_links
  for select using (is_published = true or public.is_admin());

drop policy if exists "social_links_insert" on public.social_links;
create policy "social_links_insert" on public.social_links
  for insert with check (public.is_admin());

drop policy if exists "social_links_update" on public.social_links;
create policy "social_links_update" on public.social_links
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "social_links_delete" on public.social_links;
create policy "social_links_delete" on public.social_links
  for delete using (public.is_admin());

-- ============================================================================
-- 5. Storage Bucket Configuration & RLS
-- ============================================================================

-- Create public 'media' bucket with 10MB limit and restricted MIME types
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'application/pdf', 'model/gltf-binary']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'application/pdf', 'model/gltf-binary'];

-- Storage RLS on storage.objects
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
