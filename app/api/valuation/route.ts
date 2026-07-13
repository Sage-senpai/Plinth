import { NextResponse } from 'next/server';
import { z } from 'zod';
import { valueProperty } from '@/lib/valuation';
import { saveValuation } from '@/lib/db/repo';

const schema = z.object({
  propertyType: z.enum(['residential', 'commercial', 'land']),
  location: z.string().min(2),
  sizeSqm: z.number().positive().max(1_000_000),
  features: z.array(z.string()).default([]),
  state: z.string().optional(),
  lga: z.string().optional(),
  propertyId: z.string().optional(),
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

  const { propertyId, ...input } = parsed.data;

  try {
    const valuation = await valueProperty(input);
    const id = await saveValuation(propertyId ?? null, valuation);

    return NextResponse.json({
      valuationId: id,
      estimatedValue: valuation.estimatedValue,
      range: { low: valuation.rangeLow, high: valuation.rangeHigh },
      comparables: valuation.comparables,
      methodology: valuation.methodology,
      confidence: valuation.confidence,
    });
  } catch (error) {
    console.error('[plinth] valuation failed', error);
    return NextResponse.json(
      { error: 'Valuation could not be produced.' },
      { status: 500 },
    );
  }
}
