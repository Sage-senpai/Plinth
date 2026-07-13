import { detectEntities } from '@/lib/aws/comprehend';
import { invokeJson } from '@/lib/aws/bedrock';
import { extractDocument } from '@/lib/aws/textract';
import { hasAws } from '@/lib/env';
import {
  SUMMARY_SYSTEM,
  VERIFY_SYSTEM,
  verifyUserPrompt,
} from '@/lib/prompts/verify';
import { documentLabel } from '@/lib/property/documents';
import { completeVerification, failVerification } from '@/lib/db/repo';
import { demoAnalysis, demoSummary } from '@/lib/demo/analysis';
import {
  type AnalysedDocument,
  type DocumentAnalysis,
  type DocumentType,
  highestRisk,
  type RiskLevel,
  riskFromFlags,
} from '@/lib/types';

export interface VerifyJob {
  verificationId: string;
  address: string;
  documents: Array<{ s3Key: string; type: DocumentType; fileName?: string }>;
}

/**
 * The verification pipeline.
 *
 * For each document: Textract extracts the structured content, Comprehend pulls
 * the entity spine, and Bedrock cross-checks both against the known Nigerian
 * fraud patterns. Documents are analysed in order rather than in parallel so
 * that each one can be cross-checked against the ones already seen — a name
 * that appears on the deed but not the C of O is only visible from the second
 * document onwards.
 */
export async function runVerification(job: VerifyJob): Promise<void> {
  try {
    const analysed: AnalysedDocument[] = [];

    for (const doc of job.documents) {
      const extraction = await extractDocument(doc.s3Key, doc.type);
      const entities = await detectEntities(extraction.text);

      const analysis = hasAws
        ? await invokeJson<DocumentAnalysis>({
            system: VERIFY_SYSTEM,
            user: verifyUserPrompt({
              type: doc.type,
              extraction,
              entities,
              siblings: analysed.map((a) => ({
                type: a.type,
                summary: `${documentLabel(a.type)} — ref ${
                  a.extractedData.referenceNumber ?? 'none'
                }; parties: ${a.extractedData.extractedParties
                  .map((p) => `${p.role}: ${p.name}`)
                  .join('; ')}`,
              })),
            }),
            maxTokens: 2048,
          })
        : demoAnalysis(doc.type);

      analysed.push({
        s3Key: doc.s3Key,
        type: doc.type,
        fileName: doc.fileName,
        extractedData: analysis,
        flags: analysis.flags ?? [],
      });
    }

    const allFlags = analysed.flatMap((d) => d.flags);
    const risk: RiskLevel = highestRisk([
      ...analysed.map((d) => d.extractedData.overallRisk),
      riskFromFlags(allFlags),
    ]);

    const { summary, overallRisk } = hasAws
      ? await invokeJson<{ summary: string; overallRisk: RiskLevel }>({
          system: SUMMARY_SYSTEM,
          user: [
            `PROPERTY: ${job.address}`,
            `ROLLED-UP RISK FROM DOCUMENT ANALYSIS: ${risk}`,
            ...analysed.map(
              (d) =>
                `${documentLabel(d.type)}:\n${
                  d.flags.length
                    ? d.flags
                        .map(
                          (f) =>
                            `- [${f.severity}] ${f.description} → ${f.recommendation}`,
                        )
                        .join('\n')
                    : '- No issues found.'
                }`,
            ),
          ].join('\n\n'),
          maxTokens: 1024,
        })
      : { summary: demoSummary(job.address, analysed, risk), overallRisk: risk };

    await completeVerification({
      verificationId: job.verificationId,
      documents: analysed,
      overallRisk: highestRisk([risk, overallRisk]),
      summary,
    });
  } catch (error) {
    console.error('[plinth] verification failed', job.verificationId, error);
    await failVerification(job.verificationId);
    throw error;
  }
}
