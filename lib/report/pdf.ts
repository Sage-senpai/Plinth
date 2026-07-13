import {
  PDFDocument,
  type PDFFont,
  type PDFPage,
  StandardFonts,
  rgb,
} from 'pdf-lib';
import { formatDate, formatNaira } from '@/lib/format';
import { documentLabel } from '@/lib/property/documents';
import type { DocumentFlag, Valuation, VerificationRecord } from '@/lib/types';

/** Print colours. The dark UI palette does not survive a laser printer. */
const INK = rgb(0.07, 0.07, 0.06);
const MUTED = rgb(0.42, 0.4, 0.38);
const RULE = rgb(0.85, 0.83, 0.8);
const COPPER = rgb(0.706, 0.325, 0.035);
const CRITICAL = rgb(0.863, 0.149, 0.149);
const MAJOR = rgb(0.961, 0.62, 0.043);

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 56;
const CONTENT = A4.width - MARGIN * 2;

interface Ctx {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  serif: PDFFont;
  serifBold: PDFFont;
  sans: PDFFont;
  sansBold: PDFFont;
  mono: PDFFont;
  pageNo: number;
}

function wrap(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function newPage(ctx: Ctx): void {
  ctx.page = ctx.doc.addPage([A4.width, A4.height]);
  ctx.pageNo += 1;
  ctx.y = A4.height - MARGIN;
}

function ensure(ctx: Ctx, needed: number): void {
  if (ctx.y - needed < MARGIN + 40) newPage(ctx);
}

function paragraph(
  ctx: Ctx,
  text: string,
  opts: { font?: PDFFont; size?: number; color?: typeof INK; indent?: number } = {},
): void {
  const font = opts.font ?? ctx.sans;
  const size = opts.size ?? 10;
  const indent = opts.indent ?? 0;
  const leading = size * 1.5;

  for (const line of wrap(text, font, size, CONTENT - indent)) {
    ensure(ctx, leading);
    ctx.page.drawText(line, {
      x: MARGIN + indent,
      y: ctx.y,
      size,
      font,
      color: opts.color ?? INK,
    });
    ctx.y -= leading;
  }
}

function heading(ctx: Ctx, text: string): void {
  ensure(ctx, 52);
  ctx.y -= 16;
  ctx.page.drawText(text.toUpperCase(), {
    x: MARGIN,
    y: ctx.y,
    size: 9,
    font: ctx.sansBold,
    color: COPPER,
  });
  ctx.y -= 10;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: MARGIN + CONTENT, y: ctx.y },
    thickness: 0.75,
    color: RULE,
  });
  ctx.y -= 18;
}

function severityColour(severity: string) {
  if (severity === 'critical') return CRITICAL;
  if (severity === 'major') return MAJOR;
  return MUTED;
}

/**
 * Assemble the due diligence report.
 *
 * Sections follow the order a buyer reads in: what we think, what the papers
 * said, what is wrong with them, what it is worth, and what to do on Monday.
 */
