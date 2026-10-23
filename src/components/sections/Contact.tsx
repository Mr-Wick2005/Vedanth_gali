'use client'

import { useState } from 'react'
import type { ProfileRow, SocialLinkRow } from '@/types/database'

interface ContactProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
}

export function Contact({ profile, socialLinks }: ContactProps) {
  const [copied, setCopied] = useState(false)
  const email = profile?.email || 'vedanthmgali@gmail.com'

  const phoneLink = socialLinks.find(
    (l) => l.label.toLowerCase() === 'phone' || l.url.startsWith('tel:'),
  )

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <section id="contact" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="border-border bg-surface rounded-xl border p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="text-accent font-mono text-xs tracking-widest uppercase">
              06 — CONTACT
            </span>
            <h2 className="font-display text-text mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Let&apos;s build together.
            </h2>
            <p className="text-muted mt-4 text-base leading-relaxed sm:text-lg">
              I am open to full-time Frontend and Full-Stack Developer roles where I can contribute
              to shipping scalable interfaces and robust systems.
            </p>

            {/* Email Action & Copy */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${email}`}
                className="border-accent bg-accent text-background hover:bg-accent/90 rounded border px-6 py-3 font-mono text-xs font-semibold transition-all"
              >
                Send an Email ↗
              </a>
              <button
                onClick={handleCopyEmail}
                className="border-border bg-background text-text hover:border-accent hover:bg-surface-hover rounded border px-5 py-3 font-mono text-xs transition-all"
              >
                {copied ? '✓ Copied to clipboard!' : `Copy: ${email}`}
              </button>
            </div>

            {/* Phone & Social Matrix */}
            <div className="border-border/50 mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2">
              {phoneLink && (
                <div>
                  <span className="text-muted font-mono text-xs">Direct Phone:</span>
                  <p className="mt-1">
                    <a
                      href={phoneLink.url}
                      className="text-text hover:text-accent font-mono text-sm font-semibold transition-colors"
                    >
                      {phoneLink.display_text || '+91 99876 02631'} ↗
                    </a>
                  </p>
                </div>
              )}

              <div>
                <span className="text-muted font-mono text-xs">Location:</span>
                <p className="text-text mt-1 font-mono text-sm">
                  {profile?.location || 'Mumbai, Maharashtra, India'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
