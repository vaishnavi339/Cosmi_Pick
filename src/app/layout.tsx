import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

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
  title: 'CosmicPick | Personalized Skincare Tailored to Your Face',
  description:
    'Skincare picked for your unique facial profile. Instant, private, on-device analysis with plain-language recommendations and custom AM/PM routines.',
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
      <body className="font-sans antialiased bg-[#FBF7F4] dark:bg-[#180F14] text-[#3B1F2B] dark:text-[#FAF3F0] min-h-screen flex flex-col relative selection:bg-[#F4D9D6] selection:text-[#3B1F2B]">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
