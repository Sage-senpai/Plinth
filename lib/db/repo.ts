import { and, desc, eq, sql } from 'drizzle-orm';
import { db, isLive } from './index';
import { comparables, properties, reports, valuations, verifications } from './schema';
import {
  DEMO_COMPARABLES,
  DEMO_PROPERTIES,
  DEMO_VERIFICATIONS,
} from '@/lib/demo/seed';
import type {
  AnalysedDocument,
  Comparable,
  PropertyInput,
  PropertyType,
  RiskLevel,
  Valuation,
  VerificationRecord,
  VerificationStatus,
} from '@/lib/types';

/**
 * Every read and write in Plinth goes through this module.
 *
 * When DATABASE_URL is set it is a thin wrapper over Drizzle. When it is not,
 * it serves the seeded demo corpus from an in-memory store that survives hot
 * reloads via globalThis. Route handlers never branch on mode themselves.
 */

interface MemStore {
  verifications: VerificationRecord[];
  properties: Record<string, PropertyInput>;
  valuations: Record<string, Valuation>;
  reports: Record<string, string>;
}

const g = globalThis as typeof globalThis & { __plinth?: MemStore };

function mem(): MemStore {
  if (!g.__plinth) {
    g.__plinth = {
      verifications: [...DEMO_VERIFICATIONS],
      properties: Object.fromEntries(
        Object.entries(DEMO_PROPERTIES).map(([id, p]) => [
          id,
          { address: p.address, state: p.state, lga: p.lga, type: p.type as PropertyType, sizeSqm: p.sizeSqm },
        ]),
      ),
      valuations: {},
      reports: {},
    };
  }
  return g.__plinth;
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
}

// --- Properties -------------------------------------------------------------

export async function createProperty(input: PropertyInput): Promise<string> {
  if (isLive && db) {
    const [row] = await db
      .insert(properties)
      .values({
        address: input.address,
        state: input.state,
        lga: input.lga,
        type: input.type,
        sizeSqm: input.sizeSqm,
      })
      .returning({ id: properties.id });
    return row.id;
  }

  const pid = id('prp');
  mem().properties[pid] = input;
  return pid;
}

export async function getProperty(
  propertyId: string,
): Promise<PropertyInput | null> {
  if (isLive && db) {
    const [row] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);
    if (!row) return null;
    return {
      address: row.address,
      state: row.state ?? undefined,
      lga: row.lga ?? undefined,
      type: (row.type as PropertyType) ?? undefined,
      sizeSqm: row.sizeSqm ?? undefined,
    };
  }
  return mem().properties[propertyId] ?? null;
}

// --- Verifications ----------------------------------------------------------

export async function createVerification(args: {
  propertyId: string;
  userId?: string;
  status?: VerificationStatus;
}): Promise<string> {
  if (isLive && db) {
    const [row] = await db
      .insert(verifications)
      .values({
        propertyId: args.propertyId,
        userId: args.userId,
        status: args.status ?? 'processing',
        documents: [],
      })
      .returning({ id: verifications.id });
    return row.id;
  }

  const vid = id('ver');
  mem().verifications.unshift({
    id: vid,
    propertyId: args.propertyId,
    userId: args.userId ?? 'demo',
    documents: [],
    overallRisk: 'low',
    summary: '',
    status: args.status ?? 'processing',
    createdAt: new Date().toISOString(),
  });
  return vid;
}

export async function completeVerification(args: {
  verificationId: string;
  documents: AnalysedDocument[];
  overallRisk: RiskLevel;
  summary: string;
}): Promise<void> {
  if (isLive && db) {
    await db
      .update(verifications)
      .set({
        documents: args.documents,
        overallRisk: args.overallRisk,
        summary: args.summary,
        status: 'complete',
      })
      .where(eq(verifications.id, args.verificationId));
    return;
  }

  const rec = mem().verifications.find((v) => v.id === args.verificationId);
  if (rec) {
    rec.documents = args.documents;
    rec.overallRisk = args.overallRisk;
    rec.summary = args.summary;
    rec.status = 'complete';
  }
}

export async function failVerification(
  verificationId: string,
): Promise<void> {
  if (isLive && db) {
    await db
      .update(verifications)
      .set({ status: 'failed' })
      .where(eq(verifications.id, verificationId));
    return;
  }
  const rec = mem().verifications.find((v) => v.id === verificationId);
  if (rec) rec.status = 'failed';
}

