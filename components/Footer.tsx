import Link from 'next/link';
import { Container } from './ui';

export function Footer() {
  return (
    <footer className="border-t border-pl-border py-14">
      <Container>
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-pl-text">
              Plinth
            </p>
            <p className="mt-4 text-sm leading-relaxed text-pl-muted">
              Property due diligence for Nigeria. We surface what the documents
              say. We do not guarantee title — what you do with the information
              is your informed decision.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="pl-eyebrow mb-4">Product</p>
              <ul className="space-y-2.5 text-sm text-pl-muted">
                <li>
                  <Link href="/workspace" className="hover:text-pl-text">
                    Verify
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace/comparables"
                    className="hover:text-pl-text"
                  >
                    Comparables
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-pl-text">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="pl-eyebrow mb-4">Company</p>
              <ul className="space-y-2.5 text-sm text-pl-muted">
                <li>
                  <Link href="/about" className="hover:text-pl-text">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-pl-text">
                    Search
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-pl-border pt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-pl-muted md:flex-row">
          <p>Plinth Technologies Ltd · Lagos State, Nigeria</p>
          <p>Landmark Centre, Victoria Island</p>
        </div>
      </Container>
    </footer>
  );
}
