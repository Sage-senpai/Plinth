import type {
  AnalysedDocument,
  Comparable,
  VerificationRecord,
} from '@/lib/types';

/**
 * Seed corpus for DEMO_MODE.
 *
 * These records stand in for Neon when no DATABASE_URL is configured. The
 * three verifications are modelled on real pilot cases: one clean title, one
 * with a consent defect, and the Lekki Phase 2 double-sale that started the
 * company.
 */

export const DEMO_COMPARABLES: Comparable[] = [
  { id: 'cmp-001', address: '12 Admiralty Way, Lekki Phase 1', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK1', type: 'residential', sizeSqm: 450, salePrice: 285_000_000, saleDate: '2025-11-04', source: 'Agent network', distanceKm: 0.8 },
  { id: 'cmp-002', address: '7 Fola Osibo, Lekki Phase 1', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK1', type: 'residential', sizeSqm: 500, salePrice: 312_000_000, saleDate: '2025-09-19', source: 'Land registry', distanceKm: 1.2 },
  { id: 'cmp-003', address: '24 Chief Collins, Lekki Phase 1', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK1', type: 'residential', sizeSqm: 400, salePrice: 254_000_000, saleDate: '2026-01-22', source: 'Agent network', distanceKm: 1.6 },
  { id: 'cmp-004', address: '3 Bisola Durosinmi, Lekki Phase 1', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK1', type: 'land', sizeSqm: 650, salePrice: 390_000_000, saleDate: '2025-12-11', source: 'Law firm filing', distanceKm: 2.1 },
  { id: 'cmp-005', address: 'Plot 44 Ikate Elegushi', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK1', type: 'land', sizeSqm: 600, salePrice: 348_000_000, saleDate: '2026-02-08', source: 'Agent network', distanceKm: 2.9 },

  { id: 'cmp-010', address: 'Plot 18 Orchid Road, Lekki Phase 2', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK2', type: 'land', sizeSqm: 600, salePrice: 198_000_000, saleDate: '2025-10-02', source: 'Agent network', distanceKm: 0.4 },
  { id: 'cmp-011', address: 'Plot 9 Abraham Adesanya, Lekki Phase 2', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK2', type: 'land', sizeSqm: 500, salePrice: 172_000_000, saleDate: '2025-12-19', source: 'Land registry', distanceKm: 1.1 },
  { id: 'cmp-012', address: '5 Emmanuel Close, Lekki Phase 2', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK2', type: 'residential', sizeSqm: 450, salePrice: 156_000_000, saleDate: '2026-01-15', source: 'Agent network', distanceKm: 1.7 },
  { id: 'cmp-013', address: 'Plot 61 Ilaje Road, Lekki Phase 2', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-LK2', type: 'land', sizeSqm: 700, salePrice: 231_000_000, saleDate: '2026-03-06', source: 'Law firm filing', distanceKm: 2.4 },

  { id: 'cmp-020', address: '14 Bourdillon Road, Ikoyi', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-IKY', type: 'residential', sizeSqm: 800, salePrice: 940_000_000, saleDate: '2025-11-27', source: 'Law firm filing', distanceKm: 0.6 },
  { id: 'cmp-021', address: '2 Glover Road, Ikoyi', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-IKY', type: 'residential', sizeSqm: 720, salePrice: 855_000_000, saleDate: '2026-02-14', source: 'Land registry', distanceKm: 1.4 },
  { id: 'cmp-022', address: '31 Cooper Road, Ikoyi', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-IKY', type: 'commercial', sizeSqm: 1_100, salePrice: 1_320_000_000, saleDate: '2025-08-30', source: 'Agent network', distanceKm: 2.2 },

  { id: 'cmp-030', address: '8 Adeola Odeku, Victoria Island', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-VIC', type: 'commercial', sizeSqm: 950, salePrice: 910_000_000, saleDate: '2025-10-21', source: 'Land registry', distanceKm: 0.9 },
  { id: 'cmp-031', address: '17 Ajose Adeogun, Victoria Island', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-VIC', type: 'commercial', sizeSqm: 1_200, salePrice: 1_150_000_000, saleDate: '2026-01-09', source: 'Agent network', distanceKm: 1.5 },

  { id: 'cmp-040', address: '22 Sobo Arobiodu, Ikeja GRA', state: 'Lagos', lga: 'Ikeja', areaCode: 'LA-IKJ', type: 'residential', sizeSqm: 600, salePrice: 322_000_000, saleDate: '2025-12-02', source: 'Agent network', distanceKm: 1.0 },
  { id: 'cmp-041', address: '9 Oduduwa Crescent, Ikeja GRA', state: 'Lagos', lga: 'Ikeja', areaCode: 'LA-IKJ', type: 'residential', sizeSqm: 550, salePrice: 298_000_000, saleDate: '2026-02-26', source: 'Land registry', distanceKm: 1.8 },

  { id: 'cmp-050', address: 'Plot 1204 Cadastral Zone A6, Maitama', state: 'FCT', lga: 'AMAC', areaCode: 'AB-MAI', type: 'residential', sizeSqm: 900, salePrice: 660_000_000, saleDate: '2025-11-13', source: 'Land registry', distanceKm: 0.7 },
  { id: 'cmp-051', address: 'Plot 88 Gana Street, Maitama', state: 'FCT', lga: 'AMAC', areaCode: 'AB-MAI', type: 'residential', sizeSqm: 1_000, salePrice: 745_000_000, saleDate: '2026-01-30', source: 'Agent network', distanceKm: 1.3 },
  { id: 'cmp-052', address: '5th Avenue, Gwarinpa Estate', state: 'FCT', lga: 'AMAC', areaCode: 'AB-GWA', type: 'residential', sizeSqm: 500, salePrice: 108_000_000, saleDate: '2025-12-08', source: 'Agent network', distanceKm: 2.0 },
  { id: 'cmp-053', address: '3rd Avenue, Gwarinpa Estate', state: 'FCT', lga: 'AMAC', areaCode: 'AB-GWA', type: 'residential', sizeSqm: 450, salePrice: 96_000_000, saleDate: '2026-03-11', source: 'Land registry', distanceKm: 2.6 },

  { id: 'cmp-060', address: 'Plot 12 Monastery Road, Sangotedo', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-SAN', type: 'land', sizeSqm: 600, salePrice: 72_000_000, saleDate: '2026-02-03', source: 'Agent network', distanceKm: 1.1 },
  { id: 'cmp-061', address: 'Plot 30 Lekki Gardens, Sangotedo', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-SAN', type: 'land', sizeSqm: 500, salePrice: 61_000_000, saleDate: '2025-12-15', source: 'Agent network', distanceKm: 1.9 },
  { id: 'cmp-062', address: '19 Ogombo Road, Ajah', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-AJA', type: 'residential', sizeSqm: 450, salePrice: 84_000_000, saleDate: '2026-01-19', source: 'Land registry', distanceKm: 1.4 },
  { id: 'cmp-063', address: 'Plot 7 Badore Road, Ajah', state: 'Lagos', lga: 'Eti-Osa', areaCode: 'LA-AJA', type: 'land', sizeSqm: 550, salePrice: 99_000_000, saleDate: '2025-10-28', source: 'Agent network', distanceKm: 2.3 },
];

const CLEAN_DOCS: AnalysedDocument[] = [
  {
    s3Key: 'demo/ikoyi/cofo.pdf',
    type: 'certificate_of_occupancy',
    fileName: 'Bourdillon-CofO.pdf',
    flags: [],
    extractedData: {
      documentType: 'Certificate of Occupancy',
      referenceNumber: 'LSLB/CO/2019/04471',
      extractedParties: [
        { role: 'Grantee', name: 'Adebayo Olumide Cole' },
        { role: 'Grantor', name: 'Governor of Lagos State' },
      ],
      flags: [],
      overallRisk: 'low',
      confidence: 0.94,
    },
  },
  {
    s3Key: 'demo/ikoyi/survey.pdf',
    type: 'survey_plan',
    fileName: 'Bourdillon-Survey.pdf',
    flags: [
      {
        severity: 'minor',
        type: 'unusual',
        description:
          'The survey plan was drawn in 2016, three years before the Certificate of Occupancy was issued. This is common and usually harmless, but the beacon coordinates should be re-confirmed on site before completion.',
        fieldAffected: 'Survey date',
        recommendation:
          'Ask your surveyor to re-verify the four beacons against the coordinates on the plan. A site visit of two hours settles this.',
      },
    ],
    extractedData: {
      documentType: 'Survey Plan',
      referenceNumber: 'LS/D/2016/1129',
      extractedParties: [{ role: 'Surveyor', name: 'Surv. K. A. Bamidele (SURCON 4471)' }],
      flags: [],
      overallRisk: 'low',
      confidence: 0.91,
    },
  },
  {
    s3Key: 'demo/ikoyi/deed.pdf',
    type: 'deed_of_assignment',
    fileName: 'Bourdillon-Deed.pdf',
    flags: [],
    extractedData: {
      documentType: 'Deed of Assignment',
      referenceNumber: '2019/1183/LagosState',
      extractedParties: [
        { role: 'Assignor', name: 'Adebayo Olumide Cole' },
        { role: 'Assignee', name: 'Chidinma Eze' },
      ],
      flags: [],
      overallRisk: 'low',
      confidence: 0.96,
    },
  },
];

const CONSENT_DOCS: AnalysedDocument[] = [
  {
    s3Key: 'demo/gwarinpa/cofo.pdf',
    type: 'certificate_of_occupancy',
    fileName: 'Gwarinpa-CofO.pdf',
    flags: [
      {
        severity: 'major',
        type: 'inconsistency',
        description:
          'The name on the Certificate of Occupancy is "Ibrahim M. Sanusi". The deed presented to you names the seller as "Ibrahim Mohammed Sanusi-Bello". These may be the same person, but nothing in the documents proves it.',
        fieldAffected: 'Grantee name',
        recommendation:
          'Ask the seller for a sworn declaration of name and any deed poll. If he cannot produce one, treat the chain of title as broken and do not pay a deposit.',
      },
    ],
    extractedData: {
      documentType: 'Certificate of Occupancy',
      referenceNumber: 'FCT/ABU/CO/2017/22908',
      extractedParties: [{ role: 'Grantee', name: 'Ibrahim M. Sanusi' }],
      flags: [],
      overallRisk: 'moderate',
      confidence: 0.88,
    },
  },
  {
    s3Key: 'demo/gwarinpa/deed.pdf',
    type: 'deed_of_assignment',
    fileName: 'Gwarinpa-Deed.pdf',
    flags: [
      {
        severity: 'major',
        type: 'missing_element',
        description:
          "The deed has no Governor's consent endorsement. Under the Land Use Act, a transfer without the Governor's consent is not effective against the state. You would be paying for a document the state does not have to recognise.",
        fieldAffected: "Governor's consent",
        recommendation:
          'Do not complete until consent is obtained and endorsed on the deed. Consent in the FCT typically takes 8-16 weeks. Make it a condition of payment, in writing.',
      },
    ],
    extractedData: {
      documentType: 'Deed of Assignment',
      referenceNumber: null,
      extractedParties: [
        { role: 'Assignor', name: 'Ibrahim Mohammed Sanusi-Bello' },
        { role: 'Assignee', name: 'Folake Adeniyi' },
      ],
      flags: [],
      overallRisk: 'high',
      confidence: 0.9,
    },
  },
];

const DOUBLE_SALE_DOCS: AnalysedDocument[] = [
  {
    s3Key: 'demo/lekki2/cofo.pdf',
    type: 'certificate_of_occupancy',
    fileName: 'Lekki2-CofO.pdf',
    flags: [],
    extractedData: {
      documentType: 'Certificate of Occupancy',
      referenceNumber: 'LSLB/CO/2015/09912',
      extractedParties: [{ role: 'Grantee', name: 'Emeka Nwosu' }],
      flags: [],
      overallRisk: 'low',
      confidence: 0.93,
    },
  },
  {
    s3Key: 'demo/lekki2/deed.pdf',
    type: 'deed_of_assignment',
    fileName: 'Lekki2-Deed.pdf',
    flags: [
      {
        severity: 'critical',
        type: 'fraud_indicator',
        description:
          "The Governor's consent endorsement on this deed carries reference LSLB/GC/2024/3318. The date beside it is 14 March 2024 — but consent reference 3318 was issued in the sequence for August 2024. A consent cannot be endorsed five months before it was issued. This pattern is consistent with a forged consent stamp.",
        fieldAffected: "Governor's consent reference and date",
        recommendation:
          'Stop. Do not pay any further money. Instruct your solicitor to conduct a physical search at the Lagos State Lands Bureau against the consent reference before you take another step.',
      },
      {
        severity: 'critical',
        type: 'inconsistency',
        description:
          'The deed is dated 14 March 2024, but the Certificate of Occupancy it relies on names Emeka Nwosu as grantee and a separate deed for the same plot — registered as 2023/4471 — assigned the identical beacon coordinates to a different buyer in December 2023. The same land appears to have been sold twice.',
        fieldAffected: 'Beacon coordinates and chain of title',
        recommendation:
          'Treat this as a live double-sale. Do not complete. A search against the beacon coordinates, not just the address, will confirm it.',
      },
    ],
    extractedData: {
      documentType: 'Deed of Assignment',
      referenceNumber: '2024/0912/LagosState',
      extractedParties: [
        { role: 'Assignor', name: 'Emeka Nwosu' },
        { role: 'Assignee', name: 'Tunde Bakare' },
      ],
      flags: [],
      overallRisk: 'critical',
      confidence: 0.87,
    },
  },
  {
    s3Key: 'demo/lekki2/survey.pdf',
    type: 'survey_plan',
    fileName: 'Lekki2-Survey.pdf',
    flags: [
      {
        severity: 'major',
        type: 'inconsistency',
        description:
          'The beacon numbers on the survey plan (LS/4471/A through D) place the plot approximately 900 metres from the address stated on the deed. Either the survey belongs to a different plot or the address on the deed is wrong.',
        fieldAffected: 'Beacon coordinates vs stated address',
        recommendation:
          'Have a registered surveyor confirm on the ground which plot these beacons describe before you rely on either document.',
      },
    ],
    extractedData: {
      documentType: 'Survey Plan',
      referenceNumber: 'LS/D/2015/4471',
      extractedParties: [{ role: 'Surveyor', name: 'Surv. O. Adeyemi (SURCON 2210)' }],
      flags: [],
      overallRisk: 'high',
      confidence: 0.82,
    },
  },
];

export const DEMO_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'ver_9f2c41a8',
    propertyId: 'prp_lekki2_18',
    userId: 'demo',
    documents: DOUBLE_SALE_DOCS,
    overallRisk: 'critical',
    summary:
      'Do not proceed with this transaction on the documents as they stand. The Certificate of Occupancy appears genuine, but the Governor\'s consent on the deed carries a reference number that could not have existed on the date it was endorsed, and the same beacon coordinates appear on an earlier deed assigned to a different buyer in December 2023. Taken together these two findings are consistent with a double sale using a forged consent — the exact pattern that costs Nigerian buyers the most money. A physical search at the Lagos State Lands Bureau against the consent reference and the beacon coordinates will confirm the position within a week. Until it does, no further payment should be made.',
    status: 'complete',
    createdAt: '2026-06-28T09:14:00.000Z',
  },
  {
    id: 'ver_3b71de05',
    propertyId: 'prp_gwarinpa_5th',
    userId: 'demo',
    documents: CONSENT_DOCS,
    overallRisk: 'high',
    summary:
      "This transaction is not safe to complete today, but it is fixable. Two problems: the deed carries no Governor's consent, which means the state is not obliged to recognise the transfer; and the seller's name on the C of O is shorter than the name on the deed, with nothing in the papers linking the two. Neither is necessarily fraud. Both are the kind of gap a forger relies on. Ask for a sworn declaration of name, and make payment conditional on consent being endorsed. Expect 8-16 weeks for FCT consent.",
    status: 'complete',
    createdAt: '2026-07-02T14:31:00.000Z',
  },
  {
    id: 'ver_c04e88b1',
    propertyId: 'prp_ikoyi_bourdillon',
    userId: 'demo',
    documents: CLEAN_DOCS,
    overallRisk: 'low',
    summary:
      'The documents for this property are consistent with one another and with the Lagos State registry formats. The C of O reference is well-formed, the deed recites the correct root of title, and the parties named on the deed match the C of O. One minor point: the survey plan predates the C of O by three years, which is common but worth a two-hour site visit to re-confirm the beacons before completion. On the documents alone, this is a clean title. Plinth does not guarantee title — this report tells you what the papers say, and the papers say the right things.',
    status: 'complete',
    createdAt: '2026-07-08T11:02:00.000Z',
  },
];

export const DEMO_PROPERTIES: Record<
  string,
  { address: string; state: string; lga: string; type: string; sizeSqm: number }
> = {
  prp_lekki2_18: { address: 'Plot 18 Orchid Road, Lekki Phase 2', state: 'Lagos', lga: 'Eti-Osa', type: 'land', sizeSqm: 600 },
  prp_gwarinpa_5th: { address: '5th Avenue, Gwarinpa Estate', state: 'FCT', lga: 'AMAC', type: 'residential', sizeSqm: 500 },
  prp_ikoyi_bourdillon: { address: '14 Bourdillon Road, Ikoyi', state: 'Lagos', lga: 'Eti-Osa', type: 'residential', sizeSqm: 800 },
};
