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
    <footer className="border-border/40 bg-surface/30 border-t py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-text text-sm font-extrabold">VEDANTH GALI</span>
              <span className="text-border font-mono text-xs">/</span>
              <span className="text-muted font-mono text-xs">Frontend & Full-Stack Developer</span>
            </div>
            <p className="text-muted/70 mt-2 font-mono text-[11px]">
              Computed live: {stats.projectsCount} Verified Projects · {stats.experienceCount}{' '}
              Leadership Roles · {stats.skillsCount} Technical Skills · {stats.certsCount}{' '}
              Certifications
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-muted hover:text-accent font-mono text-xs transition-colors"
              >
                {link.label}
              </a>
            ))}
            <span className="text-border font-mono text-xs">|</span>
            <Link
              href="/admin"
              className="text-muted/80 hover:text-accent font-mono text-xs transition-colors"
            >
              CMS Admin ↗
            </Link>
          </div>
        </div>

        <div className="border-border/30 text-muted/50 mt-8 border-t pt-6 text-center font-mono text-xs sm:text-left">
          © {currentYear} Vedanth Gali. Hand-crafted with Next.js 16, TypeScript strict, and
          Supabase.
        </div>
      </div>
    </footer>
  )
}
