'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ExperienceRow } from '@/types/database'
import { saveExperience, deleteExperience, type ExperienceInput } from '@/lib/actions/experience'
import { MultiImageManager } from '@/components/admin/MultiImageManager'
import { useToast } from '@/components/admin/ToastContext'
import { extractGalleryImages, type GalleryImage } from '@/lib/images'

interface ExperienceManagerProps {
  initialExperience: ExperienceRow[]
}

export function ExperienceManager({ initialExperience }: ExperienceManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [experienceList, setExperienceList] = useState<ExperienceRow[]>(initialExperience)
  const [editingItem, setEditingItem] = useState<Partial<ExperienceRow>>({
    company: '',
    title: '',
    start_date: '',
    end_date: '',
    period_label: '',
    org_url: '',
    description: '',
    highlights: [],
    image_url: '',
    image_alt: '',
    sort_order: 0,
    is_published: true,
  })
  const [galleryList, setGalleryList] = useState<GalleryImage[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [highlightsInput, setHighlightsInput] = useState('')
  const [saving, setSaving] = useState(false)

  function openCreateModal() {
    setEditingItem({
      company: '',
      title: '',
      start_date: '',
      end_date: '',
      period_label: '',
      org_url: '',
      description: '',
      highlights: [],
      image_url: '',
      image_alt: '',
      sort_order: experienceList.length + 1,
      is_published: true,
    })
    setGalleryList([])
    setHighlightsInput('')
    setIsModalOpen(true)
  }

  function openEditModal(item: ExperienceRow) {
    setEditingItem(item)
    setGalleryList(extractGalleryImages(item))
    setHighlightsInput((item.highlights || []).join('\n'))
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setHighlightsInput('')
    setGalleryList([])
  }

  async function handleDelete(item: ExperienceRow) {
    if (!confirm(`Delete "${item.title} at ${item.company}"?`)) return

    const res = await deleteExperience(item.id)
    if (res.success) {
      setExperienceList((prev) => prev.filter((e) => e.id !== item.id))
      toast.success(`Removed "${item.title}" successfully.`)
      router.refresh()
    } else {
      toast.error(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const highlightsArray = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean)

    const primaryImg = galleryList[0]

    const payload: ExperienceInput = {
      id: editingItem.id,
      company: editingItem.company || '',
      title: editingItem.title || '',
      start_date: editingItem.start_date || '',
      end_date: editingItem.end_date || null,
      period_label: editingItem.period_label || null,
      org_url: editingItem.org_url || null,
      description: editingItem.description || '',
      highlights: highlightsArray,
      image_url: primaryImg?.url || editingItem.image_url || null,
      image_alt: primaryImg?.alt || editingItem.image_alt || null,
      logo_url: primaryImg?.url || editingItem.logo_url || null,
      logo_alt: primaryImg?.alt || editingItem.logo_alt || null,
      gallery: galleryList,
      images: galleryList,
      sort_order: Number(editingItem.sort_order || 0),
      is_published: editingItem.is_published ?? true,
    }

    try {
      const res = await saveExperience(payload)
      if (res.success) {
        toast.success(`Saved position "${payload.title}" successfully!`)
        closeModal()
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save experience entry.')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-muted font-mono text-xs">
          Showing {experienceList.length} position{experienceList.length === 1 ? '' : 's'} (ordered by sort_order)
        </span>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Leadership / Role
        </button>
      </div>

      {/* Experience List Table */}
      <div className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-border/60 bg-surface-hover/50 text-muted border-b font-mono text-xs">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Role & Organization</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-center">Photos</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-sans">
              {experienceList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted px-4 py-8 text-center font-mono text-xs">
                    No roles found. Click &ldquo;+ Add Leadership / Role&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                experienceList.map((item) => {
                  const photosCount = extractGalleryImages(item).length

                  return (
                    <tr key={item.id} className="hover:bg-surface-hover/30 transition-colors">
                      <td className="text-muted px-4 py-3 font-mono text-xs">{item.sort_order}</td>
                      <td className="px-4 py-3">
                        <div className="text-text font-medium">{item.title}</div>
                        <div className="text-muted text-xs">{item.company}</div>
                      </td>
                      <td className="text-muted px-4 py-3 font-mono text-xs">
                        {item.period_label || `${item.start_date || ''} – ${item.end_date || 'Present'}`}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-blue-400">
                          {photosCount} photo{photosCount === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-2.5 py-0.5 font-mono text-xs ${
                            item.is_published
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="border-border bg-background text-text hover:border-accent cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="border-border bg-background text-red-400 hover:border-red-500 hover:bg-red-500/10 cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editor Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="border-border bg-surface max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 shadow-2xl">
            <h2 className="font-display text-text text-lg font-bold">
              {editingItem.id ? 'Edit Leadership & Event Role' : 'Add Leadership & Event Role'}
            </h2>
            <p className="text-muted font-mono text-xs">
              Add event photos, conference keynotes, hackathon podium shots, and team certifications.
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.company || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Title / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.start_date || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, start_date: e.target.value }))
                    }
                    placeholder="e.g. 2026-01-01"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">End Date</label>
                  <input
                    type="text"
                    value={editingItem.end_date || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, end_date: e.target.value }))
                    }
                    placeholder="e.g. Present"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Period Label</label>
                  <input
                    type="text"
                    value={editingItem.period_label || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, period_label: e.target.value }))
                    }
                    placeholder="e.g. 2026 or 2024–2025"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Organization URL</label>
                <input
                  type="url"
                  value={editingItem.org_url || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, org_url: e.target.value }))}
                  placeholder="https://..."
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">
                  Bullet Highlights (one per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Led technical challenge design&#10;Mentored 150+ hackathon participants"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className="border-border bg-background/50 space-y-4 rounded-lg border p-4">
                <MultiImageManager
                  folder="experience"
                  images={galleryList}
                  onChange={setGalleryList}
                  label="Role, Event & Conference Photographs"
                  helpText="Upload multiple event pictures, keynote stage moments, or certificates. Reorder to select cover."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Sort Order *</label>
                  <input
                    type="number"
                    value={editingItem.sort_order ?? 0}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingItem.is_published ?? true}
                      onChange={(e) =>
                        setEditingItem((prev) => ({ ...prev, is_published: e.target.checked }))
                      }
                      className="accent-accent h-4 w-4 rounded"
                    />
                    <span className="text-text font-mono text-xs">
                      Published (Publicly Visible)
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="border-border/50 flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="border-border bg-background text-muted hover:text-text cursor-pointer rounded border px-4 py-2 font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
