'use client';

import { useEffect } from 'react';
import { Button, ButtonLink, Container, Eyebrow } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[plinth] unhandled error', error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative">
        <div className="max-w-xl">
          <Eyebrow>Something failed</Eyebrow>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-pl-text md:text-5xl">
            This did not work, and we are not going to pretend otherwise.
          </h1>

          <p className="mt-6 text-base leading-relaxed text-pl-muted">
            Something on our side broke. Nothing you uploaded has been lost, and
            no verification has been altered — if a verification was running, it
            is still running and will be here when you come back.
          </p>

          <p className="mt-4 text-base leading-relaxed text-pl-muted">
            Do not treat this as a result. An error is not a clean title.
          </p>

          {error.digest ? (
            <p className="mt-8 border border-pl-border bg-pl-surface px-4 py-3 font-mono text-[11px] text-pl-muted">
              Reference {error.digest} — quote this if you contact us.
            </p>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href="/workspace" variant="ghost">
              Back to verifications
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
