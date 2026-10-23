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
    <section id="contact" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="rounded-xl border border-border bg-surface p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              06 — CONTACT
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-text sm:text-5xl">
              Let&apos;s build together.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              I am open to full-time Frontend and Full-Stack Developer roles where I can contribute to shipping scalable interfaces and robust systems.
            </p>

            {/* Email Action & Copy */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${email}`}
                className="rounded border border-accent bg-accent px-6 py-3 font-mono text-xs font-semibold text-background transition-all hover:bg-accent/90"
              >
                Send an Email ↗
              </a>
              <button
                onClick={handleCopyEmail}
                className="rounded border border-border bg-background px-5 py-3 font-mono text-xs text-text transition-all hover:border-accent hover:bg-surface-hover"
              >
                {copied ? '✓ Copied to clipboard!' : `Copy: ${email}`}
              </button>
            </div>

            {/* Phone & Social Matrix */}
            <div className="mt-12 grid gap-4 border-t border-border/50 pt-8 sm:grid-cols-2">
              {phoneLink && (
                <div>
                  <span className="font-mono text-xs text-muted">Direct Phone:</span>
                  <p className="mt-1">
                    <a
                      href={phoneLink.url}
                      className="font-mono text-sm font-semibold text-text hover:text-accent transition-colors"
                    >
                      {phoneLink.display_text || '+91 99876 02631'} ↗
                    </a>
                  </p>
                </div>
              )}

              <div>
                <span className="font-mono text-xs text-muted">Location:</span>
                <p className="mt-1 font-mono text-sm text-text">
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
