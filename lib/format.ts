/** Money in Plinth is always NGN, always whole naira. */
export function formatNaira(value: number): string {
  return `₦${Math.round(value).toLocaleString('en-NG')}`;
}

/** Compact form for large headline figures: ₦45.2M, ₦1.4B. */
export function formatNairaCompact(value: number): string {
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
  return formatNaira(value);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatSqm(sqm: number): string {
  return `${sqm.toLocaleString('en-NG')} sqm`;
}
