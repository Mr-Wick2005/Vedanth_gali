'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { NavItemRow } from '@/types/database'

const navItemSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Target URL or anchor is required'),
  order_index: z.number().int().default(0),
  is_visible: z.boolean().default(true),
  is_cta: z.boolean().default(false),
})

export type NavItemInput = z.infer<typeof navItemSchema>

/**
 * Fetch all navigation items for admin dashboard
 */
export async function getNavItemsAdmin(): Promise<NavItemRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('nav_items')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.warn('Error fetching admin nav items:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception fetching admin nav items:', err)
    return []
  }
}

/**
 * Save nav item (create or update)
 */
export async function saveNavItem(input: NavItemInput) {
  const parsed = navItemSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid nav item data' }
  }

  const supabase = await createClient()
  const payload = {
    label: parsed.data.label,
    href: parsed.data.href,
    order_index: parsed.data.order_index,
    is_visible: parsed.data.is_visible,
    is_cta: parsed.data.is_cta,
  }

  if (parsed.data.id) {
    const { error } = await supabase
      .from('nav_items')
      .update(payload)
      .eq('id', parsed.data.id)

    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase
      .from('nav_items')
      .insert(payload)

    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/navigation')
  return { success: true }
}

/**
 * Reorder nav items
 */
export async function updateNavItemsOrder(orderedIds: string[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return { success: false, error: 'Empty navigation order list' }
  }

  const supabase = await createClient()

  for (let idx = 0; idx < orderedIds.length; idx++) {
    const id = orderedIds[idx]
    if (!id) continue
    const { error } = await supabase
      .from('nav_items')
      .update({ order_index: idx + 1 })
      .eq('id', id)

    if (error) {
      return { success: false, error: `Failed to update nav item ${id}: ${error.message}` }
    }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/navigation')
  return { success: true }
}

/**
 * Toggle nav item visibility
 */
export async function toggleNavItemVisibility(id: string, isVisible: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('nav_items')
    .update({ is_visible: isVisible })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/navigation')
  return { success: true }
}

/**
 * Delete nav item
 */
export async function deleteNavItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('nav_items')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/navigation')
  return { success: true }
}
