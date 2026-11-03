'use client'

import React, { useState } from 'react'
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
import type { NavItemRow } from '@/types/database'
import {
  saveNavItem,
  updateNavItemsOrder,
  toggleNavItemVisibility,
  deleteNavItem,
  type NavItemInput,
} from '@/lib/actions/navigation'
import { useToast } from '@/components/admin/ToastContext'
import { GripVertical, Plus, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react'

interface NavbarManagerProps {
  initialItems: NavItemRow[]
}

function SortableNavItem({
  item,
  onEdit,
  onToggleVisibility,
  onDelete,
}: {
  item: NavItemRow
  onEdit: (item: NavItemRow) => void
  onToggleVisibility: (id: string, isVisible: boolean) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between rounded-xl border border-white/10 bg-[#0a0c14] p-3.5 transition-all ${
        isDragging ? 'shadow-2xl border-blue-500 bg-[#0e121e]' : 'hover:border-white/20'
      } ${!item.is_visible ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-slate-500 hover:text-white p-1 rounded transition-colors active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>

        {/* Item Label & Link */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold text-white">{item.label}</span>
            {item.is_cta && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/15 px-2 py-0.5 font-mono text-[9px] font-semibold text-blue-300 uppercase tracking-wider">
                <Sparkles size={10} />
                CTA Button
              </span>
            )}
          </div>
          <span className="font-mono text-xs text-slate-400">{item.href}</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleVisibility(item.id, !item.is_visible)}
          className={`rounded-lg p-2 transition-colors ${
            item.is_visible
              ? 'text-emerald-400 hover:bg-emerald-500/10'
              : 'text-slate-500 hover:bg-white/10'
          }`}
          title={item.is_visible ? 'Visible on site' : 'Hidden from site'}
        >
          {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-blue-500/40 hover:text-white transition-colors"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-lg p-2 text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete link"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export function NavbarManager({ initialItems }: NavbarManagerProps) {
  const [items, setItems] = useState<NavItemRow[]>(initialItems)
  const [editingItem, setEditingItem] = useState<Partial<NavItemInput> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
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

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(items, oldIndex, newIndex)
    setItems(newOrder)

    const orderedIds = newOrder.map((i) => i.id)
    const res = await updateNavItemsOrder(orderedIds)
    if (res.success) {
      showToast('Navbar order updated', 'success')
    } else {
      showToast(res.error || 'Failed to update order', 'error')
      setItems(items) // rollback
    }
  }

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_visible: isVisible } : item)))
    const res = await toggleNavItemVisibility(id, isVisible)
    if (res.success) {
      showToast(isVisible ? 'Link is now visible' : 'Link is now hidden', 'success')
    } else {
      showToast(res.error || 'Failed to toggle visibility', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this navigation item?')) return
    setItems((prev) => prev.filter((item) => item.id !== id))
    const res = await deleteNavItem(id)
    if (res.success) {
      showToast('Link removed from navigation', 'success')
    } else {
      showToast(res.error || 'Failed to delete link', 'error')
    }
  }

  const handleOpenAdd = () => {
    setEditingItem({
      label: '',
      href: '',
      order_index: items.length + 1,
      is_visible: true,
      is_cta: false,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: NavItemRow) => {
    setEditingItem({
      id: item.id,
      label: item.label,
      href: item.href,
      order_index: item.order_index,
      is_visible: item.is_visible,
      is_cta: item.is_cta,
    })
    setIsModalOpen(true)
  }

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem || !editingItem.label || !editingItem.href) {
      showToast('Label and target link are required', 'error')
      return
    }

    setSaving(true)
    const res = await saveNavItem({
      id: editingItem.id,
      label: editingItem.label,
      href: editingItem.href,
      order_index: editingItem.order_index ?? items.length + 1,
      is_visible: editingItem.is_visible ?? true,
      is_cta: editingItem.is_cta ?? false,
    })
    setSaving(false)

    if (res.success) {
      showToast('Navigation link saved', 'success')
      setIsModalOpen(false)
      window.location.reload()
    } else {
      showToast(res.error || 'Failed to save navigation link', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Navigation Bar Editor
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Reorder links via drag-and-drop, toggle visibility, and configure CTA buttons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-blue-500 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Nav Item</span>
        </button>
      </div>

      {/* Reorderable List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableNavItem
                key={item.id}
                item={item}
                onEdit={handleOpenEdit}
                onToggleVisibility={handleToggleVisibility}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a0c14] p-6 shadow-2xl">
            <h2 className="font-display text-lg font-bold text-white mb-4">
              {editingItem.id ? 'Edit Navigation Item' : 'New Navigation Item'}
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Link Label *</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="e.g. About, Work, Résumé"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Target Href / Anchor *</label>
                <input
                  type="text"
                  required
                  value={editingItem.href || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                  placeholder="e.g. #about, /resume.pdf, https://..."
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingItem.is_cta ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_cta: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0"
                  />
                  <span>Render as CTA Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingItem.is_visible ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, is_visible: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0"
                  />
                  <span>Visible on Site</span>
                </label>
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
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
