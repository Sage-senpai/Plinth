import type { DocumentType } from '@/lib/types';

export interface DocumentSpec {
  type: DocumentType;
  label: string;
  short: string;
  /** What a buyer should understand this document to be. */
  description: string;
  /** Elements that must be present for the document to be well-formed. */
  mandatoryElements: string[];
}

export const DOCUMENT_TYPES: DocumentSpec[] = [
  {
    type: 'certificate_of_occupancy',
    label: 'Certificate of Occupancy',
    short: 'C of O',
    description:
      'The state governor grants a right of occupancy for a term of years. It is the strongest root of title in Nigeria, but a genuine C of O does not by itself make a transaction safe.',
    mandatoryElements: [
      'C of O reference number in the issuing state format',
      "Governor's signature and seal",
      'Property description and survey plan reference',
      'Term of years and commencement date',
      'Registered title number, page and volume',
    ],
  },
  {
    type: 'survey_plan',
    label: 'Survey Plan',
    short: 'Survey',
    description:
      'A registered surveyor maps the plot boundaries and beacon coordinates. It ties the paper title to a specific piece of ground.',
    mandatoryElements: [
      'Surveyor name, seal and registration number',
      'Beacon numbers and coordinates',
      'Plot size in square metres',
      'Stamp of the state Surveyor-General',
    ],
  },
  {
    type: 'deed_of_assignment',
    label: 'Deed of Assignment',
    short: 'Deed',
    description:
      'The instrument transferring the seller’s interest to the buyer. It must be stamped and registered to be effective against third parties.',
    mandatoryElements: [
      'Assignor and assignee full names',
      'Recital of the root of title',
      'Consideration (purchase price)',
      'Execution, witnesses and date',
      "Governor's consent endorsement",
    ],
  },
  {
    type: 'power_of_attorney',
    label: 'Power of Attorney',
    short: 'POA',
    description:
      'Authorises a person to act for the owner. Frequently abused in fraudulent sales: an irrevocable POA is not a transfer of title.',
    mandatoryElements: [
      'Donor and donee full names',
      'Scope of authority',
      'Execution and notarisation',
    ],
  },
  {
    type: 'probate',
    label: 'Letters of Administration / Probate',
    short: 'Probate',
    description:
      'Where the owner has died, this establishes who may lawfully deal with the estate. Sales by one beneficiary without the others are a common defect.',
    mandatoryElements: [
      'Grant reference and issuing probate registry',
      'Named administrators',
      'Schedule of estate assets',
    ],
  },
  {
    type: 'mortgage_deed',
    label: 'Mortgage Deed',
    short: 'Mortgage',
    description:
      'Records that the property is charged to a lender. An undischarged mortgage is an encumbrance that survives the sale.',
    mandatoryElements: [
      'Mortgagor and mortgagee',
      'Secured sum',
      'Discharge or release, if repaid',
    ],
  },
  {
    type: 'excision_in_registry',
    label: 'Excision in Registry',
    short: 'EIR',
    description:
      'Confirms the land has been excised from government acquisition and released to the community. Land under acquisition cannot be safely bought.',
    mandatoryElements: [
      'Gazette number and page',
      'Village or community name',
      'Excised hectarage',
    ],
  },
  {
    type: 'approved_building_plan',
    label: 'Approved Building Plan',
    short: 'Building Plan',
    description:
      'Planning permission for what is built on the plot. Its absence exposes the buyer to demolition or regularisation costs.',
    mandatoryElements: [
      'Planning authority approval stamp',
      'Approval number and date',
      'Drawings reference',
    ],
  },
];

export function documentSpec(type: DocumentType): DocumentSpec | undefined {
  return DOCUMENT_TYPES.find((d) => d.type === type);
}

export function documentLabel(type: DocumentType): string {
  return documentSpec(type)?.label ?? 'Unclassified document';
}

/** Best-effort classification from a file name, before Textract runs. */
export function guessDocumentType(fileName: string): DocumentType {
  const n = fileName.toLowerCase();
  if (/(c[\s_-]?of[\s_-]?o|certificate|occupancy)/.test(n))
    return 'certificate_of_occupancy';
  if (/survey/.test(n)) return 'survey_plan';
  if (/(deed|assignment)/.test(n)) return 'deed_of_assignment';
  if (/(power|attorney|poa)/.test(n)) return 'power_of_attorney';
  if (/(probate|administration)/.test(n)) return 'probate';
  if (/mortgage/.test(n)) return 'mortgage_deed';
  if (/(excision|gazette|eir)/.test(n)) return 'excision_in_registry';
  if (/(building|plan|approval)/.test(n)) return 'approved_building_plan';
  return 'unknown';
}
