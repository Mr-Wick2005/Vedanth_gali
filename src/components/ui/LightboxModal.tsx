'use client'

import React, { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@/components/ui/icon'
import type { GalleryImage } from '@/lib/images'

interface LightboxModalProps {
  isOpen: boolean
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function LightboxModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const currentImage = images[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && images.length > 1) {
        onNavigate((currentIndex - 1 + images.length) % images.length)
      }
      if (e.key === 'ArrowRight' && images.length > 1) {
        onNavigate((currentIndex + 1) % images.length)
      }
    },
    [isOpen, images.length, currentIndex, onClose, onNavigate],
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !currentImage) return null

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox preview"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 -z-10"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3 font-mono text-xs">
          {images.length > 1 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close lightbox"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-3 sm:left-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-all hover:bg-blue-600 hover:border-blue-500 focus:outline-none"
            aria-label="Previous image"
          >
            <Icon name="arrow-left" size={20} />
          </button>
        )}

        {/* Main Stage Image */}
        <div className="relative flex flex-col items-center justify-center max-w-[92vw] max-h-[85vh] w-full">
          <motion.div
            key={currentImage.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center max-w-full max-h-[75vh]"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || 'Visual preview'}
              width={1600}
              height={1000}
              priority
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
          </motion.div>

          {/* Caption & Metadata */}
          {(currentImage.caption || currentImage.alt) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 max-w-xl text-center"
            >
              <p className="font-mono text-xs sm:text-sm text-slate-300">
                {currentImage.caption || currentImage.alt}
              </p>
            </motion.div>
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-3 sm:right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-all hover:bg-blue-600 hover:border-blue-500 focus:outline-none"
            aria-label="Next image"
          >
            <Icon name="arrow-right" size={20} />
          </button>
        )}
      </div>
    </AnimatePresence>
  )
}
