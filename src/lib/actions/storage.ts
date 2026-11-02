'use server'

import { createClient } from '@/lib/supabase/server'

interface DeleteStorageResult {
  success: boolean
  error?: string
}

/**
 * Server action to delete an uploaded object from the Supabase storage bucket.
 * Requires authenticated admin session.
 */
export async function deleteStorageFile(
  filePath: string,
  bucket = 'media',
): Promise<DeleteStorageResult> {
  if (!filePath) {
    return { success: false, error: 'File path is required' }
  }

  try {
    const supabase = await createClient()

    // 1. Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Admin authentication required' }
    }

    // 2. Remove file from storage bucket
    const { error: deleteError } = await supabase.storage.from(bucket).remove([filePath])

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete file from storage',
    }
  }
}
