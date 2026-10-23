'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FileUploaderProps {
  initialUrl?: string | null
  initialPath?: string | null
  label?: string
  onUploadComplete: (url: string, path: string) => void
  onRemove?: () => void
}

export function FileUploader({
  initialUrl,
  initialPath,
  label = 'Upload PDF Document',
  onUploadComplete,
  onRemove,
}: FileUploaderProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl || null)
  const [currentPath, setCurrentPath] = useState<string | null>(initialPath || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMsg(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Only PDF documents are permitted.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10 MB limit.')
      return
    }

    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setErrorMsg(null)

    try {
      const supabase = createClient()
      const filePath = `resume/${crypto.randomUUID()}.pdf`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (uploadError) throw new Error(uploadError.message)

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(filePath)

      if (currentPath && currentPath !== filePath) {
        await supabase.storage.from('media').remove([currentPath])
      }

      setCurrentUrl(publicUrl)
      setCurrentPath(filePath)
      setSelectedFile(null)
      onUploadComplete(publicUrl, filePath)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (currentPath) {
      try {
        const supabase = createClient()
        await supabase.storage.from('media').remove([currentPath])
      } catch (err) {
        console.error('Failed to remove file:', err)
      }
    }
    setCurrentUrl(null)
    setCurrentPath(null)
    setSelectedFile(null)
    if (onRemove) onRemove()
  }

  return (
    <div className="border-border bg-background space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <label className="text-text font-mono text-xs font-semibold">{label}</label>
        {currentUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="font-mono text-xs text-red-400 hover:underline"
          >
            Remove File
          </button>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="text-muted file:border-border file:bg-surface file:text-text hover:file:border-accent font-mono text-xs file:mr-3 file:rounded file:border file:px-3 file:py-1 file:font-mono file:text-xs"
        />

        {selectedFile && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="border-accent bg-accent/15 text-accent hover:bg-accent hover:text-text rounded border px-4 py-1.5 font-mono text-xs font-semibold disabled:opacity-50"
          >
            {uploading ? 'Uploading PDF...' : 'Upload PDF'}
          </button>
        )}
      </div>

      {currentUrl && (
        <div className="border-border/60 bg-surface flex items-center justify-between rounded border p-2.5">
          <span className="text-text max-w-xs truncate font-mono text-xs">
            📄 Current Résumé Document
          </span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-mono text-xs hover:underline"
          >
            View PDF ↗
          </a>
        </div>
      )}

      {errorMsg && (
        <p className="rounded border border-red-500/20 bg-red-500/10 p-2 font-mono text-xs text-red-400">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
