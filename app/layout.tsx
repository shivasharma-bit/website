import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider }         from './context/ThemeContext';
import { AuthProvider }          from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import './globals.css';

// ─── Font definitions ─────────────────────────────────────────────────────────

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
});

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-playfair',
  display:  'swap',
  weight:   ['400', '600', '700'],
  style:    ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  display:  'swap',
  weight:   ['400', '500'],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    template: '%s — Forge',
    default:  'Forge — Where professional work lives',
  },
  description:
    'Forge is the platform for creative professionals to share work, build audience, and connect with the people shaping their industries.',
  keywords: ['professional network', 'portfolio', 'creative work', 'career'],
  authors:  [{ name: 'Forge' }],
  metadataBase: new URL('https://forge.app'),
  openGraph: {
    type:       'website',
    siteName:   'Forge',
    title:      'Forge — Where professional work lives',
    description:'Share work, build audience, and connect with industry leaders.',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Forge',
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F6F3' },
    { media: '(prefers-color-scheme: dark)',  color: '#111009' },
  ],
  width:            'device-width',
  initialScale:     1,
  viewportFit:      'cover',
};

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      {/*
        suppressHydrationWarning on <html> is required because ThemeProvider
        toggles the `dark` class and `data-theme` attribute client-side before
        hydration is complete. Without it, React emits a false mismatch warning.
      */}
      <head>
        {/*
          Inline script to set theme immediately before first paint,
          eliminating the flash of un-themed content.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('forge_theme');
                  var resolved = stored === 'dark' ? 'dark'
                    : stored === 'light' ? 'light'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', resolved === 'dark');
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
