'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
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
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@/components/ui/icon'
import { useToast } from './ToastContext'
import type { GalleryImage } from '@/lib/images'

interface MultiImageManagerProps {
  folder: string
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
  label?: string
  helpText?: string
  maxFiles?: number
}

// Client-side instant image compression using HTML5 Canvas
async function compressImage(file: File, maxDim = 2048, quality = 0.88): Promise<Blob> {
  // If SVG or GIF, preserve original format
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = reject

    img.onload = () => {
      let { width, height } = img

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve(file)
        return
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            resolve(file)
          }
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Draggable Sortable Item Component
function SortableImageItem({
  item,
  index,
  onRemove,
  onSetCover,
  onUpdateMeta,
}: {
  item: GalleryImage
  index: number
  onRemove: (idx: number) => void
  onSetCover: (idx: number) => void
  onUpdateMeta: (idx: number, field: 'alt' | 'caption', val: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.url + index,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-[#060810] p-3 transition-all ${
        item.isCover ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Drag Handle & Cover Badge */}
      <div className="flex items-center justify-between pb-2 font-mono text-[10px]">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
          title="Drag to reorder"
        >
          <Icon name="menu" size={12} />
          <span>#{index + 1}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {item.isCover ? (
            <span className="rounded bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-400">
              ★ COVER
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSetCover(index)}
              className="text-slate-500 hover:text-blue-400 transition-colors"
            >
              Set Cover
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex h-5 w-5 items-center justify-center rounded text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
            title="Delete photo"
          >
            <Icon name="x" size={13} />
          </button>
        </div>
      </div>

      {/* Image Thumbnail Stage */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
        <Image
          src={item.url}
          alt={item.alt || `Photo ${index + 1}`}
          fill
          sizes="240px"
          className="object-cover"
        />
      </div>

      {/* Metadata Inline Inputs */}
      <div className="mt-2.5 space-y-1.5">
        <input
          type="text"
          value={item.caption || ''}
          onChange={(e) => onUpdateMeta(index, 'caption', e.target.value)}
          placeholder="Caption (e.g. Stage keynote / UI preview)"
          className="w-full rounded border border-white/10 bg-[#0a0c14] px-2 py-1 font-mono text-[11px] text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          value={item.alt || ''}
          onChange={(e) => onUpdateMeta(index, 'alt', e.target.value)}
          placeholder="Alt description for screen readers"
          className="w-full rounded border border-white/10 bg-[#0a0c14] px-2 py-1 font-mono text-[11px] text-slate-300 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  )
}

export function MultiImageManager({
  folder,
  images,
  onChange,
  label = 'Media Showcase & Gallery',
  helpText = 'Drag & drop photos or certificates. Reorder by dragging items.',
  maxFiles = 25,
}: MultiImageManagerProps) {
  const toast = useToast()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [manualUrl, setManualUrl] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex((img, idx) => img.url + idx === active.id)
    const newIndex = images.findIndex((img, idx) => img.url + idx === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        order: idx,
        isCover: idx === 0, // Top item defaults to cover if no other specified
      }))
      onChange(reordered)
    }
  }

  const handleFiles = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      if (images.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum limit of ${maxFiles} images per item.`, 'Upload Limit')
        return
      }

      setUploading(true)
      setUploadProgress(10)

      try {
        const supabase = createClient()
        const newlyUploaded: GalleryImage[] = []
        const total = acceptedFiles.length

        for (let i = 0; i < total; i++) {
          const file = acceptedFiles[i]!
          const compressedBlob = await compressImage(file)
          const ext = file.name.split('.').pop() || 'webp'
          const filePath = `${folder}/${crypto.randomUUID()}.${ext}`

          const { error: uploadError } = await supabase.storage.from('media').upload(filePath, compressedBlob, {
            contentType: compressedBlob.type || 'image/webp',
            upsert: true,
          })

          if (uploadError) {
            console.error('Upload error for file:', file.name, uploadError)
            toast.error(`Failed to upload ${file.name}: ${uploadError.message}`)
            continue
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('media').getPublicUrl(filePath)

          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          const newIndex = images.length + newlyUploaded.length

          newlyUploaded.push({
            url: publicUrl,
            path: filePath,
            alt: cleanName,
            caption: cleanName,
            order: newIndex,
            isCover: images.length === 0 && newlyUploaded.length === 0,
          })

          setUploadProgress(Math.round(((i + 1) / total) * 100))
        }

        if (newlyUploaded.length > 0) {
          onChange([...images, ...newlyUploaded])
          toast.success(`Successfully uploaded ${newlyUploaded.length} image(s).`, 'Upload Complete')
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [images, folder, maxFiles, onChange, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'],
    },
    disabled: uploading,
  })

  const removeImage = (indexToRemove: number) => {
    const itemToRemove = images[indexToRemove]
    const updated = images
      .filter((_, idx) => idx !== indexToRemove)
      .map((img, idx) => ({
        ...img,
        order: idx,
        isCover: idx === 0,
      }))
    onChange(updated)

    // Optionally cleanup from Supabase Storage if path exists
    if (itemToRemove?.path) {
      try {
        const supabase = createClient()
        supabase.storage.from('media').remove([itemToRemove.path]).catch(() => {})
      } catch {
        // non-blocking
      }
    }
  }

  const setCover = (indexToCover: number) => {
    const updated = images.map((img, idx) => ({
      ...img,
      isCover: idx === indexToCover,
    }))
    // Move cover to index 0 for consistent order
    const coverItem = updated[indexToCover]!
    const rest = updated.filter((_, idx) => idx !== indexToCover)
    const reordered = [coverItem, ...rest].map((img, idx) => ({ ...img, order: idx }))
    onChange(reordered)
    toast.success('Cover image updated.')
  }

  const updateMeta = (idx: number, field: 'alt' | 'caption', val: string) => {
    const copy = [...images]
    if (copy[idx]) {
      copy[idx] = { ...copy[idx], [field]: val }
      onChange(copy)
    }
  }

  const addManualUrl = () => {
    if (!manualUrl.trim()) return
    const url = manualUrl.trim()
    const newIndex = images.length
    onChange([
      ...images,
      {
        url,
        alt: `Image ${newIndex + 1}`,
        caption: `Image ${newIndex + 1}`,
        order: newIndex,
        isCover: images.length === 0,
      },
    ])
    setManualUrl('')
    setShowManualInput(false)
    toast.success('External image URL added.')
  }

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="font-display text-sm font-semibold text-white block">
            {label}
          </label>
          <p className="font-mono text-[11px] text-slate-400">{helpText}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="inline-flex items-center gap-1 rounded border border-white/10 bg-[#0a0c14] px-2.5 py-1 font-mono text-[11px] text-slate-300 hover:border-white/20 hover:text-white transition-colors"
          >
            <Icon name="link" size={12} />
            <span>{showManualInput ? 'Cancel' : 'Add by URL'}</span>
          </button>

          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-slate-400">
            {images.length} / {maxFiles}
          </span>
        </div>
      </div>

      {/* Manual URL Input Field */}
      {showManualInput && (
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#060810] p-2.5">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded border border-white/10 bg-[#0a0c14] px-3 py-1.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addManualUrl}
            className="rounded bg-blue-600 px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-blue-500"
          >
            Add
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/15 bg-[#060810]/60 hover:border-blue-400/50 hover:bg-[#0a0c14]'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/10 text-blue-400 mb-2.5">
            <Icon name="upload-cloud" size={20} />
          </div>

          <p className="font-display text-xs sm:text-sm font-semibold text-white">
            {isDragActive ? 'Drop images here...' : 'Click to upload or drag & drop multiple files'}
          </p>

          <p className="mt-1 font-mono text-[11px] text-slate-400">
            Supports PNG, JPG, WebP, AVIF, SVG, GIF • Auto-compressed to WebP before upload
          </p>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="mt-4 w-full">
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
              <span>Uploading &amp; compressing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Draggable Reorderable Images Grid */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img, idx) => img.url + idx)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {images.map((item, idx) => (
                <SortableImageItem
                  key={item.url + idx}
                  item={item}
                  index={idx}
                  onRemove={removeImage}
                  onSetCover={setCover}
                  onUpdateMeta={updateMeta}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
