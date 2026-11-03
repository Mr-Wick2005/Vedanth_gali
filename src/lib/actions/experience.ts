'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { optionalIdSchema } from '@/lib/validations'

const experienceSchema = z.object({
  id: optionalIdSchema,
  company: z.string().min(1, 'Company/Org is required'),
  title: z.string().min(1, 'Title is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().nullable().optional(),
  period_label: z.string().nullable().optional(),
  org_url: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()).default([]),
  image_url: z.string().nullable().optional(),
  image_alt: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  logo_alt: z.string().nullable().optional(),
  gallery: z.any().optional(),
  images: z.any().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type ExperienceInput = z.infer<typeof experienceSchema>

export async function saveExperience(input: ExperienceInput) {
  const parsed = experienceSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()
  const data = { ...parsed.data }

  // Sync primary image to logo_url and image_url
  if (Array.isArray(data.images) && data.images.length > 0 && data.images[0]?.url) {
    data.logo_url = data.images[0].url
    data.image_url = data.images[0].url
    if (data.images[0].alt) {
      data.logo_alt = data.images[0].alt
      data.image_alt = data.images[0].alt
    }
  } else if (Array.isArray(data.gallery) && data.gallery.length > 0 && data.gallery[0]?.url) {
    data.logo_url = data.gallery[0].url
    data.image_url = data.gallery[0].url
    if (data.gallery[0].alt) {
      data.logo_alt = data.gallery[0].alt
      data.image_alt = data.gallery[0].alt
    }
  } else {
    if (data.image_url && !data.logo_url) data.logo_url = data.image_url
    if (data.logo_url && !data.image_url) data.image_url = data.logo_url
  }

  if (parsed.data.id) {
    let { error } = await supabase.from('experience').update(data).eq('id', parsed.data.id)

    // Fallback if gallery / images / image_url columns don't exist yet on remote table
    if (
      error &&
      (error.message.includes('image_alt') ||
        error.message.includes('image_url') ||
        error.message.includes('gallery') ||
        error.message.includes('images'))
    ) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).image_url
      delete (legacyData as Record<string, unknown>).image_alt
      delete (legacyData as Record<string, unknown>).gallery
      delete (legacyData as Record<string, unknown>).images
      const retry = await supabase.from('experience').update(legacyData).eq('id', parsed.data.id)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  } else {
    let { error } = await supabase.from('experience').insert(data)

    if (
      error &&
      (error.message.includes('image_alt') ||
        error.message.includes('image_url') ||
        error.message.includes('gallery') ||
        error.message.includes('images'))
    ) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).image_url
      delete (legacyData as Record<string, unknown>).image_alt
      delete (legacyData as Record<string, unknown>).gallery
      delete (legacyData as Record<string, unknown>).images
      const retry = await supabase.from('experience').insert(legacyData)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteExperience(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
