'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring } from 'motion/react'
import type { ExperienceRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'

interface LeadershipTimelineProps {
  experience: ExperienceRow[]
}

const ORG_ICONS: Record<string, string> = {
  default: 'users',
  google: 'google',
  gdsc: 'google',
  hackathon: 'terminal',
  conference: 'globe',
  council: 'award',
}

function getOrgIcon(org: string): string {
  const o = org.toLowerCase()
  if (o.includes('gdsc') || o.includes('google')) return ORG_ICONS.google!
  if (o.includes('hackathon')) return ORG_ICONS.hackathon!
  if (o.includes('conference') || o.includes('icsice')) return ORG_ICONS.conference!
  if (o.includes('council')) return ORG_ICONS.council!
  return ORG_ICONS.default!
}

export function LeadershipTimeline({ experience }: LeadershipTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 65%'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <div ref={containerRef} className="relative ml-2 space-y-16 pl-8 sm:ml-4 sm:pl-12 w-full max-w-full">
      {/* Background Static Line Track */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-0 w-[2px] bg-white/[0.08]"
      />

      {/* Animated Glowing Progress Line */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-0 w-[2px] origin-top bg-gradient-to-b from-cyan-400 via-violet-500 to-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
      />

      {experience.map((role, idx) => {
        // Extract year from start_date
        const year = role.start_date ? new Date(role.start_date).getFullYear() : 2024 + idx
        const orgIcon = getOrgIcon(role.company)

        return (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.2, 0, 0, 1] }}
            className="group relative"
          >
            {/* Timeline Pulsing Node */}
            <div
              aria-hidden="true"
              className="absolute top-3 -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-violet-600 transition-transform group-hover:scale-125 sm:-left-[57px] shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            {/* Oversized Parallax Outlined Year Numeral */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-4 font-display text-7xl sm:text-9xl font-black text-stroke select-none opacity-15 transition-opacity group-hover:opacity-30"
            >
              {year}
            </div>

            {/* Card Container */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c20] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all hover:border-violet-500/30">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                
                {/* Details Column (8 cols) */}
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Organization Icon Badge */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300">
                      <Icon name={orgIcon} size={16} />
                    </div>

                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-violet-400">
                        {role.company}
                      </span>
                    </div>

                    {role.period_label && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[11px] text-muted">
                          <Icon name="calendar" size={11} />
                          <span>{role.period_label}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                    {role.description}
                  </p>

                  {/* Highlight Rows with Custom Icons */}
                  {role.highlights && role.highlights.length > 0 && (
                    <ul className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-4 list-none p-0 m-0">
                      {role.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2.5 font-mono text-xs text-text-lilac"
                        >
                          <Icon
                            name="check"
                            size={14}
                            className="text-violet-400 shrink-0 mt-0.5"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Photo Slot or Typographic Monogram Graphic (4 cols) */}
                <div className="lg:col-span-4">
                  {(role.image_url || role.logo_url) ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image
                        src={(role.image_url || role.logo_url)!}
                        alt={role.image_alt || role.logo_alt || role.title}
                        fill
                        sizes="300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    /* Tasteful Typographic Geometric Placeholder with Operational Scope */
                    <div className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#121226] via-[#090918] to-[#04040c] p-5 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400 font-semibold">
                          VERIFIED RESPONSIBILITY
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span className="font-mono text-[9px] text-emerald-400">ACTIVE</span>
                        </div>
                      </div>

                      <div className="my-auto py-2">
                        <span className="font-display text-3xl sm:text-4xl font-black text-stroke text-white/20 uppercase tracking-tight">
                          {role.company.includes('ICSICE')
                            ? 'ICSICE 26'
                            : role.company.includes('Hackathon')
                            ? 'HACK CLUB'
                            : 'TECH HEAD'}
                        </span>
                        <p className="mt-1 font-mono text-xs text-text-lilac font-medium truncate">
                          {role.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-muted truncate">
                          {role.company}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[9px] text-white/40">
                        <span>EST. {year}</span>
                        <span>MUMBAI, IN</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
