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

  if (parsed.data.id) {
    const { error } = await supabase.from('projects').update(parsed.data).eq('id', parsed.data.id)

    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('projects').insert(parsed.data)
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
  if (slug) revalidatePath(`/work/${slug}`)
  return { success: true }
}

export async function toggleProjectPublished(id: string, is_published: boolean, slug?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({ is_published }).eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  if (slug) revalidatePath(`/work/${slug}`)
  return { success: true }
}
