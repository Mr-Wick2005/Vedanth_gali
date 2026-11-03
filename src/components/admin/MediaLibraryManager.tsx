'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { saveMediaRecord, deleteMediaRecord } from '@/lib/actions/media'
import { useToast } from '@/components/admin/ToastContext'
import type { MediaRow } from '@/types/database'
import {
  UploadCloud,
  Trash2,
  Copy,
  Check,
  Film,
  FileImage,
} from 'lucide-react'

interface MediaLibraryManagerProps {
  initialMedia: MediaRow[]
}

export function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const [mediaList, setMediaList] = useState<MediaRow[]>(initialMedia)
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { showToast } = useToast()

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]
      if (!file) continue
      setUploadProgress(`Uploading ${i + 1} of ${acceptedFiles.length}: ${file.name}`)

      const isVideo = file.type.startsWith('video/')
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `uploads/${Date.now()}_${cleanName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storagePath, file, {
            cacheControl: '31536000',
            upsert: false,
          })

        if (uploadError) {
          showToast(`Error uploading ${file.name}: ${uploadError.message}`, 'error')
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(storagePath)

        const publicUrl = publicUrlData.publicUrl

        const saveRes = await saveMediaRecord({
          bucket_path: storagePath,
          public_url: publicUrl,
          type: isVideo ? 'video' : 'image',
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          mime: file.type,
          size: file.size,
        })

        if (saveRes.success) {
          showToast(`Uploaded ${file.name}`, 'success')
        }
      } catch (err: unknown) {
        showToast(`Upload exception: ${err instanceof Error ? err.message : String(err)}`, 'error')
      }
    }

    setUploading(false)
    setUploadProgress(null)
    window.location.reload()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'],
      'video/*': ['.mp4', '.webm'],
    },
    maxSize: 52428800, // 50MB
  })

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      showToast('Public URL copied to clipboard', 'success')
      setTimeout(() => setCopiedId(null), 2500)
    } catch {
      showToast('Could not copy URL', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this media asset?')) return
    setMediaList((prev) => prev.filter((m) => m.id !== id))
    const res = await deleteMediaRecord(id)
    if (res.success) {
      showToast('Media asset deleted', 'success')
    } else {
      showToast(res.error || 'Failed to delete asset', 'error')
    }
  }

  const filtered = mediaList.filter((item) => {
    if (filter === 'all') return true
    return item.type === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Media Library &amp; Assets
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Store, preview, and manage images and videos stored in Supabase Storage.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-lg border border-white/10 bg-[#0a0c14] p-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1 transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('image')}
            className={`rounded-md px-3 py-1 transition-colors ${
              filter === 'image' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Images ({mediaList.filter((m) => m.type === 'image').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('video')}
            className={`rounded-md px-3 py-1 transition-colors ${
              filter === 'video' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Videos ({mediaList.filter((m) => m.type === 'video').length})
          </button>
        </div>
      </div>

      {/* Dropzone Uploader */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/15 bg-[#0a0c14] hover:border-white/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-3">
          <UploadCloud size={24} />
        </div>
        <p className="font-display text-sm font-bold text-white">
          {isDragActive ? 'Drop files here to upload...' : 'Drag & drop media files, or click to browse'}
        </p>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Supports PNG, JPG, WEBP, SVG, MP4, WEBM up to 50MB per file.
        </p>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600/20 border border-blue-500/40 px-4 py-2 font-mono text-xs text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>{uploadProgress || 'Uploading files to storage...'}</span>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0c14] p-12 text-center">
          <FileImage size={32} className="mx-auto text-slate-600 mb-2" />
          <p className="font-mono text-xs text-slate-400">No media assets found in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0a0c14] transition-all hover:border-blue-500/40 shadow-lg"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center border-b border-white/[0.08]">
                {item.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Film size={28} className="text-pink-400 mb-1" />
                    <span className="font-mono text-[10px] text-slate-500 uppercase">Video Asset</span>
                  </div>
                ) : (
                  <Image
                    src={item.public_url}
                    alt={item.alt_text || 'Media'}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <span className="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-300 border border-white/10">
                  {item.type}
                </span>
              </div>

              {/* Media Info & Actions */}
              <div className="p-3">
                <span className="block truncate font-mono text-xs text-white" title={item.alt_text || item.bucket_path}>
                  {item.alt_text || item.bucket_path.split('/').pop()}
                </span>
                <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.id, item.public_url)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-blue-300 transition-colors"
                  >
                    {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete asset"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
