import type { Config } from 'tailwindcss';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Tailwind CSS Design Tokens (Dastarkhwan Heritage)
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Centralizes the custom color palette, typography scales, and spacing tokens
 * defined in Google Stitch.
 * 
 * PALETTE RATIONALE:
 * - Saffron Amber (#E65100): Warm, energetic primary CTA buttons and highlights.
 * - Turmeric Glow (#FFF8E1): Soft card backgrounds, nutrient chip fills.
 * - Cardamom Emerald (#1B5E20): Freshness, healthy pairing badges, balance indicators.
 * - Terracotta Clay (#BF360C): Earthy accent borders and dish titles.
 * - Charcoal Ink (#1F2937): Deep contrast for readable kitchen typography.
 * - Warm Parchment (#FAFAF8): Eye-friendly background avoiding sterile blue-white.
 * ============================================================================
 */

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'saffron-amber': '#E65100',
        'turmeric-glow': '#FFF8E1',
        'cardamom-emerald': '#1B5E20',
        'cardamom-soft': '#E8F5E9',
        'terracotta-clay': '#BF360C',
        'charcoal-ink': '#1F2937',
        'warm-gray': '#6B7280',
        'warm-parchment': '#FAFAF8',
        'surface-pure': '#FFFFFF',
        'border-subtle': '#E5E1DA',
        'primary': '#982400',
        'on-primary': '#ffffff',
        'primary-container': '#bf360c',
        'on-primary-container': '#ffe1da',
        'secondary': '#2a6b2c',
        'on-secondary': '#ffffff',
        'secondary-container': '#acf4a4',
        'on-secondary-container': '#307231',
        'tertiary': '#8f2f00',
        'surface': '#f8f9ff',
        'surface-dim': '#d0dbed',
        'surface-bright': '#f8f9ff',
        'surface-container': '#e6eeff',
        'surface-container-high': '#dee9fc',
        'surface-container-low': '#eff4ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-highest': '#d9e3f6',
        'on-surface': '#121c2a',
        'on-surface-variant': '#5a413a',
        'inverse-surface': '#27313f',
        'inverse-on-surface': '#eaf1ff',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
        urdu: ['var(--font-urdu)', '"Noto Nastaliq Urdu"', '"Noto Sans Arabic"', 'serif'],
      },
      boxShadow: {
        'warm-card': '0 4px 20px -2px rgba(180, 83, 9, 0.08)',
        'warm-hero': '0 10px 25px -4px rgba(191, 54, 12, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'bottom-sheet': '0 -8px 30px rgba(31, 41, 55, 0.16), 0 -2px 10px rgba(180, 83, 9, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};

export default config;
