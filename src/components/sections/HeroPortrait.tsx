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
      setTilt({ x: x * 4, y: y * -4 }) // up to 4 degrees
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [shouldReduceMotion])

  return (
    <div className="relative flex w-full max-w-[500px] items-center justify-center lg:justify-end">
      {/* Layer 1: Ambient background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-20 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.12] blur-[100px]"
      />

      {/* Layer 2: WebGL or CSS Energy Ring positioned behind head and body */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="relative h-[480px] w-[480px] sm:h-[540px] sm:w-[540px]">
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
          maskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 84%, transparent 100%)',
        }}
      >
        <Image
          src={imageSrc}
          alt={avatarAlt || 'Vedanth Gali portrait'}
          width={400}
          height={447}
          priority
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 480px"
          className="h-[340px] w-auto max-w-full object-contain sm:h-[420px] md:h-[480px] lg:h-[510px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
        />

        {/* Layer 4: Depth Illusion — Front Arc wrapping over collar/shoulders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center"
        >
          <svg
            className="w-full max-w-[380px] opacity-70"
            viewBox="0 0 300 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 30 10 Q 150 70 270 10"
              stroke="url(#frontArcGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="frontArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
