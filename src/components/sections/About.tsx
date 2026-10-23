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
    <section id="about" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-accent font-mono text-xs tracking-widest uppercase">
            01 — ABOUT
          </span>
          <h2 className="font-display text-text mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
            Engineering & Leadership
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Narrative Bios (7 columns) */}
          <div className="text-muted space-y-6 text-base leading-relaxed lg:col-span-7">
            {bioParagraphs.map((p, idx) => (
              <p key={idx} className="text-muted/90">
                {p}
              </p>
            ))}

            <div className="text-muted flex flex-wrap gap-4 pt-4 font-mono text-xs">
              <span className="border-border bg-surface rounded border px-3 py-1.5">
                📍 {profile?.location || 'Mumbai, Maharashtra, India'}
              </span>
              <span className="border-border bg-surface rounded border px-3 py-1.5">
                🎓 Mumbai University (2023–2027)
              </span>
            </div>
          </div>

          {/* Education & Status Card (5 columns) */}
          <div className="lg:col-span-5">
            <div className="border-border bg-surface hover:border-border-hover rounded-lg border p-6 transition-colors">
              <span className="text-accent font-mono text-xs tracking-wider uppercase">
                Education
              </span>

              {education.map((edu) => (
                <div key={edu.id} className="mt-4">
                  <h3 className="font-display text-text text-lg font-bold">{edu.degree}</h3>
                  <p className="text-accent mt-1 font-mono text-xs">{edu.field}</p>
                  <p className="text-muted mt-2 text-sm">{edu.institution}</p>
                  <div className="border-border/50 text-muted mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs">
                    <span>
                      {edu.start_year} – {edu.end_year}
                    </span>
                    <span className="bg-accent/10 text-accent rounded px-2 py-0.5 uppercase">
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
