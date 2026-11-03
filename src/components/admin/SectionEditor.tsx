'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SectionRow, SectionVersionRow, MediaRow } from '@/types/database'
import { saveSection, rollbackSectionVersion } from '@/lib/actions/sections'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useToast } from '@/components/admin/ToastContext'
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  RotateCcw,
  Layers,
  Palette,
  Eye,
  FileCode,
} from 'lucide-react'

interface SectionEditorProps {
  section: SectionRow
  versions: SectionVersionRow[]
  availableMedia?: MediaRow[]
}

function getStr(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val
  if (val === null || val === undefined) return fallback
  return String(val)
}

function getNum(val: unknown, fallback = 1.0): number {
  if (typeof val === 'number') return val
  const parsed = Number(val)
  return isNaN(parsed) ? fallback : parsed
}

export function SectionEditor({ section, versions }: SectionEditorProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'history' | 'preview'>('content')
  const [content, setContent] = useState<Record<string, unknown>>(
    (section.content as Record<string, unknown>) || {}
  )
  const [style, setStyle] = useState<Record<string, unknown>>(
    (section.style as Record<string, unknown>) || {}
  )
  const [status, setStatus] = useState<'draft' | 'published'>(section.status)
  const [isVisible, setIsVisible] = useState<boolean>(section.is_visible)
  const [saving, setSaving] = useState(false)

  const updateContentField = (key: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const updateStyleField = (key: string, value: unknown) => {
    setStyle((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (publishNow = false) => {
    setSaving(true)
    const targetStatus = publishNow ? 'published' : status
    const res = await saveSection({
      id: section.id,
      key: section.key,
      type: section.type,
      order_index: section.order_index,
      is_visible: isVisible,
      status: targetStatus,
      content,
      style,
    })
    setSaving(false)

    if (res.success) {
      setStatus(targetStatus)
      showToast(
        publishNow ? 'Section published live!' : 'Section draft saved',
        'success'
      )
      router.refresh()
    } else {
      showToast(res.error || 'Failed to save section', 'error')
    }
  }

  const handleRollback = async (versionId: string) => {
    if (!confirm('Rollback to this version? Current unsaved edits will be replaced.')) return
    const res = await rollbackSectionVersion(section.id, versionId)
    if (res.success) {
      showToast('Version restored successfully', 'success')
      window.location.reload()
    } else {
      showToast(res.error || 'Failed to rollback', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/sections"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold uppercase tracking-tight text-white">
                Edit Section: {section.key}
              </h1>
              <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-300">
                {section.type}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Live updates persist directly to Supabase and cache-revalidate automatically.
            </span>
          </div>
        </div>

        {/* Save / Publish Action Strip */}
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-slate-300 mr-2">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-0"
            />
            <span>Visible</span>
          </label>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-200 hover:border-white/30 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'content'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Content Fields</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'style'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Palette size={14} />
          <span>Style &amp; Appearance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'history'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Clock size={14} />
          <span>Version History ({versions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Eye size={14} />
          <span>Raw Data Preview</span>
        </button>
      </div>

      {/* Tab 1: Content Fields */}
      {activeTab === 'content' && (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8">
          
          {/* Section Kicker & Headings (Common to most sections) */}
          {(section.type !== 'marquee_band') && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Section Kicker (Category Badge)
                </label>
                <input
                  type="text"
                  value={getStr(content.kicker)}
                  onChange={(e) => updateContentField('kicker', e.target.value)}
                  placeholder="e.g. [ 03 — ABOUT & DISCIPLINE ]"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={getStr(content.heading_line_1)}
                  onChange={(e) => updateContentField('heading_line_1', e.target.value)}
                  placeholder="e.g. ENGINEERING,"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-display text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Heading Line 2 (Accent Gradient)
                </label>
                <input
                  type="text"
                  value={getStr(content.heading_line_2)}
                  onChange={(e) => updateContentField('heading_line_2', e.target.value)}
                  placeholder="e.g. DESIGN & LEADERSHIP."
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-display text-sm font-bold text-pink-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Type-Specific Dynamic Fields */}
          {section.type === 'hero' && (
            <div className="space-y-5 border-t border-white/[0.08] pt-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Hero Section Parameters
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Availability Text</label>
                  <input
                    type="text"
                    value={getStr(content.availability_text)}
                    onChange={(e) => updateContentField('availability_text', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Location Tag</label>
                  <input
                    type="text"
                    value={getStr(content.location)}
                    onChange={(e) => updateContentField('location', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">First Name (White Line)</label>
                  <input
                    type="text"
                    value={getStr(content.first_name)}
                    onChange={(e) => updateContentField('first_name', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-display text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Last Name (Accent Line)</label>
                  <input
                    type="text"
                    value={getStr(content.last_name)}
                    onChange={(e) => updateContentField('last_name', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-display text-sm font-bold text-pink-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Rotating Action Word</label>
                <input
                  type="text"
                  value={getStr(content.prompt_action, 'architecting')}
                  onChange={(e) => updateContentField('prompt_action', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Rotating Phrases (one per line)
                </label>
                <textarea
                  rows={4}
                  value={
                    Array.isArray(content.rotating_phrases)
                      ? (content.rotating_phrases as string[]).join('\n')
                      : ''
                  }
                  onChange={(e) =>
                    updateContentField(
                      'rotating_phrases',
                      e.target.value.split('\n').filter((p) => p.trim())
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Hero Bio Narrative</label>
                <textarea
                  rows={3}
                  value={getStr(content.bio)}
                  onChange={(e) => updateContentField('bio', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={getStr(content.cta_primary_label)}
                    onChange={(e) => updateContentField('cta_primary_label', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Primary CTA Link</label>
                  <input
                    type="text"
                    value={getStr(content.cta_primary_url)}
                    onChange={(e) => updateContentField('cta_primary_url', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={getStr(content.cta_secondary_label)}
                    onChange={(e) => updateContentField('cta_secondary_label', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Secondary CTA Link</label>
                  <input
                    type="text"
                    value={getStr(content.cta_secondary_url)}
                    onChange={(e) => updateContentField('cta_secondary_url', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Hero 3D Video File URL (plays smoothly in Hero stage)
                </label>
                <input
                  type="text"
                  value={getStr(content.avatar_video_mp4, '/videos/vedanth-cutout.mp4')}
                  onChange={(e) => updateContentField('avatar_video_mp4', e.target.value)}
                  placeholder="/videos/vedanth-cutout.mp4"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="block mt-1 font-mono text-[10px] text-slate-500">
                  Plays the video stored in public/videos (default: /videos/vedanth-cutout.mp4). No static images will display.
                </span>
              </div>
            </div>
          )}

          {/* About Section Parameters */}
          {section.type === 'about' && (
            <div className="space-y-5 border-t border-white/[0.08] pt-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Developer Terminal &amp; Dossier Configuration
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Terminal Window Title</label>
                  <input
                    type="text"
                    value={getStr(content.terminal_title)}
                    onChange={(e) => updateContentField('terminal_title', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Terminal Badge Status</label>
                  <input
                    type="text"
                    value={getStr(content.terminal_status)}
                    onChange={(e) => updateContentField('terminal_status', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Core Philosophy Narrative</label>
                <textarea
                  rows={4}
                  value={getStr(content.bio_narrative)}
                  onChange={(e) => updateContentField('bio_narrative', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <label className="block font-mono text-xs text-slate-300 font-semibold mb-1">About Section Portrait Image URL</label>
                <input
                  type="text"
                  value={getStr(content.dossier_avatar)}
                  onChange={(e) => updateContentField('dossier_avatar', e.target.value)}
                  placeholder="/images/vedanth-cutout.svg or uploaded storage image"
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="block mt-1.5 font-mono text-[11px] text-slate-400">
                  This image exclusively renders inside the full portrait card on the right side of the About section. It does not affect the Hero section video.
                </span>
              </div>
            </div>
          )}

          {/* Marquee Band Parameters */}
          {section.type === 'marquee_band' && (
            <div className="space-y-4 border-t border-white/[0.08] pt-5">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Marquee Ticker Phrase
                </label>
                <input
                  type="text"
                  value={getStr(content.phrase)}
                  onChange={(e) => updateContentField('phrase', e.target.value)}
                  placeholder="e.g. OPEN TO WORK • FRONTEND & FULL-STACK • MUMBAI • 2027 • "
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-display text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">
                  Speed Multiplier
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={getNum(content.speed, 1.0)}
                  onChange={(e) => updateContentField('speed', parseFloat(e.target.value))}
                  className="w-36 rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Contact Section Parameters */}
          {section.type === 'contact' && (
            <div className="space-y-4 border-t border-white/[0.08] pt-5">
              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1">Contact Narrative</label>
                <textarea
                  rows={3}
                  value={getStr(content.body)}
                  onChange={(e) => updateContentField('body', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={getStr(content.email)}
                    onChange={(e) => updateContentField('email', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1">Copyright Colophon</label>
                  <input
                    type="text"
                    value={getStr(content.copyright)}
                    onChange={(e) => updateContentField('copyright', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Custom Section Rich Text Editor */}
          {section.type === 'custom' && (
            <div className="space-y-4 border-t border-white/[0.08] pt-5">
              <label className="block font-mono text-xs text-slate-400 mb-1">
                Rich Text Content
              </label>
              <RichTextEditor
                value={getStr(content.body)}
                onChange={(val) => updateContentField('body', val)}
              />
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Style & Appearance */}
      {activeTab === 'style' && (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8">
          <h2 className="font-display text-base font-bold text-white uppercase tracking-tight">
            Style &amp; Container Customization
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={getStr(style.bg_color, '#05060a')}
                  onChange={(e) => updateStyleField('bg_color', e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={getStr(style.bg_color, '#05060a')}
                  onChange={(e) => updateStyleField('bg_color', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">Surface Accent Glow</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={getStr(style.glow_color, '#3b82f6')}
                  onChange={(e) => updateStyleField('glow_color', e.target.value)}
                  className="h-9 w-12 rounded cursor-pointer border border-white/20 bg-transparent p-1"
                />
                <input
                  type="text"
                  value={getStr(style.glow_color, '#3b82f6')}
                  onChange={(e) => updateStyleField('glow_color', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">Vertical Padding</label>
              <select
                value={getStr(style.padding_y, 'default')}
                onChange={(e) => updateStyleField('padding_y', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white"
              >
                <option value="none">None (0px)</option>
                <option value="compact">Compact (py-8)</option>
                <option value="default">Standard (py-16 sm:py-24)</option>
                <option value="relaxed">Spacious (py-24 sm:py-32)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-400 mb-1">Layout Variant</label>
              <select
                value={getStr(style.layout, 'default')}
                onChange={(e) => updateStyleField('layout', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white"
              >
                <option value="default">Default Symmetrical</option>
                <option value="centered">Centered Editorial</option>
                <option value="split">Split Columns</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Version History & Rollback */}
      {activeTab === 'history' && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white uppercase tracking-tight">
              Snapshot Revision History
            </h2>
            <span className="font-mono text-xs text-slate-400">
              Select any previous snapshot to inspect and rollback.
            </span>
          </div>

          {versions.length === 0 ? (
            <p className="font-mono text-xs text-slate-500 py-4">
              No previous revisions recorded yet. Saving edits automatically generates snapshots.
            </p>
          ) : (
            <div className="space-y-3 pt-2">
              {versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 font-mono text-xs text-blue-400 border border-blue-500/20">
                      #{versions.length - idx}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white">
                          {new Date(ver.created_at).toLocaleString()}
                        </span>
                        <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-slate-400 uppercase">
                          {ver.status}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        Snapshot ID: {ver.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRollback(ver.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Rollback to this version</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Raw Data Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <FileCode size={16} className="text-blue-400" />
            <span>Underlying JSONB Data Stored in Supabase</span>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/90 p-4 font-mono text-xs text-slate-300 leading-relaxed max-h-[500px]">
            {JSON.stringify({ content, style }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
