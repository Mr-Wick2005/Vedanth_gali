import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/admin/SignOutButton'
import {
  Layers,
  Compass,
  FileImage,
  Type,
  Settings,
  Briefcase,
  Award,
  GraduationCap,
  Code2,
  Share2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch quick counts safely
  let sectionsCount = 0
  let navCount = 0
  let mediaCount = 0
  let projectsCount = 0
  let expCount = 0
  let certsCount = 0
  let skillsCount = 0

  try {
    const [
      { count: sCount },
      { count: nCount },
      { count: mCount },
      { count: pCount },
      { count: eCount },
      { count: cCount },
      { count: skCount },
    ] = await Promise.all([
      supabase.from('sections').select('*', { count: 'exact', head: true }),
      supabase.from('nav_items').select('*', { count: 'exact', head: true }),
      supabase.from('media').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('experience').select('*', { count: 'exact', head: true }),
      supabase.from('certifications').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
    ])

    sectionsCount = sCount ?? 0
    navCount = nCount ?? 0
    mediaCount = mCount ?? 0
    projectsCount = pCount ?? 0
    expCount = eCount ?? 0
    certsCount = cCount ?? 0
    skillsCount = skCount ?? 0
  } catch {
    // Defaults on first run
  }

  const primaryTools = [
    {
      title: 'Sections Manager',
      description: 'Reorder sections via drag-and-drop, toggle visibility, and edit per-section content and layout.',
      href: '/admin/sections',
      count: `${sectionsCount || 8} sections`,
      icon: Layers,
      highlight: true,
    },
    {
      title: 'Navigation Editor',
      description: 'Add, remove, reorder, rename navbar links, and configure magnetic CTA buttons.',
      href: '/admin/navigation',
      count: `${navCount || 7} links`,
      icon: Compass,
      highlight: true,
    },
    {
      title: 'Media Library',
      description: 'Upload, manage, and attach images and video files with drag-and-drop support.',
      href: '/admin/media',
      count: `${mediaCount} files`,
      icon: FileImage,
      highlight: true,
    },
    {
      title: 'Typography & Fonts',
      description: 'Configure Google Fonts, upload custom font files, and assign element typography.',
      href: '/admin/typography',
      count: 'Configured',
      icon: Type,
      highlight: false,
    },
    {
      title: 'Global Settings',
      description: 'Site title, favicon, OpenGraph metadata, SEO tags, and color theme parameters.',
      href: '/admin/settings',
      count: 'Active',
      icon: Settings,
      highlight: false,
    },
  ]

  const dataModules = [
    {
      title: 'Projects',
      description: 'Manage flagship case studies, metrics, tech stack, and live demo links.',
      href: '/admin/projects',
      count: `${projectsCount} items`,
      icon: Briefcase,
    },
    {
      title: 'Experience & Leadership',
      description: 'Manage conference coordinator roles, timeline highlights, and operations.',
      href: '/admin/experience',
      count: `${expCount} items`,
      icon: Award,
    },
    {
      title: 'Certifications',
      description: 'Manage verified academic and industry qualifications and credential IDs.',
      href: '/admin/certifications',
      count: `${certsCount} items`,
      icon: GraduationCap,
    },
    {
      title: 'Skills & Tech Stack',
      description: 'Categorized technical proficiencies mapped to active production platforms.',
      href: '/admin/skills',
      count: `${skillsCount} skills`,
      icon: Code2,
    },
    {
      title: 'Social & Networks',
      description: 'GitHub, LinkedIn, Email, Phone, and footer network links.',
      href: '/admin/socials',
      count: 'Configured',
      icon: Share2,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 shadow-xl">
        <div>
          <span className="font-mono text-xs text-blue-400 font-semibold tracking-wider uppercase">
            ADMINISTRATION DASHBOARD
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
            Site Control Center
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1 max-w-xl">
            Signed in as <strong className="text-white">{user?.email}</strong>. Every edit directly updates Supabase and automatically refreshes public cache on publish.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-slate-300 hover:text-white hover:border-white/20 transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* Primary Landing Page Controllers */}
      <div>
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Core Landing Page Controllers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryTools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all hover:-translate-y-0.5 shadow-lg ${
                  tool.highlight
                    ? 'border-blue-500/30 bg-gradient-to-br from-[#0e121e] to-[#0a0c14] hover:border-blue-500/60'
                    : 'border-white/10 bg-[#0a0c14] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      <IconComponent size={18} />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{tool.count}</span>
                  </div>

                  <h3 className="mt-3.5 font-display text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-xs text-slate-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 font-mono text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Data Records & Repositories */}
      <div>
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Content Records &amp; Data Hub
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dataModules.map((mod) => {
            const IconComponent = mod.icon
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#0a0c14] p-5 transition-all hover:border-white/20 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-300 border border-white/10">
                      <IconComponent size={16} />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{mod.count}</span>
                  </div>

                  <h3 className="mt-3 font-display text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-slate-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 font-mono text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span>Manage</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
