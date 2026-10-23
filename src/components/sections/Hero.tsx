import type { ProfileRow, SocialLinkRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { HeroRingWrapper } from '@/components/three/HeroRingWrapper'

interface HeroProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
}

export function Hero({ profile, socialLinks }: HeroProps) {
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Vedanth'
  const lastName = profile?.name ? profile.name.split(' ').slice(1).join(' ') : 'Gali'
  const headline =
    profile?.headline || 'Frontend & Full-Stack developer · Computer Engineering student'
  const availabilityText = profile?.availability_text || 'Open to work · Frontend / Full-Stack'

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Soft background radial wash behind hero (allowed glow exception) */}
      <div
        aria-hidden="true"
        className="bg-accent/15 pointer-events-none absolute top-1/4 right-0 -z-10 h-96 w-96 rounded-full blur-[120px] md:h-[500px] md:w-[500px]"
      />

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text Hierarchy (7 columns) */}
          <div className="lg:col-span-7">
            <SectionReveal>
              {/* Availability Pill */}
              <div className="border-accent/30 bg-accent/10 text-accent mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-accent relative inline-flex h-2 w-2 rounded-full" />
                </span>
                <span>{availabilityText}</span>
              </div>

              {/* Two-tone Display Name */}
              <h1 className="font-display text-text text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                <span>{firstName} </span>
                <span className="text-accent">{lastName}</span>
              </h1>

              {/* Role & Value Statement */}
              <p className="text-muted mt-4 font-mono text-xs tracking-wider uppercase sm:text-sm">
                {headline}
              </p>
              <p className="text-text/90 mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
                I build web platforms and lead tech events, from first sketch to deployment.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#work"
                  className="border-accent bg-accent text-background hover:bg-accent/90 hover:shadow-accent/20 rounded border px-5 py-2.5 font-mono text-xs font-semibold transition-all hover:shadow-lg"
                >
                  View my work ↓
                </a>
                <a
                  href={profile?.resume_url || '#contact'}
                  target={profile?.resume_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="border-border bg-surface text-text hover:border-accent hover:bg-surface-hover rounded border px-5 py-2.5 font-mono text-xs font-medium transition-all"
                >
                  Download résumé ↗
                </a>
              </div>

              {/* Social Links Row */}
              <div className="border-border/40 mt-10 flex flex-wrap items-center gap-5 border-t pt-6">
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

          {/* Right Column: Portrait Visual Anchor with 3D Ring Glow (5 columns) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
              {/* Procedural 3D WebGL Torus Ring Scene */}
              <HeroRingWrapper />

              {/* Portrait Visual Container centered in the ring */}
              <div className="border-border/80 bg-surface relative z-10 flex h-60 w-60 flex-col items-center justify-center overflow-hidden rounded-full border shadow-2xl sm:h-72 sm:w-72">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.avatar_alt || 'Vedanth Gali'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center select-none">
                    <span className="font-display text-accent text-4xl font-extrabold sm:text-5xl">
                      VG
                    </span>
                    <span className="text-muted mt-2 font-mono text-xs">Mumbai, India</span>
                    <span className="text-accent/70 mt-1 font-mono text-[10px]">
                      [PORTRAIT CUTOUT PLACEHOLDER]
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
