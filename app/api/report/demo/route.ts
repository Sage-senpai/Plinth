import { NextResponse } from 'next/server';
import { buildReport } from '@/lib/report/pdf';
import { demoNarrative } from '@/lib/demo/narrative';
import { getProperty, getValuationForProperty, getVerification } from '@/lib/db/repo';
import { valueProperty } from '@/lib/valuation';
import type { Valuation } from '@/lib/types';

/**
 * In demo mode there is no S3 bucket to presign against, so the report is
 * rebuilt on demand and streamed straight to the browser. The key carries the
 * verification id: reports/<verificationId>/plinth-due-diligence.pdf
 */
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Missing key.' }, { status: 400 });
  }

  const verificationId = key.split('/')[1];
  const verification = verificationId
    ? await getVerification(verificationId)
    : null;

  if (!verification) {
    return NextResponse.json({ error: 'No such report.' }, { status: 404 });
  }

  const property = verification.propertyId
    ? await getProperty(verification.propertyId)
    : null;

  let valuation: Valuation | null = null;
  if (verification.propertyId) {
    valuation = await getValuationForProperty(verification.propertyId);

    if (!valuation && property?.sizeSqm) {
      valuation = await valueProperty({
        propertyType: property.type ?? 'residential',
        location: property.address,
        sizeSqm: property.sizeSqm,
        features: [],
        state: property.state,
        lga: property.lga,
      });
    }
  }

  const pdf = await buildReport({
    verification,
    address: property?.address ?? 'Property',
    narrative: demoNarrative(verification, valuation),
    valuation,
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="plinth-${verification.id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
