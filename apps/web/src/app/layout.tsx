import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';

// next/font self-hosts these at build time: no render-blocking request to
// Google, no layout shift, and nothing for a CSP to allow.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Straightedge',
  description:
    "Build Euclid's Elements yourself, with nothing but a straightedge and a compass.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
