'use client'

import { useEffect, useState } from 'react'
import type { ProfileRow, SocialLinkRow } from '@/types/database'
import { SplitText } from '@/components/motion/SplitText'
import { Clock } from '@/components/motion/Clock'
import { Magnetic } from '@/components/motion/Magnetic'
import { Marquee } from '@/components/motion/Marquee'
import { Icon } from '@/components/ui/icon'
import { HeroVideoAvatar } from '@/components/sections/HeroVideoAvatar'
import { useReducedMotion } from 'motion/react'

interface HeroProps {
  profile: ProfileRow | null
  socialLinks: SocialLinkRow[]
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

const DEFAULT_ROTATING_PHRASES = [
  'production web platforms',
  'high-performance fullstack systems',
  'international technical conferences',
  'gamified developer experiences',
]

const DEFAULT_MARQUEE_ROW_1 = [
  { name: 'Next.js 16', icon: 'nextjs' },
  { name: 'React 19', icon: 'react' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Tailwind CSS v4', icon: 'tailwindcss' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Python', icon: 'python' },
]

const DEFAULT_MARQUEE_ROW_2 = [
  { name: 'Three.js', icon: 'sparkles' },
  { name: 'GSAP', icon: 'terminal' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Git & GitHub', icon: 'git' },
  { name: 'REST & GraphQL', icon: 'graphql' },
  { name: 'Figma UI/UX', icon: 'figma' },
  { name: 'Linux', icon: 'linux' },
  { name: 'TensorFlow', icon: 'cpu' },
]

export function Hero({ profile, socialLinks, content }: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const nameParts = (profile?.name || 'VEDANTH GALI').trim().split(/\s+/)
  const firstName =
    typeof content?.first_name === 'string' && content.first_name.trim()
      ? content.first_name.toUpperCase()
      : nameParts[0]?.toUpperCase() || 'VEDANTH'
  const lastName =
    typeof content?.last_name === 'string' && content.last_name.trim()
      ? content.last_name.toUpperCase()
      : nameParts.slice(1).join(' ').toUpperCase() || 'GALI'

  const availabilityText =
    typeof content?.availability_text === 'string' && content.availability_text.trim()
      ? content.availability_text
      : profile?.availability_text || 'Available for Roles'

  const locationText =
    typeof content?.location === 'string' && content.location.trim()
      ? content.location
      : 'Mumbai, IN'

  const terminalTag =
    typeof content?.terminal_tag === 'string' && content.terminal_tag.trim()
      ? content.terminal_tag
      : '~/vedanth // final-year cs'

  const promptAction =
    typeof content?.prompt_action === 'string' && content.prompt_action.trim()
      ? content.prompt_action
      : 'architecting'

  const rotatingPhrases =
    Array.isArray(content?.rotating_phrases) && content.rotating_phrases.length > 0
      ? (content.rotating_phrases as string[])
      : DEFAULT_ROTATING_PHRASES

  const shortBio =
    typeof content?.bio === 'string' && content.bio.trim()
      ? content.bio
      : profile?.short_bio ||
      'Final-year Computer Engineering student at Mumbai University (2023–2027). Builder of The Rkive, deployed and actively serving engineering students.'

  const primaryCtaLabel =
    typeof content?.cta_primary_label === 'string' && content.cta_primary_label.trim()
      ? content.cta_primary_label
      : 'Explore Platforms'

  const primaryCtaUrl =
    typeof content?.cta_primary_url === 'string' && content.cta_primary_url.trim()
      ? content.cta_primary_url
      : '#work'

  const secondaryCtaLabel =
    typeof content?.cta_secondary_label === 'string' && content.cta_secondary_label.trim()
      ? content.cta_secondary_label
      : 'Download Résumé'

  const secondaryCtaUrl =
    typeof content?.cta_secondary_url === 'string' && content.cta_secondary_url.trim()
      ? content.cta_secondary_url
      : profile?.resume_url || '#contact'

  const cohortBadge =
    typeof content?.cohort_badge === 'string' && content.cohort_badge.trim()
      ? content.cohort_badge
      : "Mumbai University '27"

  const videoSrc =
    typeof content?.avatar_video_mp4 === 'string' &&
      content.avatar_video_mp4.trim() &&
      !content.avatar_video_mp4.includes('avatar-animation')
      ? content.avatar_video_mp4
      : '/videos/vedanth-cutout.mp4'

  const marqueeRow1 =
    Array.isArray(content?.marquee_row_1) && content.marquee_row_1.length > 0
      ? (content.marquee_row_1 as Array<{ name: string; icon: string }>)
      : DEFAULT_MARQUEE_ROW_1

  const marqueeRow2 =
    Array.isArray(content?.marquee_row_2) && content.marquee_row_2.length > 0
      ? (content.marquee_row_2 as Array<{ name: string; icon: string }>)
      : DEFAULT_MARQUEE_ROW_2

  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [shouldReduceMotion, rotatingPhrases.length])

  return (
    <section className="relative flex min-h-[100svh] lg:h-[100svh] lg:max-h-[100svh] flex-col justify-between overflow-hidden bg-[#05060a] pt-14 sm:pt-16">
      {/* Background Ambient Electric Blue & Warm Magenta Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_30%,rgba(37,99,235,0.14),transparent_50%),radial-gradient(circle_at_25%_65%,rgba(236,72,153,0.1),transparent_55%)]"
      />

      {/* Subtle Dot Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Main 2-Column Content Stage - Lifted snugly under navbar, fills viewport without scrolling */}
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16 pt-2 sm:pt-3 lg:pt-4 pb-2 mb-auto">
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">

          {/* Left Column: Balanced Editorial Content (7 cols on desktop) */}
          <div className="z-20 lg:col-span-7">

            {/* Terminal Breadcrumb & Status Pill */}
            <div className="mb-2 sm:mb-2.5 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-[#0a0c14]/90 px-3.5 py-1 font-mono text-[11px] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-medium text-slate-200">{availabilityText}</span>
                <span className="text-white/20">•</span>
                <span className="text-slate-400">{locationText}</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-slate-400">
                <span className="text-blue-400">{terminalTag}</span>
              </div>
            </div>

            {/* Kinetic Hero Display Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase leading-[0.92] tracking-tight">
              <span className="block whitespace-nowrap text-white">
                <SplitText text={firstName} delay={0.15} stagger={0.03} />
              </span>
              <span className="block whitespace-nowrap text-gradient-accent drop-shadow-[0_0_40px_rgba(236,72,153,0.35)]">
                <SplitText text={lastName} delay={0.35} stagger={0.035} />
              </span>
            </h1>

            {/* Dynamic Rotating Line with Terminal Prompt */}
            <div className="mt-2.5 sm:mt-3 flex items-center gap-2 font-mono text-xs sm:text-sm text-slate-400">
              <span className="text-blue-400 font-bold">$</span>
              <span>{promptAction}</span>
              <span className="inline-block min-w-[240px] font-semibold text-white border-b border-pink-500/60 pb-0.5 transition-all">
                {shouldReduceMotion ? rotatingPhrases[0] : rotatingPhrases[phraseIndex]}
              </span>
            </div>

            {/* Concise Bio */}
            <p className="mt-2.5 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base leading-relaxed text-slate-300">
              {shortBio}
            </p>

            {/* Magnetic CTAs */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <a
                  href={primaryCtaUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(37,99,235,0.45)] transition-all hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(37,99,235,0.65)]"
                >
                  <span>{primaryCtaLabel}</span>
                  <Icon name="arrow-down" size={14} />
                </a>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a
                  href={secondaryCtaUrl}
                  target={secondaryCtaUrl.startsWith('http') || secondaryCtaUrl.endsWith('.pdf') ? '_blank' : undefined}
                  rel={secondaryCtaUrl.startsWith('http') || secondaryCtaUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-pink-300 transition-all hover:border-pink-400 hover:bg-pink-500/20"
                >
                  <Icon name="download" size={14} />
                  <span>{secondaryCtaLabel}</span>
                </a>
              </Magnetic>
            </div>

            {/* Live Metadata & Social Rail */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-white/[0.08] pt-3 font-mono text-xs text-slate-400">
              <Clock showPrefix className="text-xs text-slate-300" />
              <span>•</span>
              <span>{cohortBadge}</span>
              <span>•</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Magnetic key={link.id} strength={0.25}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-blue-400"
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

          {/* Right Column: Direct Seamless Video Avatar (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-4 lg:justify-end">
            <HeroVideoAvatar src={videoSrc} />
          </div>

        </div>
      </div>

      {/* Bottom Dual-Row Tech Marquee Strip */}
      <div className="relative z-10 w-full max-w-full border-t border-white/[0.08] bg-[#05060a]/90 backdrop-blur-md py-2 overflow-hidden">
        {/* Row 1 */}
        <Marquee direction="left" speed={28} gap="2.5rem" className="text-[11px] font-mono text-slate-400 uppercase">
          {marqueeRow1.map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Icon name={item.icon} size={14} className="text-blue-400" />
              <span>{item.name}</span>
              <span className="text-white/20 ml-5">•</span>
            </span>
          ))}
        </Marquee>

        {/* Row 2 */}
        <div className="mt-1 border-t border-white/[0.04] pt-1">
          <Marquee direction="right" speed={32} gap="2.5rem" className="text-[11px] font-mono text-slate-500 uppercase">
            {marqueeRow2.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <Icon name={item.icon} size={14} className="text-pink-400" />
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
