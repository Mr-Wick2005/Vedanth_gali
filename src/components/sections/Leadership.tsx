import type { ExperienceRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { LeadershipTimeline } from './LeadershipTimeline'

interface LeadershipProps {
  experience: ExperienceRow[]
}

export function Leadership({ experience }: LeadershipProps) {
  return (
    <section id="leadership" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionReveal>
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              03 — LEADERSHIP
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
              Positions of Responsibility
            </h2>
            <p className="mt-2 text-xs font-mono text-muted max-w-lg">
              Guiding technical events, organizing hackathons, and managing creative direction.
            </p>
          </div>
        </SectionReveal>

        <LeadershipTimeline experience={experience} />
      </div>
    </section>
  )
}
