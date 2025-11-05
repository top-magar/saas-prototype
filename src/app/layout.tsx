import { ClerkProvider } from '@clerk/nextjs';
import { fontClasses } from "@/lib/fonts";
import { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'PASAAL.IO - Multi-tenant SaaS Platform for Nepal',
    template: '%s | PASAAL.IO'
  },
  description: 'Automate your inventory, sales, and customer management with PASAAL.IO - the leading SaaS platform built for Nepali businesses.',
  keywords: ['SaaS', 'Nepal', 'inventory management', 'business automation', 'e-commerce', 'multi-tenant'],
  authors: [{ name: 'PASAAL.IO Team' }],
  creator: 'PASAAL.IO',
  publisher: 'PASAAL.IO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pasaal.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pasaal.io',
    title: 'PASAAL.IO - Multi-tenant SaaS Platform for Nepal',
    description: 'Automate your inventory, sales, and customer management with PASAAL.IO - the leading SaaS platform built for Nepali businesses.',
    siteName: 'PASAAL.IO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PASAAL.IO - Multi-tenant SaaS Platform for Nepal',
    description: 'Automate your inventory, sales, and customer management with PASAAL.IO - the leading SaaS platform built for Nepali businesses.',
    creator: '@pasaalio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ThemeProvider } from "@/components/providers/theme-provider"
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${fontClasses.variables} font-sans`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
