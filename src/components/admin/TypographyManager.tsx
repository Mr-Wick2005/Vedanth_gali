'use client'

import React, { useState } from 'react'
import type { FontRow, SiteSettingsRow } from '@/types/database'
import { saveFont, deleteFont } from '@/lib/actions/fonts'
import { updateSiteSettings } from '@/lib/actions/settings'
import { useToast } from '@/components/admin/ToastContext'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'

interface TypographyManagerProps {
  initialFonts: FontRow[]
  settings: SiteSettingsRow | null
}

const POPULAR_GOOGLE_FONTS = [
  'Unbounded',
  'Geist',
  'Geist Mono',
  'Inter',
  'Plus Jakarta Sans',
  'Outfit',
  'Syne',
  'Space Grotesk',
  'JetBrains Mono',
  'Fira Code',
  'Clash Display',
]

export function TypographyManager({ initialFonts, settings }: TypographyManagerProps) {
  const [fonts, setFonts] = useState<FontRow[]>(initialFonts)
  const [displayFont, setDisplayFont] = useState(settings?.display_font_family || 'Unbounded')
  const [bodyFont, setBodyFont] = useState(settings?.body_font_family || 'Geist')
  const [monoFont, setMonoFont] = useState(settings?.mono_font_family || 'Geist Mono')
  const [newFontName, setNewFontName] = useState('')
  const [newFontSource, setNewFontSource] = useState<'google' | 'uploaded'>('google')
  const [savingGlobal, setSavingGlobal] = useState(false)
  const { showToast } = useToast()

  const handleSaveGlobalFonts = async () => {
    if (!settings?.id) {
      showToast('Settings row missing', 'error')
      return
    }

    setSavingGlobal(true)
    const res = await updateSiteSettings({
      id: settings.id,
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      availability_visible: settings.availability_visible,
      display_font_family: displayFont,
      body_font_family: bodyFont,
      mono_font_family: monoFont,
    })
    setSavingGlobal(false)

    if (res.success) {
      showToast('Global font families updated', 'success')
    } else {
      showToast(res.error || 'Failed to update fonts', 'error')
    }
  }

  const handleAddFont = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFontName.trim()) return

    const res = await saveFont({
      name: newFontName.trim(),
      source: newFontSource,
      weights: ['400', '600', '700'],
    })

    if (res.success) {
      showToast(`Font ${newFontName} registered`, 'success')
      setNewFontName('')
      window.location.reload()
    } else {
      showToast(res.error || 'Failed to add font', 'error')
    }
  }

  const handleDeleteFont = async (id: string) => {
    if (!confirm('Remove this font?')) return
    setFonts((prev) => prev.filter((f) => f.id !== id))
    const res = await deleteFont(id)
    if (res.success) {
      showToast('Font removed', 'success')
    } else {
      showToast(res.error || 'Failed to delete font', 'error')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Typography &amp; Fonts
        </h1>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Configure site-wide font families or add custom web fonts.
        </p>
      </div>

      {/* Global Font Roles Assignment */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="font-display text-base font-bold text-white uppercase tracking-tight">
              Site Font Role Assignment
            </h2>
            <span className="font-mono text-xs text-slate-400">
              Assigned fonts are applied to all headlines, editorial paragraphs, and developer chrome.
            </span>
          </div>

          <button
            type="button"
            disabled={savingGlobal}
            onClick={handleSaveGlobalFonts}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-blue-500 transition-all disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>{savingGlobal ? 'Saving...' : 'Apply Font Settings'}</span>
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Display Font */}
          <div>
            <label className="block font-mono text-xs text-blue-400 uppercase tracking-wider mb-2 font-semibold">
              Display Headline Font
            </label>
            <select
              value={displayFont}
              onChange={(e) => setDisplayFont(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <p className="font-mono text-[11px] text-slate-500 mt-2">
              Used for major titles, kinetic hero banners, and project headlines.
            </p>
          </div>

          {/* Body Font */}
          <div>
            <label className="block font-mono text-xs text-blue-400 uppercase tracking-wider mb-2 font-semibold">
              Body / Editorial Font
            </label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 font-sans text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <p className="font-mono text-[11px] text-slate-500 mt-2">
              Used for long-form biography narratives, descriptions, and article text.
            </p>
          </div>

          {/* Monospace Font */}
          <div>
            <label className="block font-mono text-xs text-blue-400 uppercase tracking-wider mb-2 font-semibold">
              Developer Monospace Font
            </label>
            <select
              value={monoFont}
              onChange={(e) => setMonoFont(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/60 px-3.5 py-2.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              {POPULAR_GOOGLE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <p className="font-mono text-[11px] text-slate-500 mt-2">
              Used for terminal windows, timestamps, tags, and status pills.
            </p>
          </div>
        </div>

        {/* Live Font Preview Box */}
        <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-5 space-y-3">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
            Preview Rendering
          </span>
          <div className="space-y-2">
            <h3
              style={{ fontFamily: displayFont }}
              className="text-2xl font-black uppercase text-white tracking-tight"
            >
              ENGINEERING, DESIGN &amp; LEADERSHIP
            </h3>
            <p style={{ fontFamily: bodyFont }} className="text-sm text-slate-300 leading-relaxed max-w-xl">
              I bridge systems engineering, creative direction, and technical event leadership.
            </p>
            <span style={{ fontFamily: monoFont }} className="text-xs text-blue-400 block">
              ~/profile/engineering-philosophy.md • 100% VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Registered Fonts List */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-base font-bold text-white uppercase tracking-tight">
          Registered Web Fonts ({fonts.length})
        </h2>

        <div className="space-y-2.5">
          {fonts.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 p-3"
            >
              <div>
                <span className="font-display text-sm font-bold text-white">{f.name}</span>
                <span className="ml-2 rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400 uppercase">
                  {f.source}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteFont(f.id)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                title="Remove font"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Register New Font Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0c14] p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-base font-bold text-white uppercase tracking-tight">
          Register Web Font
        </h2>

        <form onSubmit={handleAddFont} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newFontName}
            onChange={(e) => setNewFontName(e.target.value)}
            placeholder="Google Font name (e.g. Syne, Outfit, Space Grotesk)"
            className="flex-1 rounded-lg border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
          />

          <select
            value={newFontSource}
            onChange={(e) => setNewFontSource(e.target.value as 'google' | 'uploaded')}
            className="rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs text-white"
          >
            <option value="google">Google Fonts</option>
            <option value="uploaded">Custom Uploaded File</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Font</span>
          </button>
        </form>
      </div>
    </div>
  )
}
