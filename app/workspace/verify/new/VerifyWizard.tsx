'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button, Eyebrow } from '@/components/ui';
import { DOCUMENT_TYPES, guessDocumentType } from '@/lib/property/documents';
import { STATES } from '@/lib/property/areas';
import type { DocumentType, PropertyType } from '@/lib/types';

interface PendingDoc {
  file: File;
  type: DocumentType;
}

const MAX_DOCS = 5;

export function VerifyWizard() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('residential');
  const [sizeSqm, setSizeSqm] = useState('');

  const [docs, setDocs] = useState<PendingDoc[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;

    const next = Array.from(files)
      .slice(0, MAX_DOCS - docs.length)
      .map((file) => ({ file, type: guessDocumentType(file.name) }));

    setDocs((current) => [...current, ...next]);
  }

  async function submit() {
    setError(null);

    if (!address.trim()) {
      setError('The property address is required.');
      setStep(1);
      return;
    }
    if (!docs.length) {
      setError('Upload at least one document.');
      return;
    }

    setSubmitting(true);

    try {
      // Documents go straight to S3 via a presigned PUT — a scanned C of O is
      // routinely too large to route through a serverless function.
      const uploaded = await Promise.all(
        docs.map(async (doc) => {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: doc.file.name,
              contentType: doc.file.type || 'application/octet-stream',
            }),
          });

          if (!res.ok) throw new Error('Could not prepare the upload.');
          const { key, url, mode } = await res.json();

          if (mode === 'presigned' && url) {
            const put = await fetch(url, {
              method: 'PUT',
              body: doc.file,
              headers: {
                'Content-Type': doc.file.type || 'application/octet-stream',
              },
            });
            if (!put.ok) throw new Error(`Upload failed for ${doc.file.name}.`);
          }

          return { s3Key: key, type: doc.type, fileName: doc.file.name };
        }),
      );

      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: {
            address: address.trim(),
            state,
            lga: lga.trim() || undefined,
            type: propertyType,
            sizeSqm: sizeSqm ? Number(sizeSqm) : undefined,
          },
          documents: uploaded,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Verification could not be started.');
      }

      const { verificationId } = await res.json();
      router.push(`/workspace/verify/${verificationId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Try again.',
      );
      setSubmitting(false);
    }
  }

  const field =
    'w-full border border-pl-border bg-pl-surface px-4 py-3 text-sm text-pl-text outline-none transition-colors placeholder:text-pl-muted focus:border-pl-copper';
  const label = 'mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-pl-muted';

  return (
    <div className="mt-12 max-w-2xl">
      {/* Steps */}
      <ol className="mb-10 flex gap-8 border-b border-pl-border pb-4">
        {(
          [
            [1, 'Property'],
            [2, 'Documents'],
          ] as const
        ).map(([n, title]) => (
          <li key={n} className="flex items-center gap-2.5">
            <span
              className={`flex h-6 w-6 items-center justify-center border font-mono text-[10px] ${
                step === n
                  ? 'border-pl-copper text-pl-copper-lgt'
                  : 'border-pl-border text-pl-muted'
              }`}
            >
              {n}
            </span>
            <span
              className={`text-sm ${
                step === n ? 'text-pl-text' : 'text-pl-muted'
              }`}
            >
              {title}
            </span>
          </li>
        ))}
      </ol>

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <label className={label} htmlFor="address">
              Property address
            </label>
            <input
              id="address"
              className={field}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Plot 18 Orchid Road, Lekki Phase 2"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="state">
                State
              </label>
              <select
                id="state"
                className={field}
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {STATES.map((s) => (
                  <option key={s} value={s} className="bg-pl-surface">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label} htmlFor="lga">
                LGA (optional)
              </label>
              <input
                id="lga"
                className={field}
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="Eti-Osa"
              />
            </div>

            <div>
              <label className={label} htmlFor="type">
                Property type
              </label>
              <select
                id="type"
                className={field}
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value as PropertyType)
                }
              >
                {(['residential', 'commercial', 'land'] as const).map((t) => (
                  <option key={t} value={t} className="bg-pl-surface">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={label} htmlFor="size">
                Size (sqm)
              </label>
              <input
                id="size"
                className={field}
                type="number"
                min="1"
                value={sizeSqm}
                onChange={(e) => setSizeSqm(e.target.value)}
                placeholder="600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => setStep(2)} disabled={!address.trim()}>
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <Eyebrow>Documents · up to {MAX_DOCS}</Eyebrow>

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={docs.length >= MAX_DOCS}
              className="mt-3 w-full border border-dashed border-pl-border px-6 py-10 text-center transition-colors hover:border-pl-copper disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="block text-sm text-pl-text">
                Choose documents
              </span>
              <span className="mt-1.5 block text-xs text-pl-muted">
                C of O, survey plan, deed of assignment, POA, probate, mortgage
                deed, excision, building plan
              </span>
            </button>

            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          {docs.length ? (
            <ul className="space-y-px bg-pl-border">
              {docs.map((doc, i) => (
                <li
                  key={`${doc.file.name}-${i}`}
                  className="flex flex-col gap-3 bg-pl-surface p-4 sm:flex-row sm:items-center"
                >
                  <span className="flex-1 truncate text-sm text-pl-text">
                    {doc.file.name}
                  </span>

                  <select
                    aria-label={`Document type for ${doc.file.name}`}
                    className="border border-pl-border bg-pl-surface2 px-3 py-2 text-xs text-pl-text outline-none focus:border-pl-copper"
                    value={doc.type}
                    onChange={(e) =>
                      setDocs((current) =>
                        current.map((d, j) =>
                          j === i
                            ? { ...d, type: e.target.value as DocumentType }
                            : d,
                        ),
                      )
                    }
                  >
                    {DOCUMENT_TYPES.map((spec) => (
                      <option
                        key={spec.type}
                        value={spec.type}
                        className="bg-pl-surface"
                      >
                        {spec.label}
                      </option>
                    ))}
                    <option value="unknown" className="bg-pl-surface">
                      Let Plinth classify it
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setDocs((current) => current.filter((_, j) => j !== i))
                    }
                    className="text-xs text-pl-muted transition-colors hover:text-pl-invalid"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {error ? (
            <p className="border-l-2 border-l-pl-invalid bg-pl-surface px-4 py-3 text-sm text-pl-invalid">
              {error}
            </p>
          ) : null}

          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={submit} disabled={submitting || !docs.length}>
              {submitting ? 'Verifying…' : 'Run verification'}
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-pl-muted">
            Verification takes about six minutes for five documents. You do not
            have to wait on this page.
          </p>
        </div>
      )}
    </div>
  );
}
