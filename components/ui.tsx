import Link from 'next/link';
import type { RiskLevel, VerificationStatus } from '@/lib/types';

export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`pl-eyebrow ${className}`}>{children}</p>;
}

/** A numbered step badge — 01, 02, 03… — for process and how-it-works lists. */
export function StepBadge({
  n,
  onDark = false,
}: {
  n: number;
  onDark?: boolean;
}) {
  return (
    <span className={`pl-step ${onDark ? 'pl-step-on-dark' : ''}`}>
      {String(n).padStart(2, '0')}
    </span>
  );
}

type ButtonVariant = 'copper' | 'ghost' | 'dark';

const VARIANTS: Record<ButtonVariant, string> = {
  copper:
    'bg-pl-copper text-white hover:bg-pl-copper-lgt hover:shadow-glow-copper',
  ghost:
    'border border-pl-border-h text-pl-text hover:border-pl-copper hover:text-pl-copper-lgt',
  // Styled for use on full-dark sections, where it needs to read as the
  // light, high-contrast option against black.
  dark: 'bg-pl-cream text-pl-dark hover:bg-white',
};

const BASE =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40';

export function ButtonLink({
  href,
  variant = 'copper',
  children,
  className = '',
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = 'copper',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      {...props}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    />
  );
}

const RISK_STYLES: Record<RiskLevel, string> = {
  low: 'border-pl-verified/40 text-pl-verified',
  moderate: 'border-pl-flagged/40 text-pl-flagged',
  high: 'border-pl-invalid/40 text-pl-invalid',
  critical: 'border-pl-invalid bg-pl-invalid/10 text-pl-invalid',
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${RISK_STYLES[risk]}`}
    >
      {risk}
    </span>
  );
}

const STATUS_STYLES: Record<VerificationStatus, string> = {
  queued: 'text-pl-pending',
  processing: 'text-pl-blue-lgt',
  complete: 'text-pl-verified',
  failed: 'text-pl-invalid',
};

export function StatusLabel({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
