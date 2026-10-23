import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/SignOutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Verify User Session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow unauthenticated access only on the login route
  // (Proxy handles the route redirection, but layout enforces defense-in-depth)
  if (!user) {
    return <>{children}</>
  }

  // 2. Server-side check: verify admin role via is_admin() RPC
  const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin')

  if (adminCheckError || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border border-red-500/30 bg-surface p-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs text-red-400">
            ACCESS DENIED
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-text">
            Unauthorized
          </h1>
          <p className="mb-6 text-sm text-muted">
            Signed in as{' '}
            <span className="font-mono text-text">{user.email}</span>, but your
            account is not listed in{' '}
            <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs text-accent">
              admin_users
            </code>
            .
          </p>
          <div className="flex justify-center">
            <SignOutButton />
          </div>
        </div>
      </div>
    )
  }

  const navLinks = [
    { label: 'Overview', href: '/admin' },
    { label: 'Profile', href: '/admin/profile' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Certifications', href: '/admin/certifications' },
    { label: 'Skills', href: '/admin/skills' },
    { label: 'Socials', href: '/admin/socials' },
    { label: 'Settings', href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Top Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              ← Public Site
            </Link>
            <span className="font-mono text-xs text-border">/</span>
            <span className="font-display text-sm font-bold tracking-tight text-text">
              Portfolio Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-muted sm:inline">
              Signed in as <strong className="text-text">{user.email}</strong>
            </span>
            <SignOutButton />
          </div>
        </div>

        {/* Subnav */}
        <div className="border-t border-border/40 bg-surface/30">
          <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-6 py-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:bg-surface-hover hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  )
}
