'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { CountUp } from '@/components/motion/CountUp'
import { Magnetic } from '@/components/motion/Magnetic'
import { Tilt } from '@/components/motion/Tilt'
import { Reveal } from '@/components/motion/Reveal'

interface WorkProps {
  projects: ProjectRow[]
}

const FALLBACK_SCREENSHOTS: Record<string, string> = {
  'the-rkive': '/placeholders/the-rkive.png',
  'escape-placement-cell': '/placeholders/escape-placement-cell.png',
  'plant-leaf-disease-detection': '/placeholders/plant-leaf-disease-detection.png',
}

export function Work({ projects }: WorkProps) {
  return (
    <section id="work" className="relative border-t border-white/[0.08] bg-[#06060f] py-24 sm:py-32">
      {/* Subtle ambient lighting behind section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 04 — SELECTED WORK ]
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white">
              Featured <br />
              <span className="text-violet-400">Platforms.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Production-ready digital systems, university platforms, and deep learning architectures built with TypeScript, Next.js, and Supabase.
          </p>
        </div>

        {/* Stacked Project Panels Deck */}
        <div className="relative flex flex-col gap-12 lg:gap-16">
          {projects.map((project, idx) => {
            const metrics = Array.isArray(project.metrics)
              ? (project.metrics as Array<{ label: string; value: string }>)
              : []

            const imageSrc =
              project.cover_image_url ||
              FALLBACK_SCREENSHOTS[project.slug] ||
              '/placeholders/the-rkive.png'

            return (
              <div
                key={project.id}
                className="lg:sticky lg:top-24 w-full rounded-2xl border border-white/[0.1] bg-[#0c0c1e] p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300"
              >
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                  
                  {/* Left Column: Metadata & Details (6 cols) */}
                  <div className="flex flex-col justify-between lg:col-span-6">
                    <div>
                      {/* Outlined Project Number & Meta Pill */}
                      <div className="flex items-center justify-between">
                        <span className="font-display text-5xl sm:text-6xl font-black text-stroke-violet select-none opacity-40">
                          0{idx + 1}
                        </span>

                        <div className="flex items-center gap-3 font-mono text-xs text-muted">
                          {project.role && (
                            <span className="inline-flex items-center gap-1 text-text-lilac">
                              <Icon name="briefcase" size={13} className="text-violet-400" />
                              <span>{project.role}</span>
                            </span>
                          )}
                          {project.year && (
                            <>
                              <span className="text-white/20">•</span>
                              <span className="inline-flex items-center gap-1">
                                <Icon name="calendar" size={13} />
                                <span>{project.year}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
                        <Link
                          href={`/work/${project.slug}`}
                          className="hover:text-violet-300 transition-colors"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted">
                        {project.summary}
                      </p>

                      {/* Metrics Chips with CountUp & Icons */}
                      {metrics.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 font-mono text-xs text-text-lilac"
                            >
                              <Icon name="sparkles" size={13} className="text-violet-400" />
                              <span className="text-muted">{m.label}:</span>
                              <span className="font-bold text-white">
                                <CountUp value={m.value} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Row with Brand Icons */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="mt-8 border-t border-white/[0.08] pt-6">
                          <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40">
                            TECHNOLOGIES USED
                          </span>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            {project.stack.map((tech) => (
                              <div
                                key={tech}
                                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-text-lilac"
                              >
                                <Icon name={tech} size={14} />
                                <span>{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons (Magnetic) */}
                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <Magnetic strength={0.25}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500"
                        >
                          <span>Case Study</span>
                          <Icon name="arrow-right" size={14} />
                        </Link>
                      </Magnetic>

                      {project.live_url && (
                        <Magnetic strength={0.25}>
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                          >
                            <span>Live Demo</span>
                            <Icon name="arrow-up-right" size={14} />
                          </a>
                        </Magnetic>
                      )}

                      {project.repo_url && (
                        <Magnetic strength={0.25}>
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                            aria-label={`GitHub Repository for ${project.title}`}
                          >
                            <Icon name="github" size={14} />
                            <span>Source Code</span>
                          </a>
                        </Magnetic>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Browser-Frame Mockup with 3D Tilt (6 cols) */}
                  <div className="lg:col-span-6">
                    <Tilt maxAngle={5}>
                      <Link
                        href={`/work/${project.slug}`}
                        data-cursor="view"
                        className="group/mockup block relative overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all"
                      >
                        {/* Browser Window Header */}
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#121226] px-4 py-3">
                          {/* 3 Window Dots */}
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                          </div>
                          {/* Simulated Address Pill */}
                          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/50 px-4 py-1 font-mono text-[11px] text-muted max-w-[280px] truncate">
                            <Icon name="globe" size={12} className="text-violet-400 shrink-0" />
                            <span className="truncate">{project.live_url || `https://vedanthgali.dev/work/${project.slug}`}</span>
                          </div>
                          <div className="w-10" />
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                          <Image
                            src={imageSrc}
                            alt={project.cover_image_alt || project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 600px"
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-105"
                          />
                          {/* Hover Gradient Overlay */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/mockup:opacity-100" />
                        </div>
                      </Link>
                    </Tilt>
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
