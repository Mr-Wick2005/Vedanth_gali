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
    <section id="stack" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-black py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 06 — TECH STACK & ARCHITECTURE ]
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              Engineering <br />
              <span className="text-violet-400">Stack.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Distinguishing active production technologies deployed in live builds from foundational academic engineering proficiencies.
          </p>
        </div>

        {/* Production Stack Spotlight Bar */}
        <div className="mb-8 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-950/30 via-[#0b0b18] to-cyan-950/20 p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                ACTIVE PRODUCTION STACK
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted">
              Live in deployed platforms: The Rkive, Escape Placement Cell
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {[
              { name: 'Next.js 14/16', icon: 'nextjs', deployedIn: 'The Rkive' },
              { name: 'React 19', icon: 'react', deployedIn: 'Escape Placement Cell' },
              { name: 'TypeScript', icon: 'typescript', deployedIn: 'All Platforms' },
              { name: 'Supabase & RLS', icon: 'supabase', deployedIn: 'The Rkive & Escape' },
              { name: 'PostgreSQL', icon: 'postgresql', deployedIn: 'The Rkive DB' },
              { name: 'Tailwind CSS', icon: 'tailwindcss', deployedIn: 'All Platforms' },
              { name: 'Python & TF', icon: 'python', deployedIn: 'Plant Disease CNN' },
              { name: 'Git & Vercel', icon: 'git', deployedIn: 'CI/CD Pipelines' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-xs text-text-lilac shadow-sm"
              >
                <Icon name={tech.icon} size={14} colored={true} />
                <span className="font-semibold text-white">{tech.name}</span>
                <span className="text-[10px] text-violet-400 border-l border-white/10 pl-2">
                  {tech.deployedIn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Matrix */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const list = skillsGrouped[category] || []
            const catIcon = CATEGORY_ICONS[category] || 'layers'

            return (
              <div
                key={category}
                className="rounded-xl border border-white/[0.08] bg-[#0b0b1a] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-violet-500/30"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      <Icon name={catIcon} size={14} colored={false} />
                    </div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-tight text-white">
                      {category}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-muted">
                    {list.length}
                  </span>
                </div>

                {/* Skill Tiles Grid */}
                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  {list.map((skill) => {
                    const matchedProjects = getUsedInProjects(skill.name)
                    const isHovered = activeTooltip === skill.id
                    const iconKey =
                      skill.name.toLowerCase() === 'antigravity'
                        ? 'antigravity'
                        : skill.icon_key || skill.name

                    return (
                      <div
                        key={skill.id}
                        onMouseEnter={() => setActiveTooltip(skill.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="relative"
                      >
                        <Tilt maxAngle={6} perspective={600} glare={false}>
                          <div className="group flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2 transition-all hover:border-violet-500/40 hover:bg-violet-600/[0.09] hover:shadow-[0_0_15px_rgba(139,92,246,0.18)]">
                            {/* Colorful Brand Icon Badge */}
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black/50 border border-white/10 group-hover:border-violet-500/30 transition-colors">
                              <Icon
                                name={iconKey}
                                size={14}
                                colored={true}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-medium text-text-lilac group-hover:text-white transition-colors truncate">
                              {skill.name}
                            </span>
                          </div>
                        </Tilt>

                        {/* Interactive Cross-Project Tooltip */}
                        {isHovered && (
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-48 -translate-x-1/2 rounded-lg border border-violet-500/40 bg-[#0d0d24] p-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.85)] backdrop-blur-md">
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
