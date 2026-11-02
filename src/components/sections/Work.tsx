'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { CountUp } from '@/components/motion/CountUp'
import { Magnetic } from '@/components/motion/Magnetic'
import { Tilt } from '@/components/motion/Tilt'

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
    <section id="work" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-24">
      {/* Subtle ambient lighting behind section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 04 — SELECTED WORK ]
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              Featured <br />
              <span className="text-violet-400">Platforms.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Production-ready digital systems, university platforms, and deep learning architectures built with TypeScript, Next.js, and Supabase.
          </p>
        </div>

        {/* Stacked Project Panels Deck (Dynamically stacks any N projects from Admin/DB) */}
        <div className="relative flex flex-col gap-10 lg:gap-14 pb-12">
          {projects.map((project, idx) => {
            const metrics = Array.isArray(project.metrics)
              ? (project.metrics as Array<{ label: string; value: string }>)
              : []

            const imageSrc =
              project.cover_image_url ||
              FALLBACK_SCREENSHOTS[project.slug]

            // Format card index (01, 02, ..., 10, 11)
            const formattedIndex = String(idx + 1).padStart(2, '0')
            // Staggered sticky offset so stacked cards create an elegant cascading deck
            const stickyTop = `calc(5rem + ${Math.min(idx, 8) * 16}px)`

            return (
              <div
                key={project.id}
                style={{ top: stickyTop }}
                className="lg:sticky w-full rounded-2xl border border-white/[0.1] bg-[#0c0c1e] p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300"
              >
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  
                  {/* Left Column: Metadata & Details (6 cols) */}
                  <div className="flex flex-col justify-between lg:col-span-6">
                    <div>
                      {/* Outlined Project Number & Meta Pill */}
                      <div className="flex items-center justify-between">
                        <span className="font-display text-4xl sm:text-5xl font-black text-stroke-violet select-none opacity-40">
                          {formattedIndex}
                        </span>

                        <div className="flex items-center gap-2 font-mono text-xs text-muted">
                          {project.slug === 'the-rkive' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              FLAGSHIP DEPLOYMENT
                            </span>
                          ) : project.slug === 'escape-placement-cell' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              INTERACTIVE SIMULATION
                            </span>
                          ) : project.slug === 'plant-leaf-disease-detection' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300 uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                              ML RESEARCH
                            </span>
                          ) : (
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
                      <h3
                        style={{ viewTransitionName: `project-title-${project.slug}` }}
                        className="mt-3 font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white"
                      >
                        <Link
                          href={`/work/${project.slug}`}
                          className="hover:text-violet-300 transition-colors"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted line-clamp-3">
                        {project.summary}
                      </p>

                      {/* Metrics Chips with CountUp & Icons */}
                      {metrics.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 font-mono text-[11px] text-text-lilac"
                            >
                              <Icon name="sparkles" size={12} className="text-violet-400" />
                              <span className="text-muted">{m.label}:</span>
                              <span className="font-bold text-white">
                                <CountUp value={m.value} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Row with Vibrant Brand Icons */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="mt-6 border-t border-white/[0.08] pt-4">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-white/40">
                            TECHNOLOGIES USED
                          </span>
                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            {project.stack.map((tech) => (
                              <div
                                key={tech}
                                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-text-lilac"
                              >
                                <Icon name={tech} size={13} colored={true} />
                                <span>{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons (Magnetic) */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Magnetic strength={0.25}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500"
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
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
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
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                            aria-label={`GitHub Repository for ${project.title}`}
                          >
                            <Icon name="github" size={13} />
                            <span>Source</span>
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
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#121226] px-3.5 py-2.5">
                          {/* 3 Window Dots */}
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                            <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                            <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                          </div>
                          {/* Simulated Address Pill */}
                          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/50 px-3 py-0.5 font-mono text-[10px] text-muted max-w-[240px] truncate">
                            <Icon name="globe" size={11} className="text-violet-400 shrink-0" />
                            <span className="truncate">{project.live_url || `https://vedanthgali.dev/work/${project.slug}`}</span>
                          </div>
                          <div className="w-8" />
                        </div>

                        {/* Image Preview / Dynamic Video or Project Canvas */}
                        <div
                          style={{ viewTransitionName: `project-cover-${project.slug}` }}
                          className="relative aspect-[16/10] w-full overflow-hidden bg-black"
                        >
                          {project.cover_video_url ? (
                            <video
                              src={project.cover_video_url}
                              poster={project.cover_video_poster_url || imageSrc}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-105"
                            />
                          ) : imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={project.cover_image_alt || project.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 600px"
                              className="object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-105"
                            />
                          ) : (
                            /* Architectural Wireframe Canvas if no image uploaded yet */
                            <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px] opacity-20"
                              />
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
                                <Icon name="code" size={24} />
                              </div>
                              <h4 className="mt-3 font-display text-sm font-bold uppercase tracking-wider text-white">
                                {project.title}
                              </h4>
                              <span className="mt-1 font-mono text-[10px] text-muted">
                                Production Platform Viewport
                              </span>
                            </div>
                          )}
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
