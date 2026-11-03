'use client'

import React, { useEffect, useCallback } from 'react'
import type { CertificationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { extractGalleryImages } from '@/lib/images'
import { ImageSlideshow } from './ImageSlideshow'

interface CredentialModalProps {
  cert: CertificationRow | null
  onClose: () => void
}

export function CredentialModal({ cert, onClose }: CredentialModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!cert) return
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cert, handleKeyDown])

  if (!cert) return null

  const galleryImages = extractGalleryImages(cert)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cert-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#0a0c14] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header & Close */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Icon name="award" size={20} />
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
                [ VERIFIED CREDENTIAL ]
              </span>
              <p className="font-mono text-xs text-slate-400 mt-0.5">{cert.issuer}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Certificate Title */}
        <h3
          id="modal-cert-title"
          className="mt-5 font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-white leading-snug"
        >
          {cert.title}
        </h3>

        {/* Certificate Media Viewport */}
        <div className="mt-5">
          {galleryImages.length > 0 ? (
            <ImageSlideshow
              images={galleryImages}
              aspectRatio="video"
              altFallback={cert.title}
              showThumbnails={galleryImages.length > 1}
            />
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 flex flex-col items-center justify-center text-center p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px] opacity-20"
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/10 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Icon name="award" size={28} />
              </div>
              <span className="mt-3 font-mono text-xs text-slate-200 font-medium">
                Official Credential Verification Record
              </span>
              <span className="mt-1 font-mono text-[11px] text-slate-400">
                Completed &amp; Evaluated • Year {cert.year || '2024–2026'}
              </span>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-white/[0.08] py-4 font-mono text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider block text-[10px]">ISSUING AUTHORITY</span>
            <span className="text-white font-medium mt-1 block truncate">{cert.issuer}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase tracking-wider block text-[10px]">YEAR ISSUED</span>
            <span className="text-white font-medium mt-1 block">{cert.year || 'Verified'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 hover:border-white/20 hover:text-white transition-all"
          >
            Close
          </button>

          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all"
            >
              <span>Verify on Platform</span>
              <Icon name="arrow-up-right" size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
