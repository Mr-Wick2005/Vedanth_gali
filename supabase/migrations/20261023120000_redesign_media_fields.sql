-- Migration: Add media and gallery fields for cinematic redesign
-- Description: Adds video cover support to projects, image/gallery support to experience,
-- and updates media bucket constraints to support video uploads up to 25MB.

-- 1. Add video cover columns to projects
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS cover_video_url text,
  ADD COLUMN IF NOT EXISTS cover_video_poster_url text;

-- 2. Add image and gallery columns to experience
ALTER TABLE experience 
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb;

-- 3. Update storage bucket configuration for 'media' to allow video files and 25MB limit
UPDATE storage.buckets
SET 
  file_size_limit = 26214400, -- 25 MB in bytes
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
WHERE id = 'media';
