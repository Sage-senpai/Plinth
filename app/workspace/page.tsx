import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink, Container, Eyebrow, RiskBadge, StatusLabel } from '@/components/ui';
import { getProperty, listVerifications } from '@/lib/db/repo';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Verifications' };
export const dynamic = 'force-dynamic';

export default async function WorkspacePage() {
  const verifications = await listVerifications();

  const rows = await Promise.all(
    verifications.map(async (v) => ({
      ...v,
      address:
        (v.propertyId ? (await getProperty(v.propertyId))?.address : null) ??
        'Unnamed property',
      flagCount: v.documents.reduce((n, d) => n + d.flags.length, 0),
    })),
  );

  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Workspace</Eyebrow>
          <h1 className="mt-4 font-serif text-3xl text-pl-text md:text-4xl">
            Verifications
          </h1>
        </div>

        <ButtonLink href="/workspace/verify/new" className="sm:shrink-0">
          New verification
        </ButtonLink>
      </div>

      {rows.length === 0 ? (
        <div className="mt-12 border border-dashed border-pl-border p-14 text-center">
          <p className="text-pl-text">No verifications yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-pl-muted">
            Upload the documents for a property and Plinth will check them
            against each other and against the fraud patterns we track.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-11 hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-pl-border text-left">
                  {['Property', 'Documents', 'Risk', 'Report', 'Date'].map(
                    (h) => (
                      <th key={h} className="pl-eyebrow pb-3 font-normal">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-pl-border transition-colors hover:bg-pl-surface"
                  >
                    <td className="py-5 pr-6">
                      <Link
                        href={`/workspace/verify/${row.id}`}
                        className="text-[15px] text-pl-text transition-colors group-hover:text-pl-copper-lgt"
                      >
                        {row.address}
                      </Link>
                      <p className="mt-1 font-mono text-[10px] text-pl-muted">
                        {row.id}
                      </p>
                    </td>
                    <td className="py-5 pr-6 text-sm text-pl-muted">
                      {row.documents.length}
                      {row.flagCount > 0 ? (
                        <span className="ml-2 text-pl-flagged">
                          {row.flagCount} flag
                          {row.flagCount === 1 ? '' : 's'}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-5 pr-6">
                      <RiskBadge risk={row.overallRisk} />
                    </td>
                    <td className="py-5 pr-6">
                      <StatusLabel status={row.status} />
                    </td>
                    <td className="py-5 font-mono text-xs text-pl-muted">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-9 space-y-px bg-pl-border md:hidden">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/workspace/verify/${row.id}`}
                className="block bg-pl-surface p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[15px] leading-snug text-pl-text">
                    {row.address}
                  </p>
                  <RiskBadge risk={row.overallRisk} />
                </div>
                <p className="mt-3 flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted">
                  <span>{row.documents.length} docs</span>
                  <span>{row.flagCount} flags</span>
                  <span>{formatDate(row.createdAt)}</span>
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
