/** Canonical origin. Vercel sets VERCEL_URL per deployment, without a scheme. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

export const SITE_NAME = 'Plinth';

export const SITE_DESCRIPTION =
  'Plinth verifies Nigerian property documents, checks for fraud patterns, and generates a due diligence report before you sign anything.';
