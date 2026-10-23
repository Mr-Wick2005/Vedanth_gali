import Link from 'next/link'
import {
  getProfile,
  getSiteSettings,
  getProjects,
  getExperience,
  getEducation,
  getCertifications,
  getSkillsGrouped,
  getSocialLinks,
  hasSupabaseEnv,
} from '@/lib/content'

export const revalidate = 60

export default async function HomePage() {
  const isConfigured = hasSupabaseEnv()

  if (!isConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
            SETUP REQUIRED
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-text">
            Environment Setup
          </h1>
          <p className="mb-6 text-sm text-muted">
            Supabase environment variables are missing. Please configure{' '}
            <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs text-accent">
              .env.local
            </code>{' '}
            with your URL and publishable key.
          </p>
          <div className="rounded border border-border/50 bg-background/50 p-4 text-left font-mono text-xs text-muted">
            <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
            <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...</p>
          </div>
        </div>
      </main>
    )
  }

  const [
    profile,
    ,
    projects,
    experience,
    ,
    certifications,
    skillsGrouped,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getProjects(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getSkillsGrouped(),
    getSocialLinks(),
  ])

  const totalSkills = Object.values(skillsGrouped).reduce(
    (acc, list) => acc + list.length,
    0,
  )

  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-6 py-16">
      {/* Eyebrow Status */}
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {profile?.availability_text || 'Open to work · Frontend / Full-Stack'}
        </span>
        <span className="font-mono text-xs text-muted">
          Environment & DB Connected
        </span>
      </div>

      {/* Two-tone Hero Identity */}
      <div className="mb-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-text">{profile?.name?.split(' ')[0] || 'Vedanth'} </span>
          <span className="text-accent">{profile?.name?.split(' ').slice(1).join(' ') || 'Gali'}</span>
        </h1>
        <p className="mt-2 text-lg text-muted sm:text-xl">
          {profile?.headline || 'Frontend & Full-Stack developer · Computer Engineering student'}
        </p>
      </div>

      {/* Short Bio */}
      <p className="max-w-2xl text-base leading-relaxed text-muted">
        {profile?.short_bio ||
          'Final-year Computer Engineering student at Mumbai University building high-impact web platforms with React, TypeScript, and Supabase.'}
      </p>

      {/* Live Computed Counts from Database */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded border border-border bg-surface p-4 transition-colors hover:border-border-hover">
          <span className="font-mono text-xs text-muted">Projects</span>
          <p className="mt-1 font-display text-2xl font-bold text-text">
            {projects.length}
          </p>
        </div>
        <div className="rounded border border-border bg-surface p-4 transition-colors hover:border-border-hover">
          <span className="font-mono text-xs text-muted">Leadership Roles</span>
          <p className="mt-1 font-display text-2xl font-bold text-text">
            {experience.length}
          </p>
        </div>
        <div className="rounded border border-border bg-surface p-4 transition-colors hover:border-border-hover">
          <span className="font-mono text-xs text-muted">Skills</span>
          <p className="mt-1 font-display text-2xl font-bold text-text">
            {totalSkills}
          </p>
        </div>
        <div className="rounded border border-border bg-surface p-4 transition-colors hover:border-border-hover">
          <span className="font-mono text-xs text-muted">Certifications</span>
          <p className="mt-1 font-display text-2xl font-bold text-text">
            {certifications.length}
          </p>
        </div>
      </div>

      {/* Navigation / Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/admin"
          className="rounded border border-border bg-surface px-4 py-2 font-mono text-xs text-text transition-colors hover:border-accent hover:bg-surface-hover"
        >
          Admin Portal →
        </Link>
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted hover:text-accent transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </main>
  )
}
