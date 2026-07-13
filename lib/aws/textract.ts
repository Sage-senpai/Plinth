import {
  AnalyzeDocumentCommand,
  type Block,
  TextractClient,
} from '@aws-sdk/client-textract';
import { env, hasAws } from '@/lib/env';
import { DEMO_TEXTRACT } from '@/lib/demo/textract';
import type { DocumentType } from '@/lib/types';

export interface ExtractedDocument {
  /** Flattened raw text, in reading order. */
  text: string;
  /** Key-value pairs Textract identified as form fields. */
  fields: Record<string, string>;
  /** Table rows, if any. */
  tables: string[][][];
}

let client: TextractClient | null = null;

function textract(): TextractClient {
  if (!client) {
    client = new TextractClient({
      region: env.awsRegion,
      credentials:
        env.awsAccessKeyId && env.awsSecretAccessKey
          ? {
              accessKeyId: env.awsAccessKeyId,
              secretAccessKey: env.awsSecretAccessKey,
            }
          : undefined,
    });
  }
  return client;
}

/**
 * Extract structured content from a property document already in S3.
 *
 * Nigerian property documents arrive as faded photocopies, phone photos and
 * scanned PDFs, so we ask for FORMS and TABLES rather than plain text: the
 * key-value pairs are what the fraud detector actually reasons over.
 */
export async function extractDocument(
  s3Key: string,
  type: DocumentType,
): Promise<ExtractedDocument> {
  if (!hasAws) return DEMO_TEXTRACT(type);

  const res = await textract().send(
    new AnalyzeDocumentCommand({
      Document: { S3Object: { Bucket: env.s3Bucket, Name: s3Key } },
      FeatureTypes: ['FORMS', 'TABLES'],
    }),
  );

  const blocks = res.Blocks ?? [];
  return {
    text: flattenText(blocks),
    fields: extractFields(blocks),
    tables: extractTables(blocks),
  };
}

function byId(blocks: Block[]): Map<string, Block> {
  return new Map(blocks.map((b) => [b.Id ?? '', b]));
}

function wordsOf(block: Block, index: Map<string, Block>): string {
  const ids =
    block.Relationships?.filter((r) => r.Type === 'CHILD').flatMap(
      (r) => r.Ids ?? [],
    ) ?? [];

  return ids
    .map((cid) => index.get(cid))
    .filter((b): b is Block => Boolean(b))
    .map((b) => (b.BlockType === 'SELECTION_ELEMENT' ? (b.SelectionStatus === 'SELECTED' ? '[x]' : '[ ]') : (b.Text ?? '')))
    .join(' ')
    .trim();
}

function flattenText(blocks: Block[]): string {
  return blocks
    .filter((b) => b.BlockType === 'LINE')
    .map((b) => b.Text ?? '')
    .join('\n');
}

function extractFields(blocks: Block[]): Record<string, string> {
  const index = byId(blocks);
  const fields: Record<string, string> = {};

  for (const block of blocks) {
    if (block.BlockType !== 'KEY_VALUE_SET') continue;
    if (!block.EntityTypes?.includes('KEY')) continue;

    const key = wordsOf(block, index);
    if (!key) continue;

    const valueIds =
      block.Relationships?.filter((r) => r.Type === 'VALUE').flatMap(
        (r) => r.Ids ?? [],
      ) ?? [];

    const value = valueIds
      .map((vid) => index.get(vid))
      .filter((b): b is Block => Boolean(b))
      .map((b) => wordsOf(b, index))
      .join(' ')
      .trim();

    fields[key] = value;
  }

  return fields;
}

function extractTables(blocks: Block[]): string[][][] {
  const index = byId(blocks);

  return blocks
    .filter((b) => b.BlockType === 'TABLE')
    .map((table) => {
      const cellIds =
        table.Relationships?.filter((r) => r.Type === 'CHILD').flatMap(
          (r) => r.Ids ?? [],
        ) ?? [];

      const rows: string[][] = [];
      for (const cid of cellIds) {
        const cell = index.get(cid);
        if (!cell || cell.BlockType !== 'CELL') continue;

        const r = (cell.RowIndex ?? 1) - 1;
        const c = (cell.ColumnIndex ?? 1) - 1;
        rows[r] ??= [];
        rows[r][c] = wordsOf(cell, index);
      }
      return rows;
    });
}
