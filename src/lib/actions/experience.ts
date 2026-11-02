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

  // Sync image_url and logo_url to ensure compatibility across schema versions
  if (data.image_url && !data.logo_url) data.logo_url = data.image_url
  if (data.image_alt && !data.logo_alt) data.logo_alt = data.image_alt

  if (parsed.data.id) {
    let { error } = await supabase.from('experience').update(data).eq('id', parsed.data.id)
    
    // Schema mismatch fallback: if database has not yet run redesign migration with image_alt/image_url
    if (error && (error.message.includes('image_alt') || error.message.includes('image_url'))) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).image_url
      delete (legacyData as Record<string, unknown>).image_alt
      const retry = await supabase.from('experience').update(legacyData).eq('id', parsed.data.id)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  } else {
    let { error } = await supabase.from('experience').insert(data)

    // Schema mismatch fallback for insert
    if (error && (error.message.includes('image_alt') || error.message.includes('image_url'))) {
      const legacyData = { ...data }
      delete (legacyData as Record<string, unknown>).image_url
      delete (legacyData as Record<string, unknown>).image_alt
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
