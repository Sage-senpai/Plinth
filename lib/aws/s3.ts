import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env, hasAws } from '@/lib/env';

let client: S3Client | null = null;

function s3(): S3Client {
  if (!client) {
    client = new S3Client({
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

/**
 * Presigned PUT so the browser uploads documents straight to S3.
 *
 * There is no demo equivalent — without a bucket there is nowhere to put the
 * bytes. Callers must check `hasAws` and skip the upload rather than be handed
 * a URL that quietly goes nowhere; /api/upload does exactly that.
 */
export async function presignUpload(
  key: string,
  contentType: string,
): Promise<string> {
  if (!hasAws) {
    throw new Error(
      'presignUpload requires S3. Check hasAws and skip the upload in demo mode.',
    );
  }

  return getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: env.s3Bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 900 },
  );
}

export async function presignDownload(key: string): Promise<string> {
  if (!hasAws) return `/api/report/demo?key=${encodeURIComponent(key)}`;

  return getSignedUrl(
    s3(),
    new GetObjectCommand({ Bucket: env.s3Bucket, Key: key }),
    { expiresIn: 3600 },
  );
}

export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<string> {
  if (!hasAws) return key;

  await s3().send(
    new PutObjectCommand({
      Bucket: env.s3Bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return key;
}

export async function getObject(key: string): Promise<Uint8Array | null> {
  if (!hasAws) return null;

  const res = await s3().send(
    new GetObjectCommand({ Bucket: env.s3Bucket, Key: key }),
  );
  if (!res.Body) return null;
  return new Uint8Array(await res.Body.transformToByteArray());
}

export function documentKey(verificationId: string, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `verifications/${verificationId}/${safe}`;
}

export function reportKey(verificationId: string): string {
  return `reports/${verificationId}/plinth-due-diligence.pdf`;
}
