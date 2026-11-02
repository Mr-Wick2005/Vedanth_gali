'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { ProfileRow, EducationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'
import { ScrollFill } from '@/components/motion/ScrollFill'
import { CountUp } from '@/components/motion/CountUp'

interface AboutProps {
  profile: ProfileRow | null
  education: EducationRow[]
  stats?: {
    projectsCount: number
    leadershipCount: number
    certsCount: number
  }
}

export function About({ profile, education, stats }: AboutProps) {
  const [avatarError, setAvatarError] = useState(false)
  
  // Use authentic portrait photograph from profile or static webp asset
  const avatarSrc = profile?.avatar_url || '/images/vedanth-cutout.webp'

  const primaryEdu = education[0] || {
    degree: 'Bachelor of Engineering',
    field: 'Computer Engineering',
    institution: 'Mumbai University',
    start_year: 2023,
    end_year: 2027,
    status: 'Final Year',
  }

  const bioNarrative =
    profile?.long_bio ||
    'I bridge systems engineering, creative direction, and technical event leadership. As a developer, I build full-stack web platforms with Next.js, React, TypeScript, and Supabase — including The Rkive, a digital publishing platform with custom flipbook physics deployed for real use at my college. In parallel, I served as Conference Coordinator & Creative Head for ICSICE 2026 and Head of the Hackathon Club, guiding multi-disciplinary teams and technical operations.'

  const projectsCount = stats?.projectsCount ?? 3
  const leadershipCount = stats?.leadershipCount ?? 3
  const certsCount = stats?.certsCount ?? 4

  return (
    <section id="about" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-24">
      {/* Background ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-0 h-[350px] w-[350px] translate-x-1/3 rounded-full bg-cyan-500/[0.05] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
            [ 03 — ABOUT & DISCIPLINE ]
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
            Engineering, <br />
            <span className="text-violet-400">Design & Leadership.</span>
          </h2>
        </div>

        {/* 2-Column Split: Narrative Scrollytelling & 3D Dossier Card */}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Editorial Manifesto & Core Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary Bio Scrollytelling Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b18] p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40 mb-4">
                CORE PHILOSOPHY & OBJECTIVE
              </span>
              <ScrollFill
                text={bioNarrative}
                className="font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed text-text-lilac"
              />
            </div>

            {/* Three Strategic Disciplines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-violet-400 mb-2">
                  <Icon name="code" size={15} />
                  <span className="font-bold uppercase tracking-wider text-[11px]">01 // Systems</span>
                </div>
                <p className="text-muted text-[11px] leading-relaxed">
                  Full-stack engineering with Next.js, React 19, TypeScript, and Supabase. End-to-end ownership from interface to database RLS.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Icon name="palette" size={15} />
                  <span className="font-bold uppercase tracking-wider text-[11px]">02 // Creative</span>
                </div>
                <p className="text-muted text-[11px] leading-relaxed">
                  Creative Head for ICSICE 2026. Directing visual branding, promotional media, flipbook reading UX, and cinematic design systems.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <Icon name="users" size={15} />
                  <span className="font-bold uppercase tracking-wider text-[11px]">03 // Operations</span>
                </div>
                <p className="text-muted text-[11px] leading-relaxed">
                  Conference Coordinator & Hackathon Club Head. Mentoring student engineers, shaping technical challenges, and executing events.
                </p>
              </div>
            </div>

            {/* Verified Facts Badges */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs pt-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="map-pin" size={13} className="text-violet-400" />
                <span>{profile?.location || 'Mumbai, Maharashtra, IN'}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="graduation-cap" size={13} className="text-cyan-400" />
                <span>Mumbai University (2023–2027)</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="award" size={13} className="text-emerald-400" />
                <span>ICSICE 2026 Creative Head</span>
              </div>
            </div>

            {/* Dynamic Metric Counts */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
              <div>
                <span className="font-mono text-[11px] text-muted block uppercase">Platforms Shipped</span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white">
                  <CountUp value={projectsCount} />+
                </p>
              </div>

              <div>
                <span className="font-mono text-[11px] text-muted block uppercase">Leadership Roles</span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-violet-400">
                  <CountUp value={leadershipCount} />
                </p>
              </div>

              <div>
                <span className="font-mono text-[11px] text-muted block uppercase">Credentials</span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-cyan-400">
                  <CountUp value={certsCount} />+
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile 3D Dossier Identity Card (5 cols) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Tilt maxAngle={8} perspective={1000} className="w-full max-w-[360px] xl:max-w-[400px]">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#121226] via-[#090918] to-[#04040c] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(139,92,246,0.15)]">
                
                {/* Dossier Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-extrabold tracking-tight text-white">
                      VG<span className="text-violet-400">.</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                      ENGINEER & DIRECTOR
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {primaryEdu.status || 'FINAL YEAR'}
                  </span>
                </div>

                {/* Authentic Portrait Slot with Cinematic Lighting */}
                <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-xl border border-violet-500/20 bg-black flex items-center justify-center">
                  {!avatarError ? (
                    <Image
                      src={avatarSrc}
                      alt={profile?.name || 'Vedanth Gali'}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-4 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-600/10 text-violet-300">
                        <Icon name="code" size={32} />
                      </div>
                      <span className="mt-3 font-display text-xs font-bold text-white uppercase">
                        Vedanth Gali
                      </span>
                    </div>
                  )}

                  {/* Corner Verified Shield Badge */}
                  <div className="pointer-events-none absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-violet-400/40 bg-violet-600/40 backdrop-blur-sm shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                    <Icon name="shield-check" size={14} className="text-violet-300" />
                  </div>
                </div>

                {/* Dossier Information Grid */}
                <div className="mt-4 space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-white/40">NAME & TITLE</span>
                    <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white uppercase block">
                      VEDANTH GALI
                    </span>
                    <span className="text-[11px] text-violet-300 font-mono mt-0.5 block">
                      Frontend & Full-Stack Developer
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2.5">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">DEGREE</span>
                      <span className="text-text-lilac text-[11px] font-medium leading-tight block truncate">
                        {primaryEdu.degree}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">BRANCH</span>
                      <span className="text-cyan-300 text-[11px] font-medium leading-tight block truncate">
                        {primaryEdu.field}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">AFFILIATION</span>
                      <span className="text-muted truncate max-w-[150px] block">{primaryEdu.institution}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">TIMELINE</span>
                      <span className="text-muted">{primaryEdu.start_year} – {primaryEdu.end_year}</span>
                    </div>
                  </div>
                </div>

                {/* Holographic Watermark Barcode */}
                <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[8px] text-white/30 tracking-widest uppercase">
                  <span>MU-COMP-ENG-2023-2027</span>
                  <div className="flex gap-0.5">
                    {[12, 6, 18, 8, 4, 14, 10, 16, 6, 12, 8, 20, 6, 14].map((h, i) => (
                      <span key={i} className="w-[1px] bg-white/30" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>

              </div>
            </Tilt>
          </div>

        </div>
      </div>
    </section>
  )
}
