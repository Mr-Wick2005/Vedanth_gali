'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface RevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const offset = 28
  const initialVariants = {
    up: { opacity: 0, y: offset },
    down: { opacity: 0, y: -offset },
    left: { opacity: 0, x: offset },
    right: { opacity: 0, x: -offset },
    none: { opacity: 0 },
  }

  return (
    <motion.div
      initial={initialVariants[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
