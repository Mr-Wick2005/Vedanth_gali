import type { ProfileRow, SocialLinkRow } from '@/types/database'

interface HeroProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
}

export function Hero({ profile, socialLinks }: HeroProps) {
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Vedanth'
  const lastName = profile?.name ? profile.name.split(' ').slice(1).join(' ') : 'Gali'
  const headline = profile?.headline || 'Frontend & Full-Stack developer · Computer Engineering student'
  const availabilityText = profile?.availability_text || 'Open to work · Frontend / Full-Stack'

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Soft background radial wash behind hero (allowed glow exception) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 right-0 -z-10 h-96 w-96 rounded-full bg-accent/15 blur-[120px] md:h-[500px] md:w-[500px]"
      />

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Text Hierarchy (7 columns) */}
          <div className="lg:col-span-7">
            {/* Availability Pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>{availabilityText}</span>
            </div>

            {/* Two-tone Display Name */}
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-text sm:text-6xl md:text-7xl">
              <span>{firstName} </span>
              <span className="text-accent">{lastName}</span>
            </h1>

            {/* Role & Value Statement */}
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted sm:text-sm">
              {headline}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-text/90 sm:text-lg">
              I build web platforms and lead tech events, from first sketch to deployment.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="rounded border border-accent bg-accent px-5 py-2.5 font-mono text-xs font-semibold text-background transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
              >
                View my work ↓
              </a>
              <a
                href={profile?.resume_url || '#contact'}
                target={profile?.resume_url ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="rounded border border-border bg-surface px-5 py-2.5 font-mono text-xs font-medium text-text transition-all hover:border-accent hover:bg-surface-hover"
              >
                Download résumé ↗
              </a>
            </div>

            {/* Social Links Row */}
            <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-border/40 pt-6">
              <span className="font-mono text-xs text-muted">Connect:</span>
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Portrait Visual Anchor with 3D Ring Glow (5 columns) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative flex h-80 w-80 items-center justify-center sm:h-96 sm:w-96">
              {/* Outer Procedural Ring with Glow (Hero 3D exception) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-accent/40 bg-gradient-to-tr from-accent/20 via-transparent to-accent/30 shadow-[0_0_50px_rgba(139,92,246,0.35)] animate-[spin_20s_linear_infinite]"
              />

              {/* Inner Concentric Axis Ring */}
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-full border border-dashed border-accent/20"
              />

              {/* Portrait Visual Container */}
              <div className="relative z-10 flex h-64 w-64 flex-col items-center justify-center overflow-hidden rounded-full border border-border bg-surface sm:h-80 sm:w-80">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt={profile.avatar_alt || 'Vedanth Gali'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-display text-4xl font-extrabold text-accent/80">
                      VG
                    </span>
                    <span className="mt-2 font-mono text-xs text-muted">
                      Mumbai, India
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-accent/60">
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
