import type { MetadataRoute } from 'next'
import { config } from 'src/config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${config.domain}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}