'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteSettingsRow } from '@/types/database'
import { updateSiteSettings } from '@/lib/actions/settings'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface SettingsFormProps {
  initialSettings: SiteSettingsRow | null
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: initialSettings?.id || '',
    seo_title: initialSettings?.seo_title || '',
    seo_description: initialSettings?.seo_description || '',
    og_image_url: initialSettings?.og_image_url || '',
    og_image_alt: initialSettings?.og_image_alt || '',
    availability_visible: initialSettings?.availability_visible ?? true,
  })

  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    try {
      const res = await updateSiteSettings({
        ...formData,
        og_image_url: formData.og_image_url || null,
        og_image_alt: formData.og_image_alt || null,
      })

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Site settings updated successfully.' })
        router.refresh()
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update settings.' })
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {statusMessage && (
        <div
          className={`rounded border p-4 font-mono text-sm ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* SEO metadata */}
      <div className="border-border bg-surface space-y-4 rounded-lg border p-6">
        <h2 className="font-display text-text text-lg font-semibold">SEO & Meta Configuration</h2>

        <div>
          <label className="text-muted mb-1 block font-mono text-xs">Global SEO Title *</label>
          <input
            type="text"
            name="seo_title"
            required
            value={formData.seo_title}
            onChange={handleChange}
            className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="text-muted mb-1 block font-mono text-xs">Meta Description *</label>
          <textarea
            name="seo_description"
            required
            rows={3}
            value={formData.seo_description}
            onChange={handleChange}
            className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
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
              className="accent-accent h-4 w-4 rounded"
            />
            <span className="text-text font-mono text-sm">
              Display &ldquo;Available for hire&rdquo; indicator badge on public site
            </span>
          </label>
        </div>
      </div>

      {/* Open Graph Image */}
      <div className="border-border bg-surface rounded-lg border p-6">
        <h2 className="font-display text-text mb-4 text-lg font-semibold">
          Open Graph / Social Card Image
        </h2>
        <p className="text-muted mb-4 text-xs">
          Recommended: 1200×630px image for social sharing previews on LinkedIn, Twitter/X, and
          messaging apps.
        </p>
        <ImageUploader
          folder="og"
          label="Upload Open Graph Image"
          initialUrl={formData.og_image_url}
          initialAlt={formData.og_image_alt}
          onUploadComplete={(meta) => {
            setFormData((prev) => ({
              ...prev,
              og_image_url: meta.url,
              og_image_alt: meta.alt,
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
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-6 py-2.5 font-mono text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
