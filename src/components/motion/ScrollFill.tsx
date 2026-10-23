'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollFillProps {
  text: string
  className?: string
  wordClassName?: string
}

export function ScrollFill({ text, className = '', wordClassName = '' }: ScrollFillProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const words = text.split(' ')

  useEffect(() => {
    if (shouldReduceMotion || !containerRef.current) return

    const spans = containerRef.current.querySelectorAll('.scroll-fill-word')
    if (!spans.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { color: 'rgba(255, 255, 255, 0.22)' },
        {
          color: '#ffffff',
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  if (shouldReduceMotion) {
    return <p className={`text-text-lilac ${className}`}>{text}</p>
  }

  return (
    <p ref={containerRef} className={`leading-relaxed ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`scroll-fill-word inline-block transition-colors duration-200 text-white/20 mr-[0.28em] ${wordClassName}`}
        >
          {word}
        </span>
      ))}
    </p>
  )
}
