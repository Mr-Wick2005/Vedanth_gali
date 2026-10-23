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
 * Fetch profile row (single row)
 */
export async function getProfile(): Promise<ProfileRow | null> {
  if (!hasSupabaseEnv()) return null

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in getProfile:', err)
    return null
  }
}

/**
 * Fetch site settings (single row)
 */
export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  if (!hasSupabaseEnv()) return null

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()

    if (error) {
      console.error('Error fetching site_settings:', error.message)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error in getSiteSettings:', err)
    return null
  }
}

/**
 * Fetch published projects, ordered by sort_order ascending
 */
export async function getProjects(options?: { featuredOnly?: boolean }): Promise<ProjectRow[]> {
  if (!hasSupabaseEnv()) return []

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

    if (error) {
      console.error('Error fetching projects:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error('Unexpected error in getProjects:', err)
    return []
  }
}

/**
 * Fetch single project by its unique slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  if (!hasSupabaseEnv()) return null

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error(`Error fetching project for slug "${slug}":`, error.message)
      return null
    }

    return data
  } catch (err) {
    console.error(`Unexpected error in getProjectBySlug (${slug}):`, err)
    return null
  }
}

/**
 * Fetch published work experience / leadership roles
 */
export async function getExperience(): Promise<ExperienceRow[]> {
  if (!hasSupabaseEnv()) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching experience:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error('Unexpected error in getExperience:', err)
    return []
  }
}

/**
 * Fetch published education records
 */
export async function getEducation(): Promise<EducationRow[]> {
  if (!hasSupabaseEnv()) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching education:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error('Unexpected error in getEducation:', err)
    return []
  }
}

/**
 * Fetch published certifications
 */
export async function getCertifications(): Promise<CertificationRow[]> {
  if (!hasSupabaseEnv()) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching certifications:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error('Unexpected error in getCertifications:', err)
    return []
  }
}

/**
 * Fetch published skills, grouped by category preserving sort_order
 */
export async function getSkillsGrouped(): Promise<Record<string, SkillRow[]>> {
  if (!hasSupabaseEnv()) return {}

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching skills:', error.message)
      return {}
    }

    const skills = (data ?? []) as SkillRow[]
    const grouped: Record<string, SkillRow[]> = {}
    for (const skill of skills) {
      const cat = skill.category
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(skill)
    }

    return grouped
  } catch (err) {
    console.error('Unexpected error in getSkillsGrouped:', err)
    return {}
  }
}

/**
 * Fetch published social links (including Phone)
 */
export async function getSocialLinks(): Promise<SocialLinkRow[]> {
  if (!hasSupabaseEnv()) return []

  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching social links:', error.message)
      return []
    }

    return data ?? []
  } catch (err) {
    console.error('Unexpected error in getSocialLinks:', err)
    return []
  }
}
