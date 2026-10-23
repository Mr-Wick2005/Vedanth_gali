import type { ProfileRow, EducationRow } from '@/types/database'

interface AboutProps {
  profile: ProfileRow | null
  education: EducationRow[]
}

export function About({ profile, education }: AboutProps) {
  const bioParagraphs = profile?.long_bio
    ? profile.long_bio.split('\n\n')
    : [
        "I'm a final-year Computer Engineering student at Mumbai University who likes owning a build end to end: the interface, the data model and the deployment. My biggest project so far is The Rkive, a digital publishing platform I founded, designed and deployed for real use at my college.",
        "Alongside code, I lead people and events. I've run my department's technical activities, headed the Hackathon Club, and served as Conference Coordinator & Creative Head for ICSICE 2026. I care about clean UI, scalable structure, and problem-solving that holds up outside a demo.",
      ]

  return (
    <section id="about" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            01 — ABOUT
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
            Engineering & Leadership
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Narrative Bios (7 columns) */}
          <div className="space-y-6 text-base leading-relaxed text-muted lg:col-span-7">
            {bioParagraphs.map((p, idx) => (
              <p key={idx} className="text-muted/90">
                {p}
              </p>
            ))}

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs text-muted">
              <span className="rounded border border-border bg-surface px-3 py-1.5">
                📍 {profile?.location || 'Mumbai, Maharashtra, India'}
              </span>
              <span className="rounded border border-border bg-surface px-3 py-1.5">
                🎓 Mumbai University (2023–2027)
              </span>
            </div>
          </div>

          {/* Education & Status Card (5 columns) */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-hover">
              <span className="font-mono text-xs uppercase tracking-wider text-accent">
                Education
              </span>

              {education.map((edu) => (
                <div key={edu.id} className="mt-4">
                  <h3 className="font-display text-lg font-bold text-text">
                    {edu.degree}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-accent">
                    {edu.field}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {edu.institution}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 font-mono text-xs text-muted">
                    <span>
                      {edu.start_year} – {edu.end_year}
                    </span>
                    <span className="rounded bg-accent/10 px-2 py-0.5 text-accent uppercase">
                      {edu.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
