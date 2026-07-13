import {
  bigint,
  date,
  doublePrecision,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import type { AnalysedDocument, Comparable } from '@/lib/types';

export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull(),
  state: text('state'),
  lga: text('lga'),
  type: text('type'), // residential | commercial | land
  sizeSqm: doublePrecision('size_sqm'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id),
  userId: text('user_id'),
  documents: jsonb('documents').$type<AnalysedDocument[]>(),
  overallRisk: text('overall_risk'),
  summary: text('summary'),
  status: text('status').default('processing'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const valuations = pgTable('valuations', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id),
  estimatedValue: bigint('estimated_value', { mode: 'number' }), // NGN
  rangeLow: bigint('range_low', { mode: 'number' }),
  rangeHigh: bigint('range_high', { mode: 'number' }),
  comparables: jsonb('comparables').$type<Comparable[]>(),
  methodology: text('methodology'),
  confidence: doublePrecision('confidence'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const comparables = pgTable('comparables', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address'),
  state: text('state'),
  lga: text('lga'),
  areaCode: text('area_code'),
  type: text('type'),
  sizeSqm: doublePrecision('size_sqm'),
  salePrice: bigint('sale_price', { mode: 'number' }),
  saleDate: date('sale_date'),
  source: text('source'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  verificationId: uuid('verification_id').references(() => verifications.id),
  valuationId: uuid('valuation_id').references(() => valuations.id),
  s3Key: text('s3_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type ValuationRow = typeof valuations.$inferSelect;
export type ComparableRow = typeof comparables.$inferSelect;
export type ReportRow = typeof reports.$inferSelect;
