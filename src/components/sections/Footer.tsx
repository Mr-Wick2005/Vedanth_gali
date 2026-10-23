import Link from 'next/link'
import type { SocialLinkRow } from '@/types/database'

interface FooterProps {
  socialLinks: SocialLinkRow[]
  stats: {
    projectsCount: number
    experienceCount: number
    skillsCount: number
    certsCount: number
  }
}

export function Footer({ socialLinks, stats }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-surface/30 py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-extrabold text-text">
                VEDANTH GALI
              </span>
              <span className="font-mono text-xs text-border">/</span>
              <span className="font-mono text-xs text-muted">
                Frontend & Full-Stack Developer
              </span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted/70">
              Computed live: {stats.projectsCount} Verified Projects · {stats.experienceCount} Leadership Roles · {stats.skillsCount} Technical Skills · {stats.certsCount} Certifications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <span className="font-mono text-xs text-border">|</span>
            <Link
              href="/admin"
              className="font-mono text-xs text-muted/80 hover:text-accent transition-colors"
            >
              CMS Admin ↗
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 text-center font-mono text-xs text-muted/50 sm:text-left">
          © {currentYear} Vedanth Gali. Hand-crafted with Next.js 16, TypeScript strict, and Supabase.
        </div>
      </div>
    </footer>
  )
}
