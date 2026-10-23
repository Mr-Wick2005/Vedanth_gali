'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NavigationProps {
  resumeUrl?: string | null
}

export function Navigation({ resumeUrl }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Skills', href: '#skills' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="border-border/40 bg-background/85 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        {/* Monogram Brandmark */}
        <Link
          href="/"
          className="group font-display text-text flex items-center gap-1.5 text-lg font-extrabold tracking-tight"
        >
          <span>VG</span>
          <span className="bg-accent h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125" />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted hover:text-accent font-mono text-xs transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-accent/40 bg-accent/10 text-accent hover:border-accent hover:bg-accent hover:text-text rounded border px-3.5 py-1.5 font-mono text-xs font-medium transition-all"
              >
                Résumé ↗
              </a>
            ) : (
              <a
                href="#contact"
                className="border-accent/40 bg-accent/10 text-accent hover:border-accent hover:bg-accent hover:text-text rounded border px-3.5 py-1.5 font-mono text-xs font-medium transition-all"
              >
                Get in Touch
              </a>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="border-border bg-surface text-text flex h-9 w-9 items-center justify-center rounded border md:hidden"
        >
          <span className="font-mono text-xs">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-border bg-surface border-b px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted hover:text-accent py-1 font-mono text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href={resumeUrl || '#contact'}
                onClick={() => setMobileMenuOpen(false)}
                className="border-accent bg-accent/10 text-accent inline-block rounded border px-4 py-2 font-mono text-xs"
              >
                {resumeUrl ? 'Download Résumé ↗' : 'Contact Me'}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
