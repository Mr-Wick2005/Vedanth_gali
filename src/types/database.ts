// src/types/database.ts
// Database types matching the schema in supabase/migrations/20261023000000_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ProjectMetric {
  label: string
  value: string
}

export interface GalleryItem {
  path?: string
  url: string
  alt: string
  width?: number
  height?: number
  sort?: number
}

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profile: {
        Row: {
          id: string
          name: string
          headline: string
          short_bio: string
          long_bio: string
          location: string
          email: string
          availability_text: string
          avatar_url: string | null
          avatar_alt: string | null
          resume_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          headline: string
          short_bio: string
          long_bio: string
          location: string
          email: string
          availability_text?: string
          avatar_url?: string | null
          avatar_alt?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          headline?: string
          short_bio?: string
          long_bio?: string
          location?: string
          email?: string
          availability_text?: string
          avatar_url?: string | null
          avatar_alt?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          seo_title: string
          seo_description: string
          og_image_url: string | null
          og_image_alt: string | null
          availability_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seo_title?: string
          seo_description?: string
          og_image_url?: string | null
          og_image_alt?: string | null
          availability_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seo_title?: string
          seo_description?: string
          og_image_url?: string | null
          og_image_alt?: string | null
          availability_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          problem: string | null
          solution: string | null
          outcome: string | null
          role: string | null
          year: number | null
          stack: string[]
          live_url: string | null
          repo_url: string | null
          cover_image_url: string | null
          cover_image_alt: string | null
          gallery: Json
          metrics: Json
          featured: boolean
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          problem?: string | null
          solution?: string | null
          outcome?: string | null
          role?: string | null
          year?: number | null
          stack?: string[]
          live_url?: string | null
          repo_url?: string | null
          cover_image_url?: string | null
          cover_image_alt?: string | null
          gallery?: Json
          metrics?: Json
          featured?: boolean
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          problem?: string | null
          solution?: string | null
          outcome?: string | null
          role?: string | null
          year?: number | null
          stack?: string[]
          live_url?: string | null
          repo_url?: string | null
          cover_image_url?: string | null
          cover_image_alt?: string | null
          gallery?: Json
          metrics?: Json
          featured?: boolean
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company: string
          title: string
          start_date: string
          end_date: string | null
          period_label: string | null
          org_url: string | null
          description: string
          highlights: string[]
          logo_url: string | null
          logo_alt: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          title: string
          start_date: string
          end_date?: string | null
          period_label?: string | null
          org_url?: string | null
          description: string
          highlights?: string[]
          logo_url?: string | null
          logo_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          title?: string
          start_date?: string
          end_date?: string | null
          period_label?: string | null
          org_url?: string | null
          description?: string
          highlights?: string[]
          logo_url?: string | null
          logo_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          institution: string
          degree: string
          field: string
          start_year: number
          end_year: number
          status: string
          logo_url: string | null
          logo_alt: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          institution: string
          degree: string
          field: string
          start_year: number
          end_year: number
          status: string
          logo_url?: string | null
          logo_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          institution?: string
          degree?: string
          field?: string
          start_year?: number
          end_year?: number
          status?: string
          logo_url?: string | null
          logo_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          title: string
          issuer: string
          year: number
          credential_url: string | null
          image_url: string | null
          image_alt: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          issuer: string
          year: number
          credential_url?: string | null
          image_url?: string | null
          image_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          issuer?: string
          year?: number
          credential_url?: string | null
          image_url?: string | null
          image_alt?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          icon_key: string | null
          icon_url: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          icon_key?: string | null
          icon_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          icon_key?: string | null
          icon_url?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          label: string
          url: string
          display_text: string | null
          sort_order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          url: string
          display_text?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          url?: string
          display_text?: string | null
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}

export type ProfileRow = Database['public']['Tables']['profile']['Row']
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row']
export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ExperienceRow = Database['public']['Tables']['experience']['Row']
export type EducationRow = Database['public']['Tables']['education']['Row']
export type CertificationRow = Database['public']['Tables']['certifications']['Row']
export type SkillRow = Database['public']['Tables']['skills']['Row']
export type SocialLinkRow = Database['public']['Tables']['social_links']['Row']
