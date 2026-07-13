import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink, Container, Eyebrow } from '@/components/ui';
import { TEAM, TIMELINE, VALUES } from '@/lib/team';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Plinth was founded in July 2024 in Lagos after a client lost ₦18 million to a forged Governor’s consent.',
};

const METRICS = [
  { label: 'Founded', value: 'July 2024' },
  { label: 'Pre-seed', value: '₦23M' },
  { label: 'Pilot customers', value: '6' },
  { label: 'Reports generated', value: '380' },
  { label: 'Fraud flags caught', value: '47' },
  { label: 'Document types', value: '8' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative border-b border-pl-border">
        <div className="relative h-[300px] w-full md:h-[420px]">
          {/* Victoria Island and the Ikoyi marina — the brief's original URL
              was Toronto, CN Tower and all. */}
          <Image
            src="https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1400&q=80"
            alt="Victoria Island, Lagos, from the water"
            fill
            priority
            className="object-cover opacity-40 grayscale"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-pl-bg via-pl-bg/70 to-transparent"
            aria-hidden
          />
        </div>

        <Container className="relative -mt-32 pb-20 md:-mt-40 md:pb-24">
          <Eyebrow>About Plinth</Eyebrow>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.1] text-pl-text md:text-6xl">
            Fraud this common is not a market failure. It is a tooling failure.
          </h1>
        </Container>
      </section>

      {/* Origin story */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Eyebrow>The origin</Eyebrow>

            <div className="max-w-2xl space-y-6 text-base leading-relaxed text-pl-muted md:text-lg">
              <p>
                In February 2024, a client of Tobi&apos;s lost ₦18 million on a
                plot in Lekki Phase 2. The Certificate of Occupancy was genuine.
                The governor&apos;s consent had been forged. The seller had sold
                the same plot three months earlier.
              </p>
              <p>
                The professional due diligence firm Tobi used had spotted
                nothing, because they checked the document&apos;s surface, not
                its provenance.
              </p>
              <p className="font-serif text-xl leading-relaxed text-pl-text md:text-2xl">
                Tobi called Nkechi the same week. “I need to build something,”
                he said, “that looks at a document the way a forger looks at it.
                It knows what to fake and where.”
              </p>
              <p>
                Fraudulent property sales cost Nigerians an estimated ₦1.5
                trillion a year. Professional due diligence exists, but it is
                expensive, slow, and concentrated in Lagos and Abuja. Most
                buyers in secondary cities and emerging areas are entirely
                unprotected. Plinth exists to change the arithmetic of that.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <Eyebrow>The team</Eyebrow>
          <h2 className="mt-5 font-serif text-3xl text-pl-text md:text-4xl">
            Five people, three of whom have lost sleep over a land dispute.
          </h2>

          <div className="mt-14 grid gap-px bg-pl-border sm:grid-cols-2">
            {TEAM.map((member) => (
              <article key={member.name} className="bg-pl-surface p-8">
                {/* object-top: these are portraits, so a centred crop lands on
                    the chest rather than the face. */}
                <Image
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] object-cover object-top grayscale"
                />
                <h3 className="mt-5 text-lg text-pl-text">{member.name}</h3>
                <p className="pl-eyebrow mt-1.5">{member.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-pl-muted">
                  {member.bio}
                </p>

                {member.quote ? (
                  <p className="mt-5 border-l-2 border-l-pl-copper pl-4 font-serif text-[15px] leading-relaxed text-pl-text">
                    {member.quote}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Eyebrow>Timeline</Eyebrow>

            <ol className="max-w-2xl">
              {TIMELINE.map((entry) => (
                <li
                  key={entry.when}
                  className="grid grid-cols-[100px_1fr] gap-5 border-t border-pl-border py-5 md:grid-cols-[130px_1fr]"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-pl-copper-lgt">
                    {entry.when}
                  </span>
                  <span className="text-sm leading-relaxed text-pl-muted">
                    {entry.what}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Metrics */}
      <section className="border-b border-pl-border py-20 md:py-24">
        <Container>
          <div className="grid grid-cols-2 gap-px bg-pl-border md:grid-cols-3 lg:grid-cols-6">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-pl-surface px-5 py-7">
                <p className="font-mono text-xl text-pl-text">{m.value}</p>
                <p className="pl-eyebrow mt-2">{m.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Eyebrow>What we hold to</Eyebrow>

            <div className="max-w-2xl space-y-10">
              {VALUES.map((value, i) => (
                <div key={value.title}>
                  <p className="font-mono text-[11px] text-pl-copper-lgt">
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-pl-text md:text-2xl">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pl-muted">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="max-w-xl font-serif text-2xl leading-tight text-pl-text md:text-3xl">
              Run a verification before you commit to anything.
            </h2>
            <ButtonLink href="/workspace/verify/new" className="shrink-0">
              Start Verifying
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
