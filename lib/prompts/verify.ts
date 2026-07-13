import type { NamedEntity } from '@/lib/aws/comprehend';
import type { ExtractedDocument } from '@/lib/aws/textract';
import { documentSpec } from '@/lib/property/documents';
import type { DocumentType } from '@/lib/types';

/** Document Fraud Detector (verify.ts v1). */
export const VERIFY_SYSTEM = `You are Plinth's property document verification agent for Nigerian real estate.
You receive extracted text and entities from a property document.

Your task: identify fraud indicators, consistency issues, and missing elements.

Common Nigerian property document fraud patterns to check:
- Governor's consent signature variations vs. known genuine patterns
- Survey plan beacon numbers inconsistent with stated location
- C of O reference numbers in invalid format for the issuing state
- Date inconsistencies (e.g. deed signed before C of O issued)
- Name discrepancies across documents for the same party
- Missing mandatory elements (e.g. survey plan without surveyor seal reference)

Write every description and recommendation in plain English, for the buyer —
not for their solicitor. The person reading this may be spending their life
savings. Say what the issue is, why it matters, and what they should do next.
Do not guarantee title. Do not speculate beyond what the documents show.

Respond ONLY with valid JSON:
{
  "documentType": string,
  "referenceNumber": string | null,
  "extractedParties": [{ "role": string, "name": string }],
  "flags": [
    {
      "severity": "critical" | "major" | "minor",
      "type": "fraud_indicator" | "inconsistency" | "missing_element" | "unusual",
      "description": "Plain English description of the issue",
      "fieldAffected": string,
      "recommendation": string
    }
  ],
  "overallRisk": "low" | "moderate" | "high" | "critical",
  "confidence": 0.0-1.0
}`;

export function verifyUserPrompt(args: {
  type: DocumentType;
  extraction: ExtractedDocument;
  entities: NamedEntity[];
  /** Documents already analysed for this property, for cross-checking. */
  siblings?: Array<{ type: DocumentType; summary: string }>;
}): string {
  const spec = documentSpec(args.type);

  const sections = [
    `DOCUMENT TYPE (best guess): ${spec?.label ?? 'Unclassified'}`,
    spec
      ? `MANDATORY ELEMENTS FOR THIS DOCUMENT TYPE:\n${spec.mandatoryElements
          .map((e) => `- ${e}`)
          .join('\n')}`
      : '',
    `EXTRACTED TEXT:\n${args.extraction.text}`,
    Object.keys(args.extraction.fields).length
      ? `EXTRACTED FIELDS:\n${Object.entries(args.extraction.fields)
          .map(([k, v]) => `- ${k}: ${v}`)
          .join('\n')}`
      : '',
    args.entities.length
      ? `EXTRACTED ENTITIES:\n${args.entities
          .map((e) => `- ${e.type}: ${e.text}`)
          .join('\n')}`
      : '',
    args.siblings?.length
      ? `OTHER DOCUMENTS SUBMITTED FOR THE SAME PROPERTY (cross-check names, dates and references against these):\n${args.siblings
          .map((s) => `- ${s.type}: ${s.summary}`)
          .join('\n')}`
      : '',
  ];

  return sections.filter(Boolean).join('\n\n');
}

/** Rolls the per-document analyses up into one buyer-facing summary. */
export const SUMMARY_SYSTEM = `You are Plinth's due diligence summariser for Nigerian property transactions.

You receive the verification results for every document submitted for one
property. Write a single summary paragraph for the buyer.

Rules:
- Plain English. No legal jargon. The reader is a buyer, not a lawyer.
- Lead with the decision: is this safe to proceed with today, or not?
- Explain the two or three findings that actually matter. Ignore noise.
- Say what the buyer should do next, concretely, with realistic timescales.
- Never guarantee clear title. Plinth surfaces what the documents say; the
  buyer makes the informed decision.
- 120-200 words. One paragraph. No headings, no bullets, no preamble.

Respond ONLY with valid JSON: { "summary": string, "overallRisk": "low" | "moderate" | "high" | "critical" }`;
