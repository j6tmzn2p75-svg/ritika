import type { Metadata, Viewport } from 'next';
import { Inter, Cinzel, Dancing_Script, Playfair_Display, Cinzel_Decorative } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cinzel-decorative',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-handwriting',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Happy Birthday Ritika | A Fairytale Journey',
  description: 'An enchanted cinematic fairytale birthday experience for Ritika.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c0207',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} ${playfair.variable} ${dancingScript.variable} dark`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0c0207] text-[#fce7f3] min-h-screen overflow-x-hidden selection:bg-[#ff2e93] selection:text-white font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
