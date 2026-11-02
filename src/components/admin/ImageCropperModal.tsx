'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Icon } from '@/components/ui/icon'

export type AspectRatioType = '4:3' | '16:9' | '1:1' | '3:2' | 'free'

interface ImageCropperModalProps {
  isOpen: boolean
  imageSrc: string
  fileName?: string
  initialAspect?: AspectRatioType
  onCropComplete: (file: File) => void
  onUseOriginal?: () => void
  onClose: () => void
}

const PRESET_RATIOS: { label: string; value: AspectRatioType; ratio: number | null }[] = [
  { label: '4:3 (Experience)', value: '4:3', ratio: 4 / 3 },
  { label: '16:9 (Projects)', value: '16:9', ratio: 16 / 9 },
  { label: '1:1 (Avatar/Square)', value: '1:1', ratio: 1 },
  { label: '3:2 (Photo)', value: '3:2', ratio: 3 / 2 },
  { label: 'Free (Any)', value: 'free', ratio: null },
]

export function ImageCropperModal({
  isOpen,
  imageSrc,
  fileName = 'cropped-image.webp',
  initialAspect = '4:3',
  onCropComplete,
  onUseOriginal,
  onClose,
}: ImageCropperModalProps) {
  const [selectedAspect, setSelectedAspect] = useState<AspectRatioType>(initialAspect)
  const [zoom, setZoom] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageObjRef = useRef<HTMLImageElement | null>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const imageLoaded = Boolean(imageSrc && loadedSrc === imageSrc)
  const [processing, setProcessing] = useState(false)

  // Reset transforms when image changes or modal opens
  useEffect(() => {
    if (!isOpen || !imageSrc) return

    let cancelled = false

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      imageObjRef.current = img
      setZoom(1)
      setRotation(0)
      setPan({ x: 0, y: 0 })
      setSelectedAspect(initialAspect)
      setLoadedSrc(imageSrc)
    }
    img.src = imageSrc

    return () => {
      cancelled = true
    }
  }, [isOpen, imageSrc, initialAspect])

  // Draw interactive crop preview on canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageObjRef.current
    if (!canvas || !img || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const containerWidth = canvas.width
    const containerHeight = canvas.height

    ctx.clearRect(0, 0, containerWidth, containerHeight)

    // Calculate crop box viewport
    const preset = PRESET_RATIOS.find((p) => p.value === selectedAspect)
    const targetRatio = preset?.ratio ?? img.width / img.height

    const padding = 32
    const maxBoxW = containerWidth - padding * 2
    const maxBoxH = containerHeight - padding * 2

    let boxW = maxBoxW
    let boxH = boxW / targetRatio

    if (boxH > maxBoxH) {
      boxH = maxBoxH
      boxW = boxH * targetRatio
    }

    const boxX = (containerWidth - boxW) / 2
    const boxY = (containerHeight - boxH) / 2

    // 1. Draw Image with pan, zoom, rotation
    ctx.save()

    // Clip to canvas or draw full image for user context
    ctx.translate(containerWidth / 2 + pan.x, containerHeight / 2 + pan.y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(zoom, zoom)

    // Base scale to cover crop box
    const imgAspect = img.width / img.height
    let drawW = boxW
    let drawH = boxW / imgAspect
    if (drawH < boxH) {
      drawH = boxH
      drawW = boxH * imgAspect
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()

    // 2. Draw Translucent Dark Mask over non-crop region
    ctx.save()
    ctx.fillStyle = 'rgba(6, 6, 15, 0.75)'

    // Top
    ctx.fillRect(0, 0, containerWidth, boxY)
    // Bottom
    ctx.fillRect(0, boxY + boxH, containerWidth, containerHeight - (boxY + boxH))
    // Left
    ctx.fillRect(0, boxY, boxX, boxH)
    // Right
    ctx.fillRect(boxX + boxW, boxY, containerWidth - (boxX + boxW), boxH)

    // 3. Draw Crop Box Border & Rule of Thirds
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 2
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    // Rule of Thirds grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    // Verticals
    ctx.beginPath()
    ctx.moveTo(boxX + boxW / 3, boxY)
    ctx.lineTo(boxX + boxW / 3, boxY + boxH)
    ctx.moveTo(boxX + (boxW * 2) / 3, boxY)
    ctx.lineTo(boxX + (boxW * 2) / 3, boxY + boxH)

    // Horizontals
    ctx.moveTo(boxX, boxY + boxH / 3)
    ctx.lineTo(boxX + boxW, boxY + boxH / 3)
    ctx.moveTo(boxX, boxY + (boxH * 2) / 3)
    ctx.lineTo(boxX + boxW, boxY + (boxH * 2) / 3)
    ctx.stroke()

    ctx.restore()
  }, [imageLoaded, selectedAspect, zoom, rotation, pan])

  useEffect(() => {
    drawPreview()
  }, [drawPreview])

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...pan }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false)
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY * -0.001
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 4))
  }

  // Generate cropped output file
  const handleApplyCrop = async () => {
    const img = imageObjRef.current
    if (!img) return
    setProcessing(true)

    try {
      const preset = PRESET_RATIOS.find((p) => p.value === selectedAspect)
      const targetRatio = preset?.ratio ?? img.width / img.height

      // Target high quality output dimensions (up to 1400px width)
      const outputWidth = Math.min(1400, Math.max(800, img.width))
      const outputHeight = Math.round(outputWidth / targetRatio)

      const offscreen = document.createElement('canvas')
      offscreen.width = outputWidth
      offscreen.height = outputHeight
      const ctx = offscreen.getContext('2d')

      if (!ctx) throw new Error('Could not create canvas context')

      // Fill black or transparent
      ctx.fillStyle = '#06060f'
      ctx.fillRect(0, 0, outputWidth, outputHeight)

      // Calculate translation and scaling matching preview viewport
      ctx.save()
      ctx.translate(outputWidth / 2, outputHeight / 2)

      // Map preview pan coordinates to output resolution
      const canvas = canvasRef.current
      const scaleFactor = canvas ? outputWidth / (canvas.width - 64) : 1
      ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor)

      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom, zoom)

      // Base dimension scaled to cover output
      const imgAspect = img.width / img.height
      let drawW = outputWidth
      let drawH = outputWidth / imgAspect
      if (drawH < outputHeight) {
        drawH = outputHeight
        drawW = outputHeight * imgAspect
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()

      // Convert canvas to WebP/JPEG blob
      offscreen.toBlob(
        (blob) => {
          if (!blob) {
            setProcessing(false)
            return
          }
          const cleanName = fileName.replace(/\.[^/.]+$/, '') + '-cropped.webp'
          const file = new File([blob], cleanName, { type: 'image/webp' })
          onCropComplete(file)
          setProcessing(false)
          onClose()
        },
        'image/webp',
        0.92
      )
    } catch {
      setProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-white/15 bg-[#0b0b1c] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <Icon name="crop" size={16} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white">Crop & Frame Photograph</h2>
              <p className="font-mono text-xs text-muted">
                Drag to reposition · Slider or wheel to zoom · Choose section ratio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-white transition-colors"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Aspect Ratio Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.02] px-6 py-3 font-mono text-xs">
          <span className="text-muted text-[11px] uppercase mr-1">Aspect Ratio:</span>
          {PRESET_RATIOS.map((preset) => {
            const isSelected = selectedAspect === preset.value
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  setSelectedAspect(preset.value)
                  setPan({ x: 0, y: 0 })
                }}
                className={`rounded-lg px-3 py-1 font-medium transition-all ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                    : 'border border-white/10 bg-white/[0.04] text-muted hover:border-white/20 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        {/* Canvas Workspace */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black/60 p-4 select-none">
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="cursor-move rounded-xl border border-white/10 shadow-2xl touch-none"
          />

          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 font-mono text-xs text-muted">
              Loading image preview...
            </div>
          )}
        </div>

        {/* Bottom Control Bar: Zoom & Rotation */}
        <div className="border-t border-white/10 bg-white/[0.02] px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <span className="text-muted text-[11px] uppercase">Zoom:</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1.5 w-32 cursor-pointer accent-violet-500"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
                className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              >
                +
              </button>
              <span className="text-text-lilac min-w-[40px] text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-muted hover:border-white/20 hover:text-white transition-colors"
              >
                <Icon name="refresh-cw" size={13} />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1)
                  setPan({ x: 0, y: 0 })
                  setRotation(0)
                }}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-muted hover:border-white/20 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
          <div>
            {onUseOriginal && (
              <button
                type="button"
                onClick={() => {
                  onUseOriginal()
                  onClose()
                }}
                className="font-mono text-xs text-muted hover:text-white underline transition-colors"
              >
                Skip Crop & Use Original
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="rounded-lg border border-white/10 px-4 py-2 font-mono text-xs text-muted hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={processing || !imageLoaded}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 font-mono text-xs font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:bg-violet-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              {processing ? (
                <>
                  <Icon name="loader" size={14} className="animate-spin" />
                  <span>Applying Crop...</span>
                </>
              ) : (
                <>
                  <Icon name="check" size={14} />
                  <span>Apply Crop & Upload</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
