import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EducationManager } from '@/components/admin/EducationManager'
import type { EducationRow } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AdminEducationPage() {
  const supabase = await createClient()
  const { data: education } = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="border-border/50 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-accent font-mono text-xs">CMS SECTION</span>
          <h1 className="font-display text-text text-2xl font-bold">Education Records</h1>
          <p className="text-muted mt-1 text-xs">
            Manage degrees, colleges, university qualifications, and graduation status.
          </p>
        </div>
        <Link
          href="/admin"
          className="border-border bg-background text-muted hover:text-text rounded border px-3 py-1.5 font-mono text-xs transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <EducationManager initialEducation={(education as EducationRow[]) || []} />
    </div>
  )
}
