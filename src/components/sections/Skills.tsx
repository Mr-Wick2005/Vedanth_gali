'use client'

import React, { useState } from 'react'
import type { SkillRow, ProjectRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'

interface SkillsProps {
  skillsGrouped: Record<string, SkillRow[]>
  projects?: ProjectRow[]
}

const CATEGORY_ICONS: Record<string, string> = {
  Frontend: 'react',
  Languages: 'code',
  Backend: 'server',
  Databases: 'database',
  Design: 'figma',
  Tools: 'terminal',
  'Machine Learning': 'cpu',
}

export function Skills({ skillsGrouped, projects = [] }: SkillsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

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

  // Function to find matching projects for a given skill
  const getUsedInProjects = (skillName: string) => {
    const s = skillName.toLowerCase()
    return projects
      .filter((p) =>
        p.stack?.some(
          (tech) =>
            tech.toLowerCase().includes(s) || s.includes(tech.toLowerCase())
        )
      )
      .map((p) => p.title)
  }

  return (
    <section id="stack" className="relative border-t border-white/[0.08] bg-black py-24 sm:py-32">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.06] blur-[150px]"
      />

      <div className="mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 06 — TECH STACK & CAPABILITIES ]
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white">
              Engineering <br />
              <span className="text-violet-400">Toolkit.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Verified frameworks, languages, and distributed systems actively used to construct production applications.
          </p>
        </div>

        {/* Categories Matrix */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const list = skillsGrouped[category] || []
            const catIcon = CATEGORY_ICONS[category] || 'layers'

            return (
              <div
                key={category}
                className="rounded-2xl border border-white/[0.08] bg-[#0b0b1c] p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all hover:border-violet-500/30"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Icon name={catIcon} size={18} className="text-violet-400" />
                    <h3 className="font-display text-base font-bold uppercase tracking-tight text-white">
                      {category}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-muted">
                    {list.length}
                  </span>
                </div>

                {/* Skill Tiles Grid */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {list.map((skill) => {
                    const matchedProjects = getUsedInProjects(skill.name)
                    const isHovered = activeTooltip === skill.id

                    return (
                      <div
                        key={skill.id}
                        onMouseEnter={() => setActiveTooltip(skill.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="relative"
                      >
                        <Tilt maxAngle={8} perspective={600} glare={false}>
                          <div className="group flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 transition-all hover:border-violet-500/40 hover:bg-violet-600/[0.08] hover:shadow-[0_0_20px_rgba(139,92,246,0.18)]">
                            <Icon
                              name={skill.icon_key || skill.name}
                              size={16}
                              className="text-muted group-hover:text-violet-300 transition-colors shrink-0"
                            />
                            <span className="font-mono text-xs text-text-lilac group-hover:text-white transition-colors truncate">
                              {skill.name}
                            </span>
                          </div>
                        </Tilt>

                        {/* Interactive Cross-Project Tooltip */}
                        {isHovered && (
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-lg border border-violet-500/40 bg-[#0d0d24] p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-violet-400">
                              CROSS-PROJECT USAGE
                            </span>
                            <p className="mt-1 font-sans text-xs text-text-lilac leading-snug">
                              {matchedProjects.length > 0 ? (
                                <>Used in: <strong className="text-white">{matchedProjects.join(', ')}</strong></>
                              ) : (
                                'Core engineering competency'
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
