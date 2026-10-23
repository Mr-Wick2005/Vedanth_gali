'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded border border-border bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-red-500/50 hover:bg-surface-hover hover:text-red-400"
    >
      Sign out
    </button>
  )
}
