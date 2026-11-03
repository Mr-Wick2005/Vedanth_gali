/**
 * Lightweight server-safe HTML sanitizer for rich text content.
 * Strips script tags, iframe, object, embed, javascript: URLs, and inline event handlers (on*).
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') return ''

  const sanitized = rawHtml
    // Strip <script>...</script>
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip <iframe>...</iframe>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip <object>...</object>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip <embed>...</embed>
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Strip javascript: pseudo protocols in attributes
    .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'href="#"')
    .replace(/src\s*=\s*(['"])\s*javascript:[^'"]*\1/gi, 'src=""')
    // Strip inline on* event handler attributes
    .replace(/\s+on[a-zA-Z]+\s*=\s*(['"])[^'"]*\1/gi, '')
    .replace(/\s+on[a-zA-Z]+\s*=\s*[^>\s]+/gi, '')

  return sanitized
}
