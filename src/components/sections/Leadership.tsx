import type { ExperienceRow } from '@/types/database'

interface LeadershipProps {
  experience: ExperienceRow[]
}

export function Leadership({ experience }: LeadershipProps) {
  return (
    <section id="leadership" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
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

        {/* Timeline Container */}
        <div className="relative border-l border-accent/25 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-12">
          {experience.map((role) => (
            <div key={role.id} className="relative group">
              {/* Timeline Indicator Dot */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
