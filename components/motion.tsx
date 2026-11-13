'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Shared easing — a decisive settle, not a bounce. */
export const EASE = [0.23, 1, 0.32, 1] as const;

type RevealTag = 'div' | 'section' | 'aside';

const REVEAL_TAGS: Record<
  RevealTag,
  typeof motion.div | typeof motion.section | typeof motion.aside
> = {
  div: motion.div,
  section: motion.section,
  aside: motion.aside,
};

/**
 * Fades and lifts a block into place the first time it crosses into view.
 * Disabled entirely for prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
}) {
  const reduce = useReducedMotion();
  const MotionTag = REVEAL_TAGS[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerTag = 'div' | 'tbody';
type ItemTag = 'div' | 'li' | 'tr';

const STAGGER_TAGS: Record<StaggerTag, typeof motion.div | typeof motion.tbody> = {
  div: motion.div,
  tbody: motion.tbody,
};

const ITEM_TAGS: Record<ItemTag, typeof motion.div | typeof motion.li | typeof motion.tr> = {
  div: motion.div,
  li: motion.li,
  tr: motion.tr,
};

/** Orchestrates staggered entry for its RevealItem children. */
export function RevealStagger({
  children,
  className = '',
  stagger = 0.08,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: StaggerTag;
}) {
  const reduce = useReducedMotion();
  const MotionTag = STAGGER_TAGS[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </MotionTag>
  );
}

/** One cell of a RevealStagger — fades and lifts on its parent's cue. */
export function RevealItem({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ItemTag;
}) {
  const MotionTag = ITEM_TAGS[as];

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** A numbered 01/02/03 badge with a small entrance beat. */
export function StepBadge({
  n,
  className = '',
}: {
  n: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const label = String(n).padStart(2, '0');
  const base = `font-mono text-xs text-pl-copper-lgt ${className}`;

  if (reduce) {
    return <span className={base}>{label}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${base}`}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {label}
    </motion.span>
  );
}

/** Container for a sticky/stacked-card scroll sequence. */
export function StickyStack({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`relative ${className}`}>{children}</div>;
}

/**
 * A card that sticks as the user scrolls past it, so the next card in the
 * stack rises up and covers it — the guidelock.health stat-card sequence.
 */
export function StickyStackCard({
  index,
  children,
  className = '',
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`sticky ${className}`}
      style={{ top: `calc(5.5rem + ${index * 18}px)`, zIndex: index + 1 }}
      initial={reduce ? undefined : { opacity: 0, y: 48 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
