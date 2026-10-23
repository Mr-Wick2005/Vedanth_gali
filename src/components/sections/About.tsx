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
  
  // Checks if user uploaded a custom AI avatar or fallback to futuristic avatar placeholder
  const customAvatarSrc = profile?.avatar_url || '/images/ai-avatar.png'

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
    "I am a final-year Computer Engineering student at Mumbai University who likes owning a build end-to-end: the interface, the data model, and the deployment. My biggest project so far is The Rkive, a digital publishing platform I founded, designed, and deployed for real use at my college. Alongside code, I lead technical teams and hackathon events, caring deeply about clean UI, scalable architecture, and problem-solving that holds up outside a demo."

  const projectsCount = stats?.projectsCount ?? 3
  const leadershipCount = stats?.leadershipCount ?? 3
  const certsCount = stats?.certsCount ?? 6

  return (
    <section id="about" className="relative border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-20">
      {/* Background ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-0 h-[350px] w-[350px] translate-x-1/3 rounded-full bg-cyan-500/[0.05] blur-[120px]"
      />

      <div className="mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
            [ 03 — ABOUT & IDENTITY ]
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
            Engineering & <br />
            <span className="text-violet-400">Community.</span>
          </h2>
        </div>

        {/* 2-Column Split: Narrative Scrollytelling & 3D Student ID Card */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Pinned Word-by-Word Scroll Fill (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0a1a] p-6 sm:p-7 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40 mb-4">
                PERSISTENT ARCHITECTURE NARRATIVE
              </span>
              <ScrollFill
                text={bioNarrative}
                className="font-sans text-sm sm:text-base md:text-lg font-normal leading-relaxed text-text-lilac"
              />
            </div>

            {/* Facts Row with Strict Icons (NO EMOJI) */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="map-pin" size={13} className="text-violet-400" />
                <span>{profile?.location || 'Mumbai, Maharashtra, IN'}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="graduation-cap" size={13} className="text-cyan-400" />
                <span>Mumbai University (2023–2027)</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-text-lilac">
                <Icon name="code" size={13} className="text-emerald-400" />
                <span>Frontend & Full-Stack</span>
              </div>
            </div>

            {/* Dynamic Metric Counts */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
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
                <span className="font-mono text-[11px] text-muted block uppercase">Certifications</span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-cyan-400">
                  <CountUp value={certsCount} />+
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile 3D Student ID Card (5 cols) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Tilt maxAngle={10} perspective={1000} className="w-full max-w-[340px]">
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#12122b] via-[#090919] to-[#04040d] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(139,92,246,0.15)]">
                
                {/* ID Card Top Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base font-extrabold tracking-tight text-white">
                      VG<span className="text-violet-400">.</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-muted uppercase">
                      STUDENT IDENTITY
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {primaryEdu.status || 'FINAL YEAR'}
                  </span>
                </div>

                {/* AI Avatar Slot (Replaced Personal Cutout per User Request) */}
                <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-xl border border-violet-500/20 bg-black/80 flex items-center justify-center">
                  {!avatarError ? (
                    <Image
                      src={customAvatarSrc}
                      alt="AI Avatar"
                      fill
                      sizes="300px"
                      className="object-cover object-center"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    /* Futuristic Cybernetic AI Avatar Hologram Placeholder */
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-4 text-center">
                      {/* Grid background */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:14px_14px] opacity-20"
                      />
                      
                      {/* Holographic Glowing Rings */}
                      <div className="relative flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-dashed border-violet-500/40 animate-[spin_25s_linear_infinite]" />
                        <div className="absolute inset-2 rounded-full border border-cyan-500/30 animate-[spin_18s_linear_infinite_reverse]" />
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600/30 to-cyan-500/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                          <Icon name="cpu" size={26} className="text-violet-300" colored={false} />
                        </div>
                      </div>

                      {/* AI Ready Indicator */}
                      <div className="mt-3">
                        <span className="inline-block rounded border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-violet-300 uppercase">
                          AI AVATAR READY
                        </span>
                        <p className="mt-1 font-mono text-[9px] text-muted/60">
                          Place avatar at /images/ai-avatar.png
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Holographic corner emblem */}
                  <div className="pointer-events-none absolute right-2.5 bottom-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-violet-400/40 bg-violet-600/30 backdrop-blur-sm shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                    <Icon name="shield-check" size={14} className="text-violet-300" />
                  </div>
                </div>

                {/* ID Card Information Grid */}
                <div className="mt-4 space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-white/40">NAME</span>
                    <span className="font-display text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                      VEDANTH GALI
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-2.5">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">PROGRAMME</span>
                      <span className="text-text-lilac text-[11px] font-medium leading-tight block truncate">
                        {primaryEdu.degree}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">DISCIPLINE</span>
                      <span className="text-violet-300 text-[11px] font-medium leading-tight block truncate">
                        {primaryEdu.field}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">INSTITUTION</span>
                      <span className="text-muted truncate max-w-[150px] block">{primaryEdu.institution}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">VALIDITY</span>
                      <span className="text-muted">{primaryEdu.start_year} – {primaryEdu.end_year}</span>
                    </div>
                  </div>
                </div>

                {/* Card Barcode Line */}
                <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[8px] text-white/30 tracking-widest uppercase">
                  <span>ENG-MU-2023-2027</span>
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
