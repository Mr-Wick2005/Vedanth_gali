-- supabase/seed.sql
-- Seed data for Vedanth Gali Portfolio (Content Bible + Patch 1)
-- Idempotent using fixed UUIDs and ON CONFLICT DO NOTHING

-- ============================================================================
-- 1. Profile
-- ============================================================================
insert into public.profile (
  id,
  name,
  headline,
  short_bio,
  long_bio,
  location,
  email,
  availability_text,
  avatar_url,
  avatar_alt,
  resume_url
) values (
  '00000000-0000-0000-0000-000000000001',
  'Vedanth Gali',
  'Frontend & Full-Stack developer · Computer Engineering student',
  'Final-year Computer Engineering student at Mumbai University. I build with React, Next.js, TypeScript and Supabase, and I have deployed a digital publishing platform for real use at my college.',
  'I''m a final-year Computer Engineering student at Mumbai University who likes owning a build end to end: the interface, the data model and the deployment. My biggest project so far is The Rkive, a digital publishing platform I founded, designed and deployed for real use at my college.

Alongside code, I lead people and events. I''ve run my department''s technical activities, headed the Hackathon Club, and served as Conference Coordinator & Creative Head for ICSICE 2026. I care about clean UI, scalable structure, and problem-solving that holds up outside a demo.',
  'Mumbai, Maharashtra, India',
  'vedanthmgali@gmail.com',
  'Open to work as a Frontend or Full-Stack Developer',
  null,
  null,
  null
) on conflict (id) do nothing;

-- ============================================================================
-- 2. Site Settings
-- ============================================================================
insert into public.site_settings (
  id,
  seo_title,
  seo_description,
  og_image_url,
  og_image_alt,
  availability_visible
) values (
  '00000000-0000-0000-0000-000000000002',
  'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
  'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building web platforms and leading technical teams in Mumbai.',
  null,
  null,
  true
) on conflict (id) do nothing;

-- ============================================================================
-- 3. Education
-- ============================================================================
insert into public.education (
  id,
  institution,
  degree,
  field,
  start_year,
  end_year,
  status,
  logo_url,
  logo_alt,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000010',
  'Mumbai University, India',
  'Bachelor of Engineering',
  'Computer Engineering',
  2023,
  2027,
  'final year',
  null,
  null,
  1,
  true
) on conflict (id) do nothing;

-- ============================================================================
-- 4. Projects (Order per Patch 1: The Rkive, Escape Placement Cell, Plant Leaf)
-- ============================================================================
-- 4.1 The Rkive
insert into public.projects (
  id,
  slug,
  title,
  summary,
  problem,
  solution,
  outcome,
  role,
  year,
  stack,
  live_url,
  repo_url,
  cover_image_url,
  cover_image_alt,
  gallery,
  metrics,
  featured,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000021',
  'the-rkive',
  'The Rkive',
  'A digital magazine platform for publishing, discovering and preserving college publications, with a physical-book flipbook reader.',
  '[CONFIRM] College magazines, newsletters and publications had no single place to be published, managed and preserved digitally.',
  'Flipbook reader with page-curl physics, dual-page desktop spreads, single-page mobile layout, zoom/pan and shareable page links. Server-side PDF pipeline rendering print-quality pages (about 200–300 DPI) plus thumbnails. Role-based access (Super Admin, Department Admin) enforced with Supabase Auth and Row Level Security. Editorial lifecycle from draft to published or archived, with audit logging. I designed the brand identity, UI/UX and end-to-end publishing workflow.',
  'Deployed for real use at my college to support digital magazine publishing and content management.',
  'Founder & Developer',
  2024,
  array['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel', 'Cloudflare'],
  'https://the-rkive.vercel.app',
  'https://github.com/Mr-Wick2005/THE_RKIVE',
  null,
  'The Rkive platform cover preview',
  '[]'::jsonb,
  '[
    {"label": "Publication states", "value": "7"},
    {"label": "Admin roles", "value": "2"},
    {"label": "Page rendering", "value": "200–300 DPI"}
  ]'::jsonb,
  true,
  1,
  true
) on conflict (id) do nothing;

