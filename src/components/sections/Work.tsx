import Link from 'next/link'
import type { ProjectRow } from '@/types/database'

interface WorkProps {
  projects: ProjectRow[]
}

export function Work({ projects }: WorkProps) {
  return (
    <section id="work" className="py-24 border-t border-border/40">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent">
              02 — WORK
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-text sm:text-4xl">
              Selected Projects
            </h2>
          </div>
          <p className="max-w-md text-xs text-muted font-mono">
            Full-stack platforms and deep learning systems built for production use and research validation.
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
                className="group relative rounded-lg border border-border bg-surface p-6 sm:p-8 transition-all hover:border-border-hover hover:-translate-y-0.5"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                  {/* Left Metadata & Overview (8 columns) */}
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-accent">
                        0{idx + 1}
                      </span>
                      {project.role && (
                        <span className="font-mono text-xs text-muted">
                          · {project.role}
                        </span>
                      )}
                      {project.year && (
                        <span className="font-mono text-xs text-muted">
                          · {project.year}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-xl font-bold text-text group-hover:text-accent transition-colors sm:text-2xl">
                      <Link href={`/work/${project.slug}`}>
                        {project.title} ↗
                      </Link>
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                      {project.summary}
                    </p>

                    {/* Metrics Badges */}
                    {metrics.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="rounded border border-border/80 bg-background/50 px-3 py-1.5 font-mono text-xs"
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
                          className="rounded border border-border/60 bg-surface-hover/50 px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions & Details (4 columns) */}
                  <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end lg:justify-between lg:self-stretch">
                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:flex-col lg:w-auto">
                      <Link
                        href={`/work/${project.slug}`}
                        className="rounded border border-accent bg-accent/10 px-4 py-2 text-center font-mono text-xs font-medium text-accent transition-all hover:bg-accent hover:text-text"
                      >
                        Case Study →
                      </Link>

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded border border-border bg-background px-4 py-2 text-center font-mono text-xs text-text transition-all hover:border-accent hover:bg-surface-hover"
                        >
                          Live Demo ↗
                        </a>
                      )}

                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded border border-border bg-background px-4 py-2 text-center font-mono text-xs text-muted transition-all hover:border-accent hover:text-text hover:bg-surface-hover"
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
