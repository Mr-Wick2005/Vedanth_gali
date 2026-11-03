'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { Magnetic } from '@/components/motion/Magnetic'
import type { NavItemRow } from '@/types/database'

interface NavigationProps {
  resumeUrl?: string | null
  navItems?: NavItemRow[] | null
  siteTitle?: string | null
}

const DEFAULT_NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation({ resumeUrl, navItems, siteTitle }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Use dynamic navItems if provided, filtering for non-CTA links
  const regularLinks = navItems && navItems.length > 0
    ? navItems.filter((item) => item.is_visible && !item.is_cta)
    : DEFAULT_NAV_LINKS

  // Check for CTA link configured in navigation items
  const ctaItem = navItems?.find((item) => item.is_visible && item.is_cta)
  const ctaHref = ctaItem ? ctaItem.href : resumeUrl || '#contact'
  const ctaLabel = ctaItem ? ctaItem.label : resumeUrl ? 'Résumé' : 'Connect'
  const isExternalCta = ctaHref.startsWith('http') || ctaHref.endsWith('.pdf')

  return (
    <header
      style={{ viewTransitionName: 'site-navigation' }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.08] bg-[#05060a]/80 backdrop-blur-md transition-all"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-3.5 sm:py-4">
        {/* Monogram Brandmark */}
        <Link
          href="/"
          className="group flex items-center gap-1 font-display text-lg font-black tracking-tight text-white transition-opacity hover:opacity-85"
        >
          <span>{siteTitle || 'VG'}</span>
          <span className="text-blue-500">.</span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {regularLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <Magnetic strength={0.3}>
            <a
              href={ctaHref}
              target={isExternalCta ? '_blank' : undefined}
              rel={isExternalCta ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-blue-400 transition-all hover:border-blue-400 hover:bg-blue-500/20 hover:text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]"
            >
              <span>{ctaLabel}</span>
              <Icon name="arrow-up-right" size={14} />
            </a>
          </Magnetic>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={18} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0a0c14]/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-4 list-none m-0 p-0 font-mono text-sm">
            {regularLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-300 hover:text-blue-400 transition-colors uppercase tracking-wider text-xs py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-white/10">
              <a
                href={ctaHref}
                target={isExternalCta ? '_blank' : undefined}
                rel={isExternalCta ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white"
              >
                <span>{ctaLabel}</span>
                <Icon name="arrow-up-right" size={14} />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
