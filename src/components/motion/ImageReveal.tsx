'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface ImageRevealProps {
  children: React.ReactNode
  direction?: 'bottom' | 'top' | 'left' | 'right'
  duration?: number
  delay?: number
  className?: string
}

export function ImageReveal({
  children,
  direction = 'bottom',
  duration = 0.8,
  delay = 0,
  className = '',
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const clipInitial = {
    bottom: 'inset(100% 0 0 0)',
    top: 'inset(0 0 100% 0)',
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
  }

  return (
    <motion.div
      initial={{ clipPath: clipInitial[direction], opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo out
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  )
}
