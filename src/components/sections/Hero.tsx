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
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-black pt-28 sm:pt-32">
      {/* Background Ambient Violet & Indigo Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_40%,rgba(56,189,248,0.07),transparent_55%),radial-gradient(circle_at_25%_60%,rgba(139,92,246,0.1),transparent_50%)]"
      />

      {/* Main 2-Column Stage */}
      <div className="mx-auto my-auto w-full max-w-[1320px] px-6 py-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Editorial Content (7 cols on desktop) */}
          <div className="z-20 lg:col-span-7">
            
            {/* Status & Location Pill */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-violet-500/30 bg-surface/80 px-4 py-1.5 font-mono text-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-medium text-text-lilac">{availabilityText}</span>
              <span className="text-white/20">•</span>
              <span className="text-muted">Mumbai, IN</span>
            </div>

            {/* Kinetic Hero Display Headline */}
            <h1 className="font-display text-5xl font-black uppercase leading-[0.92] tracking-tighter sm:text-7xl md:text-8xl xl:text-9xl">
              <span className="block text-white">
                <SplitText text="VEDANTH" delay={0.2} stagger={0.035} />
              </span>
              <span className="block text-violet-400 drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                <SplitText text="GALI" delay={0.45} stagger={0.04} />
              </span>
            </h1>

            {/* Dynamic Rotating Line */}
            <div className="mt-6 flex items-center gap-2 font-mono text-sm sm:text-base text-muted">
              <span>I build</span>
              <span className="inline-block min-w-[240px] font-semibold text-white border-b border-violet-500/60 pb-0.5 transition-all">
                {shouldReduceMotion ? ROTATING_PHRASES[0] : ROTATING_PHRASES[phraseIndex]}
              </span>
            </div>

            {/* Concise Bio */}
            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted">
              {shortBio}
            </p>

            {/* Magnetic CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3}>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500 hover:shadow-[0_0_35px_rgba(139,92,246,0.55)]"
                >
                  <span>View My Work</span>
                  <Icon name="arrow-down" size={16} />
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={profile?.resume_url || '#contact'}
                  target={profile?.resume_url ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-mono text-xs sm:text-sm font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <Icon name="download" size={16} />
                  <span>Download Résumé</span>
                </a>
              </Magnetic>
            </div>

            {/* Live Metadata & Social Rail */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/[0.08] pt-6 font-mono text-xs text-muted">
              <Clock showPrefix className="text-xs" />
              <span>•</span>
              <span>Mumbai University '27</span>
              <span>•</span>
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <Magnetic key={link.id} strength={0.25}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-lilac transition-colors hover:text-violet-300"
                      aria-label={link.label}
                    >
                      <Icon name={link.label} size={15} />
                      <span className="hidden sm:inline">{link.label}</span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Balanced Portrait Cutout with WebGL Neon Energy Ring (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
            <HeroPortrait
              avatarUrl="/images/vedanth-cutout.webp"
              avatarAlt={profile?.avatar_alt || profile?.name}
            />
          </div>

        </div>
      </div>

      {/* Bottom Dual-Row Tech Marquee Strip */}
      <div className="relative z-10 border-t border-white/[0.08] bg-black/80 backdrop-blur-md py-3 overflow-hidden">
        {/* Row 1: Left */}
        <Marquee direction="left" speed={28} gap="2.5rem" className="text-xs font-mono text-muted uppercase">
          {MARQUEE_ROW_1.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <Icon name={item.icon} size={15} className="text-violet-400" />
              <span>{item.name}</span>
              <span className="text-white/20 ml-6">•</span>
            </span>
          ))}
        </Marquee>

        {/* Row 2: Right */}
        <div className="mt-1.5 border-t border-white/[0.04] pt-1.5">
          <Marquee direction="right" speed={32} gap="2.5rem" className="text-xs font-mono text-muted/70 uppercase">
            {MARQUEE_ROW_2.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Icon name={item.icon} size={15} className="text-cyan-400" />
                <span>{item.name}</span>
                <span className="text-white/20 ml-6">•</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
