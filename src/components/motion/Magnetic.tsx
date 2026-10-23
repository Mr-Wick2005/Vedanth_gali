'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface MagneticProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.35, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (shouldReduceMotion || isTouch) {
    return <div className={className}>{children}</div>
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * strength, y: middleY * strength })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 18, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  )
}
