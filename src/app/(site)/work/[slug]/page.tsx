import type { Metadata } from 'next'
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

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} — Case Study | Vedanth Gali`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Case Study | Vedanth Gali`,
      description: project.summary,
      images: project.cover_image_url
        ? [{ url: project.cover_image_url, alt: project.cover_image_alt || project.title }]
        : [],
    },
  }
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
        className="text-muted hover:text-accent mb-8 inline-block font-mono text-xs transition-colors"
      >
        ← Back to all projects
      </Link>

      <header className="mb-12">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-accent font-mono text-xs">CASE STUDY</span>
          {project.year && <span className="text-muted font-mono text-xs">· {project.year}</span>}
          {project.role && <span className="text-muted font-mono text-xs">· {project.role}</span>}
        </div>

        <h1 className="font-display text-text text-3xl font-extrabold tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="text-muted mt-4 max-w-3xl text-lg">{project.summary}</p>

        {metrics.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <div key={i} className="border-border bg-surface rounded border p-4">
                <span className="text-muted font-mono text-xs">{m.label}</span>
                <p className="font-display text-accent mt-1 text-xl font-bold">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Tech Stack Chips */}
      <section className="mb-12">
        <h2 className="text-muted mb-3 font-mono text-xs tracking-wider uppercase">
          Technology Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="border-border bg-surface text-text rounded border px-3 py-1 font-mono text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Problem, Solution, Outcome Narrative */}
      <div className="max-w-3xl space-y-8">
        {project.problem && (
          <section className="border-border bg-surface rounded-lg border p-6">
            <h3 className="font-display text-text mb-2 text-base font-bold">The Problem</h3>
            <p className="text-muted text-sm leading-relaxed">{project.problem}</p>
          </section>
        )}

        {project.solution && (
          <section className="border-border bg-surface rounded-lg border p-6">
            <h3 className="font-display text-text mb-2 text-base font-bold">
              The Solution & Architecture
            </h3>
            <p className="text-muted text-sm leading-relaxed">{project.solution}</p>
          </section>
        )}

        {project.outcome && (
          <section className="border-border bg-surface rounded-lg border p-6">
            <h3 className="font-display text-text mb-2 text-base font-bold">The Outcome</h3>
            <p className="text-muted text-sm leading-relaxed">{project.outcome}</p>
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
            className="border-accent bg-accent/10 text-accent hover:bg-accent hover:text-text rounded border px-4 py-2 font-mono text-xs font-semibold transition-colors"
          >
            Visit Live Platform ↗
          </a>
        )}
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-surface text-text hover:border-accent rounded border px-4 py-2 font-mono text-xs transition-colors"
          >
            GitHub Repository ↗
          </a>
        )}
      </div>
    </article>
  )
}
