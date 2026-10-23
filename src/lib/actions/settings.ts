'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const settingsSchema = z.object({
  id: z.string().uuid(),
  seo_title: z.string().min(1, 'SEO title is required'),
  seo_description: z.string().min(1, 'SEO description is required'),
  og_image_url: z.string().nullable().optional(),
  og_image_alt: z.string().nullable().optional(),
  availability_visible: z.boolean(),
})

export type SiteSettingsInput = z.infer<typeof settingsSchema>

export async function updateSiteSettings(input: SiteSettingsInput) {
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid data' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update(parsed.data)
    .eq('id', parsed.data.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
