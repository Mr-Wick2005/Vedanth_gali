'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageMetadata {
  url: string
  alt: string
  width: number
  height: number
  path: string
}

interface ImageUploaderProps {
  folder: string
  initialUrl?: string | null
  initialAlt?: string | null
  initialPath?: string | null
  label?: string
  onUploadComplete: (meta: ImageMetadata) => void
  onRemove?: () => void
}

export function ImageUploader({
  folder,
  initialUrl,
  initialAlt = '',
  initialPath,
  label = 'Upload Image',
  onUploadComplete,
  onRemove,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null)
  const [altText, setAltText] = useState(initialAlt || '')
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [currentPath, setCurrentPath] = useState<string | null>(initialPath || null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialUrl || null)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif']
  const maxSizeBytes = 10 * 1024 * 1024 // 10MB

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Allowed: PNG, JPEG, WebP, AVIF.')
      return
    }

    if (file.size > maxSizeBytes) {
      setErrorMsg('File size exceeds the 10 MB limit.')
      return
    }

    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    // Compute dimensions
    const img = new Image()
    img.src = localUrl
    img.onload = async () => {
      const w = img.naturalWidth
      const h = img.naturalHeight
      setDimensions({ width: w, height: h })

      // Auto-upload immediately to Supabase Storage
      setUploading(true)
      try {
        const supabase = createClient()
        const ext = file.name.split('.').pop() || 'webp'
        const filePath = `${folder}/${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('media').getPublicUrl(filePath)

        if (currentPath && currentPath !== filePath) {
          await supabase.storage.from('media').remove([currentPath])
        }

        setCurrentPath(filePath)
        setUploadedUrl(publicUrl)
        setPreviewUrl(publicUrl)

        const finalAlt = altText.trim() || 'Uploaded visual'
        if (!altText.trim()) {
          setAltText(finalAlt)
        }

        onUploadComplete({
          url: publicUrl,
          alt: finalAlt,
          width: w,
          height: h,
          path: filePath,
        })
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
      } finally {
        setUploading(false)
      }
    }
  }

  function handleAltChange(newAlt: string) {
    setAltText(newAlt)
    if (uploadedUrl) {
      onUploadComplete({
        url: uploadedUrl,
        alt: newAlt.trim(),
        width: dimensions?.width || 1200,
        height: dimensions?.height || 800,
        path: currentPath || '',
      })
    }
  }

  async function handleRemoveImage() {
    if (currentPath) {
      try {
        const supabase = createClient()
        await supabase.storage.from('media').remove([currentPath])
      } catch (err) {
        console.error('Failed to delete storage file:', err)
      }
    }
    setPreviewUrl(null)
    setUploadedUrl(null)
    setCurrentPath(null)
    setAltText('')
    setDimensions(null)
    if (onRemove) onRemove()
  }

  return (
    <div className="border-border bg-background space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <label className="text-text font-mono text-xs font-semibold">{label}</label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="cursor-pointer font-mono text-xs text-red-400 hover:underline"
          >
            Remove Image
          </button>
        )}
      </div>

      {/* Image Preview & Upload control */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {previewUrl ? (
          <div className="border-border bg-surface relative h-28 w-28 shrink-0 overflow-hidden rounded border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={altText || 'Preview'}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-border text-muted flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded border border-dashed text-center font-mono text-xs">
            No image
          </div>
        )}

        <div className="w-full flex-1 space-y-2">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, image/avif"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-muted file:border-border file:bg-surface file:text-text hover:file:border-accent w-full cursor-pointer font-mono text-xs file:mr-3 file:rounded file:border file:px-3 file:py-1 file:font-mono file:text-xs"
          />
          {uploading && (
            <p className="text-accent animate-pulse font-mono text-xs">
              Uploading to media bucket...
            </p>
          )}
          {!uploading && uploadedUrl && (
            <p className="font-mono text-xs text-emerald-400">✓ Ready and uploaded to CDN</p>
          )}
          {dimensions && (
            <p className="text-muted font-mono text-[11px]">
              Dimensions: {dimensions.width} × {dimensions.height} px
            </p>
          )}
        </div>
      </div>

      {/* Accessibility Alt-Text Input */}
      <div>
        <label className="text-muted mb-1 block font-mono text-[11px]">
          Accessibility Alt Text <span className="text-accent">*</span>
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => handleAltChange(e.target.value)}
          placeholder="Descriptive explanation of the visual content..."
          className="border-border bg-surface text-text placeholder-muted/50 focus:border-accent w-full rounded border px-3 py-1.5 text-xs focus:outline-none"
        />
      </div>

      {errorMsg && (
        <p className="rounded border border-red-500/20 bg-red-500/10 p-2 font-mono text-xs text-red-400">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
