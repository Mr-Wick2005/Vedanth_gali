import { createPublicClient } from '@/lib/supabase/server'
import type {
  ProfileRow,
  SiteSettingsRow,
  ProjectRow,
  ExperienceRow,
  EducationRow,
  CertificationRow,
  SkillRow,
  SocialLinkRow,
} from '@/types/database'
import {
  FALLBACK_PROFILE,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_PROJECTS,
  FALLBACK_EXPERIENCE,
  FALLBACK_EDUCATION,
  FALLBACK_CERTIFICATIONS,
  FALLBACK_SKILLS,
  FALLBACK_SOCIAL_LINKS,
} from './fallback'

/**
 * Checks if Supabase credentials exist in the runtime environment.
 */
export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )
}

/**
 * Helper to group skills by category preserving order
 */
function groupSkills(skills: SkillRow[]): Record<string, SkillRow[]> {
  const grouped: Record<string, SkillRow[]> = {}
  for (const skill of skills) {
    const cat = skill.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(skill)
  }
  return grouped
}

/**
 * Fetch profile row (single row)
 */
export async function getProfile(): Promise<ProfileRow | null> {
  if (!hasSupabaseEnv()) return FALLBACK_PROFILE

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle()

    if (error) {
      console.warn('Supabase profile query notice:', error.message)
      return FALLBACK_PROFILE
    }

    return data || FALLBACK_PROFILE
  } catch {
    return FALLBACK_PROFILE
  }
}

/**
 * Fetch site settings (single row)
 */
export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  if (!hasSupabaseEnv()) return FALLBACK_SITE_SETTINGS

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

    if (error) {
      console.warn('Supabase site_settings query notice:', error.message)
      return FALLBACK_SITE_SETTINGS
    }

    return data || FALLBACK_SITE_SETTINGS
  } catch {
    return FALLBACK_SITE_SETTINGS
  }
}

/**
 * Fetch published projects, ordered by sort_order ascending
 */
export async function getProjects(options?: { featuredOnly?: boolean }): Promise<ProjectRow[]> {
  if (!hasSupabaseEnv()) return FALLBACK_PROJECTS

  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (options?.featuredOnly) {
      query = query.eq('featured', true)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase projects query notice:', error.message)
      return FALLBACK_PROJECTS
    }

    return data
  } catch {
    return FALLBACK_PROJECTS
  }
}

/**
 * Fetch single project by its unique slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  if (!hasSupabaseEnv()) {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null
  }

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !data) {
      if (error) console.warn(`Supabase project query notice (${slug}):`, error.message)
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null
    }

    return data
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null
  }
}

/**
 * Fetch published work experience / leadership roles
 */
export async function getExperience(): Promise<ExperienceRow[]> {
  if (!hasSupabaseEnv()) return FALLBACK_EXPERIENCE

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase experience query notice:', error.message)
      return FALLBACK_EXPERIENCE
    }

    return data
  } catch {
    return FALLBACK_EXPERIENCE
  }
}

/**
 * Fetch published education records
 */
export async function getEducation(): Promise<EducationRow[]> {
  if (!hasSupabaseEnv()) return FALLBACK_EDUCATION

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase education query notice:', error.message)
      return FALLBACK_EDUCATION
    }

    return data
  } catch {
    return FALLBACK_EDUCATION
  }
}

/**
 * Fetch published certifications
 */
export async function getCertifications(): Promise<CertificationRow[]> {
  if (!hasSupabaseEnv()) return FALLBACK_CERTIFICATIONS

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase certifications query notice:', error.message)
      return FALLBACK_CERTIFICATIONS
    }

    return data
  } catch {
    return FALLBACK_CERTIFICATIONS
  }
}

/**
 * Fetch published skills, grouped by category preserving sort_order
 */
export async function getSkillsGrouped(): Promise<Record<string, SkillRow[]>> {
  if (!hasSupabaseEnv()) return groupSkills(FALLBACK_SKILLS)

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase skills query notice:', error.message)
      return groupSkills(FALLBACK_SKILLS)
    }

    return groupSkills(data as SkillRow[])
  } catch {
    return groupSkills(FALLBACK_SKILLS)
  }
}

/**
 * Fetch published social links (including Phone)
 */
export async function getSocialLinks(): Promise<SocialLinkRow[]> {
  if (!hasSupabaseEnv()) return FALLBACK_SOCIAL_LINKS

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase social_links query notice:', error.message)
      return FALLBACK_SOCIAL_LINKS
    }

    return data
  } catch {
    return FALLBACK_SOCIAL_LINKS
  }
}
