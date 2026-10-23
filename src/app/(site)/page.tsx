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

import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { SectionReveal } from '@/components/ui/SectionReveal'
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
        </div>
      </main>
    )
  }

  const [profile, projects, experience, education, certifications, skillsGrouped, socialLinks] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getExperience(),
      getEducation(),
      getCertifications(),
      getSkillsGrouped(),
      getSocialLinks(),
    ])

  const totalSkills = Object.values(skillsGrouped).reduce((acc, list) => acc + list.length, 0)

  const stats = {
    projectsCount: projects.length,
    experienceCount: experience.length,
    skillsCount: totalSkills,
    certsCount: certifications.length,
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name || 'Vedanth Gali',
    jobTitle: profile?.headline || 'Frontend & Full-Stack Developer',
    description: profile?.short_bio || 'Developer building scalable web platforms.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile?.location || 'Mumbai',
      addressCountry: 'IN',
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vedanthgali.dev',
    sameAs: socialLinks.map((s) => s.url).filter((u) => u.startsWith('http')),
  }

  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background text-text min-h-screen">
        {/* Sticky Navigation */}
        <Navigation resumeUrl={profile?.resume_url} />

        {/* Hero Section with R3F 3D Ring */}
        <Hero profile={profile} socialLinks={socialLinks} />

        {/* Section 01: About */}
        <SectionReveal>
          <About profile={profile} education={education} />
        </SectionReveal>

        {/* Section 02: Work */}
        <SectionReveal>
          <Work projects={projects} />
        </SectionReveal>

        {/* Section 03: Leadership with Scroll-Drawn Timeline */}
        <Leadership experience={experience} />

        {/* Section 04: Skills */}
        <SectionReveal>
          <Skills skillsGrouped={skillsGrouped} />
        </SectionReveal>

        {/* Section 05: Certifications */}
        <SectionReveal>
          <Certifications certifications={certifications} />
        </SectionReveal>

        {/* Section 06: Contact */}
        <SectionReveal>
          <Contact profile={profile} socialLinks={socialLinks} />
        </SectionReveal>

        {/* Footer */}
        <Footer socialLinks={socialLinks} stats={stats} />
      </div>
    </SmoothScrollProvider>
  )
}
