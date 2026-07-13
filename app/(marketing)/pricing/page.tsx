import type { Metadata } from 'next';
import { ButtonLink, Container, Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'One-time reports from ₦12,000. Agent and law firm plans for teams running due diligence at volume.',
};

const TIERS = [
  {
    name: 'One-time',
    naira: '₦12,000',
    usd: '$8',
    cadence: 'per report',
    reports: '1 report',
    features: [
      'Full due diligence report',
      'Up to 5 documents verified',
      'AI valuation with comparables',
      'PDF download',
    ],
    cta: 'Verify a property',
    featured: false,
  },
  {
    name: 'Agent',
    naira: '₦45,000',
    usd: '$29',
    cadence: 'per month',
    reports: '20 reports',
    features: [
      'Everything in One-time',
      'Team workspace',
      'Full comparables database access',
      'Verification history and search',
    ],
    cta: 'Start with Agent',
    featured: true,
  },
  {
    name: 'Legal',
    naira: '₦120,000',
    usd: '$78',
    cadence: 'per month',
    reports: '60 reports',
    features: [
      'Everything in Agent',
      'Your firm’s branding on reports',
      'API access',
      'Priority verification queue',
    ],
    cta: 'Start with Legal',
    featured: false,
  },
  {
    name: 'Developer',
    naira: 'Custom',
    usd: '',
    cadence: '',
    reports: 'Unlimited',
    features: [
      'Bulk verification',
      'White-label reports',
      'Dedicated support',
      'Custom document types',
    ],
    cta: 'Talk to us',
    featured: false,
  },
];

const FAQ = [
  {
    q: 'What counts as one report?',
    a: 'One property, up to five documents, verified and cross-checked against each other, with a valuation and a downloadable PDF. Re-running a verification on the same property after you upload a new document does not cost another report.',
  },
  {
    q: 'Do you guarantee the title is clean?',
    a: 'No, and be wary of anyone who does. Plinth surfaces what the documents say, where they contradict one another, and where they are silent. A physical search at the lands registry and an inspection of the land remain necessary. Our report tells your solicitor exactly where to look first, which is usually what the search fee is being spent on anyway.',
  },
  {
    q: 'How long does a verification take?',
    a: 'About six minutes for a five-document property. You do not have to wait on the page — the report is there when you come back.',
  },
  {
    q: 'What if Plinth finds nothing wrong?',
    a: 'Then you have a report that says so, in writing, that you can hand to your lawyer or your bank. That is the outcome most of our reports produce, and it is worth ₦12,000 on its own.',
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-pl-border">
        <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

        <Container className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-pl-text md:text-6xl">
              A report costs less than the search fee it saves you.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-pl-muted">
              And considerably less than the plot. Every plan includes the full
              verification engine — the tiers differ in volume, not in rigour.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-pl-border py-16 md:py-20">
        <Container>
          <div className="grid gap-px bg-pl-border md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col bg-pl-surface p-8 ${
                  tier.featured ? 'ring-1 ring-inset ring-pl-copper' : ''
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-pl-text">
                    {tier.name}
                  </h2>
                  {tier.featured ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-pl-copper-lgt">
                      Most chosen
                    </span>
                  ) : null}
                </div>

                <p className="mt-7 font-serif text-3xl text-pl-text">
                  {tier.naira}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-pl-muted">
                  {tier.usd ? `${tier.usd} · ` : ''}
                  {tier.cadence}
                </p>

                <p className="mt-6 border-t border-pl-border pt-5 text-sm text-pl-copper-lgt">
                  {tier.reports}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 text-sm leading-relaxed text-pl-muted"
                    >
                      <span className="text-pl-copper" aria-hidden>
                        ·
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/workspace/verify/new"
                  variant={tier.featured ? 'copper' : 'ghost'}
                  className="mt-8 w-full"
                >
                  {tier.cta}
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Eyebrow>Questions</Eyebrow>

            <div className="max-w-2xl divide-y divide-pl-border">
              {FAQ.map((item) => (
                <div key={item.q} className="py-7 first:pt-0">
                  <h3 className="font-serif text-xl text-pl-text">{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-pl-muted">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