-- 4.2 Escape Placement Cell
insert into public.projects (
  id,
  slug,
  title,
  summary,
  problem,
  solution,
  outcome,
  role,
  year,
  stack,
  live_url,
  repo_url,
  cover_image_url,
  cover_image_alt,
  gallery,
  metrics,
  featured,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000022',
  'escape-placement-cell',
  'Escape Placement Cell',
  'A gamified placement-preparation game where you clear three rounds (aptitude, coding, HR interview) to "escape" the placement cell.',
  '[CONFIRM] Placement preparation is usually dry, unstructured practice.',
  'Three-round progression with a timed aptitude test, a multi-language coding challenge, and a voice-enabled HR interview with keyword-based answer scoring, followed by a performance report. Speech-to-text in supported browsers; 3D elements with React Three Fiber; user flows and interaction logic designed for engagement.',
  'Live demo deployed on Vercel.',
  'Frontend & Full-Stack Developer',
  2025,
  array['React 19', 'JavaScript', 'Tailwind CSS', 'Radix UI', 'React Three Fiber', 'Supabase', 'React Hook Form', 'Zod'],
  'https://escape-placement-cell.vercel.app/',
  'https://github.com/Mr-Wick2005/Escape-Placement-Cell',
  null,
  'Escape Placement Cell game interface preview',
  '[]'::jsonb,
  '[
    {"label": "Rounds", "value": "3"},
    {"label": "Interview questions", "value": "7"},
    {"label": "Aptitude round", "value": "5-minute"}
  ]'::jsonb,
  true,
  2,
  true
) on conflict (id) do nothing;

-- 4.3 Plant Leaf Multi-Disease Detection
insert into public.projects (
  id,
  slug,
  title,
  summary,
  problem,
  solution,
  outcome,
  role,
  year,
  stack,
  live_url,
  repo_url,
  cover_image_url,
  cover_image_alt,
  gallery,
  metrics,
  featured,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000023',
  'plant-leaf-disease-detection',
  'Plant Leaf Multi-Disease Detection',
  'A deep-learning system that identifies plant diseases from leaf images across multiple plant species.',
  '[CONFIRM] Spotting plant diseases by eye is slow and inconsistent; leaf images can be classified automatically.',
  'MobileNetV2 transfer learning on the PlantVillage dataset. Evaluated with a confusion matrix, precision, recall and F1-score. A research-based implementation and experimental validation of a published approach to multi-class plant disease classification.',
  '91.82% test accuracy.',
  'Major Project Researcher & Developer',
  2024,
  array['Python', 'TensorFlow', 'Keras', 'MobileNetV2', 'CNN'],
  null,
  'https://github.com/Mr-Wick2005/plant-leaf-multidisease-detection',
  null,
  'Plant Leaf disease detection model evaluation',
  '[]'::jsonb,
  '[
    {"label": "Test accuracy", "value": "91.82%"},
    {"label": "Disease classes", "value": "25"},
    {"label": "Images evaluated", "value": "31,397"}
  ]'::jsonb,
  true,
  3,
  true
) on conflict (id) do nothing;

-- 4.4 Draft 1: CVAdapt AI
insert into public.projects (
  id,
  slug,
  title,
  summary,
  problem,
  solution,
  outcome,
  role,
  year,
  stack,
  live_url,
  repo_url,
  cover_image_url,
  cover_image_alt,
  gallery,
  metrics,
  featured,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000024',
  'cv-builder',
  'CVAdapt AI — Target-Driven Resume Tailoring',
  '[CONFIRM] A modern Next.js application that adapts and tailors resumes for specific job descriptions and target roles using Gemini AI with fallback local rule-based optimization.',
  null,
  null,
  null,
  'Developer',
  2025,
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Gemini API'],
  null,
  'https://github.com/Mr-Wick2005/CV_BUILDER',
  null,
  null,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  4,
  false
) on conflict (id) do nothing;

