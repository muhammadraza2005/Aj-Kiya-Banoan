import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Root Layout & Font Optimization
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Serves as the top-level HTML document wrapper.
 * 
 * FONT STRATEGY:
 * Uses Next.js native font optimization (next/font/google) to download and host
 * Google Fonts locally at build time. This ensures zero Cumulative Layout Shift (CLS)
 * and guarantees fast offline font rendering in kitchen environments.
 * 
 * VIEWPORT & PWA READINESS:
 * Configured with maximum-scale=1 to feel like a native mobile app on iOS/Android.
 * ============================================================================
 */

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['600', '700'],
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Aaj Kya Banaun? (آج کیا بناؤں؟) — Desi Meal Recommender',
  description: 'Smart Pakistani daily meal recommendation and nutritional variety tracker for households.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#E65100',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable} ${nastaliq.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-warm-parchment text-charcoal-ink flex justify-center antialiased selection:bg-turmeric-glow selection:text-terracotta-clay">
        {children}
      </body>
    </html>
  );
}
