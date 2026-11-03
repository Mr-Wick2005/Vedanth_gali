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
  image_url: z.string().nullable().optional(),
  image_alt: z.string().nullable().optional(),
  gallery: z.any().optional(),
  images: z.any().optional(),
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
  const data = { ...parsed.data }

  // Sync image_url from gallery/images if provided
  if (Array.isArray(data.images) && data.images.length > 0 && data.images[0]?.url) {
    data.image_url = data.images[0].url
    if (data.images[0].alt) data.image_alt = data.images[0].alt
  } else if (Array.isArray(data.gallery) && data.gallery.length > 0 && data.gallery[0]?.url) {
    data.image_url = data.gallery[0].url
    if (data.gallery[0].alt) data.image_alt = data.gallery[0].alt
  }

  if (parsed.data.id) {
    let { error } = await supabase
      .from('certifications')
      .update(data)
      .eq('id', parsed.data.id)

    // Fallback if gallery / images columns don't exist yet on remote table
    if (error && (error.message.includes('gallery') || error.message.includes('images'))) {
      const legacyData = { ...data }
      delete legacyData.gallery
      delete legacyData.images
      const retry = await supabase.from('certifications').update(legacyData).eq('id', parsed.data.id)
      error = retry.error
    }

    if (error) return { success: false, error: error.message }
  } else {
    let { error } = await supabase.from('certifications').insert(data)

    if (error && (error.message.includes('gallery') || error.message.includes('images'))) {
      const legacyData = { ...data }
      delete legacyData.gallery
      delete legacyData.images
      const retry = await supabase.from('certifications').insert(legacyData)
      error = retry.error
    }

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
