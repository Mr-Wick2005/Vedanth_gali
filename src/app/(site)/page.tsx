import type { Metadata } from 'next'
import {
  getProfile,
  getProjects,
  getExperience,
  getEducation,
  getCertifications,
  getSkillsGrouped,
  getSocialLinks,
  getSiteSettings,
  getNavItems,
  getSections,
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
import type { SectionRow } from '@/types/database'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ])

  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedanthgali.dev'
  const siteUrl = rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
    ? rawSiteUrl
    : `https://${rawSiteUrl}`

  const title = settings?.seo_title || `${profile?.name || 'Vedanth Gali'} | ${profile?.headline || 'Frontend & Full-Stack Developer'}`
  const description = settings?.seo_description || profile?.short_bio || 'Developer building scalable web platforms.'
  const ogImage = settings?.og_image_url || '/og-image.png'
  const ogAlt = settings?.og_image_alt || title

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      images: [{ url: ogImage, alt: ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function HomePage() {
  const [
    profile,
    projects,
    experience,
    education,
    certifications,
    skillsGrouped,
    socialLinks,
    siteSettings,
    navItems,
    sections,
  ] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getSkillsGrouped(),
    getSocialLinks(),
    getSiteSettings(),
    getNavItems(),
    getSections(),
  ])

  const stats = {
    projectsCount: projects.length,
    leadershipCount: experience.length,
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

  // Filter and sort visible published sections by order_index
  const orderedSections = [...sections]
    .filter((s) => s.is_visible && s.status === 'published')
    .sort((a, b) => a.order_index - b.order_index)

  // Dispatch renderer by section type
  const renderSection = (section: SectionRow) => {
    const content = section.content as Record<string, unknown> | null
    const style = section.style as Record<string, unknown> | null

    switch (section.type) {
      case 'hero':
        return (
          <Hero
            key={section.id}
            profile={profile}
            socialLinks={socialLinks}
            content={content}
            style={style}
          />
        )
      case 'about':
        return (
          <About
            key={section.id}
            profile={profile}
            education={education}
            stats={stats}
            content={content}
            style={style}
          />
        )
      case 'work':
        return (
          <Work
            key={section.id}
            projects={projects}
            content={content}
            style={style}
          />
        )
      case 'marquee_band':
        return (
          <BigTypeBand
            key={section.id}
            content={content}
            style={style}
          />
        )
      case 'stack':
        return (
          <Skills
            key={section.id}
            skillsGrouped={skillsGrouped}
            projects={projects}
            content={content}
            style={style}
          />
        )
      case 'leadership':
        return (
          <Leadership
            key={section.id}
            experience={experience}
            content={content}
            style={style}
          />
        )
      case 'credentials':
        return (
          <Certifications
            key={section.id}
            certifications={certifications}
            content={content}
            style={style}
          />
        )
      case 'contact':
        return (
          <div id="contact" key={section.id}>
            <Footer
              socialLinks={socialLinks}
              email={profile?.email || 'vedanthmgali@gmail.com'}
              content={content}
              style={style}
            />
          </div>
        )
      case 'custom':
        return (
          <section
            key={section.id}
            className="w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24"
          >
            <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
              {typeof content?.heading === 'string' && (
                <h2 className="mb-6 font-display text-3xl font-extrabold uppercase text-white">
                  {content.heading}
                </h2>
              )}
              {typeof content?.body === 'string' && (
                <div
                  className="prose prose-invert max-w-none text-slate-300"
                  dangerouslySetInnerHTML={{ __html: content.body }}
                />
              )}
            </div>
          </section>
        )
      default:
        return null
    }
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
      <div className="bg-background text-text min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Skip to Main Content Link for Screen Readers & Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-full focus:bg-violet-600 focus:px-5 focus:py-2.5 focus:font-mono focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Dynamic Sticky Navigation */}
        <Navigation
          resumeUrl={profile?.resume_url}
          navItems={navItems}
          siteTitle={siteSettings?.site_title}
        />

        <main id="main-content" className="w-full max-w-full overflow-x-hidden">
          {orderedSections.map(renderSection)}
        </main>
      </div>
    </SmoothScrollProvider>
  )
}
