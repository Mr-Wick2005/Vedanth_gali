import Link from 'next/link'

export default function AdminSettingsStub() {
  return (
    <div className="border-border bg-surface rounded-lg border p-8">
      <div className="border-border/50 mb-6 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-accent font-mono text-xs">CMS SECTION</span>
          <h1 className="font-display text-text text-2xl font-bold">Site Settings</h1>
          <p className="text-muted mt-1 text-xs">
            Manage SEO metadata, OpenGraph images, and availability display.
          </p>
        </div>
        <Link
          href="/admin"
          className="border-border bg-background text-muted hover:text-text rounded border px-3 py-1.5 font-mono text-xs"
        >
          ← Dashboard
        </Link>
      </div>
      <div className="border-border/60 bg-background/50 rounded border border-dashed p-12 text-center">
        <span className="text-muted font-mono text-xs">
          STUB: Site settings editor will be built in Phase 5
        </span>
      </div>
    </div>
  )
}
