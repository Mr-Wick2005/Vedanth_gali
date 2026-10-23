'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, useSyncExternalStore } from 'react'
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

// CSS fallback conic gradient ring for mobile / low-spec
function CssRingFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        className="h-[340px] w-[340px] sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px] rounded-full p-[2.5px] shadow-[0_0_45px_rgba(139,92,246,0.55),0_0_80px_rgba(56,189,248,0.3)]"
        style={{
          background:
            'conic-gradient(from 0deg, #38bdf8, #8b5cf6, #a78bfa, #00e5ff, #38bdf8)',
          animation: 'spin 14s linear infinite',
        }}
      >
        <div className="h-full w-full rounded-full bg-black/75 backdrop-blur-[2px]" />
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function HeroRingCanvas() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  const [mounted, setMounted] = useState(false)
  const [isLowSpec, setIsLowSpec] = useState(false)

  useEffect(() => {
    // Check low-spec device: mobile width or low CPU concurrency
    const isMobile = window.innerWidth < 768
    const isLowCpu =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4

    if (isMobile || isLowCpu) {
      setIsLowSpec(true)
      return
    }

    // Mount canvas after first paint using requestIdleCallback
    const onIdle = () => setMounted(true)
    if ('requestIdleCallback' in window) {
      const handle = (window as Window).requestIdleCallback(onIdle, { timeout: 1200 })
      return () => (window as Window).cancelIdleCallback(handle)
    } else {
      const timer = setTimeout(onIdle, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  if (reducedMotion || isLowSpec) {
    return <CssRingFallback />
  }

  if (!mounted) {
    return <CssRingFallback />
  }

  // Cap DPR at 1.75
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.75) : 1

  return (
    <div className="pointer-events-auto absolute inset-0 h-full w-full">
      <Suspense fallback={<CssRingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          dpr={dpr}
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
