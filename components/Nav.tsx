'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Container } from './ui';

const MARKETING = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/search', label: 'Search' },
];

const WORKSPACE = [
  { href: '/workspace', label: 'Verifications' },
  { href: '/workspace/comparables', label: 'Comparables' },
];

/** Top bar, not a sidebar — the workspace is read on phones as often as desks. */
export function Nav({ variant }: { variant: 'marketing' | 'workspace' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = variant === 'workspace' ? WORKSPACE : MARKETING;

  return (
    <header className="sticky top-0 z-50 border-b border-pl-border bg-pl-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href={variant === 'workspace' ? '/workspace' : '/'}
            className="font-mono text-sm uppercase tracking-[0.3em] text-pl-text transition-colors hover:text-pl-copper-lgt"
          >
            Plinth
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active =
                link.href === '/workspace'
                  ? pathname === '/workspace'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    active
                      ? 'text-pl-copper-lgt'
                      : 'text-pl-muted hover:text-pl-text'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {variant === 'workspace' ? (
              <Link
                href="/workspace/verify/new"
                className="bg-pl-copper px-4 py-2 text-sm text-white transition-colors hover:bg-pl-copper-lgt"
              >
                New verification
              </Link>
            ) : (
              <Link
                href="/workspace"
                className="bg-pl-copper px-4 py-2 text-sm text-white transition-colors hover:bg-pl-copper-lgt"
              >
                Verify a property
              </Link>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="text-pl-muted md:hidden"
          >
            <span className="block h-px w-6 bg-current" />
            <span className="mt-1.5 block h-px w-6 bg-current" />
          </button>
        </div>

        {open ? (
          <nav className="flex flex-col gap-1 border-t border-pl-border py-4 md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-pl-muted transition-colors hover:text-pl-text"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={
                variant === 'workspace' ? '/workspace/verify/new' : '/workspace'
              }
              onClick={() => setOpen(false)}
              className="mt-3 bg-pl-copper px-4 py-3 text-center text-sm text-white"
            >
              {variant === 'workspace'
                ? 'New verification'
                : 'Verify a property'}
            </Link>
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
