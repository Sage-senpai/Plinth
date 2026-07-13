import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { ComparableCard } from '@/components/ComparableCard';
import { ButtonLink, Container, Eyebrow, RiskBadge } from '@/components/ui';
import { getProperty, listComparables, listVerifications } from '@/lib/db/repo';
import { formatDate } from '@/lib/format';
import { AREAS } from '@/lib/property/areas';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search Plinth’s property records, verification reports and comparable sales.',
};

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? '').trim();
  const needle = q.toLowerCase();

  const [verifications, comparables] = await Promise.all([
    listVerifications(),
    listComparables(),
  ]);

  const properties = await Promise.all(
    verifications.map(async (v) => ({
      verification: v,
      address:
        (v.propertyId ? (await getProperty(v.propertyId))?.address : null) ??
        'Unnamed property',
    })),
  );

  const matchedProperties = needle
    ? properties.filter(
        (p) =>
          p.address.toLowerCase().includes(needle) ||
          p.verification.id.toLowerCase().includes(needle),
      )
    : [];

  const matchedSales = needle
    ? comparables.filter(
        (c) =>
          c.address.toLowerCase().includes(needle) ||
          (c.lga ?? '').toLowerCase().includes(needle) ||
          (c.state ?? '').toLowerCase().includes(needle),
      )
    : [];

  const matchedAreas = needle
    ? AREAS.filter((a) => a.name.toLowerCase().includes(needle))
    : [];

  const nothing =
    needle && !matchedProperties.length && !matchedSales.length && !matchedAreas.length;

  return (
    <>
      <Nav variant="marketing" />

      <main>
        <section className="relative overflow-hidden border-b border-pl-border">
          <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

          <Container className="relative py-16 md:py-24">
            <div className="max-w-2xl">
              <Eyebrow>Search</Eyebrow>
              <h1 className="mt-5 font-serif text-3xl leading-tight text-pl-text md:text-5xl">
                Look up a property, a report, or a street.
              </h1>

              <form action="/search" method="get" className="mt-9 flex gap-px">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Lekki Phase 2, Ikoyi, ver_9f2c41a8…"
                  aria-label="Search properties, reports and sales"
                  className="w-full border border-pl-border bg-pl-surface px-4 py-3.5 text-sm text-pl-text outline-none transition-colors placeholder:text-pl-muted focus:border-pl-copper"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-pl-copper px-7 text-sm text-white transition-colors hover:bg-pl-copper-lgt"
                >
                  Search
                </button>
              </form>
            </div>
          </Container>
        </section>

        <Container className="py-16 md:py-20">
          {!needle ? (
            <div className="max-w-xl">
              <p className="text-sm leading-relaxed text-pl-muted">
                Search across verification reports, recorded comparable sales
                and the Lagos and Abuja areas Plinth covers. Reports are
                searchable by address or by their reference — the one printed at
                the top of the PDF.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Lekki Phase 2', 'Ikoyi', 'Gwarinpa', 'Victoria Island'].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="border border-pl-border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted transition-colors hover:border-pl-copper hover:text-pl-copper-lgt"
                    >
                      {term}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ) : null}

          {nothing ? (
            <div className="max-w-xl">
              <p className="text-pl-text">Nothing matched “{q}”.</p>
              <p className="mt-3 text-sm leading-relaxed text-pl-muted">
                Plinth only holds records for properties that have been through
                a verification, and sales that have been reported to us. An
                absence here is not evidence about the property — it means we
                have not seen it.
              </p>
              <ButtonLink href="/workspace/verify/new" className="mt-7">
                Verify this property
              </ButtonLink>
            </div>
          ) : null}

          {matchedAreas.length ? (
            <section className="mb-16">
              <Eyebrow>Areas · {matchedAreas.length}</Eyebrow>
              <div className="mt-5 grid gap-px bg-pl-border sm:grid-cols-2 lg:grid-cols-4">
                {matchedAreas.map((area) => (
                  <div key={area.code} className="bg-pl-surface p-5">
                    <p className="text-[15px] text-pl-text">{area.name}</p>
                    <p className="pl-eyebrow mt-1.5">
                      {area.code} · {area.state}
                    </p>
                    <p className="mt-4 font-mono text-sm text-pl-copper-lgt">
                      ₦{area.baseRateSqm.toLocaleString('en-NG')} / sqm
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {matchedProperties.length ? (
            <section className="mb-16">
              <Eyebrow>Reports · {matchedProperties.length}</Eyebrow>
              <ul className="mt-5 space-y-px bg-pl-border">
                {matchedProperties.map(({ verification, address }) => (
                  <li key={verification.id}>
                    <Link
                      href={`/workspace/verify/${verification.id}`}
                      className="flex flex-col gap-3 bg-pl-surface p-5 transition-colors hover:bg-pl-surface2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span>
                        <span className="block text-[15px] text-pl-text">
                          {address}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] text-pl-muted">
                          {verification.id} ·{' '}
                          {formatDate(verification.createdAt)}
                        </span>
                      </span>
                      <RiskBadge risk={verification.overallRisk} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {matchedSales.length ? (
            <section>
              <Eyebrow>Recorded sales · {matchedSales.length}</Eyebrow>
              <div className="mt-5 flex gap-px overflow-x-auto bg-pl-border pb-1">
                {matchedSales.map((sale) => (
                  <ComparableCard
                    key={sale.id}
                    address={sale.address}
                    size={sale.sizeSqm}
                    salePrice={sale.salePrice}
                    saleDate={sale.saleDate}
                    source={sale.source}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </Container>
      </main>

      <Footer />
    </>
  );
}
