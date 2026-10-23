'use client'

import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [cursorState, setCursorState] = useState<'default' | 'link' | 'view' | 'drag'>('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(isCoarse)
    if (isCoarse) return

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      if (target.closest('[data-cursor="view"]')) {
        setCursorState('view')
      } else if (target.closest('[data-cursor="drag"]')) {
        setCursorState('drag')
      } else if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setCursorState('link')
      } else {
        setCursorState('default')
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible])

  if (isTouch || shouldReduceMotion || !isVisible) {
    return null
  }

  const isView = cursorState === 'view'
  const isDrag = cursorState === 'drag'
  const isLink = cursorState === 'link'

  return (
    <>
      {/* Outer context ring / pill */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full will-change-transform"
        animate={{
          x: pos.x - (isView || isDrag ? 40 : isLink ? 24 : 16),
          y: pos.y - (isView || isDrag ? 40 : isLink ? 24 : 16),
          width: isView || isDrag ? 80 : isLink ? 48 : 32,
          height: isView || isDrag ? 80 : isLink ? 48 : 32,
          backgroundColor: isView || isDrag ? 'rgba(139, 92, 246, 0.88)' : 'rgba(167, 139, 250, 0.08)',
          borderColor: isView || isDrag ? 'rgba(167, 139, 250, 0.9)' : isLink ? 'rgba(167, 139, 250, 0.6)' : 'rgba(255, 255, 255, 0.25)',
          borderWidth: isView || isDrag ? 0 : 1,
          backdropFilter: isView || isDrag ? 'blur(4px)' : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 320,
          mass: 0.15,
        }}
      >
        {isView && (
          <span className="font-mono text-[10px] font-bold tracking-widest text-white uppercase">
            VIEW
          </span>
        )}
        {isDrag && (
          <span className="font-mono text-[10px] font-bold tracking-widest text-white uppercase">
            DRAG
          </span>
        )}
      </motion.div>

      {/* Inner dot */}
      {!isView && !isDrag && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[101] h-1.5 w-1.5 rounded-full bg-violet-400 will-change-transform"
          animate={{
            x: pos.x - 3,
            y: pos.y - 3,
            scale: isLink ? 0 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 35,
            stiffness: 450,
            mass: 0.05,
          }}
        />
      )}
    </>
  )
}
