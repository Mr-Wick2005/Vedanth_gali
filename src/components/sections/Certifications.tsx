'use client'

import React, { useRef } from 'react'
import type { CertificationRow } from '@/types/database'
import { Icon } from '@/components/ui/icon'
import { Tilt } from '@/components/motion/Tilt'

interface CertificationsProps {
  certifications: CertificationRow[]
}

function getIssuerIcon(issuer: string): string {
  const low = issuer.toLowerCase()
  if (low.includes('oracle')) return 'oracle'
  if (low.includes('aws') || low.includes('amazon')) return 'aws'
  if (low.includes('coursera')) return 'coursera'
  if (low.includes('google')) return 'google'
  return 'award'
}

export function Certifications({ certifications }: CertificationsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="credentials" className="relative border-t border-white/[0.08] bg-[#06060f] py-24 sm:py-32">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto max-w-[1320px] px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 08 — CREDENTIALS & CERTIFICATIONS ]
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white">
              Verified <br />
              <span className="text-violet-400">Qualifications.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs sm:text-sm text-muted leading-relaxed">
            Technical milestones, coursework validations, and simulations across cloud architectures and database engineering.
          </p>
        </div>

        {/* Draggable & Scrollable Horizontal Badge Rail */}
        <div
          ref={scrollContainerRef}
          data-cursor="drag"
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certifications.map((cert) => {
            const iconName = getIssuerIcon(cert.issuer)

            return (
              <div
                key={cert.id}
                className="w-[300px] sm:w-[340px] shrink-0 snap-start"
              >
                <Tilt maxAngle={8} perspective={800} glare={false}>
                  <div className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0c20] p-6 shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all hover:border-violet-500/40 hover:bg-[#0f0f29]">
                    
                    {/* Top Issuer & Year */}
                    <div>
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-300">
                            <Icon name={iconName} size={16} />
                          </div>
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                            {cert.issuer}
                          </span>
                        </div>

                        {cert.year && (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                            <Icon name="calendar" size={11} />
                            <span>{cert.year}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-display text-base sm:text-lg font-bold leading-snug text-text-lilac">
                        {cert.title}
                      </h3>
                    </div>

                    {/* Bottom Action (Only show View Certificate when link exists, NO fake verified label) */}
                    <div className="mt-6 border-t border-white/[0.06] pt-4">
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline"
                        >
                          <span>View Certificate</span>
                          <Icon name="arrow-up-right" size={13} />
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] text-white/30 tracking-wider uppercase">
                          Credential on record
                        </span>
                      )}
                    </div>

                  </div>
                </Tilt>
              </div>
            )
          })}
        </div>

        {/* Drag Hint */}
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted/60">
          <span className="flex items-center gap-1.5">
            <Icon name="arrow-right" size={12} />
            <span>Drag or scroll horizontally to explore</span>
          </span>
          <span>{certifications.length} Credentials Listed</span>
        </div>
      </div>
    </section>
  )
}
