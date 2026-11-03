import type { ExperienceRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { LeadershipTimeline } from './LeadershipTimeline'

interface LeadershipProps {
  experience: ExperienceRow[]
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

export function Leadership({ experience, content }: LeadershipProps) {
  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 07 — POSITIONS OF RESPONSIBILITY & CONFERENCES ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : 'Leadership &'

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Event Direction.'

  return (
    <section id="leadership" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24">
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-pink-600/[0.06] blur-[130px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        <SectionReveal>
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
              {kicker}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              {headingLine1} <br />
              <span className="text-gradient-accent">{headingLine2}</span>
            </h2>
          </div>
        </SectionReveal>

        <LeadershipTimeline experience={experience} />
      </div>
    </section>
  )
}
