import Link from 'next/link'
import type { ProjectRow } from '@/types/database'

interface WorkProps {
  projects: ProjectRow[]
}

export function Work({ projects }: WorkProps) {
  return (
    <section id="work" className="border-border/40 border-t py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-accent font-mono text-xs tracking-widest uppercase">
              02 — WORK
            </span>
            <h2 className="font-display text-text mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              Selected Projects
            </h2>
          </div>
          <p className="text-muted max-w-md font-mono text-xs">
            Full-stack platforms and deep learning systems built for production use and research
            validation.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project, idx) => {
            const metrics = Array.isArray(project.metrics)
              ? (project.metrics as Array<{ label: string; value: string }>)
              : []

            return (
              <div
                key={project.id}
                className="group border-border bg-surface hover:border-border-hover relative rounded-lg border p-6 transition-all hover:-translate-y-0.5 sm:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                  {/* Left Metadata & Overview (8 columns) */}
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-accent font-mono text-xs">0{idx + 1}</span>
                      {project.role && (
                        <span className="text-muted font-mono text-xs">· {project.role}</span>
                      )}
                      {project.year && (
                        <span className="text-muted font-mono text-xs">· {project.year}</span>
                      )}
                    </div>

                    <h3 className="font-display text-text group-hover:text-accent mt-3 text-xl font-bold transition-colors sm:text-2xl">
                      <Link href={`/work/${project.slug}`}>{project.title} ↗</Link>
                    </h3>

                    <p className="text-muted mt-3 text-sm leading-relaxed sm:text-base">
                      {project.summary}
                    </p>

                    {/* Metrics Badges */}
                    {metrics.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="border-border/80 bg-background/50 rounded border px-3 py-1.5 font-mono text-xs"
                          >
                            <span className="text-muted">{m.label}: </span>
                            <strong className="text-accent">{m.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border-border/60 bg-surface-hover/50 text-muted rounded border px-2.5 py-1 font-mono text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions & Details (4 columns) */}
                  <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end lg:justify-between lg:self-stretch">
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
                      <Link
                        href={`/work/${project.slug}`}
                        className="border-accent bg-accent/10 text-accent hover:bg-accent hover:text-text rounded border px-4 py-2 text-center font-mono text-xs font-medium transition-all"
                      >
                        Case Study →
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-border bg-background text-text hover:border-accent hover:bg-surface-hover rounded border px-4 py-2 text-center font-mono text-xs transition-all"
                        >
                          Live Demo ↗
                        </a>
                      )}

                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-border bg-background text-muted hover:border-accent hover:text-text hover:bg-surface-hover rounded border px-4 py-2 text-center font-mono text-xs transition-all"
                        >
                          GitHub Repo ↗
                        </a>
                      )}
                    </div>
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
