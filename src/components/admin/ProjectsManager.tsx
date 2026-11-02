'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { ProjectRow } from '@/types/database'
import {
  saveProject,
  deleteProject,
  toggleProjectPublished,
  type ProjectInput,
} from '@/lib/actions/projects'
import { MediaUploader } from '@/components/admin/MediaUploader'
import { useToast } from '@/components/admin/ToastContext'
import { Icon } from '@/components/ui/icon'

interface ProjectsManagerProps {
  initialProjects: ProjectRow[]
}

interface MetricItem {
  label: string
  value: string
}

interface GalleryItemState {
  url: string
  alt?: string
  caption?: string
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const router = useRouter()
  const toast = useToast()
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects)
  const [editingProject, setEditingProject] = useState<Partial<ProjectRow> | null>(null)
  const [stackInput, setStackInput] = useState('')
  const [metricsList, setMetricsList] = useState<MetricItem[]>([])
  const [galleryList, setGalleryList] = useState<GalleryItemState[]>([])
  const [saving, setSaving] = useState(false)

  function openCreateModal() {
    setEditingProject({
      slug: '',
      title: '',
      summary: '',
      problem: '',
      solution: '',
      outcome: '',
      role: '',
      year: new Date().getFullYear(),
      stack: [],
      live_url: '',
      repo_url: '',
      cover_image_url: '',
      cover_image_alt: '',
      cover_video_url: '',
      cover_video_poster_url: '',
      featured: false,
      sort_order: projects.length + 1,
      is_published: true,
    })
    setStackInput('')
    setMetricsList([])
    setGalleryList([])
  }

  function openEditModal(project: ProjectRow) {
    setEditingProject(project)
    setStackInput((project.stack || []).join(', '))
    const parsedMetrics = Array.isArray(project.metrics)
      ? (project.metrics as unknown as MetricItem[])
      : []
    setMetricsList(parsedMetrics)

    const parsedGallery = Array.isArray(project.gallery)
      ? (project.gallery as unknown as GalleryItemState[])
      : []
    setGalleryList(parsedGallery)
  }

  function closeModal() {
    setEditingProject(null)
    setStackInput('')
    setMetricsList([])
    setGalleryList([])
  }

  function addMetricRow() {
    setMetricsList((prev) => [...prev, { label: '', value: '' }])
  }

  function updateMetricRow(index: number, field: 'label' | 'value', value: string) {
    setMetricsList((prev) => {
      const copy = [...prev]
      const current = copy[index]
      if (current) {
        copy[index] = { ...current, [field]: value }
      }
      return copy
    })
  }

  function removeMetricRow(index: number) {
    setMetricsList((prev) => prev.filter((_, i) => i !== index))
  }

  function removeGalleryItem(index: number) {
    setGalleryList((prev) => prev.filter((_, i) => i !== index))
    toast.info('Removed image from gallery preview.')
  }

  function updateGalleryItemCaption(index: number, caption: string) {
    setGalleryList((prev) => {
      const copy = [...prev]
      const current = copy[index]
      if (current) {
        copy[index] = { ...current, caption, alt: caption }
      }
      return copy
    })
  }

  async function handleTogglePublish(project: ProjectRow) {
    const nextState = !project.is_published
    const res = await toggleProjectPublished(project.id, nextState, project.slug)
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_published: nextState } : p)),
      )
      toast.success(
        `Project "${project.title}" is now ${nextState ? 'published' : 'hidden'}.`,
        'Visibility Updated',
      )
      router.refresh()
    } else {
      toast.error(`Failed to update status: ${res.error}`)
    }
  }

  async function handleDelete(project: ProjectRow) {
    if (!confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return

    const res = await deleteProject(project.id, project.slug)
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
      toast.success(`Deleted "${project.title}" permanently.`, 'Project Deleted')
      router.refresh()
    } else {
      toast.error(`Delete failed: ${res.error}`)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editingProject) return
    setSaving(true)

    const stackArray = stackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload: ProjectInput = {
      id: editingProject.id,
      slug: (editingProject.slug || '').trim().toLowerCase().replace(/\s+/g, '-'),
      title: editingProject.title || '',
      summary: editingProject.summary || '',
      problem: editingProject.problem || null,
      solution: editingProject.solution || null,
      outcome: editingProject.outcome || null,
      role: editingProject.role || null,
      year: editingProject.year ? Number(editingProject.year) : null,
      stack: stackArray,
      live_url: editingProject.live_url || null,
      repo_url: editingProject.repo_url || null,
      cover_image_url: editingProject.cover_image_url || null,
      cover_image_alt: editingProject.cover_image_alt || null,
      cover_video_url: editingProject.cover_video_url || null,
      cover_video_poster_url: editingProject.cover_video_poster_url || null,
      gallery: galleryList.filter((g) => g.url && g.url.trim()),
      metrics: metricsList.filter((m) => m.label.trim() && m.value.trim()),
      featured: Boolean(editingProject.featured),
      sort_order: Number(editingProject.sort_order || 0),
      is_published: editingProject.is_published ?? true,
    }

    try {
      const res = await saveProject(payload)
      if (res.success) {
        toast.success(`Project "${payload.title}" saved successfully!`, 'Project Saved')
        closeModal()
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save project.')
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
          Showing {projects.length} project{projects.length === 1 ? '' : 's'} (ordered by
          sort_order)
        </span>
        <button
          onClick={openCreateModal}
          className="bg-accent hover:bg-accent-light text-text cursor-pointer rounded px-4 py-2 font-mono text-xs transition-colors"
        >
          + Add Project
        </button>
      </div>

      {/* Projects List Table */}
      <div className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-border/60 bg-surface-hover/50 text-muted border-b font-mono text-xs">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title & Slug</th>
                <th className="px-4 py-3">Stack</th>
                <th className="px-4 py-3">Role & Year</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y font-sans">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-muted px-4 py-8 text-center font-mono text-xs">
                    No projects found in database. Click &ldquo;+ Add Project&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="text-muted px-4 py-3 font-mono text-xs">{proj.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="text-text font-medium">{proj.title}</div>
                      <div className="text-muted font-mono text-xs">/work/{proj.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(proj.stack || []).slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="border-border/60 bg-background/50 text-text/80 rounded border px-1.5 py-0.5 font-mono text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                        {(proj.stack || []).length > 3 && (
                          <span className="text-muted font-mono text-[10px]">
                            +{(proj.stack || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-muted px-4 py-3 font-mono text-xs">
                      {proj.role || '—'} · {proj.year || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {proj.featured ? (
                        <span className="bg-accent/20 text-accent-light rounded px-2 py-0.5 font-mono text-xs">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-muted font-mono text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className={`cursor-pointer rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                          proj.is_published
                            ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            : 'border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        {proj.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="border-border bg-background text-text hover:border-accent cursor-pointer rounded border px-2.5 py-1 font-mono text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(proj)}
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

      {/* Edit / Create Form Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="border-border bg-surface max-h-[90vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-lg border p-6">
            <div className="border-border/50 flex items-center justify-between border-b pb-3">
              <h2 className="font-display text-text text-xl font-bold">
                {editingProject.id ? `Edit: ${editingProject.title}` : 'Add New Project'}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted hover:text-text cursor-pointer font-mono text-sm"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => {
                      const title = e.target.value
                      setEditingProject((prev) => ({
                        ...prev,
                        title,
                        slug: prev?.id
                          ? prev.slug
                          : title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, ''),
                      }))
                    }}
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Slug (URL path) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Role, Year, Sort Order */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Role / Positioning
                  </label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, role: e.target.value }))
                    }
                    placeholder="e.g. Lead Architect & Full-Stack"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Year</label>
                  <input
                    type="number"
                    value={editingProject.year || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        year: e.target.value ? parseInt(e.target.value) : null,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Sort Order *</label>
                  <input
                    type="number"
                    value={editingProject.sort_order ?? 0}
                    onChange={(e) =>
                      setEditingProject((prev) => ({
                        ...prev,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="text-muted mb-1 block font-mono text-xs">
                  Summary (1–2 sentences) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.summary || ''}
                  onChange={(e) =>
                    setEditingProject((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {/* Case Study Details: Problem, Solution, Outcome */}
              <div className="space-y-4">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.problem || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, problem: e.target.value }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Engineering Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, solution: e.target.value }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Outcome & Impact
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.outcome || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, outcome: e.target.value }))
                    }
                    className="border-border bg-background text-text focus:border-accent w-full resize-y rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Tech Stack & Links */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">
                    Tech Stack (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="Next.js, TypeScript, Supabase"
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Live URL</label>
                  <input
                    type="url"
                    value={editingProject.live_url || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, live_url: e.target.value }))
                    }
                    placeholder="https://..."
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted mb-1 block font-mono text-xs">Repo URL</label>
                  <input
                    type="url"
                    value={editingProject.repo_url || ''}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, repo_url: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="border-border bg-background text-text focus:border-accent w-full rounded border px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Uploader */}
              <div className="border-border bg-background/50 rounded-lg border p-4">
                <MediaUploader
                  folder="projects"
                  mode="image"
                  aspectRatioPreset="16:9"
                  label="Project Cover Image *"
                  helpText="Primary card banner and case study hero header (PNG, WebP, AVIF up to 15MB)"
                  requiredAlt={true}
                  initialUrl={editingProject.cover_image_url}
                  initialAlt={editingProject.cover_image_alt}
                  onUploadComplete={(meta) => {
                    setEditingProject((prev) => ({
                      ...prev,
                      cover_image_url: meta.url,
                      cover_image_alt: meta.alt,
                    }))
                  }}
                  onRemove={() => {
                    setEditingProject((prev) => ({
                      ...prev,
                      cover_image_url: '',
                      cover_image_alt: '',
                    }))
                  }}
                />
              </div>

              {/* Video Cover Preview (Optional) */}
              <div className="border-border bg-background/50 space-y-4 rounded-lg border p-4">
                <h3 className="font-display text-text text-sm font-semibold">
                  Video Cover Loop & Poster (Optional)
                </h3>
                
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <MediaUploader
                      folder="projects/videos"
                      mode="video"
                      label="Cover Video (MP4 / WebM)"
                      helpText="Autoplaying video preview shown on hover (max 25MB)"
                      initialUrl={editingProject.cover_video_url}
                      onUploadComplete={(meta) => {
                        setEditingProject((prev) => ({
                          ...prev,
                          cover_video_url: meta.url,
                        }))
                      }}
                      onRemove={() => {
                        setEditingProject((prev) => ({
                          ...prev,
                          cover_video_url: '',
                        }))
                      }}
                    />
                  </div>

                  <div>
                    <MediaUploader
                      folder="projects/posters"
                      mode="image"
                      label="Video Poster Image"
                      helpText="Fallback thumbnail displayed before video loads"
                      initialUrl={editingProject.cover_video_poster_url}
                      onUploadComplete={(meta) => {
                        setEditingProject((prev) => ({
                          ...prev,
                          cover_video_poster_url: meta.url,
                        }))
                      }}
                      onRemove={() => {
                        setEditingProject((prev) => ({
                          ...prev,
                          cover_video_poster_url: '',
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Project Gallery Manager (Multi-Image Showcase) */}
              <div className="border-border bg-background/50 space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-text text-sm font-semibold">
                      Case Study Gallery Images
                    </h3>
                    <p className="text-muted font-mono text-[11px]">
                      {galleryList.length} image{galleryList.length === 1 ? '' : 's'} attached to this case study.
                    </p>
                  </div>
                </div>

                {/* Existing Gallery Grid */}
                {galleryList.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {galleryList.map((item, gIdx) => (
                      <div
                        key={gIdx}
                        className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#060614] p-2"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded border border-white/10 bg-black">
                          <Image
                            src={item.url}
                            alt={item.alt || item.caption || `Gallery ${gIdx + 1}`}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(gIdx)}
                            className="absolute top-1.5 right-1.5 rounded-full bg-red-600/80 p-1 text-white hover:bg-red-500 transition-colors"
                            aria-label="Remove image from gallery"
                          >
                            <Icon name="x" size={12} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.caption || item.alt || ''}
                          onChange={(e) => updateGalleryItemCaption(gIdx, e.target.value)}
                          placeholder="Image caption / alt text..."
                          className="mt-2 w-full rounded border border-white/10 bg-surface px-2 py-1 font-mono text-[11px] text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Gallery Image via MediaUploader */}
                <MediaUploader
                  folder="projects/gallery"
                  mode="image"
                  label="Add Image to Gallery"
                  helpText="Drop screenshots, interface flows, or feature captures to attach to this project"
                  onUploadComplete={(meta) => {
                    setGalleryList((prev) => [
                      ...prev,
                      { url: meta.url, alt: meta.alt || '', caption: meta.alt || '' },
                    ])
                  }}
                />
              </div>

              {/* Metrics Array Editor */}
              <div className="border-border bg-background/50 space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-text text-sm font-semibold">
                    Key Outcome Metrics
                  </h3>
                  <button
                    type="button"
                    onClick={addMetricRow}
                    className="border-border bg-surface text-accent hover:border-accent cursor-pointer rounded border px-2 py-1 font-mono text-xs transition-colors"
                  >
                    + Add Metric
                  </button>
                </div>
                {metricsList.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Label (e.g. Active Students)"
                      value={m.label}
                      onChange={(e) => updateMetricRow(idx, 'label', e.target.value)}
                      className="border-border bg-surface text-text focus:border-accent flex-1 rounded border px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 100+)"
                      value={m.value}
                      onChange={(e) => updateMetricRow(idx, 'value', e.target.value)}
                      className="border-border bg-surface text-text focus:border-accent w-32 rounded border px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeMetricRow(idx)}
                      className="cursor-pointer px-1 font-mono text-xs text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkboxes: Featured & Published */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="accent-accent h-4 w-4 rounded"
                  />
                  <span className="text-text font-mono text-xs">
                    Featured on Homepage Hero/Work
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published ?? true}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, is_published: e.target.checked }))
                    }
                    className="accent-accent h-4 w-4 rounded"
                  />
                  <span className="text-text font-mono text-xs">Published (Publicly Visible)</span>
                </label>
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
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
