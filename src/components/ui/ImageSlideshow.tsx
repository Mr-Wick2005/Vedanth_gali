'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { Icon } from '@/components/ui/icon'
import { LightboxModal } from './LightboxModal'
import type { GalleryImage } from '@/lib/images'

interface ImageSlideshowProps {
  images: GalleryImage[]
  aspectRatio?: 'video' | '4:3' | 'square' | 'wide'
  className?: string
  altFallback?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showThumbnails?: boolean
}

const ASPECT_CLASSES = {
  video: 'aspect-video',
  '4:3': 'aspect-[4/3]',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
}

export function ImageSlideshow({
  images,
  aspectRatio = 'video',
  className = '',
  altFallback = 'Visual asset',
  autoPlay = true,
  autoPlayInterval = 4500,
  showThumbnails = true,
}: ImageSlideshowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    skipSnaps: false,
    duration: 25,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onInit)
    queueMicrotask(onInit)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onInit)
    }
  }, [emblaApi])

  // Autoplay handler with pause on hover
  useEffect(() => {
    if (!autoPlay || images.length <= 1 || isHovered || !emblaApi) return
    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, autoPlayInterval)
    return () => clearInterval(timer)
  }, [autoPlay, autoPlayInterval, images.length, isHovered, emblaApi])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const aspectClass = ASPECT_CLASSES[aspectRatio]

  // 1. Zero Images Fallback (Cybernetic Developer Monogram Slate)
  if (!images || images.length === 0) {
    return (
      <div
        className={`relative flex w-full ${aspectClass} flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#080b12] p-6 text-center ${className}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]"
        />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-950/40 text-blue-400">
          <Icon name="code" size={24} />
        </div>
        <span className="relative z-10 mt-3 font-mono text-xs uppercase tracking-wider text-slate-400">
          {altFallback}
        </span>
        <span className="relative z-10 font-mono text-[10px] text-slate-500">
          {'// preview-placeholder'}
        </span>
      </div>
    )
  }

  // 2. Single Image View (Clean Static Image with Click-to-Zoom)
  if (images.length === 1) {
    const single = images[0]!
    return (
      <>
        <div
          className={`group relative w-full ${aspectClass} cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#080b12] ${className}`}
          onClick={() => openLightbox(0)}
        >
          <Image
            src={single.url}
            alt={single.alt || altFallback}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle hover gradient and expand indicator */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-between p-3.5">
            <span className="font-mono text-[11px] text-white/90 truncate max-w-[80%]">
              {single.caption || single.alt}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur">
              <Icon name="arrow-up-right" size={13} />
            </span>
          </div>
        </div>

        <LightboxModal
          isOpen={lightboxOpen}
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      </>
    )
  }

  // 3. Multi-Image Slideshow Carousel
  return (
    <>
      <div
        className={`group relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#080b12] ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Embla Viewport */}
        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className="flex">
            {images.map((img, idx) => (
              <div
                key={img.url + idx}
                className={`relative min-w-0 flex-[0_0_100%] ${aspectClass} cursor-pointer overflow-hidden bg-black`}
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${altFallback} - Slide ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                  priority={idx === 0}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Counter Badge */}
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 font-mono text-[10px] font-medium text-slate-200 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>
            {String(selectedIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>

        {/* Expand / Lightbox Trigger */}
        <button
          type="button"
          onClick={() => openLightbox(selectedIndex)}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/70 text-slate-200 opacity-80 backdrop-blur-md transition-all hover:bg-blue-600 hover:text-white hover:opacity-100"
          aria-label="View full size image in lightbox"
        >
          <Icon name="maximize" size={13} />
        </button>

        {/* Desktop Prev / Next Arrow Controls */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            emblaApi?.scrollPrev()
          }}
          className="absolute top-1/2 left-2.5 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-blue-600 focus:opacity-100"
          aria-label="Previous slide"
        >
          <Icon name="arrow-left" size={14} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            emblaApi?.scrollNext()
          }}
          className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-blue-600 focus:opacity-100"
          aria-label="Next slide"
        >
          <Icon name="arrow-right" size={14} />
        </button>

        {/* Slide Caption Bottom Overlay */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-6 flex items-end justify-between">
          <p className="font-mono text-[11px] text-slate-200 truncate pr-2">
            {images[selectedIndex]?.caption || images[selectedIndex]?.alt}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5">
          {scrollSnaps.map((_, snapIdx) => (
            <button
              key={snapIdx}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                scrollTo(snapIdx)
              }}
              className={`h-1.5 rounded-full transition-all ${
                snapIdx === selectedIndex
                  ? 'w-5 bg-gradient-to-r from-blue-400 to-pink-500'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${snapIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Optional Mini-Thumbnails Strip below card */}
      {showThumbnails && images.length > 2 && (
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, tIdx) => (
            <button
              key={tIdx}
              type="button"
              onClick={() => scrollTo(tIdx)}
              className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-md border transition-all ${
                tIdx === selectedIndex
                  ? 'border-blue-500 ring-1 ring-blue-500 scale-105'
                  : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Thumbnail ${tIdx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={images}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </>
  )
}
