import { Client } from '@upstash/qstash';
import { env, hasQueue } from '@/lib/env';
import { runVerification, type VerifyJob } from './jobs';

/**
 * Verification takes about six minutes of Textract and Bedrock calls for a
 * five-document property — well past a serverless request budget. In
 * production the job is handed to QStash, which calls /api/queue/process back.
 *
 * Without a QStash token (demo mode) the pipeline runs inline. Demo documents
 * are stubbed, so it returns in milliseconds and the caller sees a completed
 * verification immediately.
 */
export async function enqueueVerification(job: VerifyJob): Promise<'queued' | 'inline'> {
  if (!hasQueue) {
    await runVerification(job);
    return 'inline';
  }

  const qstash = new Client({ token: env.qstashToken! });

  await qstash.publishJSON({
    url: `${env.nextAuthUrl}/api/queue/process`,
    body: job,
    retries: 2,
  });

  return 'queued';
}

export { runVerification };
export type { VerifyJob };
