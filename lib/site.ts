/** Canonical origin. Production is always proprepo.com; previews use VERCEL_URL (no scheme). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://proprepo.com'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const SITE_NAME = 'Proprepo';

export const SITE_DESCRIPTION =
  'Proprepo verifies Nigerian property documents, checks for fraud patterns, and generates a due diligence report before you sign anything.';
