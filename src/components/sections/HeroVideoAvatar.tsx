'use client'

import { useEffect, useRef } from 'react'

interface HeroVideoAvatarProps {
  className?: string
  src?: string
}

export function HeroVideoAvatar({
  className = '',
  src = '/videos/vedanth-cutout.mp4',
}: HeroVideoAvatarProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    // Ensure video plays smoothly in loop without interruption
    const startPlayback = () => {
      video.play().catch(() => {
        // Autoplay policy handled
      })
    }

    startPlayback()

    // Resume playback if visibility changes or page gains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startPlayback()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [src])

  return (
    <div
      className={`relative flex w-full items-center justify-center lg:justify-end ${className}`}
    >
      {/* Ambient background glow to anchor the video avatar into the dark theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[320px] w-[320px] sm:h-[400px] sm:w-[400px] lg:h-[480px] lg:w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.14] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[45%] left-[55%] -z-10 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.10] blur-[90px]"
      />

      {/* 
        Direct Video Container:
        - No border, no card styling, no image fallback
        - Exclusively displays the video from public/videos/vedanth-cutout.mp4
        - Prominently sized to fill the right hero column with impactful visual presence
        - Responsive height bound to viewport height so the hero section never overflows on laptops
        - Radial mask edge-fade so the video edges dissolve seamlessly into #05060A with 0 hard lines
      */}
      <div
        className="relative w-auto h-[320px] sm:h-[400px] md:h-[460px] lg:h-[min(72vh,560px)] xl:h-[min(75vh,640px)] 2xl:h-[min(78vh,700px)] aspect-[4/5] max-w-full select-none"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 78% at 50% 48%, black 40%, rgba(0, 0, 0, 0.8) 60%, transparent 80%)',
          maskImage:
            'radial-gradient(ellipse 75% 78% at 50% 48%, black 40%, rgba(0, 0, 0, 0.8) 60%, transparent 80%)',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Hero animated 3D video"
          className="h-full w-full object-cover object-[center_18%] pointer-events-none select-none block"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
