import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createProperty, createVerification, getVerification } from '@/lib/db/repo';
import { enqueueVerification } from '@/lib/queue';
import { guessDocumentType } from '@/lib/property/documents';
import type { DocumentType } from '@/lib/types';

const DOCUMENT_TYPES = [
  'certificate_of_occupancy',
  'survey_plan',
  'deed_of_assignment',
  'power_of_attorney',
  'probate',
  'mortgage_deed',
  'excision_in_registry',
  'approved_building_plan',
  'unknown',
] as const;

const schema = z.object({
  property: z.object({
    address: z.string().min(3),
    state: z.string().optional(),
    lga: z.string().optional(),
    type: z.enum(['residential', 'commercial', 'land']).optional(),
    sizeSqm: z.number().positive().optional(),
  }),
  documents: z
    .array(
      z.object({
        s3Key: z.string().min(1),
        type: z.enum(DOCUMENT_TYPES).optional(),
        fileName: z.string().optional(),
      }),
    )
    .min(1)
    .max(5),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request.', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { property, documents, userId } = parsed.data;

  const propertyId = await createProperty(property);
  const verificationId = await createVerification({
    propertyId,
    userId,
    status: 'processing',
  });

  const mode = await enqueueVerification({
    verificationId,
    address: property.address,
    documents: documents.map((d) => ({
      s3Key: d.s3Key,
      type: (d.type ??
        guessDocumentType(d.fileName ?? d.s3Key)) as DocumentType,
      fileName: d.fileName,
    })),
  });

  // Queued runs return immediately; the client polls /api/status/[jobId].
  if (mode === 'queued') {
    return NextResponse.json(
      { verificationId, status: 'processing' },
      { status: 202 },
    );
  }

  const record = await getVerification(verificationId);
  if (!record) {
    return NextResponse.json(
      { error: 'Verification could not be read back.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    verificationId,
    status: record.status,
    summary: record.summary,
    overallRisk: record.overallRisk,
    flags: record.documents.flatMap((d) => d.flags),
    documents: record.documents,
  });
}
