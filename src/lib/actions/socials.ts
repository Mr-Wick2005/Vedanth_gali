'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const socialSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, 'Label is required'),
  url: z.string().min(1, 'URL is required'),
  display_text: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type SocialInput = z.infer<typeof socialSchema>

export async function saveSocial(input: SocialInput) {
  const parsed = socialSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()

  if (parsed.data.id) {
    const { error } = await supabase
      .from('social_links')
      .update(parsed.data)
      .eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('social_links').insert(parsed.data)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteSocial(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
