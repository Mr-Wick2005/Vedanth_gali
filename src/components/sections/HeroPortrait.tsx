'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import { HeroRingWrapper } from '@/components/three/HeroRingWrapper'

interface HeroPortraitProps {
  avatarUrl?: string | null
  avatarAlt?: string | null
}

export function HeroPortrait({ avatarUrl, avatarAlt = 'Vedanth Gali' }: HeroPortraitProps) {
  const imageSrc = avatarUrl || '/images/vedanth-cutout.webp'
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(isCoarse)
    if (isCoarse || shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 2 // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2
      setTilt({ x: x * 3.5, y: y * -3.5 }) // up to 3.5 degrees
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [shouldReduceMotion])

  return (
    <div className="relative flex w-full max-w-[440px] items-center justify-center lg:justify-end">
      {/* Layer 1: Ambient radial background glow centered on head */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] left-1/2 -z-20 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.18] blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] left-[35%] -z-20 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.14] blur-[80px]"
      />

      {/* Layer 2: WebGL or CSS Energy Ring positioned behind head and upper chest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div className="relative h-[380px] w-[380px] sm:h-[420px] sm:w-[420px] lg:h-[450px] lg:w-[450px]">
          <HeroRingWrapper />
        </div>
      </div>

      {/* Layer 3: Portrait Cutout with subtle 3D pointer tilt */}
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
          height={425}
          priority
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 400px"
          className="h-[300px] w-auto max-w-full object-contain sm:h-[360px] md:h-[400px] lg:h-[440px] xl:h-[460px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
        />
      </motion.div>
    </div>
  )
}
