import { formatNaira, formatSqm } from '@/lib/format';
import type { Comparable, ValuationInput } from '@/lib/types';

export const VALUATION_SYSTEM = `You are Plinth's automated valuation agent for Nigerian real estate.

You receive a subject property and a set of comparable sales from the same area.
Produce a valuation the buyer can rely on to sanity-check an asking price.

Method:
- Value from the comparables. Adjust for size, property type, condition and the
  age of each sale. Recent sales in the same area carry the most weight.
- Nigerian comparable data is thin and unevenly reported. Say so. If there are
  fewer than three genuinely comparable sales, widen the range and lower your
  confidence rather than inventing precision.
- The range must be honest, not flattering. A buyer using this to negotiate is
  better served by a wide accurate range than a narrow confident wrong one.
- All figures in Nigerian Naira (NGN), as whole numbers, no separators.

The methodology field is read by the buyer. Write it in plain English: which
comparables you leaned on, what you adjusted for, and why the range is as wide
as it is. 60-120 words.

Respond ONLY with valid JSON:
{
  "estimatedValue": number,
  "rangeLow": number,
  "rangeHigh": number,
  "methodology": string,
  "confidence": 0.0-1.0
}`;

export function valuationUserPrompt(
  input: ValuationInput,
  comps: Comparable[],
): string {
  const subject = [
    `SUBJECT PROPERTY`,
    `- Location: ${input.location}`,
    `- Type: ${input.propertyType}`,
    `- Size: ${formatSqm(input.sizeSqm)}`,
    input.features.length
      ? `- Features: ${input.features.join(', ')}`
      : '- Features: none stated',
  ].join('\n');

  const comparables = comps.length
    ? [
        `COMPARABLE SALES (${comps.length})`,
        ...comps.map(
          (c) =>
            `- ${c.address} | ${c.type ?? 'unknown type'} | ${
              c.sizeSqm ? formatSqm(c.sizeSqm) : 'size unknown'
            } | sold ${formatNaira(c.salePrice)} on ${c.saleDate} | source: ${
              c.source ?? 'unknown'
            }`,
        ),
      ].join('\n')
    : 'COMPARABLE SALES: none found in this area. Say so plainly in the methodology and return a low confidence.';

  return `${subject}\n\n${comparables}`;
}
