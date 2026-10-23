'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Check scroll boundary status
  const updateScrollState = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)

    // Calculate approx index of card in view
    const itemWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 300
    const currentIdx = Math.round(scrollLeft / itemWidth)
    setActiveIndex(currentIdx)
  }

  useEffect(() => {
    updateScrollState()
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [certifications])

  const scrollByDirection = (dir: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const itemWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 300
    const scrollAmount = dir === 'left' ? -itemWidth * 2 : itemWidth * 2
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section id="credentials" className="relative border-t border-white/[0.08] bg-[#06060f] py-16 sm:py-20">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-violet-600/[0.06] blur-[140px]"
      />

      <div className="mx-auto max-w-[1320px] px-6">
        {/* Section Header with Navigation Controls */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              [ 08 — CREDENTIALS & CERTIFICATIONS ]
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
              Verified <br />
              <span className="text-violet-400">Qualifications.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden max-w-sm font-mono text-xs text-muted leading-relaxed sm:block">
              Coursework validations, cloud certifications, and technical simulations.
            </p>

            {/* Slideshow Arrows (Slides 4-card window smoothly) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByDirection('left')}
                disabled={!canScrollLeft}
                aria-label="Previous certificates"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:border-violet-500/50 hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="arrow-left" size={14} />
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection('right')}
                disabled={!canScrollRight}
                aria-label="Next certificates"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-all hover:border-violet-500/50 hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Card Windowed Scroller / Slideshow */}
        <div
          ref={scrollContainerRef}
          data-cursor="drag"
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certifications.map((cert) => {
            const iconName = getIssuerIcon(cert.issuer)

            return (
              <div
                key={cert.id}
                className="w-[85%] sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3*1rem)/4)] shrink-0 snap-start"
              >
                <Tilt maxAngle={6} perspective={700} glare={false}>
                  <div className="group relative flex h-[210px] sm:h-[225px] flex-col justify-between overflow-hidden rounded-xl border border-white/[0.09] bg-[#0c0c20] p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition-all hover:border-violet-500/40 hover:shadow-[0_15px_35px_rgba(139,92,246,0.18)]">
                    
                    {/* Background Certificate Image (when uploaded) or Architectural Matrix */}
                    {cert.image_url ? (
                      <Image
                        src={cert.image_url}
                        alt={cert.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 33vw, 25vw"
                        className="pointer-events-none absolute inset-0 -z-10 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:12px_12px] opacity-15"
                      />
                    )}

                    {/* Dark Vignette / Gradient Overlay to ensure crisp readability */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/85 to-black/65 backdrop-blur-[0.5px] transition-all group-hover:from-black/90 group-hover:via-black/75"
                    />

                    {/* Top Issuer Badge & Year */}
                    <div>
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-violet-500/25 bg-black/60 text-violet-300 backdrop-blur-sm">
                            <Icon name={iconName} size={14} colored={true} />
                          </div>
                          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white truncate max-w-[120px]">
                            {cert.issuer}
                          </span>
                        </div>

                        {cert.year && (
                          <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-muted border border-white/10">
                            <span>{cert.year}</span>
                          </span>
                        )}
                      </div>

                      {/* Certificate Title */}
                      <h3 className="mt-3 line-clamp-2 font-display text-xs sm:text-sm font-bold leading-snug text-text-lilac group-hover:text-white transition-colors">
                        {cert.title}
                      </h3>
                    </div>

                    {/* Bottom Action */}
                    <div className="border-t border-white/[0.06] pt-2.5">
                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline"
                        >
                          <span>View Certificate</span>
                          <Icon name="arrow-up-right" size={12} />
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-white/30 tracking-wider uppercase">
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

        {/* Footer Rail Info / Slide Indicators */}
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted/60">
          <span className="flex items-center gap-1.5">
            <Icon name="arrow-right" size={11} />
            <span>Horizontal slideshow • {certifications.length} credentials total</span>
          </span>

          <div className="flex items-center gap-1">
            {certifications.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  Math.min(activeIndex, certifications.length - 1) === i
                    ? 'w-4 bg-violet-400'
                    : 'w-1 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
