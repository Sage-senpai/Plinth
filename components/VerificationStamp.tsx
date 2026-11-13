import type { RiskLevel } from '@/lib/types';

const STAMPS: Record<
  RiskLevel,
  { label: string; className: string }
> = {
  low: {
    label: 'Low Risk',
    className: 'border-pl-copper text-pl-copper-lgt',
  },
  moderate: {
    label: 'Moderate Risk',
    className: 'border-pl-flagged text-pl-flagged',
  },
  high: {
    label: 'High Risk',
    className: 'border-pl-invalid text-pl-invalid',
  },
  critical: {
    label: 'Critical',
    className: 'border-pl-invalid bg-pl-invalid text-white',
  },
};

/**
 * The notary stamp. Drops in at mount, scaling 1.2 → 1 with a slight rotation,
 * the way a stamp lands on a document rather than the way a web element fades.
 */
export function VerificationStamp({
  risk,
  className = '',
}: {
  risk: RiskLevel;
  className?: string;
}) {
  const stamp = STAMPS[risk];

  return (
    <div
      className={`inline-flex animate-stamp select-none items-center justify-center border-[3px] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] ${stamp.className} ${className}`}
      role="img"
      aria-label={`Verification result: ${stamp.label}`}
    >
      {stamp.label}
    </div>
  );
}
