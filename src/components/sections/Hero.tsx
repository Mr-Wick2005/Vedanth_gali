'use client'

import { useEffect, useState } from 'react'
import type { ProfileRow, SocialLinkRow } from '@/types/database'
import { SplitText } from '@/components/motion/SplitText'
import { Clock } from '@/components/motion/Clock'
import { Magnetic } from '@/components/motion/Magnetic'
import { Marquee } from '@/components/motion/Marquee'
import { Icon } from '@/components/ui/icon'
import { HeroPortrait } from '@/components/sections/HeroPortrait'
import { useReducedMotion } from 'motion/react'

interface HeroProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
}

const ROTATING_PHRASES = [
  'responsive web interfaces',
  'full-stack platforms',
  'high-impact tech events',
  'scalable cloud architectures',
]

const MARQUEE_ROW_1 = [
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'React 19', icon: 'react' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Python', icon: 'python' },
]

const MARQUEE_ROW_2 = [
  { name: 'Docker', icon: 'docker' },
  { name: 'Git', icon: 'git' },
  { name: 'GraphQL', icon: 'graphql' },
  { name: 'Redis', icon: 'redis' },
  { name: 'Three.js', icon: 'sparkles' },
  { name: 'GSAP', icon: 'terminal' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Linux', icon: 'linux' },
]

export function Hero({ profile, socialLinks }: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const nameParts = (profile?.name || 'VEDANTH GALI').trim().split(/\s+/)
  const firstName = nameParts[0]?.toUpperCase() || 'VEDANTH'
  const lastName = nameParts.slice(1).join(' ').toUpperCase() || 'GALI'

  const availabilityText = profile?.availability_text || 'Available for Roles'
  const shortBio =
    profile?.short_bio ||
    'Final-year Computer Engineering student at Mumbai University (2023–2027). Builder of The Rkive, deployed and actively serving engineering students.'

  // Rotate tagline every 2.4s
  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length)
    }, 2400)
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  return (
    <section className="relative flex min-h-[100svh] lg:h-[100svh] flex-col justify-between overflow-hidden bg-black pt-20 sm:pt-24 lg:pt-20">
      {/* Background Ambient Violet & Cyan Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_35%,rgba(56,189,248,0.08),transparent_50%),radial-gradient(circle_at_25%_60%,rgba(139,92,246,0.12),transparent_50%)]"
      />

      {/* Main 2-Column Content Stage */}
      <div className="mx-auto my-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* Left Column: Balanced Editorial Content (7 cols on desktop) */}
          <div className="z-20 lg:col-span-7">
            
            {/* Status & Location Pill */}
            <div className="mb-3 inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-surface/80 px-3.5 py-1 font-mono text-[11px] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-medium text-text-lilac">{availabilityText}</span>
              <span className="text-white/20">•</span>
              <span className="text-muted">Mumbai, IN</span>
            </div>

            {/* Kinetic Hero Display Headline (Properly Proportioned, No Wrapping) */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black uppercase leading-[0.92] tracking-tight">
              <span className="block whitespace-nowrap text-white">
                <SplitText text={firstName} delay={0.15} stagger={0.03} />
              </span>
              <span className="block whitespace-nowrap text-violet-400 drop-shadow-[0_0_35px_rgba(139,92,246,0.5)]">
                <SplitText text={lastName} delay={0.35} stagger={0.035} />
              </span>
            </h1>

            {/* Dynamic Rotating Line */}
            <div className="mt-3 flex items-center gap-2 font-mono text-xs sm:text-sm text-muted">
              <span>I build</span>
              <span className="inline-block min-w-[220px] font-semibold text-white border-b border-violet-500/60 pb-0.5 transition-all">
                {shouldReduceMotion ? ROTATING_PHRASES[0] : ROTATING_PHRASES[phraseIndex]}
              </span>
            </div>

            {/* Concise Bio */}
            <p className="mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-muted/90">
              {shortBio}
            </p>

            {/* Magnetic CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3.5">
              <Magnetic strength={0.3}>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.55)]"
                >
                  <span>View My Work</span>
                  <Icon name="arrow-down" size={14} />
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={profile?.resume_url || '#contact'}
                  target={profile?.resume_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <Icon name="download" size={14} />
                  <span>Download Résumé</span>
                </a>
              </Magnetic>
            </div>

            {/* Live Metadata & Social Rail */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-white/[0.08] pt-4 font-mono text-xs text-muted">
              <Clock showPrefix className="text-xs" />
              <span>•</span>
              <span>Mumbai University &apos;27</span>
              <span>•</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Magnetic key={link.id} strength={0.25}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-lilac transition-colors hover:text-violet-300"
                      aria-label={link.label}
                    >
                      <Icon name={link.label} size={14} />
                      <span className="hidden sm:inline">{link.label}</span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Original Cinematic Cutout with Energy Ring (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
            <HeroPortrait
              avatarUrl="/images/vedanth-cutout.webp"
              avatarAlt={profile?.name || 'Vedanth Gali'}
            />
          </div>

        </div>
      </div>

      {/* Bottom Dual-Row Tech Marquee Strip (Compact & Clean) */}
      <div className="relative z-10 w-full max-w-full border-t border-white/[0.08] bg-black/85 backdrop-blur-md py-2 overflow-hidden">
        {/* Row 1 */}
        <Marquee direction="left" speed={28} gap="2.5rem" className="text-[11px] font-mono text-muted uppercase">
          {MARQUEE_ROW_1.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Icon name={item.icon} size={14} className="text-violet-400" />
              <span>{item.name}</span>
              <span className="text-white/20 ml-5">•</span>
            </span>
          ))}
        </Marquee>

        {/* Row 2 */}
        <div className="mt-1 border-t border-white/[0.04] pt-1">
          <Marquee direction="right" speed={32} gap="2.5rem" className="text-[11px] font-mono text-muted/70 uppercase">
            {MARQUEE_ROW_2.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name={item.icon} size={14} className="text-cyan-400" />
                <span>{item.name}</span>
                <span className="text-white/20 ml-5">•</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
