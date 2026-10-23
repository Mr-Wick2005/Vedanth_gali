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
import { Grain } from '@/components/motion/Grain'
import { Cursor } from '@/components/motion/Cursor'
import { Preloader } from '@/components/motion/Preloader'
import { Navigation } from '@/components/sections/Navigation'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Work } from '@/components/sections/Work'
import { BigTypeBand } from '@/components/sections/BigTypeBand'
import { Leadership } from '@/components/sections/Leadership'
import { Skills } from '@/components/sections/Skills'
import { Certifications } from '@/components/sections/Certifications'
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
      <Preloader />
      <Grain />
      <Cursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background text-text min-h-screen">
        {/* Skip to Main Content Link for Screen Readers & Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-full focus:bg-violet-600 focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Sticky Navigation */}
        <Navigation resumeUrl={profile?.resume_url} />

        <main id="main-content">
          {/* Hero Section with R3F 3D Ring */}
          <Hero profile={profile} socialLinks={socialLinks} />

          {/* Section 03: About & 3D ID Card */}
          <About
            profile={profile}
            education={education}
            stats={{
              projectsCount: projects.length,
              leadershipCount: experience.length,
              certsCount: certifications.length,
            }}
          />

          {/* Section 04: Work (Stacked Deck) */}
          <Work projects={projects} />

          {/* Section 05: Big-Type Velocity Marquee Band */}
          <BigTypeBand />

          {/* Section 06: Stack Matrix (with cross-project mapping) */}
          <Skills skillsGrouped={skillsGrouped} projects={projects} />

          {/* Section 07: Leadership with Scroll-Drawn Timeline */}
          <Leadership experience={experience} />

          {/* Section 08: Credentials & Certifications Rail */}
          <Certifications certifications={certifications} />
        </main>

        {/* Section 09: Kinetic Contact Stage & Editorial Footer */}
        <div id="contact">
          <Footer socialLinks={socialLinks} email={profile?.email || 'vedanthgali@gmail.com'} />
        </div>
      </div>
    </SmoothScrollProvider>
  )
}
