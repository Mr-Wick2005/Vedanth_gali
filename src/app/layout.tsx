import type { Metadata } from 'next'
import { Unbounded, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const displayFont = Unbounded({
  variable: '--font-display-slot',
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
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
    'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building web platforms and leading technical events.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text antialiased selection:bg-accent selection:text-text">
        {children}
      </body>
    </html>
  )
}
