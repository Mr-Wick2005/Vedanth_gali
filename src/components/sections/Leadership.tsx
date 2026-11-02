import type { ExperienceRow } from '@/types/database'
import { SectionReveal } from '@/components/ui/SectionReveal'
import { LeadershipTimeline } from './LeadershipTimeline'

interface LeadershipProps {
  experience: ExperienceRow[]
}

export function Leadership({ experience }: LeadershipProps) {
  return (
    <section id="leadership" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        <SectionReveal>
          <div className="mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 07 — POSITIONS OF RESPONSIBILITY ]
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              Leadership & <br />
              <span className="text-violet-400">Event Direction.</span>
            </h2>
            <p className="mt-2 max-w-lg font-mono text-xs sm:text-sm text-muted leading-relaxed">
              International conference coordination, creative brand direction, and competitive hackathon leadership with verified outcomes.
            </p>
          </div>
        </SectionReveal>

        <LeadershipTimeline experience={experience} />
      </div>
    </section>
  )
}
