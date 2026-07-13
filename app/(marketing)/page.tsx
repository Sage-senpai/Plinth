import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink, Container, Eyebrow } from '@/components/ui';
import { TEAM } from '@/lib/team';

const PROBLEM = [
  { figure: '₦1.5T', body: 'lost to fraudulent property transactions in Nigeria every year' },
  { figure: '92%', body: 'of first-time buyers have no access to professional due diligence' },
  { figure: '14,000+', body: 'land fraud complaints made to the EFCC annually' },
];

function SampleResult() {
  const documents = [
    { label: 'Certificate of Occupancy', state: 'Verified', mark: '✓', tone: 'text-pl-verified border-pl-verified/30' },
    { label: "Governor's Consent", state: 'Flagged', mark: '!', tone: 'text-pl-flagged border-pl-flagged/30' },
    { label: 'Deed of Assignment', state: 'Invalid', mark: '✕', tone: 'text-pl-invalid border-pl-invalid/30' },
  ];

  return (
    <div className="mx-auto w-full max-w-xl border border-pl-border bg-pl-surface">
      <div className="flex items-center justify-between border-b border-pl-border px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted">
          Plot 18 Orchid Road, Lekki Phase 2
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pl-invalid">
          Critical
        </span>
      </div>

      <ul className="divide-y divide-pl-border">
        {documents.map((doc) => (
          <li key={doc.label} className="flex items-center gap-4 px-5 py-4">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs ${doc.tone}`}
              aria-hidden
            >
              {doc.mark}
            </span>
            <span className="flex-1 text-sm text-pl-text">{doc.label}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted">
              {doc.state}
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-pl-border px-5 py-4 text-[13px] leading-relaxed text-pl-muted">
        The consent reference could not have existed on the date it was
        endorsed. The same beacons appear on an earlier deed to a different
        buyer.
      </p>
    </div>
  );
}

export default function LandingPage() {
  const founders = TEAM.filter((t) => t.onLanding);

  return (
    <>
      {/* Hero — typographic, no image */}
      <section className="relative overflow-hidden border-b border-pl-border">
        <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

        <Container className="relative py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Property due diligence · Nigeria</Eyebrow>

            <h1 className="mx-auto mt-8 max-w-3xl font-serif text-[2.6rem] leading-[1.08] text-pl-text sm:text-6xl md:text-7xl">
              Your C of O might be real.
              <br />
              <span className="text-pl-copper-lgt">
                The transaction might not be.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-pl-muted md:text-lg">
              Plinth verifies Nigerian property documents, checks for fraud
              patterns, and generates a due diligence report before you sign
              anything.
            </p>

            <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/workspace/verify/new">
                Verify a Property
              </ButtonLink>
              <ButtonLink
                href="/workspace/verify/ver_9f2c41a8"
                variant="ghost"
              >
                See a Sample Report
              </ButtonLink>
            </div>

            <div className="mt-20">
              <SampleResult />
            </div>
          </div>
        </Container>
      </section>

      {/* Problem */}
      <section className="border-b border-pl-border py-24 md:py-32">
        <Container>
          <div className="grid gap-14 text-center md:grid-cols-3 md:gap-8">
            {PROBLEM.map((item) => (
              <div key={item.figure}>
                <p className="font-serif text-5xl text-pl-copper-lgt md:text-6xl">
                  {item.figure}
                </p>
                <p className="mx-auto mt-4 max-w-[15rem] text-sm leading-relaxed text-pl-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features — bento */}
      <section className="relative border-b border-pl-border py-24 md:py-32">
        <div className="pl-grid absolute inset-0 opacity-60" aria-hidden />

        <Container className="relative">
          <Eyebrow>What Plinth does</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-tight text-pl-text md:text-5xl">
            It reads a document the way a forger reads it.
          </h2>

          <div className="mt-14 grid gap-px bg-pl-border md:grid-cols-3">
            <article className="bg-pl-surface p-8 md:col-span-2 md:p-10">
              <Eyebrow>Document verification</Eyebrow>
              <h3 className="mt-4 font-serif text-2xl text-pl-text md:text-3xl">
                Every document, cross-checked against every other.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-pl-muted">
                Textract extracts the structure. Bedrock checks it against the
                fraud patterns that actually occur here — forged consent
                endorsements, beacon numbers that don&apos;t match the address,
                a deed signed before the C of O it relies on.
              </p>

              <div className="mt-8 border-l-2 border-l-pl-flagged bg-pl-surface2 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-pl-flagged">
                  Major · Inconsistency · Governor&apos;s consent
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-pl-text">
                  The consent reference LSLB/GC/2024/3318 is dated 14 March
                  2024, but references in that sequence were not issued until
                  August. A consent cannot be endorsed before it exists.
                </p>
              </div>
            </article>

            <article className="bg-pl-surface p-8 md:p-10">
              <Eyebrow>AI valuation</Eyebrow>
              <h3 className="mt-4 font-serif text-2xl text-pl-text">
                What it is actually worth.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-pl-muted">
                Valued from comparable sales in the same area, weighted for
                recency and plot size.
              </p>

              <div className="mt-8">
                <p className="font-mono text-2xl text-pl-copper-lgt">
                  ₦198,000,000
                </p>
                <div className="mt-4 h-[3px] w-full bg-pl-border">
                  <div className="h-full w-[62%] bg-pl-copper" />
                </div>
                <p className="mt-3 font-mono text-[11px] text-pl-muted">
                  ₦172,000,000 — ₦231,000,000
                </p>
              </div>
            </article>

            <article className="bg-pl-surface p-8 md:p-10">
              <Eyebrow>Plain English reports</Eyebrow>
              <h3 className="mt-4 font-serif text-2xl text-pl-text">
                Not just flags.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-pl-muted">
                Explanations and next steps. Written for the person spending
                their savings, not for their solicitor.
              </p>
            </article>

            <article className="bg-pl-surface p-8 md:col-span-2 md:p-10">
              <Eyebrow>One-click PDF</Eyebrow>
              <h3 className="mt-4 font-serif text-2xl text-pl-text md:text-3xl">
                Download your report. Hand it to your lawyer.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-pl-muted">
                Executive summary, document-by-document findings, the valuation
                and a numbered list of what to do on Monday morning — including
                what to search, who to instruct and what it should cost.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* Founders */}
      <section className="border-b border-pl-border py-24 md:py-32">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Who built this</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-pl-text md:text-5xl">
              We have been on both sides of this problem.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {founders.map((f) => (
              <div key={f.name} className="flex items-start gap-4">
                <Image
                  src={f.image}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 object-cover grayscale"
                />
                <div>
                  <p className="text-[15px] text-pl-text">{f.name}</p>
                  <p className="pl-eyebrow mt-1">{f.role}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-pl-muted">
                    {f.short}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-16 max-w-3xl border-l-2 border-l-pl-copper pl-6 md:pl-8">
            <p className="font-serif text-xl leading-relaxed text-pl-text md:text-2xl">
              In February 2024 a client of mine lost ₦18 million on a plot in
              Lekki Phase 2. The Certificate of Occupancy was genuine — the
              governor&apos;s consent had been forged, and the seller had
              already sold the same plot three months earlier.
            </p>
            <footer className="mt-5 text-sm text-pl-muted">
              Tobi Adesanya, CEO
            </footer>
          </blockquote>

          <Link
            href="/about"
            className="mt-9 inline-block text-sm text-pl-copper-lgt transition-colors hover:text-pl-copper"
          >
            Read our full story →
          </Link>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="border-b border-pl-border bg-pl-surface py-24 md:py-28">
        <Container>
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-2xl leading-relaxed text-pl-text md:text-4xl md:leading-[1.35]">
              “Plinth found a date inconsistency on the deed that our estate
              agent had missed. That inconsistency saved us from what turned out
              to be a double-sale case.”
            </p>
            <footer className="pl-eyebrow mt-8">
              Buyer, Lekki, Lagos · Beta participant
            </footer>
          </blockquote>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-pl-copper py-20 md:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-9 md:flex-row md:items-center">
            <h2 className="max-w-xl font-serif text-3xl leading-tight text-[#1A0E03] md:text-4xl">
              Run your first verification before you commit to anything.
            </h2>
            <ButtonLink
              href="/workspace/verify/new"
              variant="dark"
              className="shrink-0"
            >
              Start Verifying
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
