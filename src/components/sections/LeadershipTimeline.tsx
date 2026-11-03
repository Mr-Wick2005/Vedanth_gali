'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import type { ExperienceRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { ImageSlideshow } from '@/components/ui/ImageSlideshow'
import { extractGalleryImages } from '@/lib/images'

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

function getRoleCategoryBadge(title: string, company: string) {
  const combined = (title + ' ' + company).toLowerCase()
  if (combined.includes('conference') || combined.includes('icsice')) {
    return {
      label: 'CONFERENCE DIRECTION',
      color: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
      dot: 'bg-pink-400',
    }
  }
  if (combined.includes('hackathon')) {
    return {
      label: 'HACKATHON OPERATIONS',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      dot: 'bg-emerald-400',
    }
  }
  return {
    label: 'TECHNICAL LEADERSHIP',
    color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
    dot: 'bg-blue-400',
  }
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

      {/* Animated Glowing Progress Line (Electric Blue -> Warm Magenta) */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-0 w-[2px] origin-top bg-gradient-to-b from-blue-500 via-pink-500 to-magenta-glow shadow-[0_0_20px_rgba(59,130,246,0.9)]"
      />

      {experience.map((role, idx) => {
        const year = role.start_date ? new Date(role.start_date).getFullYear() : 2024 + idx
        const orgIcon = getOrgIcon(role.company)
        const categoryBadge = getRoleCategoryBadge(role.title, role.company)
        const images = extractGalleryImages(role)

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
              className="absolute top-3 -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-blue-600 transition-transform group-hover:scale-125 sm:-left-[57px] shadow-[0_0_15px_rgba(37,99,235,0.8)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>

            {/* Oversized Parallax Outlined Year Numeral */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-4 font-display text-7xl sm:text-9xl font-black text-stroke select-none opacity-10 transition-opacity group-hover:opacity-25"
            >
              {year}
            </div>

            {/* Card Container in Developer Theme */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all hover:border-blue-500/40">
              
              {/* Terminal File Path Header */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-slate-400">
                    ~/leadership/{role.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.tsx
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryBadge.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${categoryBadge.dot} animate-pulse`} />
                    {categoryBadge.label}
                  </span>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
                
                {/* Details Column (7 cols - symmetrical height) */}
                <div className="flex flex-col justify-between lg:col-span-7 h-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Organization Icon Badge */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300">
                        <Icon name={orgIcon} size={16} />
                      </div>

                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                          {role.company}
                        </span>
                      </div>

                      {role.period_label && (
                        <>
                          <span className="text-white/20">•</span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono text-[11px] text-slate-400">
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
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
                      {role.description}
                    </p>
                  </div>

                  {/* Highlight Rows */}
                  {role.highlights && role.highlights.length > 0 && (
                    <ul className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-4 list-none p-0 m-0">
                      {role.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2.5 font-mono text-xs text-slate-300"
                        >
                          <Icon
                            name="check"
                            size={14}
                            className="text-blue-400 shrink-0 mt-0.5"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Right Column: Multi-Image Slideshow with Lightbox (5 cols - aligned) */}
                <div className="flex flex-col justify-center lg:col-span-5 h-full">
                  <ImageSlideshow
                    images={images}
                    aspectRatio="4:3"
                    altFallback={role.title}
                    showThumbnails={images.length > 1}
                  />
                </div>

              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
