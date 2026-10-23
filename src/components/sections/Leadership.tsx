import type { ExperienceRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { LeadershipTimeline } from './LeadershipTimeline'

interface LeadershipProps {
  experience: ExperienceRow[]
}

export function Leadership({ experience }: LeadershipProps) {
  return (
    <section id="leadership" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionReveal>
          <div className="mb-12">
            <span className="text-accent font-mono text-xs tracking-widest uppercase">
              03 — LEADERSHIP
            </span>
            <h2 className="font-display text-text mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              Positions of Responsibility
            </h2>
            <p className="text-muted mt-2 max-w-lg font-mono text-xs">
              Guiding technical events, organizing hackathons, and managing creative direction.
            </p>
          </div>
        </SectionReveal>

        <LeadershipTimeline experience={experience} />
      </div>
    </section>
  )
}
