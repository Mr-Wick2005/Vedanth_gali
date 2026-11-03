'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { SectionRow, SectionVersionRow } from '@/types/database'

const sectionInputSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1, 'Section key is required').regex(/^[a-z0-9_-]+$/, 'Key must be alphanumeric, hyphen, or underscore'),
  type: z.string().min(1, 'Section type is required'),
  order_index: z.number().int().default(0),
  is_visible: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('published'),
  content: z.record(z.string(), z.any()).default({}),
  style: z.record(z.string(), z.any()).default({}),
})

export type SectionInput = z.infer<typeof sectionInputSchema>

/**
 * Fetch all sections for admin dashboard (including drafts and hidden)
 */
export async function getSectionsAdmin(): Promise<SectionRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.warn('Error fetching admin sections:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception fetching admin sections:', err)
    return []
  }
}

/**
 * Fetch a single section by id for editing
 */
export async function getSectionById(id: string): Promise<SectionRow | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.warn('Error fetching section by id:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('Exception fetching section by id:', err)
    return null
  }
}

/**
 * Fetch revision history for a section
 */
export async function getSectionVersions(sectionId: string): Promise<SectionVersionRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('section_versions')
      .select('*')
      .eq('section_id', sectionId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.warn('Error fetching section versions:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception fetching section versions:', err)
    return []
  }
}

/**
 * Save section (create or update), log version, and revalidate cache
 */
export async function saveSection(input: SectionInput) {
  const parsed = sectionInputSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid section data' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const payload = {
    key: parsed.data.key,
    type: parsed.data.type,
    order_index: parsed.data.order_index,
    is_visible: parsed.data.is_visible,
    status: parsed.data.status,
    published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
    content: parsed.data.content,
    style: parsed.data.style,
  }

  let sectionId = parsed.data.id

  if (sectionId) {
    const { error: updateError } = await supabase
      .from('sections')
      .update(payload)
      .eq('id', sectionId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }
  } else {
    const { data: newSection, error: insertError } = await supabase
      .from('sections')
      .insert(payload)
      .select('id')
      .single()

    if (insertError) {
      return { success: false, error: insertError.message }
    }
    sectionId = newSection.id
  }

  // Record version history snapshot
  if (sectionId) {
    try {
      await supabase.from('section_versions').insert({
        section_id: sectionId,
        content: parsed.data.content,
        style: parsed.data.style,
        status: parsed.data.status,
        created_by: user?.id || null,
      })
    } catch (verErr) {
      console.warn('Could not record section version history:', verErr)
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true, sectionId }
}

/**
 * Reorder sections by updating order_index for a list of ids
 */
export async function updateSectionsOrder(orderedIds: string[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { success: false, error: 'Empty section order list' }
  }

  const supabase = await createClient()

  // Update each section's order index
  for (let idx = 0; idx < orderedIds.length; idx++) {
    const id = orderedIds[idx]
    if (!id) continue
    const { error } = await supabase
      .from('sections')
      .update({ order_index: idx + 1 })
      .eq('id', id)

    if (error) {
      return { success: false, error: `Failed to update order for section ${id}: ${error.message}` }
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true }
}

/**
 * Toggle section visibility
 */
export async function toggleSectionVisibility(id: string, isVisible: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sections')
    .update({ is_visible: isVisible })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true }
}

/**
 * Duplicate a section as a draft
 */
export async function duplicateSection(id: string) {
  const supabase = await createClient()
  const source = await getSectionById(id)
  if (!source) {
    return { success: false, error: 'Source section not found' }
  }

  const newKey = `${source.key}-copy-${Date.now().toString(36)}`
  const { data: newSec, error } = await supabase
    .from('sections')
    .insert({
      key: newKey,
      type: source.type,
      order_index: source.order_index + 1,
      is_visible: false,
      status: 'draft',
      content: source.content,
      style: source.style,
    })
    .select('id')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true, newId: newSec.id }
}

/**
 * Delete a section
 */
export async function deleteSection(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true }
}

/**
 * Rollback to a previous section version
 */
export async function rollbackSectionVersion(sectionId: string, versionId: string) {
  const supabase = await createClient()
  const { data: version, error: vError } = await supabase
    .from('section_versions')
    .select('*')
    .eq('id', versionId)
    .single()

  if (vError || !version) {
    return { success: false, error: 'Version not found' }
  }

  const { error: uError } = await supabase
    .from('sections')
    .update({
      content: version.content,
      style: version.style,
      status: (version.status === 'published' ? 'published' : 'draft') as 'published' | 'draft',
    })
    .eq('id', sectionId)

  if (uError) {
    return { success: false, error: uError.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/sections')
  return { success: true }
}
