'use client'

import React, { useState } from 'react'
import type { SkillRow, ProjectRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'

interface SkillsProps {
  skillsGrouped: Record<string, SkillRow[]>
  projects?: ProjectRow[]
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
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

const DEFAULT_SPOTLIGHT_ITEMS = [
  { name: 'Next.js 14/16', icon: 'nextjs', deployedIn: 'The Rkive' },
  { name: 'React 19', icon: 'react', deployedIn: 'Escape Placement Cell' },
  { name: 'TypeScript', icon: 'typescript', deployedIn: 'All Platforms' },
  { name: 'Supabase & RLS', icon: 'supabase', deployedIn: 'The Rkive & Escape' },
  { name: 'PostgreSQL', icon: 'postgresql', deployedIn: 'The Rkive DB' },
  { name: 'Tailwind CSS v4', icon: 'tailwindcss', deployedIn: 'All Platforms' },
  { name: 'Python & TF', icon: 'python', deployedIn: 'Plant Disease CNN' },
  { name: 'Git & Vercel', icon: 'git', deployedIn: 'CI/CD Pipelines' },
]

export function Skills({ skillsGrouped, projects = [], content }: SkillsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 06 — TECH STACK & ARCHITECTURE ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : 'Engineering'

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Stack.'

  const subtitle =
    typeof content?.subtitle === 'string' && content.subtitle.trim()
      ? content.subtitle
      : 'Distinguishing active production technologies deployed in live builds from foundational academic engineering proficiencies.'

  const spotlightTitle =
    typeof content?.spotlight_title === 'string' && content.spotlight_title.trim()
      ? content.spotlight_title
      : 'ACTIVE PRODUCTION STACK'

  const spotlightSubtitle =
    typeof content?.spotlight_subtitle === 'string' && content.spotlight_subtitle.trim()
      ? content.spotlight_subtitle
      : 'Live in deployed platforms: The Rkive, Escape Placement Cell'

  const spotlightItems =
    Array.isArray(content?.spotlight_items) && content.spotlight_items.length > 0
      ? (content.spotlight_items as typeof DEFAULT_SPOTLIGHT_ITEMS)
      : DEFAULT_SPOTLIGHT_ITEMS

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
    <section id="stack" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[150px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
              {kicker}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              {headingLine1} <br />
              <span className="text-gradient-accent">{headingLine2}</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Production Stack Spotlight Bar */}
        <div className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/30 via-[#0a0c14] to-pink-950/20 p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                {spotlightTitle}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              {spotlightSubtitle}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {spotlightItems.map((tech) => (
              <div
                key={tech.name}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-slate-200 shadow-sm"
              >
                <Icon name={tech.icon} size={14} colored={true} />
                <span className="font-semibold text-white">{tech.name}</span>
                {tech.deployedIn && (
                  <span className="text-[10px] text-blue-400 border-l border-white/10 pl-2">
                    {tech.deployedIn}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Categories Matrix - Symmetrical Grid with Equal Heights */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const list = skillsGrouped[category] || []
            const catIcon = CATEGORY_ICONS[category] || 'layers'

            return (
              <div
                key={category}
                className="flex flex-col justify-between h-full rounded-xl border border-white/10 bg-[#0a0c14] p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-blue-500/40"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Icon name={catIcon} size={14} colored={false} />
                    </div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-tight text-white">
                      {category}
                    </h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    {list.length}
                  </span>
                </div>

                {/* Skill Tiles Grid - Symmetrical layout */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 flex-1 content-start">
                  {list.map((skill) => {
                    const deployedProjects = getUsedInProjects(skill.name)
                    const isTooltipOpen = activeTooltip === skill.id

                    return (
                      <div
                        key={skill.id}
                        onMouseEnter={() => deployedProjects.length > 0 && setActiveTooltip(skill.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="group/item relative flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 text-xs transition-all hover:border-blue-500/30 hover:bg-white/[0.03]"
                      >
                        <div className="shrink-0 text-slate-400 group-hover/item:text-blue-400 transition-colors">
                          <Icon name={skill.icon_key || 'code'} size={14} colored={true} />
                        </div>
                        <span className="font-mono text-[11px] text-slate-300 group-hover/item:text-white transition-colors truncate">
                          {skill.name}
                        </span>

                        {deployedProjects.length > 0 && (
                          <span
                            aria-label={`Used in ${deployedProjects.join(', ')}`}
                            className="ml-auto flex h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"
                          />
                        )}

                        {/* Interactive Project Mapping Tooltip */}
                        {isTooltipOpen && deployedProjects.length > 0 && (
                          <div className="absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-md border border-white/10 bg-[#0e111b] px-2.5 py-1.5 font-mono text-[10px] text-slate-200 shadow-xl whitespace-nowrap">
                            <span className="text-slate-400">Deployed in: </span>
                            <span className="text-blue-400 font-semibold">{deployedProjects.join(', ')}</span>
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
