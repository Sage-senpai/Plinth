import { StepBadge } from './ui';

const CARDS = [
  { title: 'AI at the core', body: 'Documents are read with Amazon Textract and Amazon Comprehend, then a Bedrock model checks them against each other and flags contradictions. A valuation model and a report writer run on the same pipeline.' },
  { title: 'Built to scale', body: 'Serverless Next.js on Vercel with Neon Postgres. Verification runs as background jobs on QStash, so many documents can be processed at once while each user watches live job status.' },
  { title: 'Repeatable output', body: 'Every report is generated as a PDF from the same structured findings, so results are consistent and auditable rather than dependent on who reviewed the file.' },
]

export function PlatformSection() {
  return (
    <section className="bg-pl-dark px-5 py-20 text-pl-cream sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="pl-eyebrow pl-eyebrow-on-dark">The platform</p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          A verification engine, not a manual search.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pl-dark-muted">
          Proprepo is a self-serve product: upload property documents and get a due diligence report without waiting on a person to read them.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              className="rounded-2xl border border-pl-dark-border bg-pl-dark-surface p-6"
            >
              <StepBadge n={i + 1} onDark />
              <h3 className="mt-5 text-lg font-semibold text-pl-cream">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pl-dark-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}