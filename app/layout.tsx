import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SIGNAL_INTERFACE — Portfolio',
  description: 'Tune into frequencies. Discover projects. A portfolio experience as signal archaeology.',
  keywords: ['portfolio', 'design', 'interactive', 'experimental', 'oscillator'],
  authors: [{ name: 'Signal Interface' }],
  openGraph: {
    title: 'SIGNAL_INTERFACE — Portfolio',
    description: 'Tune into frequencies. Discover projects.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceMono.variable}>{children}</body>
    </html>
  );
}
