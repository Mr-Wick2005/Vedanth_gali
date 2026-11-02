'use client'

import React from 'react'
import { Icon } from '@/components/ui/icon'

interface ProjectEngineeringDetailsProps {
  slug: string
}

export function ProjectEngineeringDetails({ slug }: ProjectEngineeringDetailsProps) {
  if (slug === 'the-rkive') {
    return (
      <section className="mt-20">
        <span className="font-mono text-xs uppercase tracking-widest text-violet-400 block mb-3">
          [ TECHNICAL DECISIONS & VERIFIED ARCHITECTURE ]
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          Key Engineering Decisions
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 mb-4">
              <Icon name="layers" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Flipbook Physics & Canvas Performance
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Implemented dual-page desktop spreads and responsive single-page mobile views with hardware-accelerated canvas transforms. Page-curl physics run smoothly at 60 FPS without layout thrashing.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
              <Icon name="cpu" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              200–300 DPI Rendering Pipeline
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Decomposed large PDF documents on the server into high-fidelity web spreads rasterized at 200–300 DPI for desktop readability, paired with lightweight preview thumbnails for immediate initial paint.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
              <Icon name="shield-check" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Row Level Security & 7 Publication States
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Enforced strict multi-tenant access: Department Admins manage their own issues while Super Admins oversee college-wide distribution. Supabase RLS policies gate unpublished drafts from student access.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (slug === 'escape-placement-cell') {
    return (
      <section className="mt-20">
        <span className="font-mono text-xs uppercase tracking-widest text-violet-400 block mb-3">
          [ INTERACTIVE ARCHITECTURE & IMPLEMENTATION ]
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          Implementation Highlights & Challenges
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
              <Icon name="clock" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              State-Driven Progression
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Designed a strict multi-round progression machine using Zod validation and React Hook Form. Players cannot skip or backtrack without passing the round criteria, mirroring actual placement gates.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 mb-4">
              <Icon name="mic" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Web Speech API Voice Recognition
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Integrated real-time speech-to-text recognition in supported browsers. The lexer matches spoken vocabulary against expected domain keywords to compute live confidence and answer relevance scores.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
              <Icon name="cube" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              React Three Fiber 3D Stage
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Employed React Three Fiber to render ambient 3D scene elements representing the physical placement cell, creating immersion without incurring heavy GPU overhead on student mobile devices.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (slug === 'plant-leaf-disease-detection') {
    return (
      <section className="mt-20">
        <span className="font-mono text-xs uppercase tracking-widest text-violet-400 block mb-3">
          [ RESEARCH ANALYSIS & MODEL FINDINGS ]
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          Experimental Methodology & Findings
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400 mb-4">
              <Icon name="cpu" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              MobileNetV2 Edge Efficiency
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              MobileNetV2 was selected for its depthwise separable convolutions, reducing parameters to 3.4M compared to ResNet50 (25.6M). This ensures low latency and high feasibility for mobile field diagnosis.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
              <Icon name="check-circle" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              91.82% Accuracy on 31,397 Images
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              Evaluated with a multi-class confusion matrix across 25 disease classes. Strongest classification precision achieved on early blight and bacterial spot; minimal false positive confusion on healthy leaves.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 mb-4">
              <Icon name="alert-triangle" size={20} />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Research Limitations
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              The PlantVillage benchmark consists of laboratory-collected images with uniform backgrounds. Natural field conditions with complex shadows and occlusions present real-world domain adaptation opportunities.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return null
}
