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
    <div ref={containerRef} className="relative ml-2 space-y-12 pl-6 sm:ml-4 sm:pl-8">
      {/* Background Static Line Track */}
      <div aria-hidden="true" className="bg-border/40 absolute top-2 bottom-2 left-0 w-px" />

      {/* Animated Scroll-Drawn Accent Line */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="bg-accent absolute top-2 bottom-2 left-0 w-px origin-top shadow-[0_0_12px_rgba(139,92,246,0.6)]"
      />

      {experience.map((role, idx) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.2, 0, 0, 1] }}
          className="group relative"
        >
          {/* Timeline Node Indicator */}
          <div
            aria-hidden="true"
            className="border-background bg-accent absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 transition-transform group-hover:scale-125 sm:-left-[39px]"
          />

          <div className="border-border bg-surface hover:border-border-hover rounded-lg border p-6 transition-colors sm:p-7">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <div>
                <h3 className="font-display text-text text-lg font-bold sm:text-xl">
                  {role.title}
                </h3>
                <p className="text-accent mt-1 font-mono text-xs">{role.company}</p>
              </div>
              {role.period_label && (
                <span className="bg-accent/10 text-accent self-start rounded px-2.5 py-1 font-mono text-xs font-medium">
                  {role.period_label}
                </span>
              )}
            </div>

            <p className="text-muted mt-4 text-sm leading-relaxed">{role.description}</p>

            {role.highlights.length > 0 && (
              <ul className="border-border/50 mt-4 space-y-2 border-t pt-4">
                {role.highlights.map((h, i) => (
                  <li key={i} className="text-muted/90 flex items-start gap-2.5 text-xs">
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
