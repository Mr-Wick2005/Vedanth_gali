'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteSettingsRow } from '@/types/database'
import { updateSiteSettings } from '@/lib/actions/settings'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { useToast } from '@/components/admin/ToastContext'

interface SettingsFormProps {
  initialSettings: SiteSettingsRow | null
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    id: initialSettings?.id || '',
    site_title: initialSettings?.site_title || initialSettings?.seo_title || '',
    site_description: initialSettings?.site_description || initialSettings?.seo_description || '',
    site_url: initialSettings?.site_url || 'https://vedanthgali.dev',
    author_name: initialSettings?.author_name || 'Vedanth Gali',
    author_email: initialSettings?.author_email || 'vedanthmgali@gmail.com',
    author_location: initialSettings?.author_location || 'Mumbai, IN',
    seo_title: initialSettings?.seo_title || '',
    seo_description: initialSettings?.seo_description || '',
    og_image_url: initialSettings?.og_image_url || '',
    og_image_alt: initialSettings?.og_image_alt || '',
    favicon_url: initialSettings?.favicon_url || '/favicon.ico',
    theme_mode: initialSettings?.theme_mode || 'dark',
    accent_color_primary: initialSettings?.accent_color_primary || '#3b82f6',
    accent_color_secondary: initialSettings?.accent_color_secondary || '#ec4899',
    bg_base_color: initialSettings?.bg_base_color || '#05060a',
    surface_color: initialSettings?.surface_color || '#0a0c14',
    availability_visible: initialSettings?.availability_visible ?? true,
  })

  const [saving, setSaving] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await updateSiteSettings({
        ...formData,
        og_image_url: formData.og_image_url || null,
        og_image_alt: formData.og_image_alt || null,
        favicon_url: formData.favicon_url || null,
      })

      if (res.success) {
        showToast('Site settings updated successfully', 'success')
        router.refresh()
      } else {
        showToast(res.error || 'Failed to update settings', 'error')
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Identity Configuration */}
      <div className="border border-white/10 bg-[#0a0c14] space-y-4 rounded-xl p-6 sm:p-8">
        <h2 className="font-display text-white text-lg font-bold uppercase tracking-tight">
          General Site Configuration
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-slate-400 mb-1 block font-mono text-xs">Site Title *</label>
            <input
              type="text"
              name="site_title"
              required
              value={formData.site_title}
              onChange={handleChange}
              className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 mb-1 block font-mono text-xs">Canonical Site URL</label>
            <input
              type="text"
              name="site_url"
              value={formData.site_url}
              onChange={handleChange}
              className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-slate-400 mb-1 block font-mono text-xs">Author Name</label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 mb-1 block font-mono text-xs">Contact Email</label>
            <input
              type="email"
              name="author_email"
              value={formData.author_email}
              onChange={handleChange}
              className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 mb-1 block font-mono text-xs">Location</label>
            <input
              type="text"
              name="author_location"
              value={formData.author_location}
              onChange={handleChange}
              className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SEO & Meta Configuration */}
      <div className="border border-white/10 bg-[#0a0c14] space-y-4 rounded-xl p-6 sm:p-8">
        <h2 className="font-display text-white text-lg font-bold uppercase tracking-tight">
          SEO &amp; Search Engine Indexing
        </h2>

        <div>
          <label className="text-slate-400 mb-1 block font-mono text-xs">SEO Meta Title *</label>
          <input
            type="text"
            name="seo_title"
            required
            value={formData.seo_title}
            onChange={handleChange}
            className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full rounded-lg px-3.5 py-2 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-400 mb-1 block font-mono text-xs">Meta Description *</label>
          <textarea
            name="seo_description"
            required
            rows={3}
            value={formData.seo_description}
            onChange={handleChange}
            className="border border-white/10 bg-black/60 text-white focus:border-blue-500 w-full resize-y rounded-lg px-3.5 py-2 text-sm focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="availability_visible"
              checked={formData.availability_visible}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, availability_visible: e.target.checked }))
              }
              className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0"
            />
            <span className="text-slate-200 font-mono text-xs">
              Display &ldquo;Open to work / Available&rdquo; status badge on public landing page
            </span>
          </label>
        </div>
      </div>

      {/* Theme Colors Configuration */}
      <div className="border border-white/10 bg-[#0a0c14] space-y-4 rounded-xl p-6 sm:p-8">
        <h2 className="font-display text-white text-lg font-bold uppercase tracking-tight">
          Global Theme &amp; Brand Accent Colors
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-slate-400 mb-1.5 block font-mono text-xs">Primary Accent (Electric Blue)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="accent_color_primary"
                value={formData.accent_color_primary}
                onChange={handleChange}
                className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
              />
              <input
                type="text"
                name="accent_color_primary"
                value={formData.accent_color_primary}
                onChange={handleChange}
                className="border border-white/10 bg-black/60 text-white w-full rounded-lg px-3 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1.5 block font-mono text-xs">Secondary Accent (Warm Magenta)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="accent_color_secondary"
                value={formData.accent_color_secondary}
                onChange={handleChange}
                className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
              />
              <input
                type="text"
                name="accent_color_secondary"
                value={formData.accent_color_secondary}
                onChange={handleChange}
                className="border border-white/10 bg-black/60 text-white w-full rounded-lg px-3 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1.5 block font-mono text-xs">Void Base Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="bg_base_color"
                value={formData.bg_base_color}
                onChange={handleChange}
                className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
              />
              <input
                type="text"
                name="bg_base_color"
                value={formData.bg_base_color}
                onChange={handleChange}
                className="border border-white/10 bg-black/60 text-white w-full rounded-lg px-3 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 mb-1.5 block font-mono text-xs">Card Surface Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="surface_color"
                value={formData.surface_color}
                onChange={handleChange}
                className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
              />
              <input
                type="text"
                name="surface_color"
                value={formData.surface_color}
                onChange={handleChange}
                className="border border-white/10 bg-black/60 text-white w-full rounded-lg px-3 py-1.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Open Graph Image */}
      <div className="border border-white/10 bg-[#0a0c14] rounded-xl p-6 sm:p-8">
        <h2 className="font-display text-white mb-2 text-lg font-bold uppercase tracking-tight">
          Open Graph / Social Card Image
        </h2>
        <p className="text-slate-400 mb-4 font-mono text-xs">
          Recommended: 1200×630px image for social sharing previews on LinkedIn, Twitter/X, and messaging platforms.
        </p>
        <MediaUploader
          folder="og"
          mode="image"
          label="Open Graph / Social Card Image"
          helpText="Recommended: 1200×630px image for social sharing previews"
          initialUrl={formData.og_image_url}
          initialAlt={formData.og_image_alt}
          onUploadComplete={(meta) => {
            setFormData((prev) => ({
              ...prev,
              og_image_url: meta.url,
              og_image_alt: meta.alt || '',
            }))
          }}
          onRemove={() => {
            setFormData((prev) => ({
              ...prev,
              og_image_url: '',
              og_image_alt: '',
            }))
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-lg px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          {saving ? 'Saving Settings...' : 'Save All Settings'}
        </button>
      </div>
    </form>
  )
}
