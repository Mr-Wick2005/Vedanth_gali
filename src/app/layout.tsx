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

function getValidMetadataBase(raw?: string): URL {
  const fallback = 'https://vedanthgali.dev'
  if (!raw) return new URL(fallback)
  try {
    const formatted = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
    return new URL(formatted)
  } catch {
    return new URL(fallback)
  }
}

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedanthgali.dev'
const siteUrl = rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
  ? rawSiteUrl
  : `https://${rawSiteUrl}`

export const metadata: Metadata = {
  metadataBase: getValidMetadataBase(process.env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
    template: '%s | Vedanth Gali',
  },
  description:
    'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building scalable web platforms and leading technical events in Mumbai.',
  keywords: [
    'Vedanth Gali',
    'Frontend Developer',
    'Full-Stack Developer',
    'Software Engineer',
    'React',
    'Next.js',
    'TypeScript',
    'Supabase',
    'Tailwind CSS',
    'Mumbai Developer',
    'ICSICE 2026',
    'The Rkive',
  ],
  authors: [{ name: 'Vedanth Gali', url: siteUrl }],
  creator: 'Vedanth Gali',
  publisher: 'Vedanth Gali',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
    description:
      'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building scalable web platforms.',
    siteName: 'Vedanth Gali Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vedanth Gali — Frontend & Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vedanth Gali | Frontend & Full-Stack Developer, Mumbai',
    description:
      'Portfolio of Vedanth Gali, final-year Computer Engineering student and React/TypeScript developer building scalable web platforms.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
    >
      <body className="bg-background text-text selection:bg-accent selection:text-text min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
