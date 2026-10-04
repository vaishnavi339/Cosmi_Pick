import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Chatbot } from '@/components/common/Chatbot';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'CosmicPick | Skincare that feels personal',
  description:
    'Discover a skincare routine shaped around your skin, concerns, ingredients, and budget. Private on-device analysis, real product photos, and clear recommendations.',
  keywords: [
    'skincare recommendation',
    'face scan skincare',
    'custom skincare routine',
    'skin tone match',
    'clean beauty',
  ],
  authors: [{ name: 'CosmicPick' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#F7F6F0] dark:bg-[#17201B] text-[#213A30] dark:text-[#F7F6F0] min-h-screen flex flex-col relative selection:bg-[#E2EADD] selection:text-[#213A30]">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
