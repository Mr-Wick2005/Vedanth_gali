'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SocialLinkRow } from '@/types/database'
import { saveSocial, deleteSocial, type SocialInput } from '@/lib/actions/socials'

interface SocialsManagerProps {
  initialSocials: SocialLinkRow[]
}

export function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const router = useRouter()
  const [links, setLinks] = useState<SocialLinkRow[]>(initialSocials)
  const [editingItem, setEditingItem] = useState<Partial<SocialLinkRow>>({
    label: '',
    url: '',
    display_text: '',
    sort_order: 0,
    is_published: true,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  function openCreateModal() {
    setEditingItem({
      label: '',
      url: '',
      display_text: '',
      sort_order: links.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
    setStatusMessage(null)
  }

  function openEditModal(item: SocialLinkRow) {
    setEditingItem(item)
    setIsModalOpen(true)
    setStatusMessage(null)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleDelete(item: SocialLinkRow) {
    if (!confirm(`Delete link "${item.label}"?`)) return

    const res = await deleteSocial(item.id)
    if (res.success) {
      setLinks((prev) => prev.filter((l) => l.id !== item.id))
      router.refresh()
    } else {
      alert(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    const payload: SocialInput = {
      id: editingItem.id,
      label: editingItem.label || '',
      url: editingItem.url || '',
      display_text: editingItem.display_text || null,
      sort_order: Number(editingItem.sort_order || 0),
      is_published: editingItem.is_published ?? true,
    }

    try {
      const res = await saveSocial(payload)
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Social link saved successfully!' })
        closeModal()
        router.refresh()
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to save link.' })
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error saving.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
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

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-muted font-mono text-xs">
          Showing {links.length} external social/contact link{links.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Social Link
        </button>
      </div>

      {/* List Table */}
      <div className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-border/60 bg-surface-hover/50 text-muted border-b font-mono text-xs">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Destination URL</th>
                <th className="px-4 py-3">Display Text</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-sans">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted px-4 py-8 text-center font-mono text-xs">
                    No social links found.
                  </td>
                </tr>
              ) : (
                links.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="text-muted px-4 py-3 font-mono text-xs">{item.sort_order}</td>
                    <td className="text-text px-4 py-3 font-medium">{item.label}</td>
                    <td className="text-muted px-4 py-3 font-mono text-xs">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="text-text/80 px-4 py-3 font-mono text-xs">
                      {item.display_text || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded px-2.5 py-1 font-mono text-xs ${
                          item.is_published
                            ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                            : 'border border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
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
                          className="cursor-pointer rounded border border-red-500/30 px-2 py-1 font-mono text-xs text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="border-border bg-surface w-full max-w-md space-y-6 overflow-y-auto rounded-lg border p-6">
            <div className="border-border/50 flex items-center justify-between border-b pb-3">
              <h2 className="font-display text-text text-xl font-bold">
                {editingItem.id ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted hover:text-text cursor-pointer font-mono text-sm"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Platform Label *</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. GitHub, LinkedIn, Twitter"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Destination URL *</label>
                <input
                  type="url"
                  required
                  value={editingItem.url || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 font-mono text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">
                  Display Text (Optional)
                </label>
                <input
                  type="text"
                  value={editingItem.display_text || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, display_text: e.target.value }))
                  }
                  placeholder="e.g. github.com/Mr-Wick2005"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 font-mono text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Sort Order</label>
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
                    <span className="text-text font-mono text-xs">Published</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="border-border/50 flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="border-border bg-background text-muted hover:text-text cursor-pointer rounded border px-4 py-2 font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-5 py-2 font-mono text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
