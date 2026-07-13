import { NextResponse } from 'next/server';
import { z } from 'zod';
import { invokeJson } from '@/lib/aws/bedrock';
import { presignDownload, putObject, reportKey } from '@/lib/aws/s3';
import { hasAws } from '@/lib/env';
import { REPORT_SYSTEM, reportUserPrompt } from '@/lib/prompts/report';
import { buildReport } from '@/lib/report/pdf';
import { demoNarrative } from '@/lib/demo/narrative';
import { formatNaira } from '@/lib/format';
import { documentLabel } from '@/lib/property/documents';
import {
  getProperty,
  getValuationForProperty,
  getVerification,
  saveReport,
} from '@/lib/db/repo';
import { valueProperty } from '@/lib/valuation';
import type { Valuation } from '@/lib/types';

const schema = z.object({
  verificationId: z.string().min(1),
  includeValuation: z.boolean().default(true),
});

export const maxDuration = 120;

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

  const { verificationId, includeValuation } = parsed.data;

  const verification = await getVerification(verificationId);
  if (!verification) {
    return NextResponse.json(
      { error: 'No verification with that id.' },
      { status: 404 },
    );
  }

  if (verification.status !== 'complete') {
    return NextResponse.json(
      {
        error: `Verification is ${verification.status}. A report can only be generated once verification is complete.`,
      },
      { status: 409 },
    );
  }

  const property = verification.propertyId
    ? await getProperty(verification.propertyId)
    : null;
  const address = property?.address ?? 'Property';

  // Valuation: reuse one if we already have it, otherwise value on the fly.
  let valuation: Valuation | null = null;
  if (includeValuation && verification.propertyId) {
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

  const flags = verification.documents.flatMap((d) => d.flags);

  try {
    const narrative = hasAws
      ? await invokeJson<{
          executiveSummary: string;
          keyFindings: string[];
          nextSteps: string[];
          valuationNote: string;
        }>({
          system: REPORT_SYSTEM,
          user: reportUserPrompt({
            address,
            overallRisk: verification.overallRisk,
            summary: verification.summary,
            documents: verification.documents.map((d) => ({
              label: documentLabel(d.type),
              flagCount: d.flags.length,
            })),
            flags,
            valuation: valuation
              ? {
                  estimated: formatNaira(valuation.estimatedValue),
                  low: formatNaira(valuation.rangeLow),
                  high: formatNaira(valuation.rangeHigh),
                }
              : undefined,
          }),
          maxTokens: 2048,
        })
      : demoNarrative(verification, valuation);

    const pdf = await buildReport({
      verification,
      address,
      narrative,
      valuation,
    });

    const key = reportKey(verification.id);
    await putObject(key, pdf, 'application/pdf');

    const reportId = await saveReport({
      verificationId: verification.id,
      valuationId: valuation?.id ?? null,
      s3Key: key,
    });

    const reportUrl = await presignDownload(key);

    return NextResponse.json({ reportId, reportUrl, key });
  } catch (error) {
    console.error('[plinth] report generation failed', error);
    return NextResponse.json(
      { error: 'Report could not be generated.' },
      { status: 500 },
    );
  }
}
