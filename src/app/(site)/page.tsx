import {
  getProfile,
  getProjects,
  getExperience,
  getEducation,
  getCertifications,
  getSkillsGrouped,
  getSocialLinks,
  hasSupabaseEnv,
} from '@/lib/content'

import { Navigation } from '@/components/sections/Navigation'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Work } from '@/components/sections/Work'
import { Leadership } from '@/components/sections/Leadership'
import { Skills } from '@/components/sections/Skills'
import { Certifications } from '@/components/sections/Certifications'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

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
        </div>
      </main>
    )
  }

  const [
    profile,
    projects,
    experience,
    education,
    certifications,
    skillsGrouped,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
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

  const stats = {
    projectsCount: projects.length,
    experienceCount: experience.length,
    skillsCount: totalSkills,
    certsCount: certifications.length,
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {/* 1. Sticky Navigation */}
      <Navigation resumeUrl={profile?.resume_url} />

      {/* 2. Hero Section */}
      <Hero profile={profile} socialLinks={socialLinks} />

      {/* 3. Section 01: About */}
      <About profile={profile} education={education} />

      {/* 4. Section 02: Work */}
      <Work projects={projects} />

      {/* 5. Section 03: Leadership */}
      <Leadership experience={experience} />

      {/* 6. Section 04: Skills */}
      <Skills skillsGrouped={skillsGrouped} />

      {/* 7. Section 05: Certifications */}
      <Certifications certifications={certifications} />

      {/* 8. Section 06: Contact */}
      <Contact profile={profile} socialLinks={socialLinks} />

      {/* 9. Footer */}
      <Footer socialLinks={socialLinks} stats={stats} />
    </div>
  )
}
