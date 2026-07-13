import { NextResponse } from 'next/server';
import { getVerification } from '@/lib/db/repo';

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } },
) {
  const record = await getVerification(params.jobId);

  if (!record) {
    return NextResponse.json(
      { error: 'No verification with that id.' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    verificationId: record.id,
    status: record.status,
    overallRisk: record.overallRisk,
    summary: record.summary,
    documents: record.documents,
    flags: record.documents.flatMap((d) => d.flags),
    createdAt: record.createdAt,
  });
}
