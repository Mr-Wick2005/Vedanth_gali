'use client'

import React from 'react'
import Link from 'next/link'
import type { ProjectRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Magnetic } from '@/components/motion/Magnetic'
import { ImageSlideshow } from '@/components/ui/ImageSlideshow'
import { extractGalleryImages } from '@/lib/images'

interface WorkProps {
  projects: ProjectRow[]
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

const FALLBACK_SCREENSHOTS: Record<string, string> = {
  'the-rkive': '/placeholders/the-rkive.png',
  'escape-placement-cell': '/placeholders/escape-placement-cell.png',
  'plant-leaf-disease-detection': '/placeholders/plant-leaf-disease-detection.png',
}

export function Work({ projects, content }: WorkProps) {
  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 04 — SELECTED WORK & PLATFORMS ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : 'Featured'

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Platforms.'

  const subtitle =
    typeof content?.subtitle === 'string' && content.subtitle.trim()
      ? content.subtitle
      : 'Production-ready digital systems, university platforms, and deep learning architectures built with TypeScript, Next.js, and Supabase.'

  return (
    <section id="work" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24">
      {/* Subtle ambient lighting behind section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/3 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-pink-600/[0.07] blur-[130px]"
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

        {/* Stacked Project Panels Deck */}
        <div className="relative flex flex-col gap-10 lg:gap-14 pb-12">
          {projects.map((project, idx) => {
            const metrics = Array.isArray(project.metrics)
              ? (project.metrics as Array<{ label: string; value: string }>)
              : []

            const galleryImages = extractGalleryImages(
              project,
              FALLBACK_SCREENSHOTS[project.slug],
            )

            const formattedIndex = String(idx + 1).padStart(2, '0')
            const stickyTop = `calc(4.5rem + ${Math.min(idx, 8) * 16}px)`

            return (
              <div
                key={project.id}
                style={{ top: stickyTop }}
                className="lg:sticky w-full rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-blue-500/30"
              >
                {/* Top Terminal Window Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-slate-400">~/platforms/{project.slug}.tsx</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.slug === 'the-rkive' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        FLAGSHIP PRODUCTION
                      </span>
                    ) : project.slug === 'escape-placement-cell' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        INTERACTIVE SIMULATION
                      </span>
                    ) : project.slug === 'plant-leaf-disease-detection' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-pink-300 uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                        ML RESEARCH
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <Icon name="briefcase" size={13} className="text-blue-400" />
                        <span>{project.role}</span>
                      </span>
                    )}

                    {project.year && (
                      <span className="text-slate-500 hidden sm:inline">
                        • {project.year}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  
                  {/* Left Column: Metadata & Details (6 cols - symmetrical height) */}
                  <div className="flex flex-col justify-between lg:col-span-6 h-full">
                    <div>
                      {/* Outlined Project Number */}
                      <span className="font-display text-4xl sm:text-5xl font-black text-stroke-blue select-none opacity-40">
                        {formattedIndex}
                      </span>

                      {/* Project Title */}
                      <h3
                        style={{ viewTransitionName: `project-title-${project.slug}` }}
                        className="mt-3 font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white"
                      >
                        <Link
                          href={`/work/${project.slug}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300 line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Key Engineering Metrics Strip */}
                      {metrics.length > 0 && (
                        <div className="mt-5 grid grid-cols-3 gap-2.5 rounded-xl border border-white/10 bg-black/40 p-3 font-mono">
                          {metrics.map((m, mIdx) => (
                            <div key={mIdx} className="text-center sm:text-left">
                              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 truncate">
                                {m.label}
                              </span>
                              <span className="font-display text-xs sm:text-sm md:text-base font-bold text-blue-400">
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Chips */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {project.stack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-colors hover:border-blue-500/40 hover:text-white"
                            >
                              <span className="h-1 w-1 rounded-full bg-blue-400" />
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Magnetic strength={0.25}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                        >
                          <span>Case Study</span>
                          <Icon name="arrow-right" size={13} />
                        </Link>
                      </Magnetic>

                      {project.live_url && (
                        <Magnetic strength={0.25}>
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-slate-300 transition-all hover:border-blue-500/40 hover:text-white"
                          >
                            <span>Live Demo</span>
                            <Icon name="arrow-up-right" size={13} />
                          </a>
                        </Magnetic>
                      )}

                      {project.repo_url && (
                        <Magnetic strength={0.25}>
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-slate-300 transition-all hover:border-white/20 hover:text-white"
                            aria-label={`GitHub Repository for ${project.title}`}
                          >
                            <Icon name="github" size={13} />
                            <span>Source</span>
                          </a>
                        </Magnetic>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Multi-Image Interactive Slideshow (6 cols - symmetrical height) */}
                  <div className="flex flex-col justify-center lg:col-span-6 h-full">
                    <ImageSlideshow
                      images={galleryImages}
                      aspectRatio="video"
                      altFallback={project.title}
                      showThumbnails={galleryImages.length > 1}
                    />
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
