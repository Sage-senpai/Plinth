import { ButtonLink, Container, Eyebrow } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pl-grid pl-grid-fade absolute inset-0" aria-hidden />

      <Container className="relative">
        <div className="max-w-xl">
          <Eyebrow>404</Eyebrow>

          <h1 className="mt-6 font-serif text-4xl leading-tight text-pl-text md:text-5xl">
            There is nothing at this address.
          </h1>

          <p className="mt-6 text-base leading-relaxed text-pl-muted">
            The page you asked for does not exist. If you followed a link to a
            verification report, the reference may be wrong — report references
            are printed at the top of the PDF and begin{' '}
            <span className="font-mono text-pl-copper-lgt">ver_</span>.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/workspace">Go to your verifications</ButtonLink>
            <ButtonLink href="/search" variant="ghost">
              Search for a property
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
