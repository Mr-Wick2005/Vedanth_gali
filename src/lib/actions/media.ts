'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { MediaRow, SectionMediaRow } from '@/types/database'

const mediaRecordSchema = z.object({
  id: z.string().uuid().optional(),
  bucket_path: z.string().min(1, 'Bucket path is required'),
  public_url: z.string().url('Valid public URL is required'),
  type: z.enum(['image', 'video']),
  alt_text: z.string().default(''),
  mime: z.string().nullable().optional(),
  size: z.number().nullable().optional(),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
})

export type MediaRecordInput = z.infer<typeof mediaRecordSchema>

/**
 * Fetch all media items in library with optional type filter
 */
export async function getMediaAdmin(typeFilter?: 'image' | 'video'): Promise<MediaRow[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('media').select('*').order('created_at', { ascending: false })

    if (typeFilter) {
      query = query.eq('type', typeFilter)
    }

    const { data, error } = await query
    if (error) {
      console.warn('Error fetching media:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception fetching media:', err)
    return []
  }
}

/**
 * Save new media record in the media table
 */
export async function saveMediaRecord(input: MediaRecordInput) {
  const parsed = mediaRecordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid media input' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const payload = {
    bucket_path: parsed.data.bucket_path,
    public_url: parsed.data.public_url,
    type: parsed.data.type,
    alt_text: parsed.data.alt_text,
    mime: parsed.data.mime || null,
    size: parsed.data.size || null,
    width: parsed.data.width || null,
    height: parsed.data.height || null,
    uploaded_by: user?.id || null,
  }

  if (parsed.data.id) {
    const { error } = await supabase.from('media').update(payload).eq('id', parsed.data.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { data, error } = await supabase.from('media').insert(payload).select('id').single()
    if (error) return { success: false, error: error.message }
    return { success: true, id: data.id }
  }

  revalidatePath('/admin/media')
  return { success: true }
}

/**
 * Delete media record and remove file from storage
 */
export async function deleteMediaRecord(id: string) {
  const supabase = await createClient()

  // First fetch the bucket path
  const { data: item } = await supabase.from('media').select('bucket_path').eq('id', id).single()

  if (item?.bucket_path) {
    // Delete file from storage
    const pathParts = item.bucket_path.split('/')
    const fileName = pathParts[pathParts.length - 1]
    if (fileName) {
      await supabase.storage.from('media').remove([item.bucket_path])
    }
  }

  const { error } = await supabase.from('media').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/media')
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Fetch media attached to a specific section
 */
export async function getSectionMedia(sectionId: string): Promise<Array<SectionMediaRow & { media: MediaRow }>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('section_media')
      .select('*, media:media_id (*)')
      .eq('section_id', sectionId)
      .order('order_index', { ascending: true })

    if (error) {
      console.warn('Error fetching section media:', error.message)
      return []
    }
    return (data as unknown as Array<SectionMediaRow & { media: MediaRow }>) || []
  } catch (err) {
    console.error('Exception fetching section media:', err)
    return []
  }
}

/**
 * Attach a media item to a section
 */
export async function attachMediaToSection(sectionId: string, mediaId: string, role = 'gallery', orderIndex = 0) {
  const supabase = await createClient()
  const { error } = await supabase.from('section_media').insert({
    section_id: sectionId,
    media_id: mediaId,
    role,
    order_index: orderIndex,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Detach a media item from a section
 */
export async function detachMediaFromSection(sectionMediaId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('section_media').delete().eq('id', sectionMediaId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}
