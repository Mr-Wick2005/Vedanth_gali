'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { FontRow } from '@/types/database'

const fontSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Font name is required'),
  source: z.enum(['google', 'uploaded']),
  file_path: z.string().nullable().optional(),
  weights: z.array(z.string()).min(1, 'At least one weight is required'),
})

export type FontInput = z.infer<typeof fontSchema>

export async function getFontsAdmin(): Promise<FontRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('fonts').select('*').order('name', { ascending: true })
    if (error) {
      console.warn('Error fetching fonts:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception fetching fonts:', err)
    return []
  }
}

export async function saveFont(input: FontInput) {
  const parsed = fontSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid font data' }
  }

  const supabase = await createClient()
  const payload = {
    name: parsed.data.name,
    source: parsed.data.source,
    file_path: parsed.data.file_path || null,
    weights: parsed.data.weights,
  }

  if (parsed.data.id) {
    const { error } = await supabase.from('fonts').update(payload).eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('fonts').insert(payload)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/typography')
  return { success: true }
}

export async function deleteFont(id: string) {
  const supabase = await createClient()

  // If uploaded, delete from storage
  const { data: font } = await supabase.from('fonts').select('*').eq('id', id).single()
  if (font?.source === 'uploaded' && font.file_path) {
    await supabase.storage.from('fonts').remove([font.file_path])
  }

  const { error } = await supabase.from('fonts').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/typography')
  return { success: true }
}
