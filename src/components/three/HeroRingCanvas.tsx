'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { HeroRingScene } from './HeroRingScene'

export default function HeroRingCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(media.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 rounded-full border border-accent/40 shadow-[0_0_40px_rgba(139,92,246,0.3)]" />
    )
  }

  return (
    <div className="absolute inset-0 h-full w-full pointer-events-auto">
      <Suspense
        fallback={
          <div className="h-full w-full rounded-full border border-accent/20 animate-pulse" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <HeroRingScene />
        </Canvas>
      </Suspense>
    </div>
  )
}
