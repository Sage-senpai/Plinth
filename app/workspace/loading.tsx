import { Container, Eyebrow } from '@/components/ui';

export default function Loading() {
  return (
    <Container className="py-12 md:py-16">
      <Eyebrow>Workspace</Eyebrow>
      <div className="mt-4 h-9 w-64 animate-pulse bg-pl-surface2" />

      <div className="mt-11 space-y-px bg-pl-border">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-6 bg-pl-surface p-5">
            <div className="h-4 flex-1 animate-pulse bg-pl-surface2" />
            <div className="h-4 w-16 animate-pulse bg-pl-surface2" />
            <div className="h-4 w-20 animate-pulse bg-pl-surface2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
