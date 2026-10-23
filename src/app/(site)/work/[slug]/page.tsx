import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, getProjects } from '@/lib/content'

interface WorkPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectCaseStudyPage({ params }: WorkPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const metrics = Array.isArray(project.metrics)
    ? (project.metrics as Array<{ label: string; value: string }>)
    : []

  return (
    <article className="mx-auto min-h-screen max-w-[1200px] px-6 py-16">
      <Link
        href="/#work"
        className="mb-8 inline-block font-mono text-xs text-muted hover:text-accent transition-colors"
      >
        ← Back to all projects
      </Link>

      <header className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs text-accent">CASE STUDY</span>
          {project.year && (
            <span className="font-mono text-xs text-muted">· {project.year}</span>
          )}
          {project.role && (
            <span className="font-mono text-xs text-muted">· {project.role}</span>
          )}
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-text sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">{project.summary}</p>

        {metrics.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="rounded border border-border bg-surface p-4"
              >
                <span className="font-mono text-xs text-muted">{m.label}</span>
                <p className="mt-1 font-display text-xl font-bold text-accent">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Tech Stack Chips */}
      <section className="mb-12">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
          Technology Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-surface px-3 py-1 font-mono text-xs text-text"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Problem, Solution, Outcome Narrative */}
      <div className="space-y-8 max-w-3xl">
        {project.problem && (
          <section className="rounded-lg border border-border bg-surface p-6">
            <h3 className="font-display text-base font-bold text-text mb-2">
              The Problem
            </h3>
            <p className="text-sm leading-relaxed text-muted">{project.problem}</p>
          </section>
        )}

        {project.solution && (
          <section className="rounded-lg border border-border bg-surface p-6">
            <h3 className="font-display text-base font-bold text-text mb-2">
              The Solution & Architecture
            </h3>
            <p className="text-sm leading-relaxed text-muted">{project.solution}</p>
          </section>
        )}

        {project.outcome && (
          <section className="rounded-lg border border-border bg-surface p-6">
            <h3 className="font-display text-base font-bold text-text mb-2">
              The Outcome
            </h3>
            <p className="text-sm leading-relaxed text-muted">{project.outcome}</p>
          </section>
        )}
      </div>

      {/* External Links */}
      <div className="mt-12 flex gap-4">
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-semibold text-accent hover:bg-accent hover:text-text transition-colors"
          >
            Visit Live Platform ↗
          </a>
        )}
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border bg-surface px-4 py-2 font-mono text-xs text-text hover:border-accent transition-colors"
          >
            GitHub Repository ↗
          </a>
        )}
      </div>
    </article>
  )
}
