'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { optionalIdSchema } from '@/lib/validations'

const certSchema = z.object({
  id: optionalIdSchema,
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  year: z.number().int(),
  credential_url: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
})

export type CertificationInput = z.infer<typeof certSchema>

export async function saveCertification(input: CertificationInput) {
  const parsed = certSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()

  if (parsed.data.id) {
    const { error } = await supabase
      .from('certifications')
      .update(parsed.data)
      .eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('certifications').insert(parsed.data)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteCertification(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}