export async function buildReport(args: {
  verification: VerificationRecord;
  address: string;
  narrative: {
    executiveSummary: string;
    keyFindings: string[];
    nextSteps: string[];
    valuationNote: string;
  };
  valuation?: Valuation | null;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const ctx: Ctx = {
    doc,
    page: doc.addPage([A4.width, A4.height]),
    y: A4.height - MARGIN,
    serif: await doc.embedFont(StandardFonts.TimesRoman),
    serifBold: await doc.embedFont(StandardFonts.TimesRomanBold),
    sans: await doc.embedFont(StandardFonts.Helvetica),
    sansBold: await doc.embedFont(StandardFonts.HelveticaBold),
    mono: await doc.embedFont(StandardFonts.Courier),
    pageNo: 1,
  };

  const { verification: v, address, narrative, valuation } = args;

  // Masthead
  ctx.page.drawText('PLINTH', {
    x: MARGIN,
    y: ctx.y,
    size: 11,
    font: ctx.sansBold,
    color: COPPER,
  });
  ctx.page.drawText('DUE DILIGENCE REPORT', {
    x: MARGIN + 54,
    y: ctx.y,
    size: 11,
    font: ctx.sans,
    color: MUTED,
  });
  ctx.y -= 34;

  for (const line of wrap(address, ctx.serifBold, 22, CONTENT)) {
    ctx.page.drawText(line, {
      x: MARGIN,
      y: ctx.y,
      size: 22,
      font: ctx.serifBold,
      color: INK,
    });
    ctx.y -= 28;
  }

  ctx.y -= 4;
  ctx.page.drawText(
    `${v.id}   ·   ${formatDate(v.createdAt)}   ·   RISK: ${v.overallRisk.toUpperCase()}`,
    { x: MARGIN, y: ctx.y, size: 8, font: ctx.mono, color: MUTED },
  );
  ctx.y -= 14;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: MARGIN + CONTENT, y: ctx.y },
    thickness: 2,
    color: COPPER,
  });
  ctx.y -= 8;

  // Executive summary
  heading(ctx, 'Executive Summary');
  paragraph(ctx, narrative.executiveSummary, { font: ctx.serif, size: 11.5 });

  // Documents
  heading(ctx, 'Document Verification');
  for (const d of v.documents) {
    ensure(ctx, 34);
    const label = documentLabel(d.type);
    ctx.page.drawText(label, {
      x: MARGIN,
      y: ctx.y,
      size: 10,
      font: ctx.sansBold,
      color: INK,
    });

    const status = d.flags.length
      ? `${d.flags.length} flag${d.flags.length === 1 ? '' : 's'}`
      : 'No issues found';
    ctx.page.drawText(status, {
      x: MARGIN + CONTENT - ctx.sans.widthOfTextAtSize(status, 9),
      y: ctx.y,
      size: 9,
      font: ctx.sans,
      color: d.flags.length ? severityColour(d.flags[0].severity) : MUTED,
    });
    ctx.y -= 14;

    const ref = d.extractedData.referenceNumber;
    paragraph(
      ctx,
      `${ref ? `Reference ${ref}. ` : 'No reference number found. '}${
        d.extractedData.extractedParties.length
          ? d.extractedData.extractedParties
              .map((p) => `${p.role}: ${p.name}`)
              .join('. ')
          : 'No parties identified.'
      }`,
      { size: 9, color: MUTED },
    );
    ctx.y -= 6;
  }

  // Flags
  const flags: DocumentFlag[] = v.documents.flatMap((d) => d.flags);
  const order = { critical: 0, major: 1, minor: 2 } as const;
  flags.sort((a, b) => order[a.severity] - order[b.severity]);

  heading(ctx, 'Flags and Recommendations');
  if (!flags.length) {
    paragraph(
      ctx,
      'No flags were raised against the documents submitted. This is not a guarantee of clear title — it means nothing in the papers contradicts itself or the registry formats Plinth checks against.',
      { color: MUTED },
    );
  }

  for (const f of flags) {
    ensure(ctx, 60);
    const colour = severityColour(f.severity);

    const top = ctx.y + 10;
    ctx.page.drawText(`${f.severity.toUpperCase()}  ·  ${f.fieldAffected}`, {
      x: MARGIN + 12,
      y: ctx.y,
      size: 8.5,
      font: ctx.sansBold,
      color: colour,
    });
    ctx.y -= 14;

    paragraph(ctx, f.description, { size: 10, indent: 12 });
    ctx.y -= 2;
    paragraph(ctx, `What to do: ${f.recommendation}`, {
      size: 9.5,
      indent: 12,
      font: ctx.sansBold,
    });

    // Severity bar on the left, drawn last so it spans the finished block.
    ctx.page.drawRectangle({
      x: MARGIN,
      y: ctx.y + 4,
      width: 2.5,
      height: Math.max(12, top - ctx.y - 4),
      color: colour,
    });

    ctx.y -= 10;
  }

  // Valuation
  if (valuation) {
    heading(ctx, 'Valuation');
    ensure(ctx, 40);

    ctx.page.drawText(formatNaira(valuation.estimatedValue), {
      x: MARGIN,
      y: ctx.y,
      size: 18,
      font: ctx.serifBold,
      color: INK,
    });
    ctx.y -= 18;

    ctx.page.drawText(
      `${formatNaira(valuation.rangeLow)} — ${formatNaira(valuation.rangeHigh)}   ·   confidence ${(valuation.confidence * 100).toFixed(0)}%`,
      { x: MARGIN, y: ctx.y, size: 8.5, font: ctx.mono, color: MUTED },
    );
    ctx.y -= 20;

    paragraph(ctx, valuation.methodology, { size: 10 });

    if (narrative.valuationNote) {
      ctx.y -= 4;
      paragraph(ctx, narrative.valuationNote, { size: 10, font: ctx.serif });
    }

    if (valuation.comparables.length) {
      ctx.y -= 6;
      paragraph(ctx, 'Comparable sales used', {
        size: 8.5,
        font: ctx.sansBold,
        color: MUTED,
      });
      for (const c of valuation.comparables.slice(0, 6)) {
        ensure(ctx, 13);
        ctx.page.drawText(
          `${c.address} — ${formatNaira(c.salePrice)} — ${formatDate(c.saleDate)}`,
          { x: MARGIN, y: ctx.y, size: 8.5, font: ctx.mono, color: MUTED },
        );
        ctx.y -= 13;
      }
    }
  }

  // Findings and next steps
  if (narrative.keyFindings.length) {
    heading(ctx, 'Key Findings');
    for (const finding of narrative.keyFindings) {
      paragraph(ctx, `— ${finding}`, { size: 10 });
      ctx.y -= 2;
    }
  }

  heading(ctx, 'Next Steps');
  narrative.nextSteps.forEach((step, i) => {
    paragraph(ctx, `${i + 1}.  ${step}`, { size: 10 });
    ctx.y -= 2;
  });

  // Standing disclaimer. Value 3: we do not guarantee clear title.
  ctx.y -= 12;
  ensure(ctx, 48);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: MARGIN + CONTENT, y: ctx.y },
    thickness: 0.75,
    color: RULE,
  });
  ctx.y -= 16;
  paragraph(
    ctx,
    'Plinth does not guarantee clear title. This report sets out what the documents submitted say, where they contradict one another, and where they are silent. It is not legal advice and does not replace a physical search at the relevant lands registry or an inspection of the land. What you do with this information is your informed decision.',
    { size: 8, color: MUTED },
  );

  // Footers
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    page.drawText(`Plinth  ·  ${v.id}  ·  ${i + 1} of ${pages.length}`, {
      x: MARGIN,
      y: MARGIN - 24,
      size: 7.5,
      font: ctx.mono,
      color: MUTED,
    });
  });

  return doc.save();
}
