'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const skillSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  icon_key: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type SkillInput = z.infer<typeof skillSchema>

export async function saveSkill(input: SkillInput) {
  const parsed = skillSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()

  if (parsed.data.id) {
    const { error } = await supabase.from('skills').update(parsed.data).eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('skills').insert(parsed.data)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteSkill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
