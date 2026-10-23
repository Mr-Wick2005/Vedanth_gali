import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

// Next.js 16 network proxy convention
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

// Backwards-compatible alias for Next.js middleware convention
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static chunks)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - static asset extensions: svg, png, jpg, jpeg, gif, webp, avif, glb, pdf
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|glb|pdf)$).*)',
  ],
}
