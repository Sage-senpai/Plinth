import type { Metadata } from 'next';
import { ComparableCard } from '@/components/ComparableCard';
import { Container, Eyebrow } from '@/components/ui';
import { listComparables } from '@/lib/db/repo';
import { formatNaira, formatSqm } from '@/lib/format';
import { AREAS } from '@/lib/property/areas';

export const metadata: Metadata = { title: 'Comparables' };
export const dynamic = 'force-dynamic';

export default async function ComparablesPage() {
  const comparables = await listComparables();

  const byArea = AREAS.map((area) => ({
    area,
    sales: comparables.filter((c) => c.areaCode === area.code),
  }))
    .filter((group) => group.sales.length > 0)
    .sort((a, b) => b.sales.length - a.sales.length);

  const rate = (sales: typeof comparables) => {
    const usable = sales.filter((s) => s.sizeSqm);
    if (!usable.length) return null;
    return (
      usable.reduce((sum, s) => sum + s.salePrice / s.sizeSqm!, 0) /
      usable.length
    );
  };

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-2xl">
        <Eyebrow>Comparables</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl text-pl-text md:text-4xl">
          What actually sold, and for how much.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-pl-muted">
          {comparables.length} recorded sales across {byArea.length} areas.
          Comparable data in Nigeria is thin and unevenly reported — every
          valuation Plinth produces widens its range to say so rather than
          inventing precision.
        </p>
      </div>

      <div className="mt-14 space-y-16">
        {byArea.map(({ area, sales }) => {
          const avg = rate(sales);

          return (
            <section key={area.code}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-pl-border pb-4">
                <div className="flex items-baseline gap-4">
                  <h2 className="font-serif text-xl text-pl-text md:text-2xl">
                    {area.name}
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted">
                    {area.code} · {area.lga}, {area.state}
                  </span>
                </div>

                {avg ? (
                  <p className="font-mono text-xs text-pl-copper-lgt">
                    {formatNaira(avg)} / sqm
                    <span className="ml-2 text-pl-muted">
                      from {sales.length} sale{sales.length === 1 ? '' : 's'}
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex gap-px overflow-x-auto bg-pl-border pb-1">
                {sales.map((sale) => (
                  <ComparableCard
                    key={sale.id}
                    address={sale.address}
                    size={sale.sizeSqm}
                    salePrice={sale.salePrice}
                    saleDate={sale.saleDate}
                    distance={sale.distanceKm}
                    source={sale.source}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-pl-muted">
                Indicative land rate for {area.name}:{' '}
                {formatNaira(area.baseRateSqm)} per sqm. Used only as a prior
                when there is nothing to compare against — a rate is not a
                valuation.
              </p>
            </section>
          );
        })}
      </div>

      <p className="mt-20 border-t border-pl-border pt-8 text-xs leading-relaxed text-pl-muted">
        Sales are drawn from the Lagos and Abuja land registries, filings shared
        by partner law firms, and Plinth&apos;s estate agent network. A recorded
        sale price is what the parties declared — in a market where stamp duty
        is assessed on the consideration, that is not always what changed hands.
        Sizes are as stated on the survey plan:{' '}
        {formatSqm(comparables[0]?.sizeSqm ?? 600)} on paper is not always{' '}
        {formatSqm(comparables[0]?.sizeSqm ?? 600)} on the ground.
      </p>
    </Container>
  );
}