-- 4.5 Draft 2: College Buzz
insert into public.projects (
  id,
  slug,
  title,
  summary,
  problem,
  solution,
  outcome,
  role,
  year,
  stack,
  live_url,
  repo_url,
  cover_image_url,
  cover_image_alt,
  gallery,
  metrics,
  featured,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000025',
  'college-buzz',
  'College Buzz',
  '[CONFIRM] A full-stack campus event discovery, registration, and management platform built for students, organizers, and college administrators.',
  null,
  null,
  null,
  'Developer',
  2025,
  array['React', 'Node.js', 'Tailwind CSS', 'PostgreSQL'],
  'https://college-buzz2026.vercel.app/',
  'https://github.com/Mr-Wick2005/College_Buzz2026',
  null,
  null,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  5,
  false
) on conflict (id) do nothing;

-- ============================================================================
-- 5. Experience / Positions of Responsibility (Most recent first)
-- ============================================================================
insert into public.experience (
  id,
  company,
  title,
  start_date,
  end_date,
  period_label,
  org_url,
  description,
  highlights,
  logo_url,
  logo_alt,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000031',
  'ICSICE 2026 (International Conference on Sustainability Innovation in Computing and Engineering)',
  'Conference Coordinator & Creative Head',
  '2026-01-01',
  null,
  '2026',
  null,
  'Cross-team planning, communication and event execution. Directed the creative vision: branding, visual design and promotional materials. Kept a consistent identity across conference activities.',
  array[
    'Coordinated the International Conference on Sustainability Innovation in Computing and Engineering (ICSICE 2026)',
    'Directed the creative vision including branding, visual design, and promotional materials',
    'Maintained a consistent visual and organizational identity across conference activities'
  ],
  null,
  null,
  1,
  true
) on conflict (id) do nothing;

insert into public.experience (
  id,
  company,
  title,
  start_date,
  end_date,
  period_label,
  org_url,
  description,
  highlights,
  logo_url,
  logo_alt,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000032',
  'Computer Engineering Department',
  'Hackathon Club Head',
  '2024-06-01',
  '2025-05-31',
  '2024–2025',
  null,
  'Shaped technical challenges, facilitated team participation, and supported students through ideation, development and final submissions.',
  array[
    'Shaped technical challenges and structured competitive hackathon prompts',
    'Facilitated student participation and mentored teams through technical execution'
  ],
  null,
  null,
  2,
  true
) on conflict (id) do nothing;

insert into public.experience (
  id,
  company,
  title,
  start_date,
  end_date,
  period_label,
  org_url,
  description,
  highlights,
  logo_url,
  logo_alt,
  sort_order,
  is_published
) values (
  '00000000-0000-0000-0000-000000000033',
  'Department of Computer Engineering, CESA & CSI',
  'Technical Head',
  '2024-01-01',
  '2024-12-31',
  '2024',
  null,
  'Managed the department''s technical activities: student workshops, expert lectures, technical sessions and project mentoring.',
  array[
    'Managed department technical sessions, student workshops, and guest lectures',
    'Mentored junior students on practical engineering projects and development practices'
  ],
  null,
  null,
  3,
  true
) on conflict (id) do nothing;

-- ============================================================================
-- 6. Certifications
-- ============================================================================
insert into public.certifications (
  id,
  title,
  issuer,
  year,
  credential_url,
  image_url,
  image_alt,
  sort_order,
  is_published
) values
  ('00000000-0000-0000-0000-000000000041', 'Introduction to Database Systems', 'NPTEL, IIT Madras', 2025, null, null, null, 1, true),
  ('00000000-0000-0000-0000-000000000042', 'RDBMS PostgreSQL Training', 'EduPyramids, SINE IIT Bombay', 2026, null, null, null, 2, true),
  ('00000000-0000-0000-0000-000000000043', 'Tata GenAI Powered Data Analytics Job Simulation', 'Forage', 2026, null, null, null, 3, true),
  ('00000000-0000-0000-0000-000000000044', 'Linux Training', 'EduPyramids, SINE IIT Bombay', 2025, null, null, null, 4, true)
on conflict (id) do nothing;

