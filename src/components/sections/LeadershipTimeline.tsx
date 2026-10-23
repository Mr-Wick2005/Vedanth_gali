'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import type { ExperienceRow } from '@/types/database'

interface LeadershipTimelineProps {
  experience: ExperienceRow[]
}

export function LeadershipTimeline({ experience }: LeadershipTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 70%'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <div ref={containerRef} className="relative ml-2 sm:ml-4 pl-6 sm:pl-8 space-y-12">
      {/* Background Static Line Track */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-2 bottom-2 w-px bg-border/40"
      />

      {/* Animated Scroll-Drawn Accent Line */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute left-0 top-2 bottom-2 w-px origin-top bg-accent shadow-[0_0_12px_rgba(139,92,246,0.6)]"
      />

      {experience.map((role, idx) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.2, 0, 0, 1] }}
          className="relative group"
        >
          {/* Timeline Node Indicator */}
          <div
            aria-hidden="true"
            className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent transition-transform group-hover:scale-125"
          />

          <div className="rounded-lg border border-border bg-surface p-6 sm:p-7 transition-colors hover:border-border-hover">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <div>
                <h3 className="font-display text-lg font-bold text-text sm:text-xl">
                  {role.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-accent">
                  {role.company}
                </p>
              </div>
              {role.period_label && (
                <span className="self-start rounded bg-accent/10 px-2.5 py-1 font-mono text-xs font-medium text-accent">
                  {role.period_label}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {role.description}
            </p>

            {role.highlights.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-border/50 pt-4">
                {role.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-muted/90"
                  >
                    <span className="text-accent mt-0.5">▹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
