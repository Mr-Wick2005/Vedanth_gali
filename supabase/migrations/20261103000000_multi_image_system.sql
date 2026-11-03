-- Migration: Multi-Image System & Deployed Image Fallback Fix
-- Description: Adds multi-image array columns to experience, projects, and certifications.
-- Backward-compatible backfill preserves all existing single images.

-- 1. Experience Table Enhancements
ALTER TABLE public.experience 
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- 2. Projects Table Enhancements
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS cover_video_url text,
  ADD COLUMN IF NOT EXISTS cover_video_poster_url text,
  ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- 3. Certifications Table Enhancements
ALTER TABLE public.certifications 
  ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;

-- 4. Fix deployed projects images (where cover_image_url was seeded as NULL)
UPDATE public.projects
SET 
  cover_image_url = '/placeholders/the-rkive.png',
  cover_image_alt = 'The Rkive platform cover preview'
WHERE slug = 'the-rkive' AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.projects
SET 
  cover_image_url = '/placeholders/escape-placement-cell.png',
  cover_image_alt = 'Escape Placement Cell game preview'
WHERE slug = 'escape-placement-cell' AND (cover_image_url IS NULL OR cover_image_url = '');

UPDATE public.projects
SET 
  cover_image_url = '/placeholders/plant-leaf-disease-detection.png',
  cover_image_alt = 'Plant Leaf disease detection model evaluation'
WHERE slug = 'plant-leaf-disease-detection' AND (cover_image_url IS NULL OR cover_image_url = '');

-- 5. Backfill existing single-image values into images array
-- Projects
UPDATE public.projects
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', cover_image_url,
    'alt', COALESCE(cover_image_alt, title),
    'order', 0,
    'isCover', true
  )
)
WHERE cover_image_url IS NOT NULL 
  AND (images IS NULL OR images = '[]'::jsonb);

-- Experience
UPDATE public.experience
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', COALESCE(image_url, logo_url),
    'alt', COALESCE(image_alt, logo_alt, title),
    'order', 0,
    'isCover', true
  )
)
WHERE (image_url IS NOT NULL OR logo_url IS NOT NULL)
  AND (images IS NULL OR images = '[]'::jsonb);

-- Certifications
UPDATE public.certifications
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'alt', COALESCE(image_alt, title),
    'order', 0,
    'isCover', true
  )
)
WHERE image_url IS NOT NULL 
  AND (images IS NULL OR images = '[]'::jsonb);
