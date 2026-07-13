import { formatNaira } from '@/lib/format';
import type { Valuation, VerificationRecord } from '@/lib/types';

/**
 * Report narrative for DEMO_MODE — the sections Bedrock writes in production.
 *
 * It is assembled from the flags rather than templated blindly, so a demo
 * report on a clean title reads differently from one on the Lekki double-sale.
 */
export function demoNarrative(
  v: VerificationRecord,
  valuation?: Valuation | null,
): {
  executiveSummary: string;
  keyFindings: string[];
  nextSteps: string[];
  valuationNote: string;
} {
  const flags = v.documents.flatMap((d) => d.flags);
  const critical = flags.filter((f) => f.severity === 'critical');
  const major = flags.filter((f) => f.severity === 'major');

  const keyFindings = [...critical, ...major, ...flags.filter((f) => f.severity === 'minor')]
    .slice(0, 5)
    .map((f) => f.description);

  const nextSteps: string[] = [];

  if (critical.length) {
    nextSteps.push(
      'Make no further payment. Anything already paid should be treated as at risk until the searches below come back.',
    );
    nextSteps.push(
      'Instruct a property solicitor to conduct a physical search at the state lands registry against the consent reference and the beacon coordinates — not the address. A search by address will miss a double sale; a search by beacon will not. Expect five to seven working days and ₦150,000 to ₦400,000.',
    );
  } else if (major.length) {
    nextSteps.push(
      'Do not complete until the items flagged above are produced. Put that condition in writing, in the offer letter, before any deposit changes hands.',
    );
    nextSteps.push(
      'Instruct a property solicitor to conduct a search at the relevant lands registry to confirm the root of title and check for any undischarged encumbrance.',
    );
  } else {
    nextSteps.push(
      'Instruct a property solicitor to conduct a confirmatory search at the lands registry. The documents are consistent, but only a search confirms what the registry itself holds.',
    );
  }

  nextSteps.push(
    'Commission a registered surveyor to confirm the beacons on the ground match the survey plan. This is a half-day job and it is the cheapest insurance in the transaction.',
  );
  nextSteps.push(
    'Visit the land. Ask the neighbours who owns it. In a surprising number of fraud cases, someone on the street already knew.',
  );

  if (!critical.length) {
    nextSteps.push(
      'Give this report to your solicitor before you sign anything. It tells them where to look first.',
    );
  }

  const executiveSummary = v.summary;

  const valuationNote = valuation
    ? `The comparable evidence puts this property at around ${formatNaira(
        valuation.estimatedValue,
      )}, with a working range of ${formatNaira(valuation.rangeLow)} to ${formatNaira(
        valuation.rangeHigh,
      )}. Use that to sanity-check the asking price, not to set it — a price inside the range is not by itself evidence that the transaction is sound.`
    : '';

  return { executiveSummary, keyFindings, nextSteps, valuationNote };
}
