import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/SignOutButton'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch quick row counts
  const [
    { count: projectsCount },
    { count: expCount },
    { count: eduCount },
    { count: certsCount },
    { count: skillsCount },
    { count: socialsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('experience').select('*', { count: 'exact', head: true }),
    supabase.from('education').select('*', { count: 'exact', head: true }),
    supabase.from('certifications').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('social_links').select('*', { count: 'exact', head: true }),
  ])

  const sections = [
    {
      title: 'Profile',
      description: 'Edit personal bio, headline, availability, and avatar.',
      href: '/admin/profile',
      count: '1 record',
    },
    {
      title: 'Projects',
      description: 'Manage case studies, metrics, tech stack, and publishing status.',
      href: '/admin/projects',
      count: `${projectsCount ?? 0} items`,
    },
    {
      title: 'Experience & Leadership',
      description: 'Manage conference coordinator and technical head positions.',
      href: '/admin/experience',
      count: `${expCount ?? 0} items`,
    },
    {
      title: 'Education',
      description: 'Manage university degree, institution, and years.',
      href: '/admin/education',
      count: `${eduCount ?? 0} items`,
    },
    {
      title: 'Certifications',
      description: 'NPTEL, EduPyramids, Forage certifications and credentials.',
      href: '/admin/certifications',
      count: `${certsCount ?? 0} items`,
    },
    {
      title: 'Skills',
      description: 'Categorized technical skills (Frontend, Languages, Backend, etc.).',
      href: '/admin/skills',
      count: `${skillsCount ?? 0} items`,
    },
    {
      title: 'Social Links',
      description: 'GitHub, LinkedIn, Email, and public Phone number.',
      href: '/admin/socials',
      count: `${socialsCount ?? 0} items`,
    },
    {
      title: 'Site Settings',
      description: 'Manage global SEO title, description, and OG metadata.',
      href: '/admin/settings',
      count: 'Configured',
    },
  ]

  return (
    <div>
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <span className="font-mono text-xs text-accent">MANAGEMENT DASHBOARD</span>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-text">
            Signed in as {user?.email}
          </h1>
          <p className="mt-1 text-xs text-muted">
            All content updates directly revalidate affected public routes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SignOutButton />
        </div>
      </div>

      {/* CRUD Section Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-lg border border-border bg-surface p-5 transition-all hover:border-accent hover:bg-surface-hover hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-text group-hover:text-accent transition-colors">
                {section.title}
              </h2>
              <span className="font-mono text-xs text-muted">
                {section.count}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {section.description}
            </p>
            <div className="mt-4 flex items-center font-mono text-xs text-accent">
              <span>Manage →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
