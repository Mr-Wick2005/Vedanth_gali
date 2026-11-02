'use client'

import React, { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Icon } from '@/components/ui/icon'
import { useToast } from './ToastContext'
import { ImageCropperModal, type AspectRatioType } from './ImageCropperModal'

export interface UploadedMediaMeta {
  url: string
  alt?: string
  path?: string
  width?: number
  height?: number
  contentType?: string
}

export type MediaUploaderMode = 'image' | 'video' | 'pdf' | 'any'

interface MediaUploaderProps {
  folder: string
  mode?: MediaUploaderMode
  initialUrl?: string | null
  initialAlt?: string | null
  initialPath?: string | null
  label?: string
  helpText?: string
  requiredAlt?: boolean
  aspectRatioPreset?: AspectRatioType
  allowCrop?: boolean
  onUploadComplete: (meta: UploadedMediaMeta) => void
  onRemove?: () => void
}

const MIME_CONFIGS: Record<
  MediaUploaderMode,
  { accept: string; allowed: string[]; maxBytes: number; desc: string }
> = {
  image: {
    accept: 'image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/gif',
    allowed: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'image/gif',
    ],
    maxBytes: 15 * 1024 * 1024, // 15MB
    desc: 'PNG, JPEG, WebP, AVIF, SVG (max 15MB)',
  },
  video: {
    accept: 'video/mp4,video/webm,video/quicktime',
    allowed: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxBytes: 25 * 1024 * 1024, // 25MB (storage limit)
    desc: 'MP4 or WebM (max 25MB)',
  },
  pdf: {
    accept: 'application/pdf',
    allowed: ['application/pdf'],
    maxBytes: 20 * 1024 * 1024, // 20MB
    desc: 'PDF document (max 20MB)',
  },
  any: {
    accept:
      'image/png,image/jpeg,image/webp,image/avif,image/svg+xml,video/mp4,video/webm,application/pdf',
    allowed: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ],
    maxBytes: 25 * 1024 * 1024,
    desc: 'Images, MP4/WebM videos, or PDF (max 25MB)',
  },
}

