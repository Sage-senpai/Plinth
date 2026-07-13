import { NextResponse } from 'next/server';
import { z } from 'zod';
import { presignUpload } from '@/lib/aws/s3';
import { hasAws } from '@/lib/env';

const schema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

/**
 * Hands the browser a presigned PUT so documents go straight to S3 and never
 * pass through a serverless function — a scanned C of O is routinely 20MB.
 *
 * In demo mode there is no bucket: the key is returned so the client can
 * proceed, and the pipeline reads stubbed extractions against it.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const safe = parsed.data.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `uploads/${crypto.randomUUID()}/${safe}`;

  if (!hasAws) {
    return NextResponse.json({ key, mode: 'demo' as const, url: null });
  }

  const url = await presignUpload(key, parsed.data.contentType);
  return NextResponse.json({ key, mode: 'presigned' as const, url });
}
