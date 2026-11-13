import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink, Container, Eyebrow } from '@/components/ui';
import { Reveal, RevealItem, RevealStagger, StepBadge } from '@/components/motion';
import { TEAM, TIMELINE, VALUES } from '@/lib/team';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Proprepo was founded in July 2024 in Lagos after a client lost ₦18 million to a forged Governor’s consent.',
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
          <Reveal>
            <Eyebrow>About Proprepo</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.1] text-pl-text md:text-6xl">
              Fraud this common is not a market failure.{' '}
              <span className="font-normal text-pl-muted">
                It is a tooling failure.
              </span>
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* Origin story */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Reveal>
              <Eyebrow>The origin</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} className="max-w-2xl space-y-6 text-base leading-relaxed text-pl-muted md:text-lg">
              <p>
                In February 2024, a client of Eze&apos;s lost ₦18 million on a
                plot in Lekki Phase 2. The Certificate of Occupancy was genuine.
                The governor&apos;s consent had been forged. The seller had sold
                the same plot three months earlier.
              </p>
              <p>
                The professional due diligence firm Eze used had spotted
                nothing, because they checked the document&apos;s surface, not
                its provenance.
              </p>
              <p className="font-serif text-xl leading-relaxed text-pl-text md:text-2xl">
                Eze called Nkechi the same week. “I need to build something,”
                he said, “that looks at a document the way a forger looks at it.
                It knows what to fake and where.”
              </p>
              <p>
                Fraudulent property sales cost Nigerians an estimated ₦1.5
                trillion a year. Professional due diligence exists, but it is
                expensive, slow, and concentrated in Lagos and Abuja. Most
                buyers in secondary cities and emerging areas are entirely
                unprotected. Proprepo exists to change the arithmetic of that.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <Reveal>
            <Eyebrow>The team</Eyebrow>
            <h2 className="mt-5 font-serif text-3xl text-pl-text md:text-4xl">
              Five people, three of whom have lost sleep over a land dispute.
            </h2>
          </Reveal>

          <RevealStagger className="mt-14 grid gap-px bg-pl-border sm:grid-cols-2">
            {TEAM.map((member) => (
              <RevealItem key={member.name} className="bg-pl-surface p-8">
                <article>
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
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Reveal>
              <Eyebrow>Timeline</Eyebrow>
            </Reveal>

            <RevealStagger className="max-w-2xl" stagger={0.06}>
              <ol>
                {TIMELINE.map((entry) => (
                  <RevealItem
                    key={entry.when}
                    as="li"
                    className="grid grid-cols-[100px_1fr] gap-5 border-t border-pl-border py-5 md:grid-cols-[130px_1fr]"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-pl-copper-lgt">
                      {entry.when}
                    </span>
                    <span className="text-sm leading-relaxed text-pl-muted">
                      {entry.what}
                    </span>
                  </RevealItem>
                ))}
              </ol>
            </RevealStagger>
          </div>
        </Container>
      </section>

      {/* Metrics */}
      <section className="border-b border-pl-border py-20 md:py-24">
        <Container>
          <RevealStagger className="grid grid-cols-2 gap-px bg-pl-border md:grid-cols-3 lg:grid-cols-6" stagger={0.05}>
            {METRICS.map((m) => (
              <RevealItem key={m.label} className="bg-pl-surface px-5 py-7">
                <p className="font-mono text-xl text-pl-text">{m.value}</p>
                <p className="pl-eyebrow mt-2">{m.label}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>
      </section>

      {/* Values */}
      <section className="border-b border-pl-border py-20 md:py-28">
        <Container>
          <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-16">
            <Reveal>
              <Eyebrow>What we hold to</Eyebrow>
            </Reveal>

            <RevealStagger className="max-w-2xl space-y-10" stagger={0.1}>
              {VALUES.map((value, i) => (
                <RevealItem key={value.title}>
                  <StepBadge n={i + 1} />
                  <h3 className="mt-3 font-serif text-xl text-pl-text md:text-2xl">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pl-muted">
                    {value.body}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-24">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="max-w-xl font-serif text-2xl leading-tight text-pl-text md:text-3xl">
              Run a verification before you commit to anything.
            </h2>
            <ButtonLink href="/workspace/verify/new" className="shrink-0">
              Start Verifying
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
