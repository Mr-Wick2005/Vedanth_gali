import type { ProfileRow, SocialLinkRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { HeroPortrait } from '@/components/sections/HeroPortrait'

interface HeroProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
}

export function Hero({ profile, socialLinks }: HeroProps) {
  const headline =
    profile?.headline || 'Frontend & Full-Stack Developer · Computer Engineering Student'
  const availabilityText = profile?.availability_text || 'Available for Full-Time Roles'
  const shortBio =
    profile?.short_bio ||
    'Final-year Computer Engineering student building scalable web platforms and leading technical teams.'

  return (
    <section className="relative flex min-h-[calc(100vh-2rem)] items-center overflow-hidden bg-black pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-36 lg:pb-12">
      {/* Background Subtle Atmospheric Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_45%,rgba(6,182,212,0.1),transparent_55%),radial-gradient(circle_at_25%_65%,rgba(139,92,246,0.08),transparent_50%)]"
      />

      <div className="mx-auto w-full max-w-[1240px] px-6">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Left Column: Text & Editorial Hierarchy (6 cols on desktop) */}
          <div className="z-20 lg:col-span-6 xl:col-span-6">
            <SectionReveal>
              {/* Availability Indicator Badge */}
              <div className="border-accent/30 bg-surface/80 mb-5 inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-xs backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-text/90 font-medium tracking-wide">{availabilityText}</span>
              </div>

              {/* Bold Editorial Display Name (White + Violet) */}
              <h1 className="font-display text-text text-4xl leading-[0.94] font-black tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-7xl">
                <span className="block text-white">VEDANTH</span>
                <span className="text-accent block drop-shadow-[0_0_35px_rgba(139,92,246,0.4)]">
                  GALI
                </span>
              </h1>

              {/* Compact Uppercase Monospace Positioning Line */}
              <p className="text-muted mt-4 font-mono text-xs tracking-wider uppercase sm:text-sm">
                {headline}
              </p>

              {/* Short Introduction */}
              <p className="text-text/85 mt-4 max-w-lg text-sm leading-relaxed sm:text-base">
                {shortBio}
              </p>

              {/* CTAs: Primary Work + Secondary Résumé */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <a
                  href="#work"
                  className="bg-accent hover:bg-accent-light cursor-pointer rounded px-5 py-2.5 font-mono text-xs font-semibold tracking-wide text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]"
                >
                  View My Work ↓
                </a>
                <a
                  href={profile?.resume_url || '#contact'}
                  target={profile?.resume_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="border-border/80 bg-surface/60 hover:bg-surface-hover hover:border-accent text-text cursor-pointer rounded border px-5 py-2.5 font-mono text-xs font-medium tracking-wide backdrop-blur-sm transition-all"
                >
                  Download Résumé ↗
                </a>
              </div>

              {/* Social Connections Row */}
              <div className="border-border/40 mt-8 flex flex-wrap items-center gap-5 border-t pt-5">
                <span className="text-muted font-mono text-xs">Connect:</span>
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
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Balanced Cinematic Portrait with Neon Energy Ring (6 cols on desktop) */}
          <div className="relative flex items-center justify-center lg:col-span-6 lg:justify-end xl:col-span-6">
            <HeroPortrait
              avatarUrl="/images/vedanth-cutout.webp"
              avatarAlt={profile?.avatar_alt || profile?.name}
            />
          </div>
        </div>
      </div>

      {/* Smooth bottom fade into site dark background (#06060F) */}
      <div
        aria-hidden="true"
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent"
      />
    </section>
  )
}
