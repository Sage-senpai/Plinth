import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Container, Eyebrow } from '@/components/ui';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative">
        <div className="mx-auto max-w-sm">
          <Link
            href="/"
            className="font-mono text-sm uppercase tracking-[0.3em] text-pl-text transition-colors hover:text-pl-copper-lgt"
          >
            Plinth
          </Link>

          <div className="mt-10">
            <Eyebrow>Sign in</Eyebrow>
            <h1 className="mt-4 font-serif text-3xl text-pl-text">
              Your verifications.
            </h1>
          </div>

          <Suspense>
            <SignInForm />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
