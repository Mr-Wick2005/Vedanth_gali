'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { SocialLinkRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Clock } from '@/components/motion/Clock'
import { Magnetic } from '@/components/motion/Magnetic'

interface FooterProps {
  socialLinks: SocialLinkRow[]
  email?: string
}

export function Footer({
  socialLinks,
  email = 'vedanthgali@gmail.com',
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      // Fallback
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-black pt-24 pb-12 text-white">
      {/* Background ambient spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[450px] w-full max-w-[1200px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Kinetic CTA Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 09 — NEXT STEPS ]
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              Let&apos;s Build <br />
              <span className="text-violet-400">Together.</span>
            </h2>
            <p className="mt-4 font-mono text-xs sm:text-sm text-muted leading-relaxed max-w-lg">
              Open to full-time Frontend &amp; Full-Stack engineering opportunities. Available to discuss systems architecture, production web builds, and technical creative direction.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.55)]"
              >
                <span>Send An Email</span>
                <Icon name="arrow-up-right" size={16} />
              </a>
            </Magnetic>

            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 font-mono text-sm font-medium tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
              >
                <Icon name={copied ? 'check' : 'copy'} size={16} className={copied ? 'text-emerald-400' : ''} />
                <span>{copied ? 'Copied to Clipboard' : 'Copy Email'}</span>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Metadata Rail */}
        <div className="mt-20 grid grid-cols-1 gap-8 border-y border-white/[0.08] py-8 sm:grid-cols-2 md:grid-cols-4 font-mono text-xs text-muted">
          {/* Col 1: Time */}
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-white/40">LOCATION & TIME</span>
            <div className="mt-2 text-text">
              <Clock showPrefix={false} className="text-xs" /> • Mumbai, India
            </div>
          </div>

          {/* Col 2: Status */}
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-white/40">CURRENT STATUS</span>
            <div className="mt-2 flex items-center gap-2 text-text">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>Available for Roles</span>
            </div>
          </div>

          {/* Col 3: Social Links */}
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-white/40">VERIFIED PROFILES</span>
            <div className="mt-2 flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-text-lilac transition-colors hover:text-violet-300"
                  aria-label={link.label}
                >
                  <Icon name={link.label} size={16} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: Back to top */}
          <div className="flex sm:justify-end">
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-muted transition-colors hover:border-violet-400/40 hover:text-white"
              >
                <span>Back to Top</span>
                <Icon name="arrow-down" size={14} className="rotate-180" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Oversized Wordmark */}
        <div className="select-none pt-16 pb-8 text-center w-full max-w-full overflow-hidden">
          <span className="block font-display text-[12vw] 2xl:text-[180px] font-black uppercase leading-none tracking-tighter text-stroke text-white/5 opacity-40">
            VEDANTH GALI
          </span>
        </div>

        {/* Minimal Copyright with Discreet Admin Portal Link */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-center font-mono text-xs text-muted/60 sm:flex-row sm:text-left">
          <p>© {currentYear} Vedanth Gali. Built with Next.js 16, React 19, TypeScript, and Supabase.</p>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-white/30">Crafted with precision • Mumbai, Maharashtra</p>
            <span className="text-white/10" aria-hidden="true">•</span>
            <Link
              href="/admin"
              className="text-[11px] text-white/20 transition-colors hover:text-violet-400 focus:text-violet-400 focus:outline-none"
              title="Admin Portal"
            >
              admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
