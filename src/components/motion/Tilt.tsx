'use client'

import React, { useRef, useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'motion/react'

function subscribeCoarse(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(pointer: coarse)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getCoarseSnapshot() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

interface TiltProps {
  children: React.ReactNode
  maxAngle?: number
  perspective?: number
  glare?: boolean
  className?: string
}

export function Tilt({
  children,
  maxAngle = 10,
  perspective = 1000,
  glare = true,
  className = '',
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const isTouch = useSyncExternalStore(subscribeCoarse, getCoarseSnapshot, () => false)
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion || isTouch) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotX = (0.5 - y) * maxAngle * 2
    const rotY = (x - 0.5) * maxAngle * 2

    setRotation({ x: rotX, y: rotY })
    if (glare) {
      setGlarePos({ x: x * 100, y: y * 100, opacity: 0.25 })
    }
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }))
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: `${perspective}px` }}
      className={`relative ${className}`}
    >
      <motion.div
        animate={{ rotateX: rotation.x, rotateY: rotation.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(167, 139, 250, 0.45), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
