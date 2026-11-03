'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CertificationRow } from '@/types/database'
import {
  saveCertification,
  deleteCertification,
  type CertificationInput,
} from '@/lib/actions/certifications'
import { MultiImageManager } from '@/components/admin/MultiImageManager'
import { useToast } from '@/components/admin/ToastContext'
import { extractGalleryImages, type GalleryImage } from '@/lib/images'

interface CertificationsManagerProps {
  initialCertifications: CertificationRow[]
}

export function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [list, setList] = useState<CertificationRow[]>(initialCertifications)
  const [editingItem, setEditingItem] = useState<Partial<CertificationRow>>({
    title: '',
    issuer: '',
    year: new Date().getFullYear(),
    credential_url: '',
    image_url: '',
    sort_order: 0,
    is_published: true,
  })
  const [galleryList, setGalleryList] = useState<GalleryImage[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreateModal() {
    setEditingItem({
      title: '',
      issuer: '',
      year: new Date().getFullYear(),
      credential_url: '',
      image_url: '',
      sort_order: list.length + 1,
      is_published: true,
    })
    setGalleryList([])
    setIsModalOpen(true)
  }

  function openEditModal(item: CertificationRow) {
    setEditingItem(item)
    setGalleryList(extractGalleryImages(item))
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setGalleryList([])
  }

  async function handleDelete(item: CertificationRow) {
    if (!confirm(`Delete "${item.title} by ${item.issuer}"?`)) return

    const res = await deleteCertification(item.id)
    if (res.success) {
      setList((prev) => prev.filter((c) => c.id !== item.id))
      toast.success(`Deleted "${item.title}" successfully.`)
      router.refresh()
    } else {
      toast.error(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const primaryImg = galleryList[0]

    const payload: CertificationInput = {
      id: editingItem.id,
      title: editingItem.title || '',
      issuer: editingItem.issuer || '',
      year: Number(editingItem.year),
      credential_url: editingItem.credential_url || null,
      image_url: primaryImg?.url || editingItem.image_url || null,
      image_alt: primaryImg?.alt || editingItem.image_alt || null,
      gallery: galleryList,
      images: galleryList,
      sort_order: Number(editingItem.sort_order || 0),
      is_published: editingItem.is_published ?? true,
    }

    try {
      const res = await saveCertification(payload)
      if (res.success) {
        toast.success(`Saved credential "${payload.title}" successfully!`)
        closeModal()
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save certification.')
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
          Showing {list.length} credential{list.length === 1 ? '' : 's'} (ordered by sort_order)
        </span>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Credential
        </button>
      </div>

      {/* Certifications Table */}
      <div className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-border/60 bg-surface-hover/50 text-muted border-b font-mono text-xs">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title & Issuer</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 text-center">Images</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-sans">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted px-4 py-8 text-center font-mono text-xs">
                    No certifications found. Click &ldquo;+ Add Credential&rdquo; to add one.
                  </td>
                </tr>
              ) : (
                list.map((cert) => {
                  const photosCount = extractGalleryImages(cert).length

                  return (
                    <tr key={cert.id} className="hover:bg-surface-hover/30 transition-colors">
                      <td className="text-muted px-4 py-3 font-mono text-xs">{cert.sort_order}</td>
                      <td className="px-4 py-3">
                        <div className="text-text font-medium">{cert.title}</div>
                        <div className="text-muted text-xs">{cert.issuer}</div>
                      </td>
                      <td className="text-muted px-4 py-3 font-mono text-xs">{cert.year}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-blue-400">
                          {photosCount} image{photosCount === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded px-2.5 py-0.5 font-mono text-xs ${
                            cert.is_published
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {cert.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cert)}
                            className="border-border bg-background text-text hover:border-accent cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cert)}
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
          <div className="border-border bg-surface max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-text text-lg font-bold">
                {editingItem.id ? 'Edit Credential' : 'Add Credential'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-muted hover:text-text cursor-pointer font-mono text-sm"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-muted mb-1 block font-mono text-xs">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Introduction to Database Systems"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Issuer / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.issuer || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, issuer: e.target.value }))
                    }
                    placeholder="e.g. NPTEL, IIT Madras"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Year Issued *</label>
                  <input
                    type="number"
                    required
                    value={editingItem.year || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        year: parseInt(e.target.value) || 2025,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Credential URL</label>
                <input
                  type="url"
                  value={editingItem.credential_url || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, credential_url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Multi-Image Upload */}
              <div className="border-border bg-background/50 rounded-lg border p-4">
                <MultiImageManager
                  folder="certifications"
                  images={galleryList}
                  onChange={setGalleryList}
                  label="Certificate Image or Verification Proofs"
                  helpText="Upload credential images, scorecards, or verification certificates. Reorder by dragging."
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

              {/* Action Buttons */}
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
                  {saving ? 'Saving...' : 'Save Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
