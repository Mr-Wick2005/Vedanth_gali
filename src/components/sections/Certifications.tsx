'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type { CertificationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'
import { CredentialModal } from '@/components/ui/CredentialModal'

interface CertificationsProps {
  certifications: CertificationRow[]
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

export function Certifications({ certifications }: CertificationsProps) {
  const [selectedCert, setSelectedCert] = useState<CertificationRow | null>(null)

  return (
    <section id="credentials" className="relative overflow-hidden w-full max-w-full border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-24">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 08 — CREDENTIALS & CERTIFICATIONS ]
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              Verified <br />
              <span className="text-violet-400">Qualifications.</span>
            </h2>
          </div>

          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Directly displaying verified academic coursework certifications, competitive industry simulations, and engineering credentials.
          </p>
        </div>

        {/* Direct Certificate Showcase Grid (Thin borders, clear visual certificate presentation) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {certifications.map((cert) => {
            const iconName = getIssuerIcon(cert.issuer)
            const hasImage = Boolean(cert.image_url)

            return (
              <div key={cert.id} className="w-full">
                <Tilt maxAngle={5} perspective={800} glare={false}>
                  <div
                    onClick={() => setSelectedCert(cert)}
                    data-cursor="view"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c20] shadow-[0_15px_35px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_20px_45px_rgba(139,92,246,0.22)] cursor-pointer"
                  >
                    
                    {/* Top Certificate Stage: Direct Certificate Display */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden border-b border-white/[0.06] bg-black/90 flex items-center justify-center p-2.5">
                      {hasImage ? (
                        <div className="relative h-full w-full overflow-hidden rounded-lg">
                          <Image
                            src={cert.image_url!}
                            alt={cert.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        /* Tasteful Framed Certificate Document Replica */
                        <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-white/10 bg-gradient-to-b from-[#13132b] via-[#090919] to-[#04040d] p-3 text-center shadow-inner">
                          {/* Inner Guilloche Border */}
                          <div className="pointer-events-none absolute inset-1 rounded border border-violet-500/20" />
                          
                          <div className="flex items-center justify-between z-10">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-violet-400 font-semibold truncate max-w-[140px]">
                              {cert.issuer}
                            </span>
                            <span className="font-mono text-[9px] text-muted">
                              {cert.year}
                            </span>
                          </div>

                          <div className="my-auto py-1 z-10">
                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/30 bg-violet-600/10 text-violet-300 mb-1.5 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                              <Icon name={iconName} size={15} />
                            </div>
                            <h4 className="font-display text-xs font-bold text-white line-clamp-2 px-1">
                              {cert.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-mono text-white/30 z-10 border-t border-white/[0.06] pt-1">
                            <span>VERIFIED RECORD</span>
                            <span>OFFICIAL CREDENTIAL</span>
                          </div>
                        </div>
                      )}

                      {/* Hover Pill "Click to Inspect" */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                          <Icon name="search" size={12} />
                          <span>Inspect Full Certificate</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Details Section (Ultra-thin border, clean typography) */}
                    <div className="flex flex-col justify-between p-4 bg-[#090918]">
                      <div>
                        {/* Issuer & Year Tag */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-400 truncate max-w-[170px]">
                            {cert.issuer}
                          </span>
                          {cert.year && (
                            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-muted border border-white/10">
                              {cert.year}
                            </span>
                          )}
                        </div>

                        {/* Certificate Title */}
                        <h3 className="mt-2 line-clamp-2 font-display text-xs sm:text-sm font-bold leading-snug text-text-lilac transition-colors group-hover:text-white">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Action Links */}
                      <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCert(cert)
                          }}
                          className="inline-flex items-center gap-1 text-violet-400 transition-colors hover:text-violet-300 hover:underline cursor-pointer"
                        >
                          <span>View Proof</span>
                          <Icon name="arrow-up-right" size={12} />
                        </button>

                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/40 hover:text-white transition-colors"
                            aria-label={`Verify ${cert.title} online`}
                          >
                            Verify ↗
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </Tilt>
              </div>
            )
          })}
        </div>

        {/* In-App Credential Verification Lightbox Modal */}
        <CredentialModal cert={selectedCert} onClose={() => setSelectedCert(null)} />

      </div>
    </section>
  )
}