-- ============================================================================
-- 7. Skills (Order per Patch 1: Frontend, Languages, Backend, Databases, Design, Tools, ML)
-- ============================================================================
insert into public.skills (id, name, category, icon_key, sort_order, is_published) values
  -- Frontend
  ('00000000-0000-0000-0000-000000000051', 'React.js', 'Frontend', 'react', 1, true),
  ('00000000-0000-0000-0000-000000000052', 'Next.js', 'Frontend', 'nextjs', 2, true),
  ('00000000-0000-0000-0000-000000000053', 'Tailwind CSS', 'Frontend', 'tailwindcss', 3, true),
  ('00000000-0000-0000-0000-000000000054', 'HTML', 'Frontend', 'html5', 4, true),
  ('00000000-0000-0000-0000-000000000055', 'CSS', 'Frontend', 'css3', 5, true),
  ('00000000-0000-0000-0000-000000000056', 'Vite', 'Frontend', 'vite', 6, true),

  -- Languages
  ('00000000-0000-0000-0000-000000000057', 'TypeScript', 'Languages', 'typescript', 7, true),
  ('00000000-0000-0000-0000-000000000058', 'JavaScript', 'Languages', 'javascript', 8, true),
  ('00000000-0000-0000-0000-000000000059', 'Python', 'Languages', 'python', 9, true),
  ('00000000-0000-0000-0000-000000000060', 'Java', 'Languages', 'java', 10, true),
  ('00000000-0000-0000-0000-000000000061', 'C', 'Languages', 'c', 11, true),
  ('00000000-0000-0000-0000-000000000062', 'SQL', 'Languages', 'sql', 12, true),

  -- Backend
  ('00000000-0000-0000-0000-000000000063', 'Node.js', 'Backend', 'nodejs', 13, true),
  ('00000000-0000-0000-0000-000000000064', 'Express.js', 'Backend', 'express', 14, true),
  ('00000000-0000-0000-0000-000000000065', 'REST APIs', 'Backend', 'api', 15, true),

  -- Databases
  ('00000000-0000-0000-0000-000000000066', 'PostgreSQL', 'Databases', 'postgresql', 16, true),
  ('00000000-0000-0000-0000-000000000067', 'Supabase', 'Databases', 'supabase', 17, true),
  ('00000000-0000-0000-0000-000000000068', 'MySQL', 'Databases', 'mysql', 18, true),

  -- Design
  ('00000000-0000-0000-0000-000000000069', 'Figma', 'Design', 'figma', 19, true),
  ('00000000-0000-0000-0000-000000000070', 'UI/UX', 'Design', 'layout', 20, true),
  ('00000000-0000-0000-0000-000000000071', 'Responsive Design', 'Design', 'responsive', 21, true),

  -- Tools
  ('00000000-0000-0000-0000-000000000072', 'Git', 'Tools', 'git', 22, true),
  ('00000000-0000-0000-0000-000000000073', 'GitHub', 'Tools', 'github', 23, true),
  ('00000000-0000-0000-0000-000000000074', 'VS Code', 'Tools', 'vscode', 24, true),
  ('00000000-0000-0000-0000-000000000075', 'Antigravity', 'Tools', 'code', 25, true),

  -- Machine Learning
  ('00000000-0000-0000-0000-000000000076', 'TensorFlow', 'Machine Learning', 'tensorflow', 26, true),
  ('00000000-0000-0000-0000-000000000077', 'Keras', 'Machine Learning', 'keras', 27, true)
on conflict (id) do nothing;

-- ============================================================================
-- 8. Social Links (Phone included per Patch 1 item 3)
-- ============================================================================
insert into public.social_links (
  id,
  label,
  url,
  display_text,
  sort_order,
  is_published
) values
  ('00000000-0000-0000-0000-000000000081', 'GitHub', 'https://github.com/Mr-Wick2005', 'github.com/Mr-Wick2005', 1, true),
  ('00000000-0000-0000-0000-000000000082', 'LinkedIn', 'https://www.linkedin.com/in/vedanth-gali-22v2005/', 'linkedin.com/in/vedanth-gali-22v2005', 2, true),
  ('00000000-0000-0000-0000-000000000083', 'Email', 'mailto:vedanthmgali@gmail.com', 'vedanthmgali@gmail.com', 3, true),
  ('00000000-0000-0000-0000-000000000084', 'Phone', 'tel:+919987602631', '+91 99876 02631', 4, true)
on conflict (id) do nothing;
