import { Container, Eyebrow } from '@/components/ui';

export default function Loading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="border-b border-pl-border pb-10">
        <Eyebrow>Verification</Eyebrow>
        <div className="mt-4 h-10 w-full max-w-xl animate-pulse bg-pl-surface2" />
        <div className="mt-4 h-3 w-72 animate-pulse bg-pl-surface2" />
      </div>

      <div className="grid gap-10 pt-10 lg:grid-cols-[240px_1fr_280px] lg:gap-8">
        <div className="space-y-px bg-pl-border">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-pl-surface" />
          ))}
        </div>

        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 animate-pulse bg-pl-surface2" />
          ))}
        </div>

        <div className="h-52 animate-pulse border border-pl-border bg-pl-surface" />
      </div>
    </Container>
  );
}
