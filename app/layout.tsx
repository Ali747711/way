import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Newsreader, Schibsted_Grotesk } from 'next/font/google';

import './globals.css';

// Fonts are downloaded at build time and served from the app itself, so the
// page makes no font request to Google at runtime.

// The problem is a reading task: a text serif with optical sizes for titles,
// prompts and solutions.
const text = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-text',
  display: 'swap'
});

// UI chrome: labels, buttons, counts.
const ui = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap'
});

const code = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-code',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Way',
  description: 'A finite daily set of problems'
};

// Browser chrome matches the page ground, so it does not glare at night.
export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0e6' },
    { media: '(prefers-color-scheme: dark)', color: '#171512' }
  ]
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${text.variable} ${ui.variable} ${code.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
