'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

interface CountUpProps {
  value: string | number
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 1.6, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduceMotion = useReducedMotion()

  // Parse numeric part and prefix/suffix
  const str = String(value)
  const match = str.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/)
  const prefix = match ? match[1] : ''
  const targetNum = match ? parseInt(match[2]!, 10) : null
  const suffix = match ? match[3] : ''

  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView || targetNum === null || shouldReduceMotion) {
      if (targetNum !== null && shouldReduceMotion) {
        setCount(targetNum)
      }
      return
    }

    let startTime: number | null = null
    let animId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easedProgress * targetNum))

      if (progress < 1) {
        animId = requestAnimationFrame(step)
      } else {
        setCount(targetNum)
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [isInView, targetNum, duration, shouldReduceMotion])

  if (targetNum === null) {
    return <span ref={ref} className={className}>{str}</span>
  }

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
