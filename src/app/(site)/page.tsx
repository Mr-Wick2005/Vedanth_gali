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
        <div className="border-border bg-surface w-full max-w-md rounded-lg border p-8 text-center">
          <div className="bg-accent/10 text-accent mb-4 inline-block rounded-full px-3 py-1 font-mono text-xs">
            SETUP REQUIRED
          </div>
          <h1 className="font-display text-text mb-2 text-2xl font-bold tracking-tight">
            Environment Setup
          </h1>
          <p className="text-muted mb-6 text-sm">
            Supabase environment variables are missing. Please configure{' '}
            <code className="bg-surface-hover text-accent rounded px-1.5 py-0.5 font-mono text-xs">
              .env.local
            </code>{' '}
            with your URL and publishable key.
          </p>
          <div className="border-border/50 bg-background/50 text-muted rounded border p-4 text-left font-mono text-xs">
            <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
            <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...</p>
          </div>
        </div>
      </main>
    )
  }

  const [profile, , projects, experience, , certifications, skillsGrouped, socialLinks] =
    await Promise.all([
      getProfile(),
      getSiteSettings(),
      getProjects(),
      getExperience(),
      getEducation(),
      getCertifications(),
      getSkillsGrouped(),
      getSocialLinks(),
    ])

  const totalSkills = Object.values(skillsGrouped).reduce((acc, list) => acc + list.length, 0)

  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-6 py-16">
      {/* Eyebrow Status */}
      <div className="mb-6 flex items-center gap-3">
        <span className="border-accent/30 bg-accent/10 text-accent inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs">
          <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />
          {profile?.availability_text || 'Open to work · Frontend / Full-Stack'}
        </span>
        <span className="text-muted font-mono text-xs">Environment & DB Connected</span>
      </div>

      {/* Two-tone Hero Identity */}
      <div className="mb-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-text">{profile?.name?.split(' ')[0] || 'Vedanth'} </span>
          <span className="text-accent">
            {profile?.name?.split(' ').slice(1).join(' ') || 'Gali'}
          </span>
        </h1>
        <p className="text-muted mt-2 text-lg sm:text-xl">
          {profile?.headline || 'Frontend & Full-Stack developer · Computer Engineering student'}
        </p>
      </div>

      {/* Short Bio */}
      <p className="text-muted max-w-2xl text-base leading-relaxed">
        {profile?.short_bio ||
          'Final-year Computer Engineering student at Mumbai University building high-impact web platforms with React, TypeScript, and Supabase.'}
      </p>

      {/* Live Computed Counts from Database */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-border bg-surface hover:border-border-hover rounded border p-4 transition-colors">
          <span className="text-muted font-mono text-xs">Projects</span>
          <p className="font-display text-text mt-1 text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="border-border bg-surface hover:border-border-hover rounded border p-4 transition-colors">
          <span className="text-muted font-mono text-xs">Leadership Roles</span>
          <p className="font-display text-text mt-1 text-2xl font-bold">{experience.length}</p>
        </div>
        <div className="border-border bg-surface hover:border-border-hover rounded border p-4 transition-colors">
          <span className="text-muted font-mono text-xs">Skills</span>
          <p className="font-display text-text mt-1 text-2xl font-bold">{totalSkills}</p>
        </div>
        <div className="border-border bg-surface hover:border-border-hover rounded border p-4 transition-colors">
          <span className="text-muted font-mono text-xs">Certifications</span>
          <p className="font-display text-text mt-1 text-2xl font-bold">{certifications.length}</p>
        </div>
      </div>

      {/* Navigation / Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href="/admin"
          className="border-border bg-surface text-text hover:border-accent hover:bg-surface-hover rounded border px-4 py-2 font-mono text-xs transition-colors"
        >
          Admin Portal →
        </Link>
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-muted hover:text-accent font-mono text-xs transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </main>
  )
}
