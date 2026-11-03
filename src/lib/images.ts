export interface GalleryImage {
  url: string
  path?: string
  alt: string
  caption?: string
  order: number
  isCover?: boolean
  width?: number
  height?: number
}

/**
 * Normalizes any single image, legacy gallery, or images array into a sorted GalleryImage array.
 * Guarantees at least 1 image if a legacy single-image field exists, and marks the primary/first as cover.
 */
export function extractGalleryImages(
  record: {
    images?: unknown
    gallery?: unknown
    cover_image_url?: string | null
    cover_image_alt?: string | null
    image_url?: string | null
    image_alt?: string | null
    logo_url?: string | null
    logo_alt?: string | null
    title?: string
    company?: string
  } | null | undefined,
  fallbackUrl?: string | null,
): GalleryImage[] {
  if (!record) return []

  const list: GalleryImage[] = []
  const title = record.title || record.company || 'Visual asset'

  // 1. Try 'images' array first
  if (Array.isArray(record.images) && record.images.length > 0) {
    record.images.forEach((img, idx) => {
      if (typeof img === 'string' && img.trim()) {
        list.push({
          url: img.trim(),
          alt: `${title} - Image ${idx + 1}`,
          order: idx,
          isCover: idx === 0,
        })
      } else if (img && typeof img === 'object' && 'url' in img && typeof img.url === 'string' && img.url.trim()) {
        const item = img as Partial<GalleryImage>
        list.push({
          url: item.url!.trim(),
          path: item.path,
          alt: item.alt || item.caption || `${title} - Image ${idx + 1}`,
          caption: item.caption,
          order: typeof item.order === 'number' ? item.order : idx,
          isCover: Boolean(item.isCover || idx === 0),
          width: item.width,
          height: item.height,
        })
      }
    })
  }

  // 2. Try 'gallery' array if images was empty
  if (list.length === 0 && Array.isArray(record.gallery) && record.gallery.length > 0) {
    record.gallery.forEach((img, idx) => {
      if (typeof img === 'string' && img.trim()) {
        list.push({
          url: img.trim(),
          alt: `${title} - Image ${idx + 1}`,
          order: idx,
          isCover: idx === 0,
        })
      } else if (img && typeof img === 'object' && 'url' in img && typeof img.url === 'string' && img.url.trim()) {
        const item = img as Partial<GalleryImage>
        list.push({
          url: item.url!.trim(),
          path: item.path,
          alt: item.alt || item.caption || `${title} - Image ${idx + 1}`,
          caption: item.caption,
          order: typeof item.order === 'number' ? item.order : idx,
          isCover: Boolean(item.isCover || idx === 0),
          width: item.width,
          height: item.height,
        })
      }
    })
  }

  // 3. Fallback to single image fields
  const singleUrl = record.cover_image_url || record.image_url || record.logo_url
  const singleAlt = record.cover_image_alt || record.image_alt || record.logo_alt || title

  if (singleUrl && singleUrl.trim()) {
    const trimmed = singleUrl.trim()
    const alreadyPresent = list.some((i) => i.url === trimmed)
    if (!alreadyPresent) {
      list.unshift({
        url: trimmed,
        alt: singleAlt,
        order: -1,
        isCover: true,
      })
    }
  }

  // 4. Default fallback asset if provided and list is still empty
  if (list.length === 0 && fallbackUrl && fallbackUrl.trim()) {
    list.push({
      url: fallbackUrl.trim(),
      alt: singleAlt || title,
      order: 0,
      isCover: true,
    })
  }

  // Sort by order
  return list.sort((a, b) => a.order - b.order)
}
