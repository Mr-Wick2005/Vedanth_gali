'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SectionRow } from '@/types/database'
import {
  updateSectionsOrder,
  toggleSectionVisibility,
  duplicateSection,
  deleteSection,
  saveSection,
} from '@/lib/actions/sections'
import { useToast } from '@/components/admin/ToastContext'
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Edit3,
  Layers,
  ArrowRight,
} from 'lucide-react'

interface SectionsManagerProps {
  initialSections: SectionRow[]
}

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero Section (Headline & 3D Avatar)',
  about: 'About & Discipline (Terminal & 3D Dossier)',
  work: 'Selected Production Work (Stacked Deck)',
  marquee_band: 'Velocity Marquee Band',
  stack: 'Tech Stack & Architecture Matrix',
  leadership: 'Leadership & Conference Timeline',
  credentials: 'Verified Qualifications & Credentials',
  contact: 'Kinetic Contact Stage & Colophon',
  custom: 'Custom Content Section',
}

function SortableSectionCard({
  section,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}: {
  section: SectionRow
  onToggleVisibility: (id: string, isVisible: boolean) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  const typeLabel = SECTION_TYPE_LABELS[section.type] || section.type

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0a0c14] p-4 transition-all ${
        isDragging ? 'shadow-2xl border-blue-500 bg-[#0e121e]' : 'hover:border-white/20'
      } ${!section.is_visible ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-500 hover:text-white p-1 rounded transition-colors active:cursor-grabbing"
          title="Drag to reorder section"
        >
          <GripVertical size={18} />
        </button>

        {/* Section Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-base font-bold text-white uppercase tracking-tight">
              {section.key}
            </span>

            {/* Type badge */}
            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
              <Layers size={10} className="text-blue-400" />
              {section.type}
            </span>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                section.status === 'published'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  section.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {section.status}
            </span>
          </div>

          <span className="font-mono text-xs text-slate-400 mt-1 block">
            {typeLabel}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleVisibility(section.id, !section.is_visible)}
          className={`rounded-lg p-2 transition-colors ${
            section.is_visible
              ? 'text-emerald-400 hover:bg-emerald-500/10'
              : 'text-slate-500 hover:bg-white/10'
          }`}
          title={section.is_visible ? 'Visible on site' : 'Hidden from site'}
        >
          {section.is_visible ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(section.id)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          title="Duplicate section"
        >
          <Copy size={16} />
        </button>

        <Link
          href={`/admin/sections/${section.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          <Edit3 size={13} />
          <span>Edit Content</span>
          <ArrowRight size={13} />
        </Link>

        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete section"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export function SectionsManager({ initialSections }: SectionsManagerProps) {
  const router = useRouter()
  const [sections, setSections] = useState<SectionRow[]>(initialSections)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newType, setNewType] = useState('custom')
  const [creating, setCreating] = useState(false)
  const { showToast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    const newOrder = arrayMove(sections, oldIndex, newIndex)
    setSections(newOrder)

    const orderedIds = newOrder.map((s) => s.id)
    const res = await updateSectionsOrder(orderedIds)
    if (res.success) {
      showToast('Section order updated', 'success')
    } else {
      showToast(res.error || 'Failed to update order', 'error')
      setSections(sections)
    }
  }

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: isVisible } : s))
    )
    const res = await toggleSectionVisibility(id, isVisible)
    if (res.success) {
      showToast(isVisible ? 'Section is now live' : 'Section hidden from site', 'success')
    } else {
      showToast(res.error || 'Failed to toggle visibility', 'error')
    }
  }

  const handleDuplicate = async (id: string) => {
    const res = await duplicateSection(id)
    if (res.success) {
      showToast('Section duplicated as draft', 'success')
      window.location.reload()
    } else {
      showToast(res.error || 'Failed to duplicate section', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return
    setSections((prev) => prev.filter((s) => s.id !== id))
    const res = await deleteSection(id)
    if (res.success) {
      showToast('Section deleted', 'success')
    } else {
      showToast(res.error || 'Failed to delete section', 'error')
    }
  }

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey.trim()) {
      showToast('Section key is required', 'error')
      return
    }

    setCreating(true)
    const res = await saveSection({
      key: newKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      type: newType,
      order_index: sections.length + 1,
      is_visible: false,
      status: 'draft',
      content: {
        title: 'New Section',
        kicker: '[ NEW SECTION ]',
        body: 'Custom section content.',
      },
      style: {
        theme: 'dark',
      },
    })
    setCreating(false)

    if (res.success && res.sectionId) {
      showToast('New section created as draft', 'success')
      router.push(`/admin/sections/${res.sectionId}`)
    } else {
      showToast(res.error || 'Failed to create section', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Sections Manager
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Drag to reorder page flow, toggle visibility, and customize every section&apos;s content and style.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Section</span>
        </button>
      </div>

      {/* Reorderable Section Deck */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                onToggleVisibility={handleToggleVisibility}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a0c14] p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold text-white mb-4">
              Add New Section
            </h2>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Section Identifier / Anchor (Unique Key) *
                </label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. highlights, testimonials, faq"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Section Type *
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="custom">Custom Content Section</option>
                  <option value="hero">Hero Section</option>
                  <option value="about">About & Discipline Section</option>
                  <option value="work">Work Platforms Section</option>
                  <option value="marquee_band">Velocity Marquee Band</option>
                  <option value="stack">Tech Stack Matrix</option>
                  <option value="leadership">Leadership Timeline</option>
                  <option value="credentials">Credentials & Certifications</option>
                  <option value="contact">Contact & Editorial Footer</option>
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create & Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
