'use client'

import React from 'react'

interface TerminalWindowProps {
  title?: string
  status?: string
  statusColor?: 'emerald' | 'blue' | 'pink' | 'amber'
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function TerminalWindow({
  title = 'bash',
  status,
  statusColor = 'emerald',
  children,
  className = '',
  headerAction,
}: TerminalWindowProps) {
  const statusColorMap = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    pink: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0c14] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all ${className}`}
    >
      {/* Terminal Titlebar Chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0e111b] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* macOS traffic light dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/90 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/90 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/90 inline-block" />
          </div>
          {/* File/Command Title */}
          <span className="ml-2 font-mono text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${statusColorMap[statusColor]}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {status}
            </span>
          )}
          {headerAction}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="relative p-5 sm:p-6 lg:p-7">{children}</div>
    </div>
  )
}
