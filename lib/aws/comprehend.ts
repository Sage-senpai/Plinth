import {
  ComprehendClient,
  DetectEntitiesCommand,
} from '@aws-sdk/client-comprehend';
import { env, hasAws } from '@/lib/env';

export interface NamedEntity {
  type: string;
  text: string;
  score: number;
}

let client: ComprehendClient | null = null;

function comprehend(): ComprehendClient {
  if (!client) {
    client = new ComprehendClient({
      region: env.awsRegion,
      credentials:
        env.awsAccessKeyId && env.awsSecretAccessKey
          ? {
              accessKeyId: env.awsAccessKeyId,
              secretAccessKey: env.awsSecretAccessKey,
            }
          : undefined,
    });
  }
  return client;
}

/** Comprehend caps a single DetectEntities call at 100KB of UTF-8. */
const MAX_BYTES = 95_000;

/**
 * Pull names, dates, addresses and registration numbers out of document text.
 *
 * Comprehend gives us the entity spine; Bedrock then reasons over it. The two
 * disagreeing (a PERSON on the deed that never appears on the C of O) is
 * itself a signal, so we keep the raw entity list on the record.
 */
export async function detectEntities(text: string): Promise<NamedEntity[]> {
  if (!hasAws || !text.trim()) return demoEntities(text);

  const truncated = truncateUtf8(text, MAX_BYTES);

  const res = await comprehend().send(
    new DetectEntitiesCommand({ Text: truncated, LanguageCode: 'en' }),
  );

  return (res.Entities ?? [])
    .filter((e) => (e.Score ?? 0) > 0.6)
    .map((e) => ({
      type: e.Type ?? 'OTHER',
      text: e.Text ?? '',
      score: e.Score ?? 0,
    }));
}

function truncateUtf8(text: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  if (encoder.encode(text).length <= maxBytes) return text;

  let slice = text;
  while (encoder.encode(slice).length > maxBytes) {
    slice = slice.slice(0, Math.floor(slice.length * 0.9));
  }
  return slice;
}

/**
 * Demo-mode entity extraction: a deliberately simple regex pass over the
 * document text. Good enough to populate the UI, and honest about being a
 * stand-in.
 */
function demoEntities(text: string): NamedEntity[] {
  const entities: NamedEntity[] = [];

  const dates = text.match(/\b\d{1,2}(st|nd|rd|th)?\s+\w+\s+\d{4}\b/g) ?? [];
  for (const d of dates) entities.push({ type: 'DATE', text: d, score: 0.95 });

  const refs = text.match(/\b[A-Z]{2,5}\/[A-Z0-9/]+\b/g) ?? [];
  for (const r of refs) entities.push({ type: 'OTHER', text: r, score: 0.9 });

  const names = text.match(/\b[A-Z]{2,}\s+[A-Z]{2,}\b/g) ?? [];
  for (const n of names) entities.push({ type: 'PERSON', text: n, score: 0.85 });

  const amounts = text.match(/N[\d,]{6,}/g) ?? [];
  for (const a of amounts)
    entities.push({ type: 'QUANTITY', text: a, score: 0.92 });

  return entities;
}
