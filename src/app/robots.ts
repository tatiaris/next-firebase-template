import type { MetadataRoute } from 'next'
import { config } from 'src/config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/_next/static/',
    },
    sitemap: `https://${config.domain}/sitemap.xml`,
  }
}