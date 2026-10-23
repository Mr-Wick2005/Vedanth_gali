'use client'

import React from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface SplitTextProps {
  text: string
  by?: 'char' | 'word'
  className?: string
  charClassName?: string
  delay?: number
  stagger?: number
  interactive?: boolean
}

export function SplitText({
  text,
  by = 'char',
  className = '',
  charClassName = '',
  delay = 0,
  stagger = 0.025,
  interactive = true,
}: SplitTextProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  if (by === 'word') {
    const words = text.split(' ')
    return (
      <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
            <motion.span
              className={`inline-block ${charClassName}`}
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: delay + i * stagger,
                ease: [0.2, 0, 0, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    )
  }

  // by === 'char'
  const chars = Array.from(text)
  return (
    <span className={`inline-flex whitespace-nowrap ${className}`}>
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`inline-block ${charClassName}`}
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={
              interactive
                ? {
                    y: -4,
                    scale: 1.08,
                    rotate: (i % 2 === 0 ? 1 : -1) * 3,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                  }
                : undefined
            }
            transition={{
              duration: 0.55,
              delay: delay + i * stagger,
              ease: [0.2, 0, 0, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
