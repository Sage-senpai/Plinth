'use client';

import { useEffect, useRef, useState } from 'react';
import { formatNaira } from '@/lib/format';

/**
 * The estimate as a position within its own range, not a number floating alone.
 * A buyer reading a valuation needs to see how much room there is either side
 * of it — that spread is the honest part of the answer.
 */
export function ValuationRange({
  low,
  high,
  estimated,
}: {
  low: number;
  high: number;
  estimated: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const span = Math.max(1, high - low);
  const markerPct = Math.min(
    96,
    Math.max(4, ((estimated - low) / span) * 100),
  );

  return (
    <div ref={ref}>
      <p className="font-serif text-4xl text-pl-text md:text-5xl">
        {formatNaira(estimated)}
      </p>

      <div className="relative mt-7 h-[3px] w-full bg-pl-border">
        <div
          className="h-full bg-pl-copper transition-[width] duration-700 ease-out"
          style={{ width: shown ? `${markerPct}%` : '0%' }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-pl-copper-lgt shadow-glow-copper transition-[left] duration-700 ease-out"
          style={{ left: shown ? `${markerPct}%` : '0%' }}
        />
      </div>

      <div className="mt-3 flex justify-between font-mono text-[11px] text-pl-muted">
        <span>{formatNaira(low)}</span>
        <span>{formatNaira(high)}</span>
      </div>
    </div>
  );
}
