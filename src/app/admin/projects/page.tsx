import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProjectsManager } from '@/components/admin/ProjectsManager'
import type { ProjectRow } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="border-border/50 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-accent font-mono text-xs">CMS SECTION</span>
          <h1 className="font-display text-text text-2xl font-bold">Projects Portfolio</h1>
          <p className="text-muted mt-1 text-xs">
            Manage case studies, tech stacks, live repository links, and featured status.
          </p>
        </div>
        <Link
          href="/admin"
          className="border-border bg-background text-muted hover:text-text rounded border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <ProjectsManager initialProjects={(projects as ProjectRow[]) || []} />
    </div>
  )
}
