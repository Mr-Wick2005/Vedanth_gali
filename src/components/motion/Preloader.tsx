'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let animId: number
    const timer = setTimeout(() => {
      // Only show once per session and if reduced motion is not requested
      const hasSeen = typeof window !== 'undefined' ? sessionStorage.getItem('vg_preloader_seen') : true
      if (hasSeen || shouldReduceMotion) {
        setIsDone(true)
        onComplete?.()
        return
      }

      setShouldRender(true)

      let current = 0
      const duration = 1200 // ms
      const startTime = performance.now()

      const frame = (time: number) => {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Quintic ease out
        const eased = 1 - Math.pow(1 - progress, 4)
        current = Math.floor(eased * 100)
        setCount(current)

        if (progress < 1) {
          animId = requestAnimationFrame(frame)
        } else {
          setCount(100)
          setTimeout(() => {
            sessionStorage.setItem('vg_preloader_seen', 'true')
            setIsDone(true)
            onComplete?.()
          }, 250)
        }
      }

      animId = requestAnimationFrame(frame)
    }, 0)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animId)
    }
  }, [shouldReduceMotion, onComplete])

  if (!shouldRender || isDone) {
    return null
  }

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-black px-8 py-12 text-white"
        >
          {/* Top minimal status */}
          <div className="flex w-full max-w-5xl items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
            <span>VEDANTH GALI</span>
            <span>PORTFOLIO &apos;27</span>
          </div>

          {/* Center Monogram */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
              className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-violet-500/30 bg-surface/80 font-display text-3xl font-black tracking-tighter text-white shadow-[0_0_50px_rgba(139,92,246,0.25)]"
            >
              VG<span className="text-violet-400">.</span>
            </motion.div>
          </div>

          {/* Bottom Counter */}
          <div className="flex w-full max-w-5xl items-baseline justify-between border-t border-white/10 pt-6">
            <span className="font-mono text-xs text-muted tracking-wider uppercase">
              INITIALIZING EXPERIENCE
            </span>
            <div className="font-mono text-4xl sm:text-6xl font-bold tabular-nums text-violet-300">
              {String(count).padStart(2, '0')}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
