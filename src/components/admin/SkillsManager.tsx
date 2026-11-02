'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SkillRow } from '@/types/database'
import { saveSkill, deleteSkill, type SkillInput } from '@/lib/actions/skills'
import { useToast } from '@/components/admin/ToastContext'

interface SkillsManagerProps {
  initialSkills: SkillRow[]
}

const CATEGORIES = [
  'Languages',
  'Frameworks & Libraries',
  'Cloud & Infrastructure',
  'Developer Tooling',
]

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [skills, setSkills] = useState<SkillRow[]>(initialSkills)
  const [editingItem, setEditingItem] = useState<Partial<SkillRow>>({
    name: '',
    category: 'Frameworks & Libraries',
    icon_key: '',
    sort_order: 0,
    is_published: true,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreateModal(defaultCategory?: string) {
    setEditingItem({
      name: '',
      category: defaultCategory || 'Frameworks & Libraries',
      icon_key: '',
      sort_order: skills.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  function openEditModal(item: SkillRow) {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  async function handleDelete(item: SkillRow) {
    if (!confirm(`Delete skill "${item.name}"?`)) return

    const res = await deleteSkill(item.id)
    if (res.success) {
      setSkills((prev) => prev.filter((s) => s.id !== item.id))
      toast.success(`Skill "${item.name}" deleted.`)
      router.refresh()
    } else {
      toast.error(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload: SkillInput = {
      id: editingItem.id,
      name: editingItem.name || '',
      category: editingItem.category || 'Languages',
      icon_key: editingItem.icon_key || null,
      sort_order: Number(editingItem.sort_order || 0),
      is_published: editingItem.is_published ?? true,
    }

    try {
      const res = await saveSkill(payload)
      if (res.success) {
        toast.success(`Skill "${payload.name}" saved successfully!`)
        closeModal()
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save skill.')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving.')
    } finally {
      setSaving(false)
    }
  }

  // Group skills by category
  const groupedSkills: Record<string, SkillRow[]> = {}
  for (const s of skills) {
    const list = groupedSkills[s.category] ?? []
    list.push(s)
    groupedSkills[s.category] = list
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <span className="text-muted font-mono text-xs">
          Showing {skills.length} technical skills across {Object.keys(groupedSkills).length}{' '}
          categories
        </span>
        <button
          onClick={() => openCreateModal()}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {/* Grouped Skills View */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const items = groupedSkills[category] || []
          return (
            <div key={category} className="border-border bg-surface rounded-lg border p-5">
              <div className="border-border/40 mb-3 flex items-center justify-between border-b pb-2">
                <h3 className="font-display text-text text-sm font-semibold tracking-wide uppercase">
                  {category} ({items.length})
                </h3>
                <button
                  onClick={() => openCreateModal(category)}
                  className="text-muted hover:text-accent cursor-pointer font-mono text-xs"
                >
                  + Add to {category}
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-muted py-3 font-mono text-xs">No skills in this category.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className={`flex items-center gap-2 rounded border px-3 py-1.5 transition-colors ${
                        skill.is_published
                          ? 'border-border bg-background hover:border-accent/60'
                          : 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300'
                      }`}
                    >
                      <span className="text-text font-mono text-xs">{skill.name}</span>
                      {skill.icon_key && (
                        <span className="text-muted font-mono text-[10px]">[{skill.icon_key}]</span>
                      )}
                      <div className="border-border/50 ml-1 flex items-center gap-1.5 border-l pl-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="text-muted hover:text-text cursor-pointer font-mono text-[11px]"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(skill)}
                          className="cursor-pointer font-mono text-[11px] text-red-400/70 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="border-border bg-surface w-full max-w-md space-y-6 overflow-y-auto rounded-lg border p-6">
            <div className="border-border/50 flex items-center justify-between border-b pb-3">
              <h2 className="font-display text-text text-xl font-bold">
                {editingItem.id ? 'Edit Skill' : 'Add Technical Skill'}
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
                <label className="text-muted mb-1 block font-mono text-xs">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Next.js, TypeScript, Docker"
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">Category *</label>
                <select
                  value={editingItem.category || 'Frameworks & Libraries'}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-muted mb-1 block font-mono text-xs">
                  Icon Key (Optional identifier)
                </label>
                <input
                  type="text"
                  value={editingItem.icon_key || ''}
                  onChange={(e) =>
                    setEditingItem((prev) => ({ ...prev, icon_key: e.target.value }))
                  }
                  placeholder="e.g. nextjs, typescript"
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
                  {saving ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
