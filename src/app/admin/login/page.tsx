'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/admin'

  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      const supabase = createClient()

      if (authMode === 'password') {
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
      } else {
        const redirectTo = `${window.location.origin}/admin`
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectTo,
          },
        })

        if (error) {
          setErrorMsg(error.message)
          setLoading(false)
          return
        }

        setSuccessMsg('Magic link sent to your email. Check your inbox to sign in.')
        setLoading(false)
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="border-border bg-surface w-full max-w-sm rounded-xl border p-8 shadow-2xl">
      <div className="mb-6">
        <Link href="/" className="text-muted hover:text-accent font-mono text-xs transition-colors">
          ← Back to site
        </Link>
        <h1 className="font-display text-text mt-4 text-2xl font-bold tracking-tight">
          Admin Sign In
        </h1>
        <p className="text-muted mt-1 text-xs">
          Private administration portal.
        </p>
      </div>

      {/* Auth Mode Toggle */}
      <div className="mb-5 flex rounded-lg border border-white/10 bg-black/40 p-1">
        <button
          type="button"
          onClick={() => {
            setAuthMode('password')
            setErrorMsg(null)
            setSuccessMsg(null)
          }}
          className={`flex-1 rounded-md py-1.5 font-mono text-xs font-medium transition-all ${
            authMode === 'password'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('magic-link')
            setErrorMsg(null)
            setSuccessMsg(null)
          }}
          className={`flex-1 rounded-md py-1.5 font-mono text-xs font-medium transition-all ${
            authMode === 'magic-link'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Magic Link
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-muted mb-1.5 block font-mono text-xs" htmlFor="email">
            Admin Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border bg-background text-text placeholder-muted/50 focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
            placeholder="admin@example.com"
          />
        </div>

        {authMode === 'password' && (
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
              className="border-border bg-background text-text placeholder-muted/50 focus:border-accent w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white hover:bg-blue-500 w-full cursor-pointer rounded-lg py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(37,99,235,0.35)]"
        >
          {loading
            ? 'Authenticating...'
            : authMode === 'password'
              ? 'Sign In'
              : 'Send Magic Link'}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#05060a]">
      <Suspense fallback={<div className="text-muted font-mono text-xs">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
