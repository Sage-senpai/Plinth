import type { Metadata } from 'next';
import { Container, Eyebrow } from '@/components/ui';
import { VerifyWizard } from './VerifyWizard';

export const metadata: Metadata = { title: 'New verification' };

export default function NewVerificationPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-2xl">
        <Eyebrow>New verification</Eyebrow>
        <h1 className="mt-4 font-serif text-3xl text-pl-text md:text-4xl">
          Tell us about the property.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-pl-muted">
          Upload up to five documents. The more you give us, the more we can
          cross-check — a name that appears on the deed but not the Certificate
          of Occupancy is only visible when we can see both.
        </p>
      </div>

      <VerifyWizard />
    </Container>
  );
}
