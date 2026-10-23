'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { HeroRingWrapper } from '@/components/three/HeroRingWrapper'

interface HeroPortraitProps {
  avatarUrl?: string | null
  avatarAlt?: string | null
}

function subscribePointerParallax(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const fine = window.matchMedia('(pointer: fine)')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  fine.addEventListener('change', callback)
  motion.addEventListener('change', callback)
  return () => {
    fine.removeEventListener('change', callback)
    motion.removeEventListener('change', callback)
  }
}

function getPointerParallaxSnapshot() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getPointerParallaxServerSnapshot() {
  return false
}

export function HeroPortrait({ avatarUrl, avatarAlt = 'Vedanth Gali' }: HeroPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const hasPointer = useSyncExternalStore(
    subscribePointerParallax,
    getPointerParallaxSnapshot,
    getPointerParallaxServerSnapshot,
  )

  useEffect(() => {
    if (!hasPointer) return

    function handleMouseMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window
      // Normalized between -1 and 1
      const normX = (e.clientX / innerWidth) * 2 - 1
      const normY = (e.clientY / innerHeight) * 2 - 1
      setOffset({ x: normX, y: normY })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [hasPointer])

  // Parallax calculations (restrained, 4–8px movement)
  const portraitTransform = hasPointer
    ? `translate3d(${offset.x * 6}px, ${offset.y * 6}px, 0)`
    : 'none'
  const ringTransform = hasPointer
    ? `translate3d(${offset.x * -8}px, ${offset.y * -8}px, 0)`
    : 'none'

  // Default to our clean transparent cutout if avatar_url is not set or is identical
  const imageSrc = avatarUrl || '/images/vedanth-cutout.webp'

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[460px] w-full items-end justify-center sm:min-h-[560px] md:min-h-[620px] lg:min-h-[680px] lg:justify-end"
    >
      {/* Behind-Ring Atmospheric Glow Washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-20 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#00e5ff]/20 via-[#6366f1]/25 to-[#8b5cf6]/30 blur-[90px] sm:h-[460px] sm:w-[460px] lg:h-[580px] lg:w-[580px]"
      />

      {/* Layer 1: 3D Electric-Blue & Violet Circular Energy Ring Canvas */}
      <div
        style={{ transform: ringTransform }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[340px] w-[340px] -translate-x-1/2 -translate-y-[52%] transition-transform duration-300 ease-out sm:h-[460px] sm:w-[460px] md:h-[540px] md:w-[540px] lg:h-[620px] lg:w-[620px] xl:h-[680px] xl:w-[680px]"
      >
        <HeroRingWrapper />
      </div>

      {/* Layer 2: Foreground High-Resolution Portrait Cutout */}
      <div
        style={{ transform: portraitTransform }}
        className="relative z-10 flex items-end justify-center transition-transform duration-300 ease-out"
      >
        <div
          className="pointer-events-none relative select-none"
          style={{
            // Controlled dual-tone neon rim lighting (Electric Cyan on left, Violet on right)
            filter:
              'drop-shadow(-10px 0px 24px rgba(0, 229, 255, 0.32)) drop-shadow(12px 0px 28px rgba(139, 92, 246, 0.38))',
            // Seamless bottom mask fade into pure black background
            maskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={avatarAlt || 'Vedanth Gali'}
            width={574}
            height={465}
            loading="eager"
            className="h-[380px] w-auto max-w-none object-contain sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px]"
          />
        </div>
      </div>
    </div>
  )
}
