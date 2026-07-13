import type { DocumentType } from '@/lib/types';
import type { ExtractedDocument } from '@/lib/aws/textract';

/**
 * Stand-in for Textract in DEMO_MODE.
 *
 * The shapes here mirror what Textract actually returns for the Nigerian
 * document formats we support, so the fraud-detection prompt downstream sees
 * realistic input whether or not AWS is wired up.
 */
export function DEMO_TEXTRACT(type: DocumentType): ExtractedDocument {
  switch (type) {
    case 'certificate_of_occupancy':
      return {
        text: [
          'LAGOS STATE OF NIGERIA',
          'CERTIFICATE OF OCCUPANCY',
          'Ref No: LSLB/CO/2015/09912',
          'Registered as No. 41 at Page 41 in Volume 2018M',
          'GRANTEE: EMEKA NWOSU',
          'Term: 99 years commencing 1st January 2015',
          'Land situate at Plot 18 Orchid Road, Lekki Phase 2, Eti-Osa LGA',
          'Survey Plan No. LS/D/2015/4471',
          'Signed: Governor of Lagos State',
        ].join('\n'),
        fields: {
          'Ref No': 'LSLB/CO/2015/09912',
          GRANTEE: 'EMEKA NWOSU',
          Term: '99 years commencing 1st January 2015',
          'Survey Plan No': 'LS/D/2015/4471',
          'Registered Volume': '2018M',
        },
        tables: [],
      };

    case 'deed_of_assignment':
      return {
        text: [
          'DEED OF ASSIGNMENT',
          'THIS DEED made the 14th day of March 2024',
          'BETWEEN EMEKA NWOSU (the Assignor)',
          'AND TUNDE BAKARE (the Assignee)',
          'Consideration: N185,000,000 (One Hundred and Eighty Five Million Naira)',
          'Property: Plot 18 Orchid Road, Lekki Phase 2',
          'Beacons: LS/4471/A, LS/4471/B, LS/4471/C, LS/4471/D',
          "GOVERNOR'S CONSENT: LSLB/GC/2024/3318 dated 14 March 2024",
          'Registered as 2024/0912/LagosState',
        ].join('\n'),
        fields: {
          Date: '14 March 2024',
          Assignor: 'EMEKA NWOSU',
          Assignee: 'TUNDE BAKARE',
          Consideration: 'N185,000,000',
          "Governor's Consent": 'LSLB/GC/2024/3318 dated 14 March 2024',
          'Registration No': '2024/0912/LagosState',
        },
        tables: [],
      };

    case 'survey_plan':
      return {
        text: [
          'SURVEY PLAN',
          'Plan No: LS/D/2015/4471',
          'Surveyed for: EMEKA NWOSU',
          'Area: 600.00 Square Metres',
          'Beacon Nos: LS/4471/A - LS/4471/D',
          'Coordinates: N 6°26\'41" E 3°34\'12"',
          'Surv. O. Adeyemi, SURCON Reg. No. 2210',
          'Stamped: Office of the Surveyor-General, Lagos State',
        ].join('\n'),
        fields: {
          'Plan No': 'LS/D/2015/4471',
          Area: '600.00 Square Metres',
          Surveyor: 'Surv. O. Adeyemi',
          'SURCON No': '2210',
          Coordinates: 'N 6°26\'41" E 3°34\'12"',
        },
        tables: [],
      };

    case 'excision_in_registry':
      return {
        text: [
          'EXCISION IN REGISTRY',
          'Lagos State Government Gazette No. 18, Vol. 47',
          'Village: Ilaje',
          'Excised: 42.116 Hectares',
          'Date: 12 June 2018',
        ].join('\n'),
        fields: {
          'Gazette No': '18',
          Volume: '47',
          Village: 'Ilaje',
          Excised: '42.116 Hectares',
        },
        tables: [],
      };

    default:
      return {
        text: 'Document text could not be classified with confidence.',
        fields: {},
        tables: [],
      };
  }
}
