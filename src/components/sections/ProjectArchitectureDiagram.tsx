'use client'

import React from 'react'
import { Icon } from '@/components/ui/icon'

interface ProjectArchitectureDiagramProps {
  slug: string
}

export function ProjectArchitectureDiagram({ slug }: ProjectArchitectureDiagramProps) {
  if (slug === 'the-rkive') {
    return (
      <section className="mt-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            [ ARCHITECTURE & DATA FLOW ]
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          The Rkive Publishing Pipeline
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl font-mono">
          Server-side PDF ingest, 200–300 DPI high-clarity canvas rasterization, and role-based Supabase security.
        </p>

        {/* Visual Architecture Flow Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1: Ingestion & Storage */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-emerald-400 font-bold">01 // INGEST</span>
              <Icon name="upload" size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              PDF Document Upload
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Super Admin & Department Admins upload multi-page publications into Supabase Storage with size and MIME validation.
            </p>
            <div className="mt-4 flex flex-wrap gap-1 font-mono text-[10px] text-emerald-300">
              <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">PDF Ingest</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">Metadata</span>
            </div>
          </div>

          {/* Step 2: Server-Side Rasterization */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-cyan-400 font-bold">02 // PROCESSING</span>
              <Icon name="cpu" size={16} className="text-cyan-400" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Rendering Pipeline
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Server-side rasterization decomposes PDFs into print-quality (200–300 DPI) web spreads plus fast mobile thumbnail previews.
            </p>
            <div className="mt-4 flex flex-wrap gap-1 font-mono text-[10px] text-cyan-300">
              <span className="bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">200–300 DPI</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">Page Splitting</span>
            </div>
          </div>

          {/* Step 3: Database & Security */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-violet-400 font-bold">03 // DATABASE & RLS</span>
              <Icon name="database" size={16} className="text-violet-400" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Row Level Security
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Postgres enforces 7 publication lifecycle states. Strict RLS ensures departmental separation and audit trails.
            </p>
            <div className="mt-4 flex flex-wrap gap-1 font-mono text-[10px] text-violet-300">
              <span className="bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">Supabase RLS</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">7 States</span>
            </div>
          </div>

          {/* Step 4: Client Flipbook Engine */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-amber-400 font-bold">04 // CLIENT ENGINE</span>
              <Icon name="layers" size={16} className="text-amber-400" />
            </div>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Flipbook Reader
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Dual-page desktop spreads with physical page-curl shaders, single-page responsive mobile gestures, zoom/pan, and deep URLs.
            </p>
            <div className="mt-4 flex flex-wrap gap-1 font-mono text-[10px] text-amber-300">
              <span className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">Page-Curl</span>
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">Deep Links</span>
            </div>
          </div>

        </div>
      </section>
    )
  }

  if (slug === 'escape-placement-cell') {
    return (
      <section className="mt-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
            [ INTERACTIVE GAMEPLAY ARCHITECTURE ]
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          Escape Room Progression Engine
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl font-mono">
          State-driven 3-round gauntlet combining timed aptitude, multi-language coding, and real-time voice HR keyword scoring.
        </p>

        {/* 3-Round Progression Visual Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Round 1 */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-cyan-400 font-bold">ROUND 01</span>
              <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-cyan-300 text-[10px]">
                5-Min Limit
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Timed Aptitude Test
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Quantitative, verbal, and logical puzzles under strict countdown pressure. Fast evaluation prevents game stalling.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-text-lilac font-mono list-none p-0">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                <span>Timer-driven state machine</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                <span>Adaptive score weighting</span>
              </li>
            </ul>
          </div>

          {/* Round 2 */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-violet-400 font-bold">ROUND 02</span>
              <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-violet-300 text-[10px]">
                Sandbox
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Coding Challenge
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Multi-language code editor with test case execution and algorithmic verification required to unlock the final interview chamber.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-text-lilac font-mono list-none p-0">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                <span>Multi-language syntax support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                <span>Real-time test runner</span>
              </li>
            </ul>
          </div>

          {/* Round 3 */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between text-muted text-xs font-mono mb-4">
              <span className="text-emerald-400 font-bold">ROUND 03</span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-300 text-[10px]">
                Voice AI
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-white uppercase">
              Voice-Enabled HR Interview
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Browser Web Speech recognition listens to verbal answers across 7 behavioral questions, evaluating semantic keyword density.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-text-lilac font-mono list-none p-0">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Web Speech API recognition</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Detailed exit performance report</span>
              </li>
            </ul>
          </div>

        </div>
      </section>
    )
  }

  if (slug === 'plant-leaf-disease-detection') {
    return (
      <section className="mt-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
            [ ML RESEARCH & INFERENCE PIPELINE ]
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
          MobileNetV2 Transfer Learning Pipeline
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl font-mono">
          Evaluated across 31,397 leaf images across 25 disease classes on the PlantVillage benchmark.
        </p>

        {/* 4-Stage Research Pipeline Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-violet-400 font-bold text-xs block mb-3">01 // BENCHMARK</span>
            <h3 className="font-display text-base font-bold text-white uppercase">
              PlantVillage Dataset
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              31,397 curated images spanning 25 distinct plant-disease combinations across tomato, potato, corn, apple, and grape leaves.
            </p>
            <div className="mt-4 font-mono text-[11px] text-violet-300">
              <span>31,397 Samples • 25 Classes</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-cyan-400 font-bold text-xs block mb-3">02 // PREPROCESSING</span>
            <h3 className="font-display text-base font-bold text-white uppercase">
              Augmentation
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Input normalized to 224×224×3. Dynamic spatial rotation, zoom, and horizontal reflection applied to eliminate class imbalance.
            </p>
            <div className="mt-4 font-mono text-[11px] text-cyan-300">
              <span>224×224 Normalization</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-emerald-400 font-bold text-xs block mb-3">03 // ARCHITECTURE</span>
            <h3 className="font-display text-base font-bold text-white uppercase">
              MobileNetV2 Base
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Depthwise separable convolutions & inverted residual bottlenecks pre-trained on ImageNet. Custom Dense classification head.
            </p>
            <div className="mt-4 font-mono text-[11px] text-emerald-300">
              <span>GlobalAvgPool • Dropout 0.4</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c20] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-amber-400 font-bold text-xs block mb-3">04 // VALIDATION</span>
            <h3 className="font-display text-base font-bold text-white uppercase">
              91.82% Test Accuracy
            </h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">
              Evaluated with multi-class confusion matrix, precision, recall, and F1-score across independent test splits.
            </p>
            <div className="mt-4 font-mono text-[11px] text-amber-300">
              <span>Verified Metric: 91.82%</span>
            </div>
          </div>

        </div>
      </section>
    )
  }

  return null
}