export async function getVerification(
  verificationId: string,
): Promise<VerificationRecord | null> {
  if (isLive && db) {
    const [row] = await db
      .select()
      .from(verifications)
      .where(eq(verifications.id, verificationId))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      propertyId: row.propertyId,
      userId: row.userId,
      documents: row.documents ?? [],
      overallRisk: (row.overallRisk as RiskLevel) ?? 'low',
      summary: row.summary ?? '',
      status: (row.status as VerificationStatus) ?? 'processing',
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  return mem().verifications.find((v) => v.id === verificationId) ?? null;
}

export async function listVerifications(
  userId?: string,
): Promise<VerificationRecord[]> {
  if (isLive && db) {
    const rows = await db
      .select()
      .from(verifications)
      .where(userId ? eq(verifications.userId, userId) : sql`true`)
      .orderBy(desc(verifications.createdAt))
      .limit(50);

    return rows.map((row) => ({
      id: row.id,
      propertyId: row.propertyId,
      userId: row.userId,
      documents: row.documents ?? [],
      overallRisk: (row.overallRisk as RiskLevel) ?? 'low',
      summary: row.summary ?? '',
      status: (row.status as VerificationStatus) ?? 'processing',
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    }));
  }

  return mem().verifications;
}

// --- Valuations -------------------------------------------------------------

export async function saveValuation(
  propertyId: string | null,
  v: Valuation,
): Promise<string> {
  if (isLive && db) {
    const [row] = await db
      .insert(valuations)
      .values({
        propertyId,
        estimatedValue: v.estimatedValue,
        rangeLow: v.rangeLow,
        rangeHigh: v.rangeHigh,
        comparables: v.comparables,
        methodology: v.methodology,
        confidence: v.confidence,
      })
      .returning({ id: valuations.id });
    return row.id;
  }

  const vid = id('val');
  mem().valuations[vid] = { ...v, id: vid, propertyId };
  return vid;
}

export async function getValuationForProperty(
  propertyId: string,
): Promise<Valuation | null> {
  if (isLive && db) {
    const [row] = await db
      .select()
      .from(valuations)
      .where(eq(valuations.propertyId, propertyId))
      .orderBy(desc(valuations.createdAt))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      propertyId: row.propertyId,
      estimatedValue: row.estimatedValue ?? 0,
      rangeLow: row.rangeLow ?? 0,
      rangeHigh: row.rangeHigh ?? 0,
      comparables: row.comparables ?? [],
      methodology: row.methodology ?? '',
      confidence: row.confidence ?? 0,
    };
  }

  const found = Object.values(mem().valuations).find(
    (v) => v.propertyId === propertyId,
  );
  return found ?? null;
}

// --- Comparables ------------------------------------------------------------

export async function findComparables(args: {
  areaCode?: string;
  state?: string;
  lga?: string;
  type?: PropertyType;
  limit?: number;
}): Promise<Comparable[]> {
  const limit = args.limit ?? 8;

  if (isLive && db) {
    const clauses = [
      args.areaCode ? eq(comparables.areaCode, args.areaCode) : undefined,
      args.state ? eq(comparables.state, args.state) : undefined,
      args.lga ? eq(comparables.lga, args.lga) : undefined,
      args.type ? eq(comparables.type, args.type) : undefined,
    ].filter(Boolean);

    const rows = await db
      .select()
      .from(comparables)
      .where(clauses.length ? and(...clauses) : sql`true`)
      .orderBy(desc(comparables.saleDate))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      address: r.address ?? '',
      state: r.state,
      lga: r.lga,
      areaCode: r.areaCode,
      type: (r.type as PropertyType) ?? null,
      sizeSqm: r.sizeSqm,
      salePrice: r.salePrice ?? 0,
      saleDate: r.saleDate ?? '',
      source: r.source,
    }));
  }

  let rows = DEMO_COMPARABLES;
  if (args.areaCode) rows = rows.filter((c) => c.areaCode === args.areaCode);
  if (args.state) rows = rows.filter((c) => c.state === args.state);
  if (args.lga) rows = rows.filter((c) => c.lga === args.lga);
  if (args.type) rows = rows.filter((c) => c.type === args.type);

  return [...rows]
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate))
    .slice(0, limit);
}

export async function listComparables(): Promise<Comparable[]> {
  if (isLive && db) return findComparables({ limit: 100 });
  return DEMO_COMPARABLES;
}

// --- Reports ----------------------------------------------------------------

export async function saveReport(args: {
  verificationId: string;
  valuationId?: string | null;
  s3Key: string;
}): Promise<string> {
  if (isLive && db) {
    const [row] = await db
      .insert(reports)
      .values({
        verificationId: args.verificationId,
        valuationId: args.valuationId ?? null,
        s3Key: args.s3Key,
      })
      .returning({ id: reports.id });
    return row.id;
  }

  const rid = id('rep');
  mem().reports[rid] = args.s3Key;
  return rid;
}
