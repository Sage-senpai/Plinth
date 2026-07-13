import { describe, expect, it } from 'vitest';
import { buildReport } from '@/lib/report/pdf';
import { demoNarrative } from '@/lib/demo/narrative';
import { DEMO_VERIFICATIONS } from '@/lib/demo/seed';
import type { Valuation } from '@/lib/types';

const doubleSale = DEMO_VERIFICATIONS.find((v) => v.overallRisk === 'critical')!;
const cleanTitle = DEMO_VERIFICATIONS.find((v) => v.overallRisk === 'low')!;

const valuation: Valuation = {
  estimatedValue: 198_000_000,
  rangeLow: 172_000_000,
  rangeHigh: 231_000_000,
  comparables: [],
  methodology: 'Valued from 4 comparable sales in Lekki Phase 2 at ₦330,000 per sqm.',
  confidence: 0.66,
};

describe('due diligence report', () => {
  it('renders a PDF for the double-sale case', async () => {
    const pdf = await buildReport({
      verification: doubleSale,
      address: 'Plot 18 Orchid Road, Lekki Phase 2',
      narrative: demoNarrative(doubleSale, valuation),
      valuation,
    });

    expect(pdf.byteLength).toBeGreaterThan(1000);
    expect(Buffer.from(pdf.subarray(0, 5)).toString()).toBe('%PDF-');
  });

  it('renders a PDF for a clean title with no flags', async () => {
    const pdf = await buildReport({
      verification: cleanTitle,
      address: '14 Bourdillon Road, Ikoyi',
      narrative: demoNarrative(cleanTitle, null),
      valuation: null,
    });

    expect(Buffer.from(pdf.subarray(0, 5)).toString()).toBe('%PDF-');
  });

  /**
   * Regression: pdf-lib's standard fonts are WinAnsi-encoded and WinAnsi has
   * no naira sign. Since every figure in this product is in naira and the
   * report prose is model-written, an unsanitised ₦ threw and took down every
   * report. Nothing a model writes may be allowed to break a report again.
   */
  it('survives naira signs and any other character a model might emit', async () => {
    const hostile = {
      ...cleanTitle,
      summary:
        'The asking price is ₦185,000,000 — about 7% below the ₦199m comparable. Emoji: 🏚 CJK: 物件 Quotes: “smart” and ‘curly’.',
    };

    const pdf = await buildReport({
      verification: hostile,
      address: 'Plot 9 ₦-Street, Lekki 🏠',
      narrative: {
        executiveSummary: 'Estimated at ₦45,000,000 — ₦58,000,000. 物件は危険です。',
        keyFindings: ['A ₦18,000,000 deposit is at risk — 危険'],
        nextSteps: ['Do not pay the ₦18m balance.'],
        valuationNote: 'Range: ₦172,000,000 to ₦231,000,000.',
      },
      valuation,
    });

    expect(Buffer.from(pdf.subarray(0, 5)).toString()).toBe('%PDF-');
    expect(pdf.byteLength).toBeGreaterThan(1000);
  });

  it('never omits the standing disclaimer', async () => {
    const pdf = await buildReport({
      verification: cleanTitle,
      address: '14 Bourdillon Road, Ikoyi',
      narrative: demoNarrative(cleanTitle, null),
      valuation: null,
    });

    // pdf-lib writes text as hex strings, so decode the content streams.
    const zlib = await import('node:zlib');
    const raw = Buffer.from(pdf).toString('latin1');

    let text = '';
    const re = /\bstream\r?\n/g;
    let match: RegExpExecArray | null;

    while ((match = re.exec(raw))) {
      const start = match.index + match[0].length;
      const end = raw.indexOf('endstream', start);
      if (end === -1) continue;

      try {
        const inflated = zlib
          .inflateSync(Buffer.from(raw.slice(start, end), 'latin1'))
          .toString('latin1');

        for (const hex of inflated.matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g)) {
          text += Buffer.from(hex[1], 'hex').toString('latin1');
        }
      } catch {
        // Not a compressed stream — skip it.
      }
    }

    expect(text).toContain('does not guarantee clear title');
  });
});

describe('report narrative', () => {
  it('leads with stop, not with a hedge, when the risk is critical', () => {
    const narrative = demoNarrative(doubleSale, valuation);

    expect(narrative.nextSteps[0]).toMatch(/no further payment/i);
    expect(narrative.keyFindings.length).toBeGreaterThan(0);
    expect(narrative.valuationNote).toMatch(/sanity-check/i);
  });

  it('still tells a clean title to search the registry', () => {
    const narrative = demoNarrative(cleanTitle, null);

    expect(narrative.nextSteps.join(' ')).toMatch(/search/i);
    expect(narrative.valuationNote).toBe('');
  });
});
