const CARDS = [
  { title: 'AI at the core', body: 'Documents are read with Amazon Textract and Amazon Comprehend, then a Bedrock model checks them against each other and flags contradictions. A valuation model and a report writer run on the same pipeline.' },
  { title: 'Built to scale', body: 'Serverless Next.js on Vercel with Neon Postgres. Verification runs as background jobs on QStash, so many documents can be processed at once while each user watches live job status.' },
  { title: 'Repeatable output', body: 'Every report is generated as a PDF from the same structured findings, so results are consistent and auditable rather than dependent on who reviewed the file.' },
]

export function PlatformSection() {
  return (
    <section className="border-t border-pl-border px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pl-copper-lgt">The platform</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-pl-text sm:text-4xl">A verification engine, not a manual search.</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-pl-muted">Proprepo is a self-serve product: upload property documents and get a due diligence report without waiting on a person to read them.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card.title} className="border border-pl-border p-6">
              <h3 className="text-lg font-semibold text-pl-text">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pl-muted">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}