import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { DocumentFlag } from '@/components/DocumentFlag';
import { ValuationRange } from '@/components/ValuationRange';
import { VerificationStamp } from '@/components/VerificationStamp';
import { Container, Eyebrow } from '@/components/ui';
import { getProperty, getValuationForProperty, getVerification } from '@/lib/db/repo';
import { formatDate } from '@/lib/format';
import { documentLabel } from '@/lib/property/documents';
import { valueProperty } from '@/lib/valuation';
import { RISK_ORDER, type Valuation } from '@/lib/types';
import { ReportPanel } from './ReportPanel';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const v = await getVerification(params.id);
  return { title: v ? `Verification ${v.id}` : 'Verification' };
}

export default async function VerificationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const verification = await getVerification(params.id);
  if (!verification) notFound();

  const property = verification.propertyId
    ? await getProperty(verification.propertyId)
    : null;

  let valuation: Valuation | null = null;
  if (verification.propertyId) {
    valuation = await getValuationForProperty(verification.propertyId);

    if (!valuation && property?.sizeSqm) {
      valuation = await valueProperty({
        propertyType: property.type ?? 'residential',
        location: property.address,
        sizeSqm: property.sizeSqm,
        features: [],
        state: property.state,
        lga: property.lga,
      });
    }
  }

  const flags = verification.documents
    .flatMap((d) => d.flags)
    .sort(
      (a, b) =>
        ({ critical: 0, major: 1, minor: 2 })[a.severity] -
        { critical: 0, major: 1, minor: 2 }[b.severity],
    );

  const confidence = verification.documents.length
    ? verification.documents.reduce(
        (sum, d) => sum + (d.extractedData.confidence ?? 0),
        0,
      ) / verification.documents.length
    : 0;

  const worstDoc = [...verification.documents].sort(
    (a, b) =>
      RISK_ORDER[b.extractedData.overallRisk] -
      RISK_ORDER[a.extractedData.overallRisk],
  )[0];

  return (
    <Container className="py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-8 border-b border-pl-border pb-10 md:flex-row md:items-start">
        <div>
          <Eyebrow>Verification</Eyebrow>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl leading-tight text-pl-text md:text-4xl">
            {property?.address ?? 'Unnamed property'}
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-pl-muted">
            {verification.id} · {formatDate(verification.createdAt)} ·{' '}
            {verification.documents.length} document
            {verification.documents.length === 1 ? '' : 's'}
          </p>
        </div>

        {verification.status === 'complete' ? (
          <VerificationStamp risk={verification.overallRisk} />
        ) : null}
      </div>

      <div className="grid gap-10 pt-10 lg:grid-cols-[240px_1fr_280px] lg:gap-8">
        {/* Documents */}
        <aside className="lg:order-1">
          <Eyebrow>Documents</Eyebrow>

          <ul className="mt-4 space-y-px bg-pl-border">
            {verification.documents.map((doc) => (
              <li key={doc.s3Key} className="bg-pl-surface p-4">
                <p className="text-sm leading-snug text-pl-text">
                  {documentLabel(doc.type)}
                </p>
                <p className="mt-1.5 truncate font-mono text-[10px] text-pl-muted">
                  {doc.extractedData.referenceNumber ?? 'No reference'}
                </p>
                <p
                  className={`mt-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    doc.flags.length ? 'text-pl-flagged' : 'text-pl-verified'
                  }`}
                >
                  {doc.flags.length
                    ? `${doc.flags.length} flag${doc.flags.length === 1 ? '' : 's'}`
                    : 'Clear'}
                </p>
              </li>
            ))}
          </ul>
        </aside>

        {/* Summary + flags */}
        <div className="lg:order-2">
          <Eyebrow>Summary</Eyebrow>
          <p className="mt-4 font-serif text-lg leading-relaxed text-pl-text md:text-xl md:leading-relaxed">
            {verification.summary ||
              'Verification is still running. The summary appears here when it completes.'}
          </p>

          <div className="mt-12">
            <Eyebrow>
              Flags · {flags.length} raised
            </Eyebrow>

            {flags.length ? (
              <div className="mt-4 space-y-px bg-pl-border">
                {flags.map((flag, i) => (
                  <DocumentFlag key={`${flag.fieldAffected}-${i}`} {...flag} />
                ))}
              </div>
            ) : (
              <p className="mt-4 border border-dashed border-pl-border p-8 text-sm leading-relaxed text-pl-muted">
                No flags were raised against these documents. That is not a
                guarantee of clear title — it means nothing in the papers
                contradicts itself or the registry formats we check against.
              </p>
            )}
          </div>

          {valuation ? (
            <div className="mt-14">
              <Eyebrow>Valuation</Eyebrow>
              <div className="mt-5 border border-pl-border bg-pl-surface p-6 md:p-8">
                <ValuationRange
                  low={valuation.rangeLow}
                  high={valuation.rangeHigh}
                  estimated={valuation.estimatedValue}
                />
                <p className="mt-7 border-t border-pl-border pt-6 text-sm leading-relaxed text-pl-muted">
                  {valuation.methodology}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Risk panel */}
        <aside className="space-y-8 lg:order-3">
          <div className="border border-pl-border bg-pl-surface p-6">
            <Eyebrow>Overall risk</Eyebrow>
            <p
              className={`mt-3 font-serif text-3xl capitalize ${
                verification.overallRisk === 'low'
                  ? 'text-pl-verified'
                  : verification.overallRisk === 'moderate'
                    ? 'text-pl-flagged'
                    : 'text-pl-invalid'
              }`}
            >
              {verification.overallRisk}
            </p>

            <div className="mt-7">
              <ConfidenceBar value={confidence} label="Extraction confidence" />
            </div>

            {worstDoc ? (
              <p className="mt-6 border-t border-pl-border pt-5 text-xs leading-relaxed text-pl-muted">
                Driven by the {documentLabel(worstDoc.type).toLowerCase()}.
              </p>
            ) : null}
          </div>

          <ReportPanel
            verificationId={verification.id}
            status={verification.status}
          />
        </aside>
      </div>
    </Container>
  );
}
