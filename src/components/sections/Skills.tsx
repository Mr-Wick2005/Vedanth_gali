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
    <section id="skills" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-accent font-mono text-xs tracking-widest uppercase">
            04 — SKILLS
          </span>
          <h2 className="font-display text-text mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
            Technical Capabilities
          </h2>
          <p className="text-muted mt-2 font-mono text-xs">
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
                className="border-border bg-surface hover:border-border-hover rounded-lg border p-6 transition-colors"
              >
                <div className="border-border/50 flex items-center justify-between border-b pb-3">
                  <h3 className="font-display text-text text-base font-bold">{category}</h3>
                  <span className="text-muted font-mono text-xs">{list.length}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <span
                      key={skill.id}
                      className="border-border/80 bg-background/60 text-text/90 hover:border-accent hover:text-accent rounded border px-2.5 py-1 font-mono text-xs transition-colors"
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
