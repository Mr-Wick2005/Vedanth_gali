import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/admin/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profile').select('*').limit(1).maybeSingle()

  return (
    <div className="space-y-6">
      <div className="border-border/50 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-accent font-mono text-xs">CMS SECTION</span>
          <h1 className="font-display text-text text-2xl font-bold">Profile Editor</h1>
          <p className="text-muted mt-1 text-xs">
            Manage your personal identity, narrative bio, portrait photo, and downloadable résumé.
          </p>
        </div>
        <Link
          href="/admin"
          className="border-border bg-background text-muted hover:text-text rounded border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  )
}
