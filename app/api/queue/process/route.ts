import { NextResponse } from 'next/server';
import { Receiver } from '@upstash/qstash';
import { runVerification, type VerifyJob } from '@/lib/queue';

/**
 * QStash worker. A five-document property takes minutes of Textract and
 * Bedrock calls, so the work happens here rather than in the request that
 * started it.
 */
export const maxDuration = 300;

const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

export async function POST(request: Request) {
  const raw = await request.text();

  // The worker is a public endpoint. Without a valid QStash signature, anyone
  // who guesses the URL could spend our Bedrock budget.
  if (signingKey && nextSigningKey) {
    const receiver = new Receiver({
      currentSigningKey: signingKey,
      nextSigningKey,
    });

    const valid = await receiver
      .verify({
        signature: request.headers.get('upstash-signature') ?? '',
        body: raw,
      })
      .catch(() => false);

    if (!valid) {
      return NextResponse.json({ error: 'Bad signature.' }, { status: 401 });
    }
  }

  let job: VerifyJob;
  try {
    job = JSON.parse(raw) as VerifyJob;
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  if (!job.verificationId || !Array.isArray(job.documents)) {
    return NextResponse.json({ error: 'Malformed job.' }, { status: 400 });
  }

  try {
    await runVerification(job);
  } catch {
    // runVerification has already marked the verification failed. Return 500 so
    // QStash retries; a transient Textract throttle should not lose the job.
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, verificationId: job.verificationId });
}
