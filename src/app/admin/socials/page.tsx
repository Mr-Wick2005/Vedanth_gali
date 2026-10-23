import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SocialsManager } from '@/components/admin/SocialsManager'
import type { SocialLinkRow } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminSocialsPage() {
  const supabase = await createClient()
  const { data: socials } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="border-border/50 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-accent font-mono text-xs">CMS SECTION</span>
          <h1 className="font-display text-text text-2xl font-bold">Social & Contact Links</h1>
          <p className="text-muted mt-1 text-xs">
            Manage links to GitHub, LinkedIn, email, and other contact channels.
          </p>
        </div>
        <Link
          href="/admin"
          className="border-border bg-background text-muted hover:text-text rounded border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <SocialsManager initialSocials={(socials as SocialLinkRow[]) || []} />
    </div>
  )
}
