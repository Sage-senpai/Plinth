import { formatDate, formatNaira, formatSqm } from '@/lib/format';

export function ComparableCard({
  address,
  size,
  salePrice,
  saleDate,
  distance,
  source,
}: {
  address: string;
  size?: number | null;
  salePrice: number;
  saleDate: string;
  distance?: number;
  source?: string | null;
}) {
  return (
    <article className="flex min-w-[260px] flex-col justify-between border border-pl-border bg-pl-surface p-5 transition-colors hover:border-pl-border-h">
      <div>
        <h3 className="text-[15px] leading-snug text-pl-text">{address}</h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted">
          {size ? formatSqm(size) : 'Size not recorded'}
          {typeof distance === 'number' ? ` · ${distance.toFixed(1)} km` : ''}
        </p>
      </div>

      <div className="mt-6">
        <p className="font-mono text-lg text-pl-copper-lgt">
          {formatNaira(salePrice)}
        </p>
        <p className="mt-1 text-xs text-pl-muted">
          {formatDate(saleDate)}
          {source ? ` · ${source}` : ''}
        </p>
      </div>
    </article>
  );
}
