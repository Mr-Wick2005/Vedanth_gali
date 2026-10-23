'use client'

import { useEffect, useState } from 'react'

interface ClockProps {
  showPrefix?: boolean
  className?: string
}

export function Clock({ showPrefix = true, className = '' }: ClockProps) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    function getISTString() {
      const now = new Date()
      return now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    }

    setTime(getISTString())
    const interval = setInterval(() => {
      setTime(getISTString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      {showPrefix && <span className="text-muted">MUMBAI IST:</span>}
      <span className="tabular-nums text-text">{time || '00:00:00'}</span>
    </span>
  )
}
