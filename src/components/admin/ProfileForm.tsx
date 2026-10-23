'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProfileRow } from '@/types/database'
import { updateProfile } from '@/lib/actions/profile'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { FileUploader } from '@/components/admin/FileUploader'

interface ProfileFormProps {
  initialProfile: ProfileRow | null
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: initialProfile?.id || '',
    name: initialProfile?.name || '',
    headline: initialProfile?.headline || '',
    short_bio: initialProfile?.short_bio || '',
    long_bio: initialProfile?.long_bio || '',
    location: initialProfile?.location || '',
    email: initialProfile?.email || '',
    availability_text: initialProfile?.availability_text || '',
    avatar_url: initialProfile?.avatar_url || '',
    avatar_alt: initialProfile?.avatar_alt || '',
    resume_url: initialProfile?.resume_url || '',
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
      const res = await updateProfile({
        ...formData,
        avatar_url: formData.avatar_url || null,
        avatar_alt: formData.avatar_alt || null,
        resume_url: formData.resume_url || null,
      })

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Profile updated successfully and changes revalidated.',
        })
        router.refresh()
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile.' })
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

      {/* Basic Info */}
      <div className="border-border bg-surface space-y-4 rounded-lg border p-6">
        <h2 className="font-display text-text text-lg font-semibold">Personal & Contact Details</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-muted mb-1 block font-mono text-xs">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted mb-1 block font-mono text-xs">Headline *</label>
            <input
              type="text"
              name="headline"
              required
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer · Mumbai"
              className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted mb-1 block font-mono text-xs">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted mb-1 block font-mono text-xs">Contact Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-muted mb-1 block font-mono text-xs">Availability Status *</label>
          <input
            type="text"
            name="availability_text"
            required
            value={formData.availability_text}
            onChange={handleChange}
            placeholder="e.g. Available for Full-Time Roles"
            className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Bios */}
      <div className="border-border bg-surface space-y-4 rounded-lg border p-6">
        <h2 className="font-display text-text text-lg font-semibold">Narrative & Bio</h2>

        <div>
          <label className="text-muted mb-1 block font-mono text-xs">
            Short Bio (Hero section) *
          </label>
          <textarea
            name="short_bio"
            required
            rows={3}
            value={formData.short_bio}
            onChange={handleChange}
            className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="text-muted mb-1 block font-mono text-xs">
            Long Bio (About section) *
          </label>
          <textarea
            name="long_bio"
            required
            rows={6}
            value={formData.long_bio}
            onChange={handleChange}
            className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Media Uploads: Avatar & Resume */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border-border bg-surface rounded-lg border p-6">
          <h2 className="font-display text-text mb-4 text-lg font-semibold">Portrait Avatar</h2>
          <ImageUploader
            folder="avatar"
            label="Upload Avatar Image"
            initialUrl={formData.avatar_url}
            initialAlt={formData.avatar_alt}
            onUploadComplete={(meta) => {
              setFormData((prev) => ({
                ...prev,
                avatar_url: meta.url,
                avatar_alt: meta.alt,
              }))
            }}
            onRemove={() => {
              setFormData((prev) => ({
                ...prev,
                avatar_url: '',
                avatar_alt: '',
              }))
            }}
          />
        </div>

        <div className="border-border bg-surface rounded-lg border p-6">
          <h2 className="font-display text-text mb-4 text-lg font-semibold">Résumé Document</h2>
          <FileUploader
            label="Upload Résumé (PDF only)"
            initialUrl={formData.resume_url}
            onUploadComplete={(url) => {
              setFormData((prev) => ({
                ...prev,
                resume_url: url,
              }))
            }}
            onRemove={() => {
              setFormData((prev) => ({
                ...prev,
                resume_url: '',
              }))
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-6 py-2.5 font-mono text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  )
}
