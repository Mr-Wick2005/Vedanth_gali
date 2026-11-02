'use client'

import React, { createContext, useContext, useState, useCallback, useId } from 'react'
import { Icon } from '@/components/ui/icon'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastContextValue {
  toast: {
    success: (message: string, title?: string, duration?: number) => void
    error: (message: string, title?: string, duration?: number) => void
    info: (message: string, title?: string, duration?: number) => void
  }
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx.toast
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const baseId = useId()

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = `${baseId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { id, type, title, message, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [baseId, dismiss],
  )

  const toastMethods = {
    success: (message: string, title = 'Success', duration = 4000) =>
      addToast('success', message, title, duration),
    error: (message: string, title = 'Error', duration = 6000) =>
      addToast('error', message, title, duration),
    info: (message: string, title = 'Notice', duration = 4000) =>
      addToast('info', message, title, duration),
  }

  return (
    <ToastContext.Provider value={{ toast: toastMethods, dismiss }}>
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-6 right-6 z-[999] flex w-full max-w-sm flex-col gap-2.5 sm:max-w-md"
      >
        {toasts.map((item) => {
          const isSuccess = item.type === 'success'
          const isError = item.type === 'error'

          return (
            <div
              key={item.id}
              role={isError ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
                isSuccess
                  ? 'border-emerald-500/30 bg-[#071912]/95 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
                  : isError
                  ? 'border-red-500/30 bg-[#1c080d]/95 text-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.15)]'
                  : 'border-violet-500/30 bg-[#0e0e22]/95 text-violet-100 shadow-[0_10px_30px_rgba(139,92,246,0.15)]'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                  isSuccess
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                    : isError
                    ? 'border-red-500/40 bg-red-500/20 text-red-400'
                    : 'border-violet-500/40 bg-violet-500/20 text-violet-400'
                }`}
              >
                <Icon
                  name={isSuccess ? 'check' : isError ? 'alert' : 'sparkles'}
                  size={16}
                />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                {item.title && (
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    {item.title}
                  </h4>
                )}
                <p className="mt-0.5 font-sans text-xs leading-relaxed text-white/80 break-words">
                  {item.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss toast"
                className="shrink-0 rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
