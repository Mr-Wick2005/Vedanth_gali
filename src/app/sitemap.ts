import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vedanthgali.dev'
  const projects = await getProjects()

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...projectUrls,
  ]
}
