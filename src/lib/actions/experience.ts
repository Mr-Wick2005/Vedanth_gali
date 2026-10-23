'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const experienceSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().min(1, 'Company/Org is required'),
  title: z.string().min(1, 'Title is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().nullable().optional(),
  period_label: z.string().nullable().optional(),
  org_url: z.string().nullable().optional(),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()).default([]),
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

  if (parsed.data.id) {
    const { error } = await supabase.from('experience').update(parsed.data).eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('experience').insert(parsed.data)
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
