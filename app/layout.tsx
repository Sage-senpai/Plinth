import type { Metadata } from 'next';
import { DM_Serif_Display, Jost, Martian_Mono } from 'next/font/google';
import './globals.css';

const display = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Jost({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Martian_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Plinth — Property due diligence for Nigeria',
    template: '%s — Plinth',
  },
  description:
    'Plinth verifies Nigerian property documents, checks for fraud patterns, and generates a due diligence report before you sign anything.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-pl-bg text-pl-text antialiased">{children}</body>
    </html>
  );
}
