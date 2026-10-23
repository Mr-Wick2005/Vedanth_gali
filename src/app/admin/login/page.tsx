'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      router.push(nextUrl)
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="border-border bg-surface w-full max-w-sm rounded-lg border p-8">
      <div className="mb-6">
        <Link href="/" className="text-muted hover:text-accent font-mono text-xs transition-colors">
          ← Back to site
        </Link>
        <h1 className="font-display text-text mt-4 text-2xl font-bold tracking-tight">
          Admin Sign In
        </h1>
        <p className="text-muted mt-1 text-xs">
          Private management portal for Vedanth Gali Portfolio.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-muted mb-1.5 block font-mono text-xs" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border bg-background text-text placeholder-muted/50 focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="text-muted mb-1.5 block font-mono text-xs" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border bg-background text-text placeholder-muted/50 focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border-accent bg-accent/10 text-accent hover:bg-accent hover:text-text w-full cursor-pointer rounded border px-4 py-2 font-mono text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Suspense fallback={<div className="text-muted font-mono text-xs">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
