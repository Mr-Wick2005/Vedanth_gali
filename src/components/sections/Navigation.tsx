'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { Magnetic } from '@/components/motion/Magnetic'

interface NavigationProps {
  resumeUrl?: string | null
}

export function Navigation({ resumeUrl }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Stack', href: '#stack' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Credentials', href: '#credentials' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header
      style={{ viewTransitionName: 'site-navigation' }}
      className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-md transition-all"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-4">
        {/* Monogram Brandmark */}
        <Link
          href="/"
          className="group flex items-center gap-1 font-display text-lg font-black tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <span>VG</span>
          <span className="text-violet-400">.</span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <Magnetic strength={0.3}>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-violet-300 transition-all hover:border-violet-400 hover:bg-violet-500/20 hover:text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              >
                <span>Résumé</span>
                <Icon name="arrow-up-right" size={14} />
              </a>
            ) : (
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 font-mono text-xs font-semibold text-violet-300 transition-all hover:border-violet-400 hover:bg-violet-500/20 hover:text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]"
              >
                <span>Connect</span>
                <Icon name="arrow-up-right" size={14} />
              </a>
            )}
          </Magnetic>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:text-white md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-black/95 px-6 py-6 md:hidden">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-mono text-sm uppercase tracking-wider text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li className="pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 font-mono text-xs font-semibold text-violet-300"
                >
                  <span>Download Résumé</span>
                  <Icon name="download" size={14} />
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
