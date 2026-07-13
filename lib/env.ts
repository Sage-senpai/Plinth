/**
 * Environment access, centralised.
 *
 * Demo mode is the default posture: any capability whose credentials are
 * missing degrades to a deterministic stub rather than throwing. That keeps
 * the whole product — landing page through report download — runnable on a
 * clean checkout with no AWS account.
 */

function flag(name: string, fallback = false): boolean {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return v === 'true' || v === '1';
}

export const env = {
  awsRegion: process.env.AWS_REGION ?? 'eu-west-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: process.env.AWS_S3_BUCKET ?? 'plinth-docs-dev',
  databaseUrl: process.env.DATABASE_URL,
  qstashToken: process.env.QSTASH_TOKEN,
  nextAuthUrl: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
  /** Explicit opt-out only: DEMO_MODE=false with real credentials present. */
  demoMode: flag('DEMO_MODE', true),
};

/** True when we have real AWS credentials and demo mode is off. */
export const hasAws = Boolean(
  env.awsAccessKeyId && env.awsSecretAccessKey && !env.demoMode,
);

export const hasDb = Boolean(env.databaseUrl);

export const hasQueue = Boolean(env.qstashToken);

/** Bedrock model used for fraud detection, valuation reasoning and reports. */
export const BEDROCK_MODEL_ID =
  process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-5-sonnet-20241022-v2:0';
