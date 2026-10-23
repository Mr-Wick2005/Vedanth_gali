'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { optionalIdSchema } from '@/lib/validations'

const educationSchema = z.object({
  id: optionalIdSchema,
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  start_year: z.number().int(),
  end_year: z.number().int(),
  status: z.string().min(1, 'Status is required'),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type EducationInput = z.infer<typeof educationSchema>

export async function saveEducation(input: EducationInput) {
  const parsed = educationSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()

  if (parsed.data.id) {
    const { error } = await supabase.from('education').update(parsed.data).eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('education').insert(parsed.data)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteEducation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
