import { describe, expect, it } from 'vitest';
import { guessDocumentType, documentSpec } from '@/lib/property/documents';
import { highestRisk, riskFromFlags, type DocumentFlag } from '@/lib/types';
import { runVerification } from '@/lib/queue/jobs';
import { createProperty, createVerification, getVerification } from '@/lib/db/repo';

function flag(severity: DocumentFlag['severity']): DocumentFlag {
  return {
    severity,
    type: 'inconsistency',
    description: 'x',
    fieldAffected: 'x',
    recommendation: 'x',
  };
}

describe('risk rollup', () => {
  it('takes the worst risk across documents', () => {
    expect(highestRisk(['low', 'critical', 'moderate'])).toBe('critical');
    expect(highestRisk(['low', 'moderate'])).toBe('moderate');
    expect(highestRisk([])).toBe('low');
  });

  it('a single critical flag makes the property critical', () => {
    expect(riskFromFlags([flag('minor'), flag('critical')])).toBe('critical');
  });

  it('two major flags outrank one', () => {
    expect(riskFromFlags([flag('major')])).toBe('moderate');
    expect(riskFromFlags([flag('major'), flag('major')])).toBe('high');
  });

  it('no flags is low risk', () => {
    expect(riskFromFlags([])).toBe('low');
  });
});

describe('document classification', () => {
  it('recognises the Nigerian document types from a file name', () => {
    expect(guessDocumentType('Lekki-C-of-O.pdf')).toBe(
      'certificate_of_occupancy',
    );
    expect(guessDocumentType('certificate_of_occupancy.pdf')).toBe(
      'certificate_of_occupancy',
    );
    expect(guessDocumentType('survey plan 2015.jpg')).toBe('survey_plan');
    expect(guessDocumentType('DEED OF ASSIGNMENT.pdf')).toBe(
      'deed_of_assignment',
    );
    expect(guessDocumentType('gazette-excision.pdf')).toBe(
      'excision_in_registry',
    );
  });

  it('does not guess when it cannot tell', () => {
    expect(guessDocumentType('scan_0001.jpg')).toBe('unknown');
  });

  it('every supported type declares its mandatory elements', () => {
    for (const type of [
      'certificate_of_occupancy',
      'survey_plan',
      'deed_of_assignment',
    ] as const) {
      expect(documentSpec(type)?.mandatoryElements.length).toBeGreaterThan(0);
    }
  });
});

describe('verification pipeline', () => {
  it('flags the forged consent and rolls the property up to critical', async () => {
    const propertyId = await createProperty({
      address: 'Plot 18 Orchid Road, Lekki Phase 2',
      state: 'Lagos',
      type: 'land',
      sizeSqm: 600,
    });

    const verificationId = await createVerification({ propertyId });

    await runVerification({
      verificationId,
      address: 'Plot 18 Orchid Road, Lekki Phase 2',
      documents: [
        { s3Key: 'k/cofo.pdf', type: 'certificate_of_occupancy' },
        { s3Key: 'k/deed.pdf', type: 'deed_of_assignment' },
        { s3Key: 'k/survey.pdf', type: 'survey_plan' },
      ],
    });

    const record = await getVerification(verificationId);

    expect(record?.status).toBe('complete');
    expect(record?.overallRisk).toBe('critical');
    expect(record?.documents).toHaveLength(3);

    const flags = record!.documents.flatMap((d) => d.flags);
    expect(flags.some((f) => f.severity === 'critical')).toBe(true);
    expect(
      flags.some((f) => /consent/i.test(f.description)),
    ).toBe(true);

    // Every flag must tell the buyer what to do about it. That is the product.
    for (const f of flags) {
      expect(f.recommendation.length).toBeGreaterThan(20);
    }

    expect(record?.summary).toMatch(/do not proceed/i);
  });
});