export function MediaUploader({
  folder,
  mode = 'image',
  initialUrl,
  initialAlt = '',
  initialPath,
  label = 'Upload Media',
  helpText,
  requiredAlt = false,
  aspectRatioPreset = '4:3',
  allowCrop = true,
  onUploadComplete,
  onRemove,
}: MediaUploaderProps) {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl || null)
  const [altText, setAltText] = useState(initialAlt || '')
  const [currentPath, setCurrentPath] = useState<string | null>(initialPath || null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [manualInputMode, setManualInputMode] = useState(false)
  const [manualUrl, setManualUrl] = useState('')

  // Interactive Image Cropper State
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const config = MIME_CONFIGS[mode]

  const isVideo =
    currentUrl?.endsWith('.mp4') ||
    currentUrl?.endsWith('.webm') ||
    mode === 'video'
  const isPdf =
    currentUrl?.endsWith('.pdf') ||
    mode === 'pdf'

  const handleUploadFile = useCallback(
    async (file: File) => {
      setErrorMsg(null)

      // 1. Validation
      if (!config.allowed.includes(file.type)) {
        const err = `Invalid file format (${file.type || 'unknown'}). Allowed: ${config.desc}`
        setErrorMsg(err)
        toast.error(err, 'Format Not Allowed')
        return
      }

      if (file.size > config.maxBytes) {
        const mb = Math.round(config.maxBytes / (1024 * 1024))
        const err = `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the ${mb} MB limit.`
        setErrorMsg(err)
        toast.error(err, 'File Too Large')
        return
      }

      setUploading(true)
      setUploadProgress(15)

      try {
        const supabase = createClient()
        const ext = file.name.split('.').pop() || 'bin'
        const filePath = `${folder}/${crypto.randomUUID()}.${ext}`

        setUploadProgress(45)

        // Upload to Supabase Storage bucket 'media'
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            contentType: file.type,
            upsert: true,
          })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        setUploadProgress(85)

        const {
          data: { publicUrl },
        } = supabase.storage.from('media').getPublicUrl(filePath)

        // Remove old file if it existed
        if (currentPath && currentPath !== filePath) {
          try {
            await supabase.storage.from('media').remove([currentPath])
          } catch {
            // non-fatal
          }
        }

        setCurrentPath(filePath)
        setCurrentUrl(publicUrl)
        setUploadProgress(100)

        const finalAlt = altText.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        if (!altText.trim() && mode === 'image') {
          setAltText(finalAlt)
        }

        onUploadComplete({
          url: publicUrl,
          alt: finalAlt,
          path: filePath,
          contentType: file.type,
        })

        toast.success(`Successfully uploaded "${file.name}" to CDN.`, 'Upload Complete')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed. Check Supabase credentials.'
        setErrorMsg(message)
        toast.error(message, 'Upload Failed')
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [config, currentPath, folder, altText, mode, onUploadComplete, toast],
  )

  // Drag and Drop Handlers
  const processIncomingFile = (file: File) => {
    if (mode === 'image' && allowCrop && file.type.startsWith('image/')) {
      const objUrl = URL.createObjectURL(file)
      setPendingFile(file)
      setCropperImageSrc(objUrl)
      setIsCropperOpen(true)
    } else {
      handleUploadFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processIncomingFile(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processIncomingFile(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveMedia = async () => {
    if (currentPath) {
      try {
        const supabase = createClient()
        await supabase.storage.from('media').remove([currentPath])
      } catch (err) {
        console.error('Failed to delete file from storage:', err)
      }
    }
    setCurrentUrl(null)
    setCurrentPath(null)
    setAltText('')
    setErrorMsg(null)
    if (onRemove) onRemove()
    toast.info('Media removed from record.', 'File Removed')
  }

  const handleCopyUrl = async () => {
    if (!currentUrl) return
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.info('Direct media URL copied to clipboard.', 'Link Copied')
    } catch {
      // fallback
    }
  }

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return
    setCurrentUrl(manualUrl.trim())
    onUploadComplete({
      url: manualUrl.trim(),
      alt: altText.trim(),
    })
    setManualInputMode(false)
    toast.success('Custom media URL applied.', 'URL Saved')
  }

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-[#0c0c20]/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      {/* Label and Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div>
          <label className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
            {label}
          </label>
          {helpText && (
            <p className="mt-0.5 font-mono text-[11px] text-muted">{helpText}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentUrl && (
            <>
              {mode === 'image' && allowCrop && (
                <button
                  type="button"
                  onClick={() => {
                    setCropperImageSrc(currentUrl)
                    setPendingFile(null)
                    setIsCropperOpen(true)
                  }}
                  className="inline-flex items-center gap-1 rounded border border-violet-500/30 bg-violet-600/10 px-2.5 py-1 font-mono text-[11px] text-violet-300 transition-colors hover:bg-violet-600/20 hover:text-white"
                  title="Crop and frame photograph"
                >
                  <Icon name="crop" size={12} />
                  <span>Crop & Frame</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/70 transition-colors hover:border-violet-500/40 hover:text-white"
              >
                <Icon name={copied ? 'check' : 'copy'} size={12} />
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveMedia}
                className="cursor-pointer rounded border border-red-500/20 bg-red-500/10 px-2.5 py-1 font-mono text-[11px] text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
              >
                Remove
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setManualInputMode((prev) => !prev)}
            className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted hover:text-white"
          >
            {manualInputMode ? 'Upload Mode' : 'Direct URL Mode'}
          </button>
        </div>
      </div>

      {/* Manual URL Input Switch */}
      {manualInputMode ? (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... direct image, video or PDF URL"
            className="flex-1 rounded-lg border border-white/10 bg-[#060614] px-3 py-2 font-mono text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="rounded-lg bg-violet-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Apply
          </button>
        </div>
      ) : null}

      {/* Active Preview Area & Drag-and-Drop Dropzone */}
      <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
        {/* Visual Preview (4 cols if media loaded, else hidden) */}
        {currentUrl ? (
          <div className="sm:col-span-5">
            <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-inner">
              {isVideo ? (
                <video
                  src={currentUrl}
                  controls
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
              ) : isPdf ? (
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-600/10 text-violet-300">
                    <Icon name="award" size={24} />
                  </div>
                  <span className="mt-2 font-mono text-xs text-white font-medium">
                    PDF Document Attached
                  </span>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 font-mono text-[10px] text-violet-400 hover:underline"
                  >
                    Open Document ↗
                  </a>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    src={currentUrl}
                    alt={altText || 'Media preview'}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[9px] text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    View Original ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Dropzone Container (full width if no media, 7 cols if preview present) */}
        <div className={currentUrl ? 'sm:col-span-7' : 'sm:col-span-12'}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-violet-400 bg-violet-500/15 shadow-[0_0_25px_rgba(139,92,246,0.3)]'
                : 'border-white/15 bg-white/[0.02] hover:border-violet-500/50 hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={config.accept}
              onChange={handleFileInputChange}
              disabled={uploading}
              className="hidden"
            />

            {uploading ? (
              <div className="w-full space-y-3 py-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 animate-spin">
                  <Icon name="sparkles" size={18} />
                </div>
                <p className="font-mono text-xs text-violet-300">
                  Uploading to Supabase Storage ({uploadProgress}%)...
                </p>
                <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-violet-400 group-hover:text-white">
                  <Icon name={isDragging ? 'sparkles' : 'upload'} size={20} />
                </div>

                <div className="mt-3">
                  <p className="font-mono text-xs font-medium text-white">
                    {isDragging ? 'Drop file to upload' : 'Drag & drop file here, or click to browse'}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted">
                    {config.desc}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Alt Text Input (for accessibility) */}
      {mode !== 'video' && mode !== 'pdf' && (
        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] text-muted">
              Visual Alt Text {requiredAlt && <span className="text-violet-400">*</span>}
            </label>
            <span className="font-mono text-[10px] text-white/40">
              Screen readers & SEO
            </span>
          </div>
          <input
            type="text"
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value)
              if (currentUrl) {
                onUploadComplete({
                  url: currentUrl,
                  alt: e.target.value.trim(),
                  path: currentPath || undefined,
                })
              }
            }}
            placeholder="Descriptive explanation of what is shown in this visual..."
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#060614] px-3 py-2 font-mono text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
          />
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-300">
          <Icon name="alert" size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Image Cropper Modal */}
      {isCropperOpen && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageSrc={cropperImageSrc}
          fileName={pendingFile?.name || 'cropped-photo.webp'}
          initialAspect={aspectRatioPreset}
          onCropComplete={(croppedFile) => {
            handleUploadFile(croppedFile)
            if (cropperImageSrc.startsWith('blob:')) {
              URL.revokeObjectURL(cropperImageSrc)
            }
          }}
          onUseOriginal={
            pendingFile
              ? () => {
                  handleUploadFile(pendingFile)
                  if (cropperImageSrc.startsWith('blob:')) {
                    URL.revokeObjectURL(cropperImageSrc)
                  }
                }
              : undefined
          }
          onClose={() => {
            setIsCropperOpen(false)
            if (cropperImageSrc.startsWith('blob:')) {
              URL.revokeObjectURL(cropperImageSrc)
            }
          }}
        />
      )}
    </div>
  )
}
