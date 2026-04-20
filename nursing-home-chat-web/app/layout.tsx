import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from '@/components/GoogleTagManager';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nursing Home Neglect Case Check | Free Review',
  description:
    'Answer a few quick questions to see if you may have a nursing home neglect case. Free, confidential consultation.',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#01366c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh font-sans">
        <GoogleTagManagerNoScript />
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}
