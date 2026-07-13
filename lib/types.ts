/** Shared domain types for Plinth. */

export type PropertyType = 'residential' | 'commercial' | 'land';

export type NigerianState = string;

/** The 8 document types Plinth supports today. */
export type DocumentType =
  | 'certificate_of_occupancy'
  | 'survey_plan'
  | 'deed_of_assignment'
  | 'power_of_attorney'
  | 'probate'
  | 'mortgage_deed'
  | 'excision_in_registry'
  | 'approved_building_plan'
  | 'unknown';

export type FlagSeverity = 'critical' | 'major' | 'minor';

export type FlagType =
  | 'fraud_indicator'
  | 'inconsistency'
  | 'missing_element'
  | 'unusual';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type VerificationStatus =
  | 'queued'
  | 'processing'
  | 'complete'
  | 'failed';

export interface DocumentFlag {
  severity: FlagSeverity;
  type: FlagType;
  /** Plain English description of the issue. */
  description: string;
  fieldAffected: string;
  recommendation: string;
}

export interface ExtractedParty {
  role: string;
  name: string;
}

/** The JSON contract the Bedrock fraud-detection agent must return. */
export interface DocumentAnalysis {
  documentType: string;
  referenceNumber: string | null;
  extractedParties: ExtractedParty[];
  flags: DocumentFlag[];
  overallRisk: RiskLevel;
  /** 0.0 - 1.0 */
  confidence: number;
}

export interface AnalysedDocument {
  s3Key: string;
  type: DocumentType;
  fileName?: string;
  extractedData: DocumentAnalysis;
  flags: DocumentFlag[];
}

export interface PropertyInput {
  address: string;
  state?: string;
  lga?: string;
  type?: PropertyType;
  sizeSqm?: number;
}

export interface VerificationRecord {
  id: string;
  propertyId: string | null;
  userId: string | null;
  documents: AnalysedDocument[];
  overallRisk: RiskLevel;
  summary: string;
  status: VerificationStatus;
  createdAt: string;
}

export interface Comparable {
  id: string;
  address: string;
  state: string | null;
  lga: string | null;
  areaCode: string | null;
  type: PropertyType | null;
  sizeSqm: number | null;
  salePrice: number;
  saleDate: string;
  source: string | null;
  /** Kilometres from the subject property, when known. */
  distanceKm?: number;
}

export interface Valuation {
  id?: string;
  propertyId?: string | null;
  /** All money values are NGN. */
  estimatedValue: number;
  rangeLow: number;
  rangeHigh: number;
  comparables: Comparable[];
  methodology: string;
  confidence: number;
}

export interface ValuationInput {
  propertyType: PropertyType;
  location: string;
  sizeSqm: number;
  features: string[];
  state?: string;
  lga?: string;
}

export interface VerifyRequest {
  property: PropertyInput;
  documents: Array<{ s3Key: string; type?: DocumentType; fileName?: string }>;
  userId?: string;
}

export interface VerifyResponse {
  verificationId: string;
  summary: string;
  overallRisk: RiskLevel;
  flags: DocumentFlag[];
  documents: AnalysedDocument[];
}

export interface Job {
  id: string;
  kind: 'verify' | 'valuation' | 'report';
  status: VerificationStatus;
  payload: unknown;
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

/** Rank order used to roll item-level flags up to a single risk level. */
export const RISK_ORDER: Record<RiskLevel, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export function highestRisk(risks: RiskLevel[]): RiskLevel {
  return risks.reduce<RiskLevel>(
    (worst, r) => (RISK_ORDER[r] > RISK_ORDER[worst] ? r : worst),
    'low',
  );
}

/** A document's flags imply a floor on the property's overall risk. */
export function riskFromFlags(flags: DocumentFlag[]): RiskLevel {
  if (flags.some((f) => f.severity === 'critical')) return 'critical';
  if (flags.filter((f) => f.severity === 'major').length > 1) return 'high';
  if (flags.some((f) => f.severity === 'major')) return 'moderate';
  if (flags.length > 0) return 'low';
  return 'low';
}
