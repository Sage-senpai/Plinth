'use client';

import { useEffect, useRef, useState } from 'react';

/** Fills horizontally on scroll-enter. */
export function ConfidenceBar({
  value,
  label = 'Confidence',
}: {
  /** 0.0 - 1.0 */
  value: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

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
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted">
          {label}
        </span>
        <span className="font-mono text-xs text-pl-text">{pct}%</span>
      </div>
      <div
        className="h-[3px] w-full bg-pl-border"
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full bg-pl-blue-lgt transition-[width] duration-700 ease-out"
          style={{ width: shown ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}
