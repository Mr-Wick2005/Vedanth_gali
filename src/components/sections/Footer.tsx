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
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

export function Footer({
  socialLinks,
  email: initialEmail = 'vedanthmgali@gmail.com',
  content,
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [copied, setCopied] = useState(false)

  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 09 — NEXT STEPS & CONTACT ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : "Let's Build"

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Together.'

  const body =
    typeof content?.body === 'string' && content.body.trim()
      ? content.body
      : 'Open to full-time Frontend & Full-Stack engineering opportunities. Available to discuss systems architecture, production web builds, and technical creative direction.'

  const email =
    typeof content?.email === 'string' && content.email.trim()
      ? content.email
      : initialEmail

  const ctaPrimaryLabel =
    typeof content?.cta_primary_label === 'string' && content.cta_primary_label.trim()
      ? content.cta_primary_label
      : 'Send An Email'

  const ctaCopyLabel =
    typeof content?.cta_copy_label === 'string' && content.cta_copy_label.trim()
      ? content.cta_copy_label
      : 'Copy Email'

  const copyrightText =
    typeof content?.copyright === 'string' && content.copyright.trim()
      ? content.copyright
      : `© ${currentYear} Vedanth Gali`

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
    <footer className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] pt-24 pb-12 text-white">
      {/* Background ambient spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[450px] w-full max-w-[1200px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-1/4 h-[350px] w-[350px] rounded-full bg-pink-600/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Kinetic CTA Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
              {kicker}
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              {headingLine1} <br />
              <span className="text-gradient-accent">{headingLine2}</span>
            </h2>
            <p className="mt-4 font-mono text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              {body}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 font-mono text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)]"
              >
                <span>{ctaPrimaryLabel}</span>
                <Icon name="arrow-up-right" size={16} />
              </a>
            </Magnetic>

            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3.5 font-mono text-sm font-medium tracking-wider text-slate-300 transition-all hover:border-pink-500/40 hover:text-white"
              >
                <Icon name={copied ? 'check' : 'copy'} size={16} className={copied ? 'text-emerald-400' : ''} />
                <span>{copied ? 'Copied to Clipboard' : ctaCopyLabel}</span>
              </button>
            </Magnetic>
          </div>
        </div>
        {/* Social Links Row */}
        {socialLinks.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-6 font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-wider text-[11px] mr-2">Networks:</span>
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300 transition-colors hover:border-blue-500/40 hover:text-white"
              >
                <Icon name={link.label} size={13} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        )}

        {/* Bottom Colophon Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-white/[0.08] pt-8 font-mono text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-4">
            <Clock showPrefix className="text-xs" />
            <span>•</span>
            <span>Mumbai, IN</span>
          </div>

          <div className="flex items-center gap-6">
            <span>{copyrightText}</span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {'// admin'}
            </Link>
            <span>•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <Icon name="arrow-up" size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
