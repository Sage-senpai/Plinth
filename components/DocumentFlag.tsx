'use client';

import { useState } from 'react';
import type { FlagSeverity, FlagType } from '@/lib/types';

const SEVERITY: Record<
  FlagSeverity,
  { border: string; text: string; label: string }
> = {
  critical: {
    border: 'border-l-pl-invalid',
    text: 'text-pl-invalid',
    label: 'Critical',
  },
  major: {
    border: 'border-l-pl-flagged',
    text: 'text-pl-flagged',
    label: 'Major',
  },
  minor: {
    border: 'border-l-pl-muted',
    text: 'text-pl-muted',
    label: 'Minor',
  },
};

const TYPE_LABEL: Record<FlagType, string> = {
  fraud_indicator: 'Fraud indicator',
  inconsistency: 'Inconsistency',
  missing_element: 'Missing element',
  unusual: 'Unusual',
};

export function DocumentFlag({
  severity,
  type,
  description,
  recommendation,
  fieldAffected,
  defaultOpen = false,
}: {
  severity: FlagSeverity;
  type: FlagType;
  description: string;
  recommendation: string;
  fieldAffected?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen || severity === 'critical');
  const s = SEVERITY[severity];

  return (
    <div className={`border-l-2 bg-pl-surface ${s.border}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-pl-surface2"
      >
        <span className="flex-1">
          <span className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.18em] ${s.text}`}
            >
              {s.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted">
              {TYPE_LABEL[type]}
            </span>
            {fieldAffected ? (
              <span className="text-xs text-pl-muted">{fieldAffected}</span>
            ) : null}
          </span>

          <span
            className={`block text-[15px] leading-relaxed text-pl-text ${
              open ? '' : 'line-clamp-2'
            }`}
          >
            {description}
          </span>
        </span>

        <span
          aria-hidden
          className={`mt-1 shrink-0 text-pl-muted transition-transform ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>

      {open ? (
        <div className="border-t border-pl-border px-5 py-4">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted">
            What you should do
          </p>
          <p className="text-[15px] leading-relaxed text-pl-text">
            {recommendation}
          </p>
        </div>
      ) : null}
    </div>
  );
}
