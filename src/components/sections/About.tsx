'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { ProfileRow, EducationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'
import { ScrollFill } from '@/components/motion/ScrollFill'
import { TerminalWindow } from '@/components/ui/TerminalWindow'

interface AboutProps {
  profile: ProfileRow | null
  education: EducationRow[]
  stats?: {
    projectsCount: number
    leadershipCount: number
    certsCount: number
  }
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

interface DisciplineItem {
  code: string
  title?: string
  color: string
  icon: string
  description: string
}

const DEFAULT_DISCIPLINES: DisciplineItem[] = [
  {
    code: '01 // Systems',
    color: 'blue',
    icon: 'code',
    description: 'Full-stack engineering with Next.js 16, React 19, TypeScript, and Supabase. End-to-end ownership.',
  },
  {
    code: '02 // Creative',
    color: 'pink',
    icon: 'palette',
    description: 'Creative Head for ICSICE 2026. Directing visual branding, promotional media, and design systems.',
  },
  {
    code: '03 // Operations',
    color: 'emerald',
    icon: 'users',
    description: 'Conference Coordinator & Hackathon Club Head. Mentoring student engineers and executing events.',
  },
]

export function About({ profile, content }: AboutProps) {
  const [avatarError, setAvatarError] = useState(false)

  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 03 — ABOUT & DISCIPLINE ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : 'Engineering,'

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Design & Leadership.'

  const terminalTitle =
    typeof content?.terminal_title === 'string' && content.terminal_title.trim()
      ? content.terminal_title
      : '~/profile/engineering-philosophy.md'

  const terminalKicker =
    typeof content?.terminal_kicker === 'string' && content.terminal_kicker.trim()
      ? content.terminal_kicker
      : '// CORE PHILOSOPHY & OBJECTIVE'

  const bioNarrative =
    typeof content?.bio_narrative === 'string' && content.bio_narrative.trim()
      ? content.bio_narrative
      : profile?.long_bio ||
        'I bridge systems engineering, creative direction, and technical event leadership. As a developer, I build full-stack web platforms with Next.js, React, TypeScript, and Supabase — including The Rkive, a digital publishing platform with custom flipbook physics deployed for real use at my college. In parallel, I served as Conference Coordinator & Creative Head for ICSICE 2026 and Head of the Hackathon Club, guiding multi-disciplinary teams and technical operations.'

  const disciplines =
    Array.isArray(content?.disciplines) && content.disciplines.length > 0
      ? (content.disciplines as typeof DEFAULT_DISCIPLINES)
      : DEFAULT_DISCIPLINES

  const avatarSrc =
    typeof content?.dossier_avatar === 'string' && content.dossier_avatar.trim()
      ? content.dossier_avatar
      : profile?.avatar_url || '/images/vedanth-cutout.webp'

  const dossierName =
    typeof content?.dossier_name === 'string' && content.dossier_name.trim()
      ? content.dossier_name
      : profile?.name || 'VEDANTH GALI'

  return (
    <section id="about" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-0 h-[350px] w-[350px] translate-x-1/3 rounded-full bg-blue-600/[0.08] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 left-0 h-[300px] w-[300px] -translate-x-1/3 rounded-full bg-pink-600/[0.06] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
            {kicker}
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
            {headingLine1} <br />
            <span className="text-gradient-accent">{headingLine2}</span>
          </h2>
        </div>

        {/* 2-Column Split: Symmetrical Terminal Window & 3D Dossier Card */}
        <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">

          {/* Left Column: Terminal Manifesto & Core Pillars (7 cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-7 h-full">

            {/* Primary Bio in Developer Terminal Chrome */}
            <TerminalWindow
              title={terminalTitle}
              status="verified"
              statusColor="blue"
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-2.5">
                    {terminalKicker}
                  </span>
                  <ScrollFill
                    text={bioNarrative}
                    className="font-sans text-sm sm:text-base lg:text-base font-normal leading-relaxed text-slate-200"
                  />
                </div>
              </div>
            </TerminalWindow>

            {/* Three Strategic Disciplines Grid (matching bottom baseline) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {disciplines.map((d, dIdx) => {
                const borderHover =
                  d.color === 'blue'
                    ? 'hover:border-blue-500/40'
                    : d.color === 'emerald'
                    ? 'hover:border-emerald-500/40'
                    : 'hover:border-pink-500/40'
                const iconColor =
                  d.color === 'blue'
                    ? 'text-blue-400'
                    : d.color === 'emerald'
                    ? 'text-emerald-400'
                    : 'text-pink-400'

                return (
                  <div
                    key={dIdx}
                    className={`flex flex-col justify-between rounded-xl border border-white/10 bg-[#0a0c14] p-3.5 transition-all ${borderHover}`}
                  >
                    <div className={`flex items-center gap-1.5 ${iconColor} mb-2`}>
                      <Icon name={d.icon} size={14} />
                      <span className="font-bold uppercase tracking-wider text-[11px]">{d.code || d.title}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Full Portrait Card (aligned symmetrically with left column) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end h-full">
            <Tilt maxAngle={6} perspective={1000} className="w-full max-w-[420px] xl:max-w-[460px] h-full flex flex-col">
              <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#10131d] via-[#0a0c14] to-[#05060a] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(37,99,235,0.15)] h-full min-h-[460px] sm:min-h-[520px] lg:min-h-0 flex-1 flex flex-col items-center justify-center">
                <div className="relative h-full w-full min-h-[440px] sm:min-h-[500px] lg:min-h-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 flex items-center justify-center">
                  {!avatarError ? (
                    <Image
                      src={avatarSrc}
                      alt={dossierName}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/10 text-blue-300">
                        <Icon name="code" size={32} />
                      </div>
                      <span className="mt-3 font-display text-sm font-bold text-white uppercase">
                        {dossierName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Tilt>
          </div>

        </div>
      </div>
    </section>
  )
}
