'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useSyncExternalStore } from 'react'
import { HeroRingScene } from './HeroRingScene'

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

export default function HeroRingCanvas() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )

  if (reducedMotion) {
    return (
      <div className="border-accent/40 absolute inset-0 rounded-full border shadow-[0_0_50px_rgba(139,92,246,0.35)]" />
    )
  }

  return (
    <div className="pointer-events-auto absolute inset-0 h-full w-full">
      <Suspense
        fallback={
          <div className="border-accent/20 h-full w-full animate-pulse rounded-full border" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
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
