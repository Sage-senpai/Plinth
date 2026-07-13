import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The workspace holds other people's title documents and the flags
      // raised against them. None of it belongs in a search index.
      disallow: ['/workspace/', '/api/', '/signin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
