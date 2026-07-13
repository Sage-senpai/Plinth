# Plinth

AI due diligence for Nigerian real estate. Plinth verifies property documents,
flags known fraud patterns, values the property against comparable sales, and
produces a due diligence report a buyer can hand to their lawyer or their bank.

It does not guarantee clear title. It surfaces what the documents say, where
they contradict one another, and where they are silent.

## Running it

```bash
npm install
npm run dev
```

That is the whole setup. With no credentials configured, Plinth runs in **demo
mode**: every AWS capability degrades to a deterministic stub and the database
falls back to a seeded in-memory store, so the entire product — landing page
through PDF download — works on a clean checkout with no AWS account and no
Neon database.

The seeded corpus is three real pilot shapes: a clean Ikoyi title, a Gwarinpa
consent defect, and the Lekki Phase 2 double sale the company was founded on.

```bash
npm run build      # production build
npm test           # 22 tests
npm run typecheck
```

## Going live

Set the variables in `.env.example` and set `DEMO_MODE=false`. Each capability
switches from its stub to the real service independently — you can point at a
real Neon database while leaving AWS stubbed, or the reverse.

| Variable | Effect when set |
|---|---|
| `DATABASE_URL` | Reads and writes go to Neon instead of the in-memory store |
| `AWS_*` + `DEMO_MODE=false` | Textract, Bedrock, Comprehend and S3 become real calls |
| `QSTASH_TOKEN` | Verification is queued instead of running inline |
| `QSTASH_*_SIGNING_KEY` | The worker rejects unsigned requests |
| `NEXTAUTH_SECRET` | Sessions are signed with your secret |

Then push the schema:

```bash
npm run db:generate
npm run db:push
```

## How a verification works

```
POST /api/verify
  → property + up to 5 S3 document keys
  → for each document, in order:
      Textract    extract key-value pairs, tables, raw text
      Comprehend  entity spine (names, dates, references)
      Bedrock     cross-check against Nigerian fraud patterns,
                  and against every document already read
  → roll item-level flags up to one risk level
  → Bedrock writes the buyer-facing summary
  → store in Neon

GET  /api/status/[jobId]    poll while it runs
POST /api/valuation         AVM from comparable sales
POST /api/report            assemble the PDF, store in S3, return a signed URL
```

Documents are analysed **in order rather than in parallel** on purpose: a name
that appears on the deed but never on the Certificate of Occupancy is only
visible once the earlier document has been read.

Verification takes about six minutes for a five-document property — past a
serverless request budget — so in production the job is handed to QStash and
the worker at `/api/queue/process` does the work. Without a QStash token it
runs inline.

## Architecture

```
app/
  (marketing)/     landing, about, pricing
  search/          public property and report search
  workspace/       verification list, new-verification wizard, result, comparables
  api/             verify, valuation, report, status, upload, queue/process, auth
lib/
  aws/             Textract, Bedrock, S3, Comprehend — each with a demo stub
  db/              Drizzle schema + the repository every read and write goes through
  demo/            seeded corpus: comparables, verifications, stub extractions
  property/        Lagos and Abuja area codes; the 8 supported document types
  prompts/         fraud detector, valuation, report
  queue/           QStash client and the verification pipeline
  report/          pdf-lib report assembly
components/        VerificationStamp, DocumentFlag, ValuationRange, ComparableCard
```

## Two things worth knowing before you change the code

**The naira sign will crash your PDF.** `pdf-lib`'s standard fonts are
WinAnsi-encoded and WinAnsi has no `₦` (U+20A6). Every figure in this product
is in naira and the report prose is model-written, so this is not an edge case.
`lib/report/pdf.ts` sanitises at the drawing layer — naira becomes the `NGN`
currency code — and there is a regression test that throws hostile input at it.
If you add a new `drawText` call, route the text through `safe()`.

**The valuation is allowed to be unsure.** Comparable sales data in Nigeria is
thin and unevenly reported. Both the model prompt and the deterministic
fallback are instructed to widen the range and drop confidence rather than
invent precision. A wide accurate range is more useful to a buyer negotiating
than a narrow confident wrong one. Do not "improve" this by tightening it.
