import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/SignOutButton'
import { ToastProvider } from '@/components/admin/ToastContext'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Vedanth Gali',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <div className="bg-surface w-full max-w-md rounded-lg border border-red-500/30 p-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs text-red-400">
            ACCESS DENIED
          </div>
          <h1 className="font-display text-text mb-2 text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted mb-6 text-sm">
            Signed in as <span className="text-text font-mono">{user.email}</span>, but your account
            is not listed in{' '}
            <code className="bg-surface-hover text-accent rounded px-1.5 py-0.5 font-mono text-xs">
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
    <ToastProvider>
      <div className="bg-background text-text min-h-screen">
        {/* Top Header */}
        <header className="border-border bg-surface/50 border-b backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-muted hover:text-accent font-mono text-xs transition-colors"
              >
                ← Public Site
              </Link>
              <span className="text-border font-mono text-xs">/</span>
              <span className="font-display text-text text-sm font-bold tracking-tight">
                Portfolio Admin
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-muted hidden font-mono text-xs sm:inline">
                Signed in as <strong className="text-text">{user.email}</strong>
              </span>
              <SignOutButton />
            </div>
          </div>

          {/* Subnav */}
          <div className="border-border/40 bg-surface/30 border-t">
            <div className="mx-auto flex max-w-[1200px] gap-1 overflow-x-auto px-6 py-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted hover:bg-surface-hover hover:text-text rounded px-2.5 py-1 font-mono text-xs whitespace-nowrap transition-colors"
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
    </ToastProvider>
  )
}
