'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { CertificationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'
import { CredentialModal } from '@/components/ui/CredentialModal'
import { extractGalleryImages } from '@/lib/images'

interface CertificationsProps {
  certifications: CertificationRow[]
  content?: Record<string, unknown> | null
  style?: Record<string, unknown> | null
}

function getIssuerIcon(issuer: string): string {
  const low = issuer.toLowerCase()
  if (low.includes('iit') || low.includes('nptel')) return 'award'
  if (low.includes('edupyramids') || low.includes('sine')) return 'cpu'
  if (low.includes('forage') || low.includes('tata')) return 'sparkles'
  if (low.includes('linux')) return 'terminal'
  if (low.includes('oracle')) return 'database'
  if (low.includes('aws') || low.includes('amazon')) return 'server'
  if (low.includes('google')) return 'globe'
  return 'award'
}

export function Certifications({ certifications, content }: CertificationsProps) {
  const [selectedCert, setSelectedCert] = useState<CertificationRow | null>(null)

  const kicker =
    typeof content?.kicker === 'string' && content.kicker.trim()
      ? content.kicker
      : '[ 08 — CREDENTIALS & CERTIFICATIONS ]'

  const headingLine1 =
    typeof content?.heading_line_1 === 'string' && content.heading_line_1.trim()
      ? content.heading_line_1
      : 'Verified'

  const headingLine2 =
    typeof content?.heading_line_2 === 'string' && content.heading_line_2.trim()
      ? content.heading_line_2
      : 'Qualifications.'

  const subtitle =
    typeof content?.subtitle === 'string' && content.subtitle.trim()
      ? content.subtitle
      : 'Directly displaying verified academic coursework certifications, competitive industry simulations, and engineering credentials.'

  return (
    <section id="credentials" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#05060a] py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 right-0 h-[350px] w-[350px] translate-x-1/3 rounded-full bg-pink-600/[0.06] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
              {kicker}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              {headingLine1} <br />
              <span className="text-gradient-accent">{headingLine2}</span>
            </h2>
          </div>

          <p className="max-w-md font-mono text-xs sm:text-sm text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Certificate Showcase Grid - Symmetrical Equal Heights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {certifications.map((cert) => {
            const iconName = getIssuerIcon(cert.issuer)
            const galleryImages = extractGalleryImages(cert)
            const primaryImage = galleryImages[0]

            return (
              <div key={cert.id} className="w-full h-full flex flex-col">
                <Tilt maxAngle={5} perspective={800} glare={false} className="w-full h-full flex flex-col flex-1">
                  <div
                    onClick={() => setSelectedCert(cert)}
                    data-cursor="view"
                    className="group relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0a0c14] shadow-[0_15px_35px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_20px_45px_rgba(37,99,235,0.25)] cursor-pointer h-full"
                  >
                    
                    {/* Top Certificate Stage */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-white/[0.08] bg-black/90 flex items-center justify-center p-2.5">
                      {primaryImage ? (
                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt || cert.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                          {galleryImages.length > 1 && (
                            <span className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/70 px-2 py-0.5 font-mono text-[9px] text-white">
                              +{galleryImages.length - 1} photos
                            </span>
                          )}
                        </div>
                      ) : (
                        /* Framed Certificate Document Replica */
                        <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-white/10 bg-gradient-to-b from-[#10131d] via-[#0a0c14] to-[#05060a] p-3 text-center shadow-inner">
                          <div className="pointer-events-none absolute inset-1 rounded border border-blue-500/20" />
                          
                          <div className="flex items-center justify-between z-10">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-blue-400 font-semibold truncate max-w-[140px]">
                              {cert.issuer}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400">
                              {cert.year}
                            </span>
                          </div>

                          <div className="my-auto py-1 z-10">
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/30 bg-blue-600/10 text-blue-300 mb-1.5 shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                              <Icon name={iconName} size={15} />
                            </div>
                            <h4 className="font-display text-xs font-bold text-white line-clamp-2 px-1">
                              {cert.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 z-10 border-t border-white/[0.06] pt-1">
                            <span>VERIFIED RECORD</span>
                            <span>OFFICIAL CREDENTIAL</span>
                          </div>
                        </div>
                      )}

                      {/* Hover Pill "Click to Inspect" */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.6)]">
                          <Icon name="search" size={12} />
                          <span>Inspect Full Certificate</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Details Section - Symmetrical flex */}
                    <div className="flex flex-1 flex-col justify-between p-4 bg-[#0a0c14]">
                      <div>
                        {/* Issuer & Year Tag */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-blue-400 truncate max-w-[170px]">
                            {cert.issuer}
                          </span>
                          {cert.year && (
                            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-white/10">
                              {cert.year}
                            </span>
                          )}
                        </div>

                        {/* Certificate Title */}
                        <h3 className="mt-2 line-clamp-2 font-display text-xs sm:text-sm font-bold leading-snug text-slate-200 transition-colors group-hover:text-white">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Bottom Footer Verification Link */}
                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-blue-300 transition-colors">
                          <Icon name="external-link" size={12} />
                          <span>View Details</span>
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    </div>

                  </div>
                </Tilt>
              </div>
            )
          })}
        </div>
      </div>

      {/* Credential Fullscreen Modal */}
      {selectedCert && (
        <CredentialModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </section>
  )
}
