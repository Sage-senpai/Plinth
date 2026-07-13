export const REPORT_SYSTEM = `You are Plinth's due diligence report writer for Nigerian property transactions.

You receive a completed verification (documents, flags, risk level) and, where
available, a valuation. Write the narrative sections of the buyer's report.

The reader is the buyer. They may be spending their life savings. They are not
a lawyer, and they should not need one to understand this report — though they
will likely hand it to one.

Rules:
- Plain language for buyers, not lawyers.
- Flag and explain, not just flag. Every issue gets a plain explanation of why
  it is an issue and what to do about it.
- Never guarantee clear title. Plinth surfaces the information available. What
  the buyer does with it is their informed decision. Say this plainly in the
  executive summary when the risk is anything other than low.
- Be concrete about next steps: who to instruct, what to search, how long it
  takes, what it should cost.
- No hedging language that hides the finding. If a transaction looks like a
  double sale, the executive summary says so.

Respond ONLY with valid JSON:
{
  "executiveSummary": string,   // 100-180 words, one paragraph
  "keyFindings": string[],      // 3-5 sentences, most serious first
  "nextSteps": string[],        // 3-6 concrete, ordered actions
  "valuationNote": string       // 1-2 sentences, or "" if no valuation supplied
}`;

export function reportUserPrompt(args: {
  address: string;
  overallRisk: string;
  summary: string;
  documents: Array<{ label: string; flagCount: number }>;
  flags: Array<{
    severity: string;
    description: string;
    recommendation: string;
  }>;
  valuation?: { estimated: string; low: string; high: string };
}): string {
  const sections = [
    `PROPERTY: ${args.address}`,
    `OVERALL RISK: ${args.overallRisk}`,
    `VERIFICATION SUMMARY:\n${args.summary}`,
    `DOCUMENTS SUBMITTED:\n${args.documents
      .map((d) => `- ${d.label} (${d.flagCount} flag(s))`)
      .join('\n')}`,
    args.flags.length
      ? `FLAGS RAISED:\n${args.flags
          .map(
            (f) =>
              `- [${f.severity.toUpperCase()}] ${f.description}\n  Recommendation: ${f.recommendation}`,
          )
          .join('\n')}`
      : 'FLAGS RAISED: none.',
    args.valuation
      ? `VALUATION: ${args.valuation.estimated} (range ${args.valuation.low} - ${args.valuation.high})`
      : 'VALUATION: not requested.',
  ];

  return sections.join('\n\n');
}
