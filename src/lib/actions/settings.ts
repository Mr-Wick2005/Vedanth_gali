'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requiredIdSchema } from '@/lib/validations'

const settingsSchema = z.object({
  id: requiredIdSchema,
  site_title: z.string().optional(),
  site_description: z.string().optional(),
  site_keywords: z.array(z.string()).optional(),
  site_url: z.string().optional(),
  author_name: z.string().optional(),
  author_email: z.string().optional(),
  author_location: z.string().optional(),
  seo_title: z.string().min(1, 'SEO title is required'),
  seo_description: z.string().min(1, 'SEO description is required'),
  og_image_url: z.string().nullable().optional(),
  og_image_alt: z.string().nullable().optional(),
  favicon_url: z.string().nullable().optional(),
  theme_mode: z.string().optional(),
  accent_color_primary: z.string().optional(),
  accent_color_secondary: z.string().optional(),
  bg_base_color: z.string().optional(),
  surface_color: z.string().optional(),
  display_font_family: z.string().optional(),
  body_font_family: z.string().optional(),
  mono_font_family: z.string().optional(),
  availability_visible: z.boolean().optional(),
})

export type SiteSettingsInput = z.infer<typeof settingsSchema>

export async function updateSiteSettings(input: SiteSettingsInput) {
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid settings data' }
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
  revalidatePath('/admin/settings')
  return { success: true }
}
