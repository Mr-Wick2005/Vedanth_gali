import type { Metadata } from 'next'
import { Inter, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// TODO: Inter is a temporary placeholder font slot for Display.
// Candidate for Phase 1 replacement: Unbounded (wide geometric display, H1/H2 only).
const displayFontPlaceholder = Inter({
  variable: '--font-display-slot',
  subsets: ['latin'],
  display: 'swap',
})

const bodyFont = Geist({
  variable: '--font-body-slot',
  subsets: ['latin'],
  display: 'swap',
})

const monoFont = Geist_Mono({
  variable: '--font-mono-slot',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
  description:
    'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building robust web platforms and leading technical events.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFontPlaceholder.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text antialiased">{children}</body>
    </html>
  )
}
