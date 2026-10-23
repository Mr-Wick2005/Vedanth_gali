'use client'

import React from 'react'

interface MarqueeProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
  speed?: number
  pauseOnHover?: boolean
  className?: string
  gap?: string
}

export function Marquee({
  children,
  direction = 'left',
  speed = 25,
  pauseOnHover = true,
  className = '',
  gap = '3rem',
}: MarqueeProps) {
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div
      className={`group relative flex overflow-hidden whitespace-nowrap ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
    >
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
      <div
        className="flex shrink-0 items-center will-change-transform"
        style={{
          gap,
          animation: `${animationName} ${speed}s linear infinite`,
          animationPlayState: pauseOnHover ? 'running' : undefined,
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running'
        }}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
