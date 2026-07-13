'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

export function ReportPanel({
  verificationId,
  status,
}: {
  verificationId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A queued verification finishes on the worker, not in this request. Poll
  // until it lands rather than making the buyer refresh.
  useEffect(() => {
    if (status !== 'processing' && status !== 'queued') return;

    const timer = setInterval(async () => {
      const res = await fetch(`/api/status/${verificationId}`);
      if (!res.ok) return;

      const body = await res.json();
      if (body.status === 'complete' || body.status === 'failed') {
        clearInterval(timer);
        router.refresh();
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [status, verificationId, router]);

  async function download() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, includeValuation: true }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'The report could not be generated.');
      }

      const { reportUrl } = await res.json();
      window.open(reportUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (status !== 'complete') {
    return (
      <p className="border border-pl-border bg-pl-surface px-4 py-3 text-xs leading-relaxed text-pl-muted">
        {status === 'failed'
          ? 'This verification failed. Re-upload the documents and try again.'
          : 'Verification is running. This page will update on its own — about six minutes for five documents.'}
      </p>
    );
  }

  return (
    <div>
      <Button onClick={download} disabled={busy} className="w-full">
        {busy ? 'Generating…' : 'Download report'}
      </Button>

      {error ? (
        <p className="mt-3 text-xs leading-relaxed text-pl-invalid">{error}</p>
      ) : null}

      <p className="mt-3 text-xs leading-relaxed text-pl-muted">
        A PDF with the findings, the valuation and what to do next. Give it to
        your solicitor.
      </p>
    </div>
  );
}
