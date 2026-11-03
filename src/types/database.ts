// src/types/database.ts
// Database types matching the schema in supabase/migrations/20261023000000_initial_schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface ProjectMetric {
  label: string
  value: string
}

export interface GalleryItem {
  path?: string
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  sort?: number
  order?: number
  isCover?: boolean
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
        Relationships: []
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
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          seo_title: string
          seo_description: string
          og_image_url: string | null
          og_image_alt: string | null
          availability_visible: boolean
          site_title?: string
          site_description?: string
          site_keywords?: string[]
          site_url?: string
          author_name?: string
          author_email?: string
          author_location?: string
          favicon_url?: string | null
          theme_mode?: string
          accent_color_primary?: string
          accent_color_secondary?: string
          bg_base_color?: string
          surface_color?: string
          display_font_family?: string
          body_font_family?: string
          mono_font_family?: string
          social_links?: Json
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
          site_title?: string
          site_description?: string
          site_keywords?: string[]
          site_url?: string
          author_name?: string
          author_email?: string
          author_location?: string
          favicon_url?: string | null
          theme_mode?: string
          accent_color_primary?: string
          accent_color_secondary?: string
          bg_base_color?: string
          surface_color?: string
          display_font_family?: string
          body_font_family?: string
          mono_font_family?: string
          social_links?: Json
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
          site_title?: string
          site_description?: string
          site_keywords?: string[]
          site_url?: string
          author_name?: string
          author_email?: string
          author_location?: string
          favicon_url?: string | null
          theme_mode?: string
          accent_color_primary?: string
          accent_color_secondary?: string
          bg_base_color?: string
          surface_color?: string
          display_font_family?: string
          body_font_family?: string
          mono_font_family?: string
          social_links?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          id: string
          key: string
          type: string
          order_index: number
          is_visible: boolean
          status: 'draft' | 'published'
          published_at: string | null
          content: Json
          style: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          type: string
          order_index?: number
          is_visible?: boolean
          status?: 'draft' | 'published'
          published_at?: string | null
          content?: Json
          style?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          type?: string
          order_index?: number
          is_visible?: boolean
          status?: 'draft' | 'published'
          published_at?: string | null
          content?: Json
          style?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_versions: {
        Row: {
          id: string
          section_id: string
          content: Json
          style: Json
          status: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          content: Json
          style: Json
          status: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          content?: Json
          style?: Json
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          id: string
          label: string
          href: string
          order_index: number
          is_visible: boolean
          is_cta: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          label: string
          href: string
          order_index?: number
          is_visible?: boolean
          is_cta?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          href?: string
          order_index?: number
          is_visible?: boolean
          is_cta?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          id: string
          bucket_path: string
          public_url: string
          type: 'image' | 'video'
          alt_text: string | null
          mime: string | null
          size: number | null
          width: number | null
          height: number | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bucket_path: string
          public_url: string
          type: 'image' | 'video'
          alt_text?: string | null
          mime?: string | null
          size?: number | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bucket_path?: string
          public_url?: string
          type?: 'image' | 'video'
          alt_text?: string | null
          mime?: string | null
          size?: number | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_media: {
        Row: {
          id: string
          section_id: string
          media_id: string
          order_index: number
          role: string | null
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          media_id: string
          order_index?: number
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          media_id?: string
          order_index?: number
          role?: string | null
          created_at?: string
        }
        Relationships: []
      }
      fonts: {
        Row: {
          id: string
          name: string
          source: 'google' | 'uploaded'
          file_path: string | null
          weights: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          source: 'google' | 'uploaded'
          file_path?: string | null
          weights?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          source?: 'google' | 'uploaded'
          file_path?: string | null
          weights?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          cover_video_url?: string | null
          cover_video_poster_url?: string | null
          gallery: Json
          images?: Json
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
          cover_video_url?: string | null
          cover_video_poster_url?: string | null
          gallery?: Json
          images?: Json
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
          cover_video_url?: string | null
          cover_video_poster_url?: string | null
          gallery?: Json
          images?: Json
          metrics?: Json
          featured?: boolean
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          image_url?: string | null
          image_alt?: string | null
          gallery?: Json
          images?: Json
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
          image_url?: string | null
          image_alt?: string | null
          gallery?: Json
          images?: Json
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
          image_url?: string | null
          image_alt?: string | null
          gallery?: Json
          images?: Json
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          image_url?: string | null
          image_alt?: string | null
          gallery?: Json
          images?: Json
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
        Relationships: []
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
          gallery?: Json
          images?: Json
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
          gallery?: Json
          images?: Json
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
          gallery?: Json
          images?: Json
          sort_order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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

export type SectionRow = Database['public']['Tables']['sections']['Row']
export type SectionInsert = Database['public']['Tables']['sections']['Insert']
export type SectionUpdate = Database['public']['Tables']['sections']['Update']

export type SectionVersionRow = Database['public']['Tables']['section_versions']['Row']

export type NavItemRow = Database['public']['Tables']['nav_items']['Row']
export type NavItemInsert = Database['public']['Tables']['nav_items']['Insert']
export type NavItemUpdate = Database['public']['Tables']['nav_items']['Update']

export type MediaRow = Database['public']['Tables']['media']['Row']
export type MediaInsert = Database['public']['Tables']['media']['Insert']
export type MediaUpdate = Database['public']['Tables']['media']['Update']

export type SectionMediaRow = Database['public']['Tables']['section_media']['Row']
export type SectionMediaInsert = Database['public']['Tables']['section_media']['Insert']

export type FontRow = Database['public']['Tables']['fonts']['Row']
export type FontInsert = Database['public']['Tables']['fonts']['Insert']
export type FontUpdate = Database['public']['Tables']['fonts']['Update']
