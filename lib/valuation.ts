import { invokeJson } from '@/lib/aws/bedrock';
import { hasAws } from '@/lib/env';
import { VALUATION_SYSTEM, valuationUserPrompt } from '@/lib/prompts/valuation';
import { findArea } from '@/lib/property/areas';
import { findComparables } from '@/lib/db/repo';
import { formatNaira } from '@/lib/format';
import type { Comparable, Valuation, ValuationInput } from '@/lib/types';

/**
 * Comparable sales in Nigeria are thin and unevenly reported. The model is
 * instructed to widen its range rather than invent precision, and the
 * deterministic fallback below does the same: with fewer than three
 * comparables the range opens up and confidence drops.
 */
export async function valueProperty(
  input: ValuationInput,
): Promise<Valuation> {
  const area = findArea(input.location);

  const comps = await findComparables({
    areaCode: area?.code,
    state: input.state ?? area?.state,
    lga: input.lga ?? area?.lga,
    limit: 8,
  });

  if (hasAws) {
    const result = await invokeJson<{
      estimatedValue: number;
      rangeLow: number;
      rangeHigh: number;
      methodology: string;
      confidence: number;
    }>({
      system: VALUATION_SYSTEM,
      user: valuationUserPrompt(input, comps),
      maxTokens: 1500,
    });

    return { ...result, comparables: comps };
  }

  return comparableValuation(input, comps, area?.baseRateSqm);
}

/**
 * Deterministic AVM used in demo mode.
 *
 * Value per square metre from the comparables, weighted so that recent sales
 * and similar-sized plots count for more. Falls back to the area's indicative
 * land rate only when there is nothing to compare against — and says so.
 */
export function comparableValuation(
  input: ValuationInput,
  comps: Comparable[],
  baseRateSqm?: number,
): Valuation {
  const usable = comps.filter((c) => c.sizeSqm && c.salePrice);

  if (!usable.length) {
    const rate = baseRateSqm ?? 150_000;
    const estimate = Math.round(rate * input.sizeSqm);

    return {
      estimatedValue: estimate,
      rangeLow: Math.round(estimate * 0.65),
      rangeHigh: Math.round(estimate * 1.35),
      comparables: [],
      confidence: 0.3,
      methodology: `There are no recorded comparable sales for ${input.location} in Plinth's database yet. This figure is an indicative land rate for the area applied to a ${input.sizeSqm} sqm plot — it is a starting point for a conversation, not a valuation. The range is deliberately wide. Treat any asking price within it as unverified, and commission a physical valuation before you commit.`,
    };
  }

  const weighted = usable.map((c) => {
    const rate = c.salePrice / c.sizeSqm!;

    // A sale from three years ago tells you less than one from last quarter.
    const ageYears = Math.max(
      0,
      (Date.now() - new Date(c.saleDate).getTime()) / (365 * 24 * 3600 * 1000),
    );
    const recency = 1 / (1 + ageYears);

    // A 600 sqm comparable prices a 600 sqm plot better than a 1,200 sqm one.
    const sizeRatio =
      Math.min(c.sizeSqm!, input.sizeSqm) / Math.max(c.sizeSqm!, input.sizeSqm);

    const typeMatch = c.type === input.propertyType ? 1 : 0.6;

    return { rate, weight: recency * sizeRatio * typeMatch };
  });

  const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
  const rate =
    weighted.reduce((s, w) => s + w.rate * w.weight, 0) / (totalWeight || 1);

  const estimate = Math.round(rate * input.sizeSqm);

  // Spread of the comparable rates drives how wide the range is. A quiet market
  // with tight rates earns a tight range; a noisy one does not.
  const rates = weighted.map((w) => w.rate);
  const mean = rates.reduce((s, r) => s + r, 0) / rates.length;
  const variance =
    rates.reduce((s, r) => s + (r - mean) ** 2, 0) / rates.length;
  const spread = Math.sqrt(variance) / (mean || 1);

  const band = Math.min(0.35, Math.max(0.08, spread));
  const confidence = Math.min(
    0.9,
    Math.max(0.35, 0.4 + usable.length * 0.07 - spread),
  );

  const featureNote = input.features.length
    ? ` No adjustment has been made for the features you listed (${input.features.join(', ')}) — they affect what a buyer will pay, but the comparable data does not record them consistently enough to price them.`
    : '';

  return {
    estimatedValue: estimate,
    rangeLow: Math.round(estimate * (1 - band)),
    rangeHigh: Math.round(estimate * (1 + band)),
    comparables: comps,
    confidence: Number(confidence.toFixed(2)),
    methodology: `Valued from ${usable.length} comparable sale${
      usable.length === 1 ? '' : 's'
    } in ${input.location}, weighted towards recent sales and plots of a similar size to yours. That produces a working rate of about ${formatNaira(
      rate,
    )} per square metre, applied to ${input.sizeSqm} sqm.${featureNote} The range reflects how much the comparable rates disagree with one another${
      usable.length < 3
        ? ' — and with fewer than three genuine comparables, it is wide on purpose. Treat this as a sanity check on an asking price, not a valuation you can bank on'
        : ''
    }.`,
  };
}
