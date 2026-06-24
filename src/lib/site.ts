/**
 * Resolves the canonical production URL for metadata (OG tags, sitemap,
 * robots.txt). Vercel injects VERCEL_PROJECT_PRODUCTION_URL automatically on
 * every deployment, so this works without any manual env var setup — set
 * NEXT_PUBLIC_SITE_URL only if a custom domain should override it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
