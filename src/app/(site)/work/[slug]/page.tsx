import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, getProjects } from '@/lib/content'
import { Icon } from '@/components/ui/icon'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Magnetic } from '@/components/motion/Magnetic'
import { ProjectArchitectureDiagram } from '@/components/sections/ProjectArchitectureDiagram'
import { ProjectEngineeringDetails } from '@/components/sections/ProjectEngineeringDetails'
import { ImageSlideshow } from '@/components/ui/ImageSlideshow'
import { extractGalleryImages } from '@/lib/images'

interface WorkPageProps {
  params: Promise<{ slug: string }>
}

const FALLBACK_SCREENSHOTS: Record<string, string> = {
  'the-rkive': '/placeholders/the-rkive.png',
  'escape-placement-cell': '/placeholders/escape-placement-cell.png',
  'plant-leaf-disease-detection': '/placeholders/plant-leaf-disease-detection.png',
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
  const allProjects = await getProjects()
  const currentIndex = allProjects.findIndex((p) => p.slug === slug)
  const project = allProjects[currentIndex]

  if (!project) {
    notFound()
  }

  // Calculate next project for the giant transition footer
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length]

  const metrics = Array.isArray(project.metrics)
    ? (project.metrics as Array<{ label: string; value: string }>)
    : []

  const coverImage =
    project.cover_image_url ||
    FALLBACK_SCREENSHOTS[project.slug] ||
    '/placeholders/the-rkive.png'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedanthgali.dev'
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.summary,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    url: `${siteUrl}/work/${project.slug}`,
    image: coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`,
    author: {
      '@type': 'Person',
      name: 'Vedanth Gali',
      url: siteUrl,
    },
    keywords: (project.stack || []).join(', '),
  }

  return (
    <article className="min-h-screen bg-black text-white pt-24 pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      {/* Top Navigation Bar */}
      <div className="mx-auto max-w-[1320px] px-6">
        <Magnetic strength={0.25}>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-violet-400/40 hover:text-white"
          >
            <Icon name="arrow-left" size={14} />
            <span>Back to All Projects</span>
          </Link>
        </Magnetic>

        {/* Hero Title & Overview */}
        <header className="mt-12 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            {project.slug === 'the-rkive' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300 font-semibold uppercase tracking-wider text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                FLAGSHIP DIGITAL PUBLISHING PLATFORM
              </span>
            ) : project.slug === 'escape-placement-cell' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-cyan-300 font-semibold uppercase tracking-wider text-[11px]">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                INTERACTIVE GAMIFIED SIMULATION
              </span>
            ) : project.slug === 'plant-leaf-disease-detection' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-violet-300 font-semibold uppercase tracking-wider text-[11px]">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                MACHINE LEARNING RESEARCH
              </span>
            ) : (
              <span className="text-violet-400 uppercase tracking-widest">[ CASE STUDY ]</span>
            )}
            <span>•</span>
            <span>{project.role || 'Full-Stack Developer'}</span>
            <span>•</span>
            <span>{project.year || 2024}</span>
          </div>

          <h1
            style={{ viewTransitionName: `project-title-${project.slug}` }}
            className="mt-4 font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95]"
          >
            {project.title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-muted max-w-3xl">
            {project.summary}
          </p>

          {/* External Links */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {project.live_url && (
              <Magnetic strength={0.3}>
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all hover:bg-violet-500"
                >
                  <span>Visit Live Platform</span>
                  <Icon name="arrow-up-right" size={15} />
                </a>
              </Magnetic>
            )}

            {project.repo_url && (
              <Magnetic strength={0.3}>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-mono text-xs sm:text-sm font-medium uppercase tracking-wider text-text-lilac transition-all hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <Icon name="github" size={15} />
                  <span>GitHub Repository</span>
                </a>
              </Magnetic>
            )}
          </div>
        </header>

        {/* Hero Media Preview (Browser Frame & Multi-Image Slideshow) */}
        <section className="mt-16">
          <ImageReveal direction="bottom" duration={0.8}>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0c14] shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0e111b] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/60 px-5 py-1 font-mono text-xs text-slate-400 max-w-md truncate">
                  <Icon name="globe" size={13} className="text-blue-400 shrink-0" />
                  <span className="truncate">{project.live_url || `https://vedanthgali.dev/work/${project.slug}`}</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Main Media Preview (Video or ImageSlideshow) */}
              <div
                style={{ viewTransitionName: `project-cover-${project.slug}` }}
                className="relative w-full bg-black"
              >
                {project.cover_video_url ? (
                  <video
                    src={project.cover_video_url}
                    poster={project.cover_video_poster_url || coverImage}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full aspect-[16/9] object-cover object-top"
                  />
                ) : (
                  <ImageSlideshow
                    images={extractGalleryImages(project, coverImage)}
                    aspectRatio="video"
                    altFallback={project.title}
                    showThumbnails={true}
                  />
                )}
              </div>
            </div>
          </ImageReveal>
        </section>

        {/* Meta Matrix Row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-white/[0.08] py-8">
          <div>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40">ROLE & DISCIPLINE</span>
            <div className="mt-2 flex items-center gap-2 font-mono text-sm text-white">
              <Icon name="briefcase" size={16} className="text-violet-400" />
              <span>{project.role || 'Full-Stack Developer'}</span>
            </div>
          </div>

          <div>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40">TIMELINE</span>
            <div className="mt-2 flex items-center gap-2 font-mono text-sm text-white">
              <Icon name="calendar" size={16} className="text-violet-400" />
              <span>{project.year || 2024}</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-white/40">TECH STACK</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-text-lilac"
                >
                  <Icon name={t} size={13} />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <section className="mt-16">
            <h2 className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ MEASURED IMPACT & SCALE ]
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-[#0e0e22] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <span className="font-mono text-xs text-muted">{m.label}</span>
                  <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-violet-400">
                    <CountUp value={m.value} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Narrative Chapters: Problem, Solution, Outcome */}
        <div className="mt-20 max-w-4xl space-y-12">
          {project.problem && (
            <Reveal direction="up">
              <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c1e] p-8 sm:p-10">
                <span className="font-mono text-xs uppercase tracking-widest text-rose-400">
                  01 — THE PROBLEM & CHALLENGE
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                  Context & Opportunity
                </h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
                  {project.problem}
                </p>
              </section>
            </Reveal>
          )}

          {project.solution && (
            <Reveal direction="up">
              <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c1e] p-8 sm:p-10">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
                  02 — THE ARCHITECTURE & SOLUTION
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                  Technical Implementation
                </h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
                  {project.solution}
                </p>
              </section>
            </Reveal>
          )}

          {project.outcome && (
            <Reveal direction="up">
              <section className="rounded-2xl border border-white/[0.08] bg-[#0c0c1e] p-8 sm:p-10">
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                  03 — OUTCOME & VERIFICATION
                </span>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                  Results & Deployment
                </h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
                  {project.outcome}
                </p>
              </section>
            </Reveal>
          )}
        </div>

        {/* Visual Architecture & Pipeline Diagram */}
        <ProjectArchitectureDiagram slug={project.slug} />

        {/* Key Engineering Decisions & Methodology */}
        <ProjectEngineeringDetails slug={project.slug} />

        {/* Next Project Giant Footer */}
        {nextProject && (
          <section className="mt-32 border-t border-white/[0.1] pt-16">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              NEXT CASE STUDY →
            </span>
            <Link
              href={`/work/${nextProject.slug}`}
              className="group mt-4 block"
            >
              <h2 className="font-display text-4xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white/80 transition-colors group-hover:text-violet-400">
                {nextProject.title}
              </h2>
              <p className="mt-3 font-mono text-sm text-muted group-hover:text-text-lilac transition-colors">
                {nextProject.role || 'Full-Stack'} • {nextProject.year || 2024}
              </p>
            </Link>
          </section>
        )}
      </div>
    </article>
  )
}
