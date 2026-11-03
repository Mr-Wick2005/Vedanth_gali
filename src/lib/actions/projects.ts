'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { optionalIdSchema } from '@/lib/validations'

const projectSchema = z.object({
  id: optionalIdSchema,
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  problem: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  outcome: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  stack: z.array(z.string()),
  live_url: z.string().nullable().optional(),
  repo_url: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  cover_image_alt: z.string().nullable().optional(),
  cover_video_url: z.string().nullable().optional(),
  cover_video_poster_url: z.string().nullable().optional(),
  gallery: z.any().default([]),
  images: z.any().optional(),
  metrics: z.any().default([]),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type ProjectInput = z.infer<typeof projectSchema>

export async function saveProject(input: ProjectInput) {
  const parsed = projectSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()
  const data = { ...parsed.data }

  // Sync cover_image_url from gallery/images if empty and images exist
  if (!data.cover_image_url) {
    if (Array.isArray(data.images) && data.images.length > 0 && data.images[0]?.url) {
      data.cover_image_url = data.images[0].url
      if (data.images[0].alt) data.cover_image_alt = data.images[0].alt
    } else if (Array.isArray(data.gallery) && data.gallery.length > 0 && data.gallery[0]?.url) {
      data.cover_image_url = data.gallery[0].url
      if (data.gallery[0].alt) data.cover_image_alt = data.gallery[0].alt
    }
  }

  if (parsed.data.id) {
    let { error } = await supabase.from('projects').update(data).eq('id', parsed.data.id)

    // Fallback if video columns or images column don't exist yet on remote table
    if (
      error &&
      (error.message.includes('cover_video') || error.message.includes('images'))
    ) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).cover_video_url
      delete (legacyData as Record<string, unknown>).cover_video_poster_url
      delete (legacyData as Record<string, unknown>).images
      const retry = await supabase.from('projects').update(legacyData).eq('id', parsed.data.id)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  } else {
    let { error } = await supabase.from('projects').insert(data)

    if (
      error &&
      (error.message.includes('cover_video') || error.message.includes('images'))
    ) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).cover_video_url
      delete (legacyData as Record<string, unknown>).cover_video_poster_url
      delete (legacyData as Record<string, unknown>).images
      const retry = await supabase.from('projects').insert(legacyData)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath(`/work/${parsed.data.slug}`)
  return { success: true }
}

export async function deleteProject(id: string, slug?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  if (slug) {
    revalidatePath(`/work/${slug}`)
  }
  return { success: true }
}

export async function toggleProjectPublished(
  id: string,
  currentPublished: boolean,
  slug?: string,
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ is_published: !currentPublished })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  if (slug) {
    revalidatePath(`/work/${slug}`)
  }
  return { success: true }
}
