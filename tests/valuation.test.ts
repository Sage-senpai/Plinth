import { describe, expect, it } from 'vitest';
import { comparableValuation } from '@/lib/valuation';
import { findArea } from '@/lib/property/areas';
import type { Comparable, ValuationInput } from '@/lib/types';

const subject: ValuationInput = {
  propertyType: 'land',
  location: 'Lekki Phase 2',
  sizeSqm: 600,
  features: [],
};

function comp(over: Partial<Comparable>): Comparable {
  return {
    id: 'c',
    address: 'Somewhere',
    state: 'Lagos',
    lga: 'Eti-Osa',
    areaCode: 'LA-LK2',
    type: 'land',
    sizeSqm: 600,
    salePrice: 180_000_000,
    saleDate: '2026-01-01',
    source: 'Agent network',
    ...over,
  };
}

describe('comparable valuation', () => {
  it('values from the comparables, not the area rate', () => {
    const v = comparableValuation(subject, [
      comp({ id: 'a', salePrice: 180_000_000 }),
      comp({ id: 'b', salePrice: 192_000_000 }),
      comp({ id: 'c', salePrice: 186_000_000 }),
    ]);

    expect(v.estimatedValue).toBeGreaterThan(170_000_000);
    expect(v.estimatedValue).toBeLessThan(200_000_000);
    expect(v.comparables).toHaveLength(3);
  });

  it('always brackets the estimate', () => {
    const v = comparableValuation(subject, [comp({}), comp({ id: 'b' })]);
    expect(v.rangeLow).toBeLessThan(v.estimatedValue);
    expect(v.rangeHigh).toBeGreaterThan(v.estimatedValue);
  });

  it('widens the range when the comparables disagree', () => {
    const tight = comparableValuation(subject, [
      comp({ id: 'a', salePrice: 180_000_000 }),
      comp({ id: 'b', salePrice: 182_000_000 }),
      comp({ id: 'c', salePrice: 181_000_000 }),
    ]);

    const noisy = comparableValuation(subject, [
      comp({ id: 'a', salePrice: 90_000_000 }),
      comp({ id: 'b', salePrice: 260_000_000 }),
      comp({ id: 'c', salePrice: 175_000_000 }),
    ]);

    const spread = (v: { rangeHigh: number; rangeLow: number; estimatedValue: number }) =>
      (v.rangeHigh - v.rangeLow) / v.estimatedValue;

    expect(spread(noisy)).toBeGreaterThan(spread(tight));
    expect(noisy.confidence).toBeLessThan(tight.confidence);
  });

  it('is less confident with fewer comparables', () => {
    const few = comparableValuation(subject, [comp({})]);
    const many = comparableValuation(subject, [
      comp({ id: 'a' }),
      comp({ id: 'b' }),
      comp({ id: 'c' }),
      comp({ id: 'd' }),
      comp({ id: 'e' }),
    ]);

    expect(few.confidence).toBeLessThan(many.confidence);
    expect(few.methodology).toMatch(/sanity check/i);
  });

  it('falls back to the area rate when there is nothing to compare, and says so', () => {
    const area = findArea('Lekki Phase 2');
    const v = comparableValuation(subject, [], area?.baseRateSqm);

    expect(v.comparables).toHaveLength(0);
    expect(v.confidence).toBeLessThanOrEqual(0.3);
    expect(v.methodology).toMatch(/no recorded comparable sales/i);
    expect(v.methodology).toMatch(/not a valuation/i);
    // A wide range is the honest answer when there is no evidence.
    expect(v.rangeHigh - v.rangeLow).toBeGreaterThan(v.estimatedValue * 0.5);
  });

  it('weights a recent sale above a stale one', () => {
    const recent = comparableValuation(subject, [
      comp({ id: 'a', salePrice: 200_000_000, saleDate: '2026-06-01' }),
      comp({ id: 'b', salePrice: 100_000_000, saleDate: '2019-01-01' }),
    ]);

    // The 2026 sale should pull the estimate well above the midpoint of the two.
    expect(recent.estimatedValue).toBeGreaterThan(150_000_000);
  });
});

describe('area lookup', () => {
  it('finds an area from a full address', () => {
    expect(findArea('Plot 18 Orchid Road, Lekki Phase 2')?.code).toBe('LA-LK2');
    expect(findArea('Ikoyi')?.state).toBe('Lagos');
    expect(findArea('Maitama')?.state).toBe('FCT');
  });

  it('returns nothing for an area it does not cover', () => {
    expect(findArea('Sokoto')).toBeUndefined();
  });
});
