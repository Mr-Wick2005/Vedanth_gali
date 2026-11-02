'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EducationRow } from '@/types/database'
import { saveEducation, deleteEducation, type EducationInput } from '@/lib/actions/education'
import { useToast } from '@/components/admin/ToastContext'

interface EducationManagerProps {
  initialEducation: EducationRow[]
}

export function EducationManager({ initialEducation }: EducationManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [list, setList] = useState<EducationRow[]>(initialEducation)
  const [editingItem, setEditingItem] = useState<Partial<EducationRow>>({
    institution: '',
    degree: '',
    field: '',
    start_year: 2023,
    end_year: 2027,
    status: 'Pursuing',
    sort_order: 0,
    is_published: true,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreateModal() {
    setEditingItem({
      institution: '',
      degree: '',
      field: '',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 4,
      status: 'Pursuing',
      sort_order: list.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(item: EducationRow) {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleDelete(item: EducationRow) {
    if (!confirm(`Delete "${item.degree} at ${item.institution}"?`)) return

    const res = await deleteEducation(item.id)
    if (res.success) {
      setList((prev) => prev.filter((e) => e.id !== item.id))
      toast.success(`Education record deleted.`)
      router.refresh()
    } else {
      toast.error(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload: EducationInput = {
      id: editingItem.id,
      institution: editingItem.institution || '',
      degree: editingItem.degree || '',
      field: editingItem.field || '',
      start_year: Number(editingItem.start_year),
      end_year: Number(editingItem.end_year),
      status: editingItem.status || 'Pursuing',
      sort_order: Number(editingItem.sort_order || 0),
      is_published: editingItem.is_published ?? true,
    }

    try {
      const res = await saveEducation(payload)
      if (res.success) {
        toast.success(`Saved education at "${payload.institution}" successfully!`)
        closeModal()
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save education.')
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
          Showing {list.length} education record{list.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Education
        </button>
      </div>

      {/* List Table */}
      <div className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-border/60 bg-surface-hover/50 text-muted border-b font-mono text-xs">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Degree & Field</th>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Years & Status</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-sans">
              {list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted px-4 py-8 text-center font-mono text-xs">
                    No education records found.
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="text-muted px-4 py-3 font-mono text-xs">{item.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="text-text font-medium">{item.degree}</div>
                      <div className="text-muted text-xs">{item.field}</div>
                    </td>
                    <td className="text-text/90 px-4 py-3 text-xs">{item.institution}</td>
                    <td className="text-muted px-4 py-3 font-mono text-xs">
                      {item.start_year} – {item.end_year} ({item.status})
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
          <div className="border-border bg-surface max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-lg border p-6">
            <div className="border-border/50 flex items-center justify-between border-b pb-3">
              <h2 className="font-display text-text text-xl font-bold">
                {editingItem.id ? 'Edit Education' : 'Add Education Record'}
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
                <label className="text-muted mb-1 block font-mono text-xs">Institution *</label>
                <input
                  type="text"
                  required
                  value={editingItem.institution || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, institution: e.target.value }))
                  }
                  placeholder="e.g. Mumbai University"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.degree || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, degree: e.target.value }))
                    }
                    placeholder="e.g. B.E."
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.field || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, field: e.target.value }))}
                    placeholder="e.g. Computer Engineering"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Start Year *</label>
                  <input
                    type="number"
                    required
                    value={editingItem.start_year || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        start_year: parseInt(e.target.value) || 2023,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">End Year *</label>
                  <input
                    type="number"
                    required
                    value={editingItem.end_year || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        end_year: parseInt(e.target.value) || 2027,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Status *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.status || ''}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, status: e.target.value }))
                    }
                    placeholder="e.g. Pursuing, Completed"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
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
                  className="border-border bg-background text-muted hover:text-text cursor-pointer rounded border px-4 py-2 font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-5 py-2 font-mono text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
