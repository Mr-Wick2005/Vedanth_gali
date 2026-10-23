import type { SkillRow } from '@/types/database'

interface SkillsProps {
  skillsGrouped: Record<string, SkillRow[]>
}

export function Skills({ skillsGrouped }: SkillsProps) {
  // Category order per Patch 1: Frontend, Languages, Backend, Databases, Design, Tools, ML
  const categoryOrder = [
    'Frontend',
    'Languages',
    'Backend',
    'Databases',
    'Design',
    'Tools',
    'Machine Learning',
  ]

  const categories = Object.keys(skillsGrouped).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a)
    const idxB = categoryOrder.indexOf(b)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <section id="skills" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            04 — SKILLS
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
            Technical Capabilities
          </h2>
          <p className="mt-2 text-xs font-mono text-muted">
            Technologies and frameworks actively used to architect and ship software.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const list = skillsGrouped[category] || []

            return (
              <div
                key={category}
                className="rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-hover"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <h3 className="font-display text-base font-bold text-text">
                    {category}
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {list.length}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded border border-border/80 bg-background/60 px-2.5 py-1 font-mono text-xs text-text/90 transition-colors hover:border-accent hover:text-accent"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
