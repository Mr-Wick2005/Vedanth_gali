'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requiredIdSchema } from '@/lib/validations'

const profileSchema = z.object({
  id: requiredIdSchema,
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  short_bio: z.string().min(1, 'Short bio is required'),
  long_bio: z.string().min(1, 'Long bio is required'),
  location: z.string().min(1, 'Location is required'),
  email: z.string().email('Valid email is required'),
  availability_text: z.string().min(1, 'Availability text is required'),
  avatar_url: z.string().nullable().optional(),
  avatar_alt: z.string().nullable().optional(),
  resume_url: z.string().nullable().optional(),
})

export type ProfileInput = z.infer<typeof profileSchema>

export async function updateProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('profile').update(parsed.data).eq('id', parsed.data.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
