'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PHRASE = 'OPEN TO WORK • FRONTEND & FULL-STACK • MUMBAI • 2027 • '

export function BigTypeBand() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion || !trackRef.current || !containerRef.current) return

    let currentX = 0
    let targetSpeed = 1
    let scrollDirection = 1

    const ctx = gsap.context(() => {
      // Track scroll velocity and direction
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          scrollDirection = self.direction === -1 ? -1 : 1
          // Scale speed based on velocity
          const velocity = Math.abs(self.getVelocity() / 300)
          targetSpeed = 1 + velocity
        },
      })

      // Frame ticker for smooth momentum translation
      const update = () => {
        currentX += 0.8 * targetSpeed * scrollDirection
        // Smoothly decay velocity multiplier
        targetSpeed += (1 - targetSpeed) * 0.05

        if (trackRef.current) {
          // Wrap modulo 50%
          const wrapWidth = trackRef.current.scrollWidth / 2
          if (wrapWidth > 0) {
            if (currentX > wrapWidth) currentX -= wrapWidth
            if (currentX < 0) currentX += wrapWidth
            trackRef.current.style.transform = `translate3d(${-currentX}px, 0, 0)`
          }
        }
      }

      gsap.ticker.add(update)
      return () => gsap.ticker.remove(update)
    }, containerRef)

    return () => ctx.revert()
  }, [shouldReduceMotion])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden w-full max-w-full border-y border-white/[0.08] bg-black py-8 sm:py-12 select-none"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform max-w-none"
        style={{ width: 'fit-content' }}
      >
        <span className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white/90">
          {PHRASE}
          <span className="text-stroke-violet text-transparent">{PHRASE}</span>
        </span>
        <span className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white/90">
          {PHRASE}
          <span className="text-stroke-violet text-transparent">{PHRASE}</span>
        </span>
      </div>
    </section>
  )
}
