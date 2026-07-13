import { documentLabel } from '@/lib/property/documents';
import type {
  AnalysedDocument,
  DocumentAnalysis,
  DocumentType,
  RiskLevel,
} from '@/lib/types';

/**
 * Stand-in for the Bedrock fraud detector in DEMO_MODE.
 *
 * The findings mirror the Lekki Phase 2 case the company was founded on: a
 * genuine C of O, a forged consent endorsement on the deed, and a survey plan
 * whose beacons don't sit where the deed says the plot is. It gives a demo
 * user the real product experience without an AWS account.
 */
export function demoAnalysis(type: DocumentType): DocumentAnalysis {
  switch (type) {
    case 'certificate_of_occupancy':
      return {
        documentType: 'Certificate of Occupancy',
        referenceNumber: 'LSLB/CO/2015/09912',
        extractedParties: [{ role: 'Grantee', name: 'Emeka Nwosu' }],
        flags: [],
        overallRisk: 'low',
        confidence: 0.93,
      };

    case 'deed_of_assignment':
      return {
        documentType: 'Deed of Assignment',
        referenceNumber: '2024/0912/LagosState',
        extractedParties: [
          { role: 'Assignor', name: 'Emeka Nwosu' },
          { role: 'Assignee', name: 'Tunde Bakare' },
        ],
        flags: [
          {
            severity: 'critical',
            type: 'fraud_indicator',
            description:
              "The Governor's consent on this deed is referenced LSLB/GC/2024/3318 and dated 14 March 2024. Consent references in that sequence were not issued until August 2024. A consent cannot be endorsed five months before it exists. This is the signature of a forged consent stamp.",
            fieldAffected: "Governor's consent reference and date",
            recommendation:
              'Stop. Pay nothing further. Instruct your solicitor to run a physical search at the Lagos State Lands Bureau against this consent reference before you take another step. It takes about a week.',
          },
          {
            severity: 'major',
            type: 'inconsistency',
            description:
              'The consideration on the deed (₦185,000,000) is roughly 7% below the lowest comparable sale on the same road in the last year. A price that is only slightly below market is a common feature of a distressed or fraudulent sale — it is low enough to move quickly, high enough not to alarm the buyer.',
            fieldAffected: 'Consideration',
            recommendation:
              'Treat the price as a question, not a bargain. Ask the seller directly why it is below market and verify the answer independently.',
          },
        ],
        overallRisk: 'critical',
        confidence: 0.87,
      };

    case 'survey_plan':
      return {
        documentType: 'Survey Plan',
        referenceNumber: 'LS/D/2015/4471',
        extractedParties: [
          { role: 'Surveyor', name: 'Surv. O. Adeyemi (SURCON 2210)' },
        ],
        flags: [
          {
            severity: 'major',
            type: 'inconsistency',
            description:
              'The beacon coordinates on this plan put the plot roughly 900 metres from the address written on the deed. Either this survey belongs to a different piece of land, or the deed describes the wrong plot. Both are serious.',
            fieldAffected: 'Beacon coordinates vs stated address',
            recommendation:
              'Have a registered surveyor stand on the land and confirm which plot these beacons actually describe. Do not rely on either document until they agree.',
          },
        ],
        overallRisk: 'high',
        confidence: 0.82,
      };

    case 'excision_in_registry':
      return {
        documentType: 'Excision in Registry',
        referenceNumber: 'Gazette 18, Vol. 47',
        extractedParties: [],
        flags: [
          {
            severity: 'minor',
            type: 'unusual',
            description:
              'The excision covers 42.116 hectares for the whole Ilaje community. It confirms the land is released from government acquisition, but it says nothing about who within the community may sell this particular plot.',
            fieldAffected: 'Excised hectarage',
            recommendation:
              'Ask for the community allocation letter or family receipt that ties this specific plot to the seller. An excision alone is not a root of title.',
          },
        ],
        overallRisk: 'moderate',
        confidence: 0.85,
      };

    default:
      return {
        documentType: 'Unclassified document',
        referenceNumber: null,
        extractedParties: [],
        flags: [
          {
            severity: 'minor',
            type: 'missing_element',
            description:
              'Plinth could not classify this document with confidence. It may be a scan quality problem, or it may not be a document type we support yet.',
            fieldAffected: 'Document type',
            recommendation:
              'Re-upload a clearer scan. If the problem persists, this document will need to be read by a person.',
          },
        ],
        overallRisk: 'low',
        confidence: 0.41,
      };
  }
}

export function demoSummary(
  address: string,
  documents: AnalysedDocument[],
  risk: RiskLevel,
): string {
  const critical = documents.flatMap((d) =>
    d.flags.filter((f) => f.severity === 'critical'),
  );
  const major = documents.flatMap((d) =>
    d.flags.filter((f) => f.severity === 'major'),
  );

  if (critical.length) {
    return `Do not proceed with ${address} on the documents as they stand. ${critical[0].description} ${
      major.length
        ? `There is a second problem alongside it: ${major[0].description.charAt(0).toLowerCase()}${major[0].description.slice(1)} `
        : ''
    }Taken together these findings are consistent with the fraud pattern that costs Nigerian buyers the most money — a genuine root of title used to lend credibility to a transfer that never lawfully happened. A physical search at the state lands bureau against the consent reference and the beacon coordinates will settle it within about a week. Until it does, no further money should change hands. Plinth does not guarantee title; this report tells you what the documents say, and what they say here is a warning.`;
  }

  if (major.length) {
    return `The documents for ${address} are not safe to complete on today, but nothing here is necessarily fraud. ${major[0].description} ${major[0].recommendation} None of this is unusual in a Nigerian transaction, and all of it is fixable — but each gap is exactly the kind of thing a forger relies on, so close them before you pay rather than after. Make payment conditional, in writing, on the outstanding items being produced. Plinth does not guarantee title; it tells you what the papers say and where they are silent.`;
  }

  const risky = risk !== 'low';
  return `The documents for ${address} are consistent with one another and with the state registry formats we check against. The references are well-formed, the parties named across the documents match, and nothing in the chain of title contradicts itself.${
    risky ? ' There are minor points worth confirming before completion, listed below.' : ''
  } On the documents alone, this is a clean title. That is not the same as a guarantee: Plinth surfaces what the available documents say, and a physical search plus a site visit remains the only way to confirm what is true on the ground. What you do with that is your informed decision.`;
}
