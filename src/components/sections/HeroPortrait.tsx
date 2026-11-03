'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { HeroRingWrapper } from '@/components/three/HeroRingWrapper'

function subscribeCoarse(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(pointer: coarse)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getCoarseSnapshot() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(pointer: coarse)').matches
}

interface HeroPortraitProps {
  avatarUrl?: string | null
  avatarAlt?: string | null
}

export function HeroPortrait({ avatarUrl, avatarAlt = 'Vedanth Gali' }: HeroPortraitProps) {
  const imageSrc = avatarUrl || '/images/vedanth-cutout.webp'
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const isTouch = useSyncExternalStore(subscribeCoarse, getCoarseSnapshot, () => true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (isTouch || shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2
      const y = (e.clientY / innerHeight - 0.5) * 2
      setTilt({ x: x * 3.5, y: y * -3.5 })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isTouch, shouldReduceMotion])

  return (
    <div className="relative flex w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] xl:max-w-[380px] items-center justify-center lg:justify-end mx-auto lg:mr-0">
      {/* Layer 1: Ambient Electric Blue & Magenta Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] left-1/2 -z-20 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.22] blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[35%] -z-20 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.18] blur-[70px]"
      />

      {/* Layer 2: WebGL Energy Ring (Proportionately scaled) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div className="relative h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] lg:h-[320px] lg:w-[320px] xl:h-[350px] xl:w-[350px]">
          <HeroRingWrapper />
        </div>
      </div>

      {/* Layer 3: Proportional Portrait Cutout with subtle 3D pointer tilt */}
      <motion.div
        className="relative select-none will-change-transform"
        animate={{
          rotateY: isTouch || shouldReduceMotion ? 0 : tilt.x,
          rotateX: isTouch || shouldReduceMotion ? 0 : tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.1 }}
        style={{
          perspective: 1000,
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
        }}
      >
        <Image
          src={imageSrc}
          alt={avatarAlt || 'Vedanth Gali portrait'}
          width={380}
          height={420}
          priority
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 380px"
          className="h-[240px] sm:h-[280px] md:h-[320px] lg:h-[350px] xl:h-[380px] w-auto max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
        />
      </motion.div>
    </div>
  )
}
