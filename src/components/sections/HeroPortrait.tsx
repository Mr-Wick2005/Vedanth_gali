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

export function HeroPortrait({ avatarAlt = 'Vedanth Gali' }: HeroPortraitProps) {
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

  // Parallax calculations (restrained, 4–6px movement)
  const portraitTransform = hasPointer
    ? `translate3d(${offset.x * 5}px, ${offset.y * 5}px, 0)`
    : 'none'
  const ringTransform = hasPointer
    ? `translate3d(${offset.x * -6}px, ${offset.y * -6}px, 0)`
    : 'none'

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[380px] w-full max-w-[540px] items-end justify-center overflow-visible sm:min-h-[460px] md:min-h-[500px] lg:min-h-[540px]"
    >
      {/* Behind-Ring Atmospheric Glow Washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-20 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#00e5ff]/20 via-[#6366f1]/25 to-[#8b5cf6]/30 blur-[75px] sm:h-[380px] sm:w-[380px] lg:h-[460px] lg:w-[460px]"
      />

      {/* Layer 1: 3D Electric-Blue & Violet Circular Energy Ring Canvas */}
      <div
        style={{ transform: ringTransform }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-[52%] transition-transform duration-300 ease-out sm:h-[400px] sm:w-[400px] md:h-[460px] md:w-[460px] lg:h-[500px] lg:w-[500px]"
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
              'drop-shadow(-8px 0px 20px rgba(0, 229, 255, 0.35)) drop-shadow(10px 0px 24px rgba(139, 92, 246, 0.4))',
            // Seamless bottom mask fade into pure black background
            maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/vedanth-cutout.webp"
            alt={avatarAlt || 'Vedanth Gali'}
            width={349}
            height={390}
            loading="eager"
            className="h-[320px] w-auto max-w-full object-contain sm:h-[400px] md:h-[460px] lg:h-[500px]"
          />
        </div>
      </div>
    </div>
  )
}
