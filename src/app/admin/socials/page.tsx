import Link from 'next/link'

export default function AdminSocialsStub() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <span className="font-mono text-xs text-accent">CMS SECTION</span>
          <h1 className="font-display text-2xl font-bold text-text">Social Links & Contact</h1>
          <p className="mt-1 text-xs text-muted">Manage GitHub, LinkedIn, Email, and public Phone number.</p>
        </div>
        <Link href="/admin" className="rounded border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted hover:text-text">
          ← Dashboard
        </Link>
      </div>
      <div className="rounded border border-dashed border-border/60 bg-background/50 p-12 text-center">
        <span className="font-mono text-xs text-muted">STUB: Social links and contact methods editor will be built in Phase 5</span>
      </div>
    </div>
  )
}
