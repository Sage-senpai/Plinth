'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/workspace';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(
        'Those credentials were not recognised. Plinth is in pilot — accounts are provisioned by hand.',
      );
      setBusy(false);
      return;
    }

    router.push(from);
    router.refresh();
  }

  const field =
    'w-full border border-pl-border bg-pl-surface px-4 py-3 text-sm text-pl-text outline-none transition-colors placeholder:text-pl-muted focus:border-pl-copper';
  const label =
    'mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted';

  return (
    <form onSubmit={submit} className="mt-9 space-y-5">
      <div>
        <label className={label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@firm.com"
        />
      </div>

      <div>
        <label className={label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="border-l-2 border-l-pl-invalid bg-pl-surface px-4 py-3 text-sm leading-relaxed text-pl-invalid">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-xs leading-relaxed text-pl-muted">
        Plinth is in pilot with six customers. If you do not have an account and
        want one, the fastest route is to run a verification and tell us what it
        missed.
      </p>
    </form>
  );
}
