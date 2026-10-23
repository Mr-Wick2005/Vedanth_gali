'use client'

import dynamic from 'next/dynamic'

const HeroRingCanvas = dynamic(() => import('./HeroRingCanvas'), {
  ssr: false,
  loading: () => (
    <div className="border-accent/30 absolute inset-0 animate-pulse rounded-full border" />
  ),
})

export function HeroRingWrapper() {
  return <HeroRingCanvas />
}
